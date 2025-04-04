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



router.post("/getstages", async (req, res) => {
  const { selectedCity, state } = req.body;
  console.log(state, selectedCity)
  if (!selectedCity || !state) {
    console.log("jjjjj")
    return res.status(400).json({ success: false, message: "City and state are required." });
  }

  try {
    const routes = await BusRoute.find({
      state: new RegExp(`^${state}$`, "i"), 
      city: new RegExp(`^${selectedCity}$`, "i"),
    });

    console.log("Found Routes:", routes);

    if (!routes.length) {
      return res.json({ success: false, message: "No stages found." });
    }

    // Extract and filter unique stages
    const allStages = [...new Set(routes.flatMap(route => route.stages || []))];

    res.json({ success: true, stages: allStages });
  } catch (error) {
    console.error("Error fetching stages:", error);
    res.status(500).json({ success: false, message: "Internal Server Error." });
  }
});


module.exports = router;















