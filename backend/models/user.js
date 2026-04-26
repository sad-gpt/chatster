const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, default: "any" },
  preference: { type: String, default: "any" }
});

module.exports = mongoose.model("User", UserSchema);
