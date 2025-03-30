const express = require("express");
const router = express.Router();
const User = require("../Module/User");

router.post("/signup", async (req, res) => {
    try {
      const { Username, email, password, role , city ,state} = req.body;
  console.log("Received Data:", req.body);
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use!" });
      }

      // Validate role
      if (!["Admin", "User"].includes(role)) {
        return res.status(400).json({ message: "Invalid role selected! Must be either Admin or User" });
      }
  
      // Create new user with role
      const newUser = new User({
        Username,
        email,
        password,
        role,
        city,
        state
      });

      await newUser.save();
  
      res.status(201).json({ 
        message: "User registered successfully!", 
        user: {
          userName: newUser.Username,
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;