const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  gender:   {type:String,required: true},
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We’ll hash this later
});

module.exports = mongoose.model("User", userSchema);
