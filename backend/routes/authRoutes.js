const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");


router.post("/signup", async (req, res) => {
  try {
    const { gender, username, email, password, confirmPassword } = req.body;

    if (!gender || !username || !email || !password || !confirmPassword)
      return res.status(400).json({ msg: "Please fill all fields." });

    if (password !== confirmPassword)
      return res.status(400).json({ msg: "Passwords do not match." });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "Email already in use." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      gender,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ msg: "Account created successfully!" });

  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ msg: "Server error. Please try again later." });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ msg: "Please fill in all fields." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "User not found with this email." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ msg: "Incorrect password." });

    res.status(200).json({
      msg: "Login successful!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        gender: user.gender,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Server error. Please try again later." });
  }
});

module.exports = router;
