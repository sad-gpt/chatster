const Session = require("../models/Session");

const activeSessions = {};

const startSession = (socketId, username, partner) => {
  activeSessions[socketId] = {
    username: username || "Stranger",
    partner: partner || "Stranger",
    startTime: new Date(),
    messagesCount: 0
  };
};

const incrementMessage = (socketId) => {
  if (activeSessions[socketId]) {
    activeSessions[socketId].messagesCount++;
  }
};

const endSession = async (socketId) => {
  const sessionData = activeSessions[socketId];
  if (!sessionData) return;

  const endTime = new Date();
  const duration = Math.floor((endTime - sessionData.startTime) / 1000);

  try {
    await Session.create({
      ...sessionData,
      endTime,
      duration
    });
  } catch (err) {
    console.error("Error saving session analytics:", err);
  }

  delete activeSessions[socketId];
};

module.exports = {
  startSession,
  incrementMessage,
  endSession
};
