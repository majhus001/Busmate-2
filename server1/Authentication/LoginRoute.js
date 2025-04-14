const express = require("express");
const router = express.Router();
const User = require("../Module/User");
const Conductor = require("../Module/Conductor_sc");

router.post("/login", async (req, res) => {
  const { Username, password, role } = req.body; // Changed from userName to Username
  
  try {
    let user;
    let Model;
    
    switch (role) {
      case "Conductor":
        console.log(Username, password, role)
        Model = Conductor;
        user = await Model.findOne({ Username, password });
        if (user) {
          user.LoggedIn = true;
          await user.save();
        }
        break;
      case "Admin":
      case "User":
        console.log(Username, password, role)
        Model = User;
        user = await Model.findOne({
          Username,
          password,
          role,
        });
        if (user) {
          user.LoggedIn = true;
          await user.save();
        }
        break;
        default:
          return res.status(400).json({ error: "Invalid role" });
        }
        
        if (!user) {
          return res.status(400).json({ error: "Invalid credentials or role" });
        }
        const userResponse = {
          message: "Login successful!",
          user,
        };
        console.log("Login success..")
        
    res.json(userResponse);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
