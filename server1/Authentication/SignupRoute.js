const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = require("../Module/User");

// In-memory OTP store
const otpStore = {};

// OTP utils
const generateOTP = () => crypto.randomInt(100000, 999999).toString();
const setOTP = (email, otp) => { otpStore[email] = otp; };
const verifyOTP = (email, otp) => otpStore[email] === otp;
const clearOTP = (email) => { delete otpStore[email]; };

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: "Your OTP for Signup",
    text: `Your OTP is: ${otp}`,
  };
  return transporter.sendMail(mailOptions);
};

// 1. Send OTP
router.post("/signup", async (req, res) => {
  try {
    const { Username, email, password, role, city, state } = req.body;
    console.log("Received Data:", req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use!" });
    }

    if (!["Admin", "User"].includes(role)) {
      return res.status(400).json({ message: "Invalid role!" });
    }

    const otp = generateOTP();
    setOTP(email, otp);
    await sendOTP(email, otp);

    res.status(200).json({
      message: "OTP sent to email. Please verify to complete signup.",
      userData: { Username, email, password, role, city, state },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Verify OTP & Register
// 2. Verify OTP & Register
router.post("/verify-otp", async (req, res) => {
  try {
    const { Username, email, password, role, city, state, otp } = req.body;

    console.log("Verifying OTP for:", email);
    console.log("Received OTP:", otp);
    console.log("Stored OTP:", otpStore[email]);

    if (!verifyOTP(email, otp.trim())) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = new User({
      Username,
      email,
      password,
      role,
      city,
      state,
    });

    await user.save();
    clearOTP(email); // remove from memory

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        _id: user._id, // ✅ important!
        userName: user.Username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
