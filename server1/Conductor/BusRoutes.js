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

router.post("/get_stages", async (req, res) => {
  const { selectedCity, selectedState } = req.body;

  console.log("Fetching stages for:", selectedCity, selectedState);

  try {
    const routes = await BusRoute.find({
    //   state: new RegExp(`^${selectedState}$`, "i"),
      city: new RegExp(`^${selectedCity}$`, "i"),
    });

    console.log("Found Routes:", routes);

    if (!routes || routes.length === 0) {
      return res.json({ success: false, message: "No stages found." });
    }

    // Extract stages from all matching routes
    const allStages = routes.flatMap((route) => route.stages || []);

    res.json({ success: true, stages: allStages });
  } catch (error) {
    console.error("Error fetching stages:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

module.exports = router;
