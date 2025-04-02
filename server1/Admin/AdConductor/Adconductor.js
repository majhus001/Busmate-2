const express = require("express");
const router = express.Router();
const Conductor = require("../../Module/Conductor_sc");

// Add Conductor API
router.post("/add", async (req, res) => {
  try {
    let { Username, phoneNumber, dob, age, gender, password, address, adminId } = req.body;

    // Validate required fields
    if (!Username || !phoneNumber || !password) {
      return res.status(400).json({ error: "Username, Phone Number, and Password are required!" });
    }

    // Validate phone number (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ error: "Invalid phone number! Please enter a valid 10-digit number." });
    }

    // Validate password (Minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // Validate and parse DOB
    if (dob) {
      const parsedDate = new Date(dob);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid Date of Birth (DOB). Use YYYY-MM-DD format." });
      }
      dob = parsedDate;
    }

    // Validate age if provided
    if (age !== undefined) {
      if (isNaN(age) || age < 18 || age > 80) {
        return res.status(400).json({ error: "Invalid age! Age should be between 18 and 80." });
      }
    }

    // Create and save the conductor
    const newConductor = new Conductor({
      Username,
      phoneNumber,
      dob,
      age,
      gender,
      password,
      address,
      adminId,
      LoggedIn: false,
    });

    await newConductor.save();
    console.log("sss")
    res.status(201).json({ message: "Conductor added successfully!", conductor: newConductor });
  } catch (error) {
    console.error("Error saving conductor:", error);

    res.status(500).json({ error: error.message || "Internal Server Error", details: error });
  }
});

router.get("/fetchconductor/:adminId", async (req, res) => {
  const { adminId } = req.params;
  try {
    const conductors = await Conductor.find({adminId});
    console.log({data:conductors})
    res.json({data:conductors});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
