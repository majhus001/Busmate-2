const express = require("express");
const router = express.Router();
const BusRoute = require("../Module/BusRoutesSchema"); // Import Mongoose Model

// Add a new bus route
router.post("/add", async (req, res) => {
  try {
    const { state, city, numStages, stages } = req.body;
    console.log("hi");
    if (!state || !city || !numStages || !stages.length) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newRoute = new BusRoute({ state, city, numStages, stages });
    await newRoute.save();

    res.json({ success: true, message: "Route added successfully" });
  } catch (error) {
    console.error("Error Adding Route:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/getstates", async (req, res) => {

  try {
    const routes = await BusRoute.find();
    
    if (!routes || routes.length === 0) {
      return res.json({ success: false, message: "No stages found." });
    }

    const states = [...new Set(routes.map((route) => route.state))];

    res.json({ success: true, states: states });
  } catch (error) {
    console.error("Error fetching stages:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

router.get("/getcities/:selectedState", async (req, res) => {
  const {  selectedState } = req.params;
console.log(selectedState)
  try {
    const routes = await BusRoute.find({
      state: new RegExp(`^${selectedState}$`, "i"),
    });
    


    if (!routes || routes.length === 0) {
      return res.json({ success: false, message: "No stages found." });
    }

    // Extract stages from all matching routes
    const cities = [...new Set(routes.map((route) => route.city))];


    res.json({ success: true, cities: cities });
  } catch (error) {
    console.error("Error fetching stages:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});



module.exports = router;















