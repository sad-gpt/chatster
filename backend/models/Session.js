const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  username: { type: String, required: true },
  partner: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  duration: { type: Number }, // in seconds
  messagesCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Session", SessionSchema);
