const express = require("express");
const router = express.Router();
const Bus = require("../Module/BusSchema");

// Get all bus route numbers
router.get("/bus-routes", async (req, res) => {
  try {
    const busRouteNos = await Bus.distinct("busRouteNo");
    res.json(busRouteNos);
  } catch (error) {
    console.error("Error fetching bus routes:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get adminId and conductorId by busRouteNo
router.get("/metadata/:busRouteNo", async (req, res) => {
  try {
    const { busRouteNo } = req.params;
    console.log(`Fetching metadata for busRouteNo: ${busRouteNo}`);

    const bus = await Bus.findOne(
      { busRouteNo: { $regex: `^${busRouteNo}$`, $options: "i" } },
      "adminId conductorId"
    );

    if (!bus) {
      console.error(`No bus found for busRouteNo: ${busRouteNo}`);
      return res.status(404).json({ message: "Bus route not found" });
    }

    if (!bus.conductorId) {
      console.error(`No conductorId found for busRouteNo: ${busRouteNo}, bus:`, bus);
      return res.status(404).json({ message: "No conductor assigned to this bus route" });
    }

    console.log(`Found bus for ${busRouteNo}:`, { adminId: bus.adminId, conductorId: bus.conductorId });

    res.status(200).json({
      adminId: bus.adminId,
      conductorId: bus.conductorId,
    });
  } catch (error) {
    console.error(`Error fetching metadata for busRouteNo: ${busRouteNo}`, error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;