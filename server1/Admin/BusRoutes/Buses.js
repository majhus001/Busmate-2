const express = require("express");
const router = express.Router();
const Bus = require("../../Module/BusSchema");

router.post("/add", async (req, res) => {
  try {
    const {
      busRouteNo,
      busNo,
      busPassword,
      totalShifts,
      totalSeats,
      availableSeats,
      busType,
      state,
      city,
      fromStage,
      toStage,
      prices,
      timings,
      adminId,
    } = req.body;

    if (!fromStage || !toStage) {
      return res
        .status(400)
        .json({ message: "fromStage and toStage are required" });
    }

    console.log("From Stage:", fromStage);
    console.log("To Stage:", toStage);

    // Create and save the new bus document
    const newBus = new Bus({
      busRouteNo,
      busNo,
      busPassword,
      totalShifts,
      totalSeats,
      availableSeats,
      busType,
      state,
      city,
      fromStage,
      toStage,
      prices,
      timings,
      adminId,
      LoggedIn: false,
    });
    await newBus.save();
    res.status(201).json({ message: "Bus added successfully!", bus: newBus });
  } catch (error) {
    console.error("Error adding bus:", error);
    res.status(500).json({ message: "Error adding bus", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { busplateNo, password } = req.body;

    // Check if busplateNo and password are provided in the request body
    if (!busplateNo || !password) {
      return res.status(400).json({
        success: false,
        message: "Bus Plate No and Password are required",
      });
    }

    // Find the bus by its plate number (busNo)
    const bus = await Bus.findOne({ busNo: busplateNo });

    // If no bus is found with the provided bus plate number
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    // Check if the provided password matches the bus's stored password
    if (password !== bus.busPassword) {
      console.log("Invalid Password");
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password" });
    }

    // Update the bus to mark it as logged in
    bus.LoggedIn = true;
    await bus.save();

    // Respond with a success message and bus details
    res.json({ success: true, message: "Login successful", busDetails: bus });
  } catch (error) {
    // Handle any errors and return a server error
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
});

router.get("/fetchbus/:adminId", async (req, res) => {
  const { adminId } = req.params;

  try {
    const buses = await Bus.find({ adminId });

    console.log(buses);
    res.json({ data: buses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/fetchstate", async (req, res) => {
  try {
    const { state } = req.query;
    const buses = await Bus.find({ state });

    if (buses.length === 0) {
      return res
        .status(404)
        .json({ message: "No buses available in this state." });
    }

    res.json(buses);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/fetchcities", async (req, res) => {
  try {
    const { city } = req.query;

    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    console.log("Fetching locations for city:", city);

    // Case-insensitive city match
    const routes = await Bus.find({ city: new RegExp(`^${city}$`, "i") });

    console.log("Routes found:", routes);

    if (routes.length === 0) {
      return res.status(404).json({ message: "No routes found for this city" });
    }

    // Extract unique fromStage and toStage
    const fromStages = [
      ...new Set(routes.map((bus) => bus.fromStage).filter(Boolean)),
    ];
    const toStages = [
      ...new Set(routes.map((bus) => bus.toStage).filter(Boolean)),
    ];

    console.log("From Stages:", fromStages);
    console.log("To Stages:", toStages);

    res.json({ fromStages, toStages });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/getstages", async (req, res) => {
  const { busplateNo, selectedBusNo } = req.body;
  console.log("Received request:", { busplateNo, selectedBusNo });

  if (!busplateNo || !selectedBusNo) {
    console.log("Missing required parameters.");
    return res.status(400).json({
      success: false,
      message: "Bus plate number and route number are required.",
    });
  }

  try {
    const bus = await Bus.findOne({
      busNo: { $regex: `^${busplateNo}$`, $options: "i" },
      busRouteNo: { $regex: `^${selectedBusNo}$`, $options: "i" },
    }).lean();

    if (!bus) {
      console.log("No bus found.");
      return res.json({ success: false, message: "No bus found." });
    }

    if (!bus.timings || typeof bus.timings !== "object") {
      console.log("Timings field is not valid.");
      return res.json({
        success: false,
        message: "No valid timing data found.",
      });
    }

    const stageNames = Object.keys(bus.timings); // Extract timing keys

    return res.json({ success: true, stages: stageNames });
  } catch (error) {
    console.error("Error fetching stages:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error." });
  }
});

router.get("/fetchAllBuses", async (req, res) => {
  try {
    const buses = await Bus.find(); // Fetch all buses from the database

    if (buses.length === 0) {
      return res.status(404).json({ message: "No buses available." });
    }

    res.json(buses);
  } catch (error) {
    console.error("Error fetching all buses:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/fetchBy/cities/:selectedCity", async (req, res) => {
  try {
    const { selectedCity } = req.params;
    console.log(selectedCity);
    if (!selectedCity) {
      return res.status(400).json({ message: "City is required" });
    }

    // Case-insensitive city match
    const routes = await Bus.find({
      city: new RegExp(`^${selectedCity}$`, "i"),
    });

    if (routes.length === 0) {
      return res.status(404).json({ message: "No routes found for this city" });
    }

    res.json({ data: routes });
  } catch (error) {
    console.error("Error fetching locations:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/fetchbusno", async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res
        .status(400)
        .json({ message: "Both From and To locations are required" });
    }

    console.log(`Checking available buses from ${from} to ${to}`);

    // Find buses that match both from and to locations
    const buses = await Bus.find({
      fromStage: { $regex: new RegExp(`^${from}$`, "i") },
      toStage: { $regex: new RegExp(`^${to}$`, "i") },
    });

    if (buses.length === 0) {
      return res
        .status(404)
        .json({ message: "No buses found between these locations" });
    }

    // Extract unique bus numbers
    const busNumbers = [...new Set(buses.map((bus) => bus.busRouteNo))];
    const busplateNo = [...new Set(buses.map((bus) => bus.busNo))];

    console.log("Available Bus Numbers:", busNumbers);
    res.json({ busNumbers, busplateNo, buses });
  } catch (error) {
    console.error("Error fetching bus numbers:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/getprice", async (req, res) => {
  try {
    const { selectedBusNo } = req.body;

    if (!selectedBusNo) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Search for the route with the specified bus number
    const busRoute = await Bus.findOne({
      busRouteNo: selectedBusNo,
    });

    if (!busRoute) {
      return res.status(404).json({
        success: false,
        message: "Route not found for this bus",
      });
    }

    res.json({
      success: true,
      data: busRoute,
    });
  } catch (error) {
    console.error("Error fetching ticket price:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.delete("/deletebus/:busId", async (req, res) => {
  try {
    const { busId } = req.params;

    const deletedBus = await Bus.findByIdAndDelete(busId);

    if (!deletedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json({ message: "Bus deleted successfully!", deletedBus });
  } catch (error) {
    console.error("Error deleting bus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/updatebus/:busId", async (req, res) => {
  try {
    const { busId } = req.params;
    const updateData = req.body;

    // Ensure that numerical fields are correctly parsed
    if (updateData.totalSeats)
      updateData.totalSeats = Number(updateData.totalSeats);
    if (updateData.totalShifts)
      updateData.totalShifts = Number(updateData.totalShifts);
    if (updateData.availableSeats)
      updateData.availableSeats = Number(updateData.availableSeats);

    // Update the bus document
    const updatedBus = await Bus.findByIdAndUpdate(busId, updateData, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures validation rules apply
    });

    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json({ message: "Bus updated successfully!", bus: updatedBus });
  } catch (error) {
    console.error("Error updating bus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/seat-availability", async (req, res) => {
  const { busplateNo, selectedBusNo } = req.query; 
  
  try {
    const bus = await Bus.findOne({
      busNo: { $regex: `^${busplateNo}$`, $options: "i" },
      busRouteNo: { $regex: `^${selectedBusNo}$`, $options: "i" },
    }).lean();
 
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }

    res.json({ data: bus.availableSeats });
  } catch (error) {
    console.error("Error fetching seat availability:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
