require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const matchmaking = require("./services/matchmaking");
const analytics = require("./services/analytics");
const authRoutes = require("./routes/auth");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("Mongo error:", err));
  
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

function updateOnlineCount() {
  io.emit("updateOnlineCount", io.engine.clientsCount);
}

async function tryMatch(socket) {
  const me = {
    socketId: socket.id,
    username: socket.username,
    gender: socket.gender,
    preference: socket.preference
  };

  const match = await matchmaking.findMatch(me);

  if (match) {
    const partnerSocket = io.sockets.sockets.get(match.socketId);
    if (partnerSocket) {
      socket.partnerId = match.socketId;
      partnerSocket.partnerId = socket.id;

      io.to(match.socketId).emit("matched", { username: socket.username });
      socket.emit("matched", { username: match.username });

      // Start analytics sessions
      analytics.startSession(socket.id, socket.username, match.username);
      analytics.startSession(match.socketId, match.username, socket.username);

      return true;
    }
  }
  
  await matchmaking.addUserToQueue(me);
  return false;
}

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  updateOnlineCount();

  socket.on("match_user", async ({ username, gender, preference }) => {
    socket.username = username;
    socket.gender = gender;
    socket.preference = preference;
    socket.partnerId = null;

    await matchmaking.removeUserFromQueue(socket.id);
    await tryMatch(socket);
  });

  socket.on("send_message", (msg) => {
    if (socket.partnerId) {
      io.to(socket.partnerId).emit("receive_message", msg);
      // Increment message counts
      analytics.incrementMessage(socket.id);
      analytics.incrementMessage(socket.partnerId);
    }
  });

  socket.on("typing", () => {
    if (socket.partnerId) {
      io.to(socket.partnerId).emit("show_typing");
    }
  });

  let disconnected = false;

  const handleDisconnect = async () => {
    if (disconnected) return;
    disconnected = true;

    console.log(` Socket disconnected: ${socket.id}`);
    await matchmaking.removeUserFromQueue(socket.id);

    if (socket.partnerId) {
      const partner = io.sockets.sockets.get(socket.partnerId);
      if (partner) {
        partner.emit("receive_message", ` ${socket.username || "Stranger"} disconnected.`);
        partner.partnerId = null;
        analytics.endSession(socket.partnerId);
        await tryMatch(partner);
      }
      analytics.endSession(socket.id);
    }

    updateOnlineCount();
  };

  socket.on("skip", async () => {
    if (socket.partnerId) {
      const partner = io.sockets.sockets.get(socket.partnerId);
      if (partner) {
        partner.emit("receive_message", `${socket.username || "Stranger"} skipped.`);
        partner.partnerId = null;
        analytics.endSession(socket.partnerId);
        await tryMatch(partner);
      }
      analytics.endSession(socket.id);
      socket.partnerId = null;
    }
    await tryMatch(socket);
  });

  socket.on("disconnectUser", handleDisconnect);
  socket.on("disconnect", handleDisconnect);
});

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
