const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

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
let waitingQueue = [];

function updateOnlineCount() {
  io.emit("updateOnlineCount", io.engine.clientsCount);
}

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  updateOnlineCount();

  socket.on("match_user", ({ username, gender, preference }) => {
    socket.username = username;
    socket.gender = gender;
    socket.preference = preference;
    socket.partnerId = null;

    waitingQueue = waitingQueue.filter(u => u.socketId !== socket.id);

    const me = { socketId: socket.id, username, gender, preference };

    const matchIndex = waitingQueue.findIndex(u =>
      u.socketId !== me.socketId &&
      (me.preference === null || u.gender === me.preference) &&
      (u.preference === null || u.preference === me.gender)
    );

    if (matchIndex !== -1) {
      const match = waitingQueue.splice(matchIndex, 1)[0];
      const partnerSocket = io.sockets.sockets.get(match.socketId);

      socket.partnerId = match.socketId;
      partnerSocket.partnerId = socket.id;

      io.to(match.socketId).emit("matched", { username: socket.username });
      socket.emit("matched", { username: match.username });
    } else {
      waitingQueue.push(me);
    }
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

  const handleDisconnect = () => {
    if (disconnected) return;
    disconnected = true;

    console.log(` Socket disconnected: ${socket.id}`);
    waitingQueue = waitingQueue.filter(u => u.socketId !== socket.id);

    if (socket.partnerId) {
      const partner = io.sockets.sockets.get(socket.partnerId);
      if (partner) {
        partner.emit("receive_message", ` ${socket.username || "Stranger"} disconnected.`);
        partner.partnerId = null;

        const partnerUserData = {
          socketId: partner.id,
          username: partner.username,
          gender: partner.gender,
          preference: partner.preference
        };

        
        const matchIndex = waitingQueue.findIndex(u =>
          u.socketId !== partner.id &&
          (partnerUserData.preference === null || u.gender === partnerUserData.preference) &&
          (u.preference === null || u.preference === partnerUserData.gender)
        );

        if (matchIndex !== -1) {
          const newMatch = waitingQueue.splice(matchIndex, 1)[0];
          const newSocket = io.sockets.sockets.get(newMatch.socketId);

          partner.partnerId = newMatch.socketId;
          newSocket.partnerId = partner.id;

          io.to(newMatch.socketId).emit("matched", { username: partnerUserData.username });
          partner.emit("matched", { username: newMatch.username });
        } else {
          waitingQueue.push(partnerUserData);
        }
      }
    }

    updateOnlineCount();
  };

  socket.on("skip", () => {
    if (socket.partnerId) {
      const partner = io.sockets.sockets.get(socket.partnerId);
      if (partner) {
        partner.emit("receive_message", `${socket.username || "Stranger"} skipped.`);
        partner.partnerId = null;
        waitingQueue.push({
          socketId: partner.id,
          username: partner.username,
          gender: partner.gender,
          preference: partner.preference
        });
      }
      socket.partnerId = null;
    }
  });

  socket.on("disconnectUser", handleDisconnect);
  socket.on("disconnect", handleDisconnect);
});

server.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
