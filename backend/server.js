const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const matchmaking = require("./services/matchmaking");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 5050;

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
        await tryMatch(partner);
      }
    }

    updateOnlineCount();
  };

  socket.on("skip", async () => {
    if (socket.partnerId) {
      const partner = io.sockets.sockets.get(socket.partnerId);
      if (partner) {
        partner.emit("receive_message", `${socket.username || "Stranger"} skipped.`);
        partner.partnerId = null;
        await tryMatch(partner);
      }
      socket.partnerId = null;
    }
    await tryMatch(socket);
  });

  socket.on("disconnectUser", handleDisconnect);
  socket.on("disconnect", handleDisconnect);
});

server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
