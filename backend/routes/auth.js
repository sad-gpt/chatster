const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, gender, preference } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      gender: gender || "any",
      preference: preference || "any"
    });

    await user.save();
    res.status(201).json({ 
      message: "User created successfully", 
      userId: user._id,
      username: user.username,
      gender: user.gender,
      preference: user.preference
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.status(200).json({ 
      message: "Login successful", 
      userId: user._id,
      username: user.username,
      gender: user.gender,
      preference: user.preference
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
