const express = require("express");
const router = express.Router();
const Conductor = require("../../Module/Conductor_sc");
const Bus = require("../../Module/BusSchema");
const mongoose = require("mongoose");

// Assign a conductor to a bus
router.post("/assign", async (req, res) => {
  try {
    const { conductorId, busId } = req.body;

    if (!conductorId || !busId) {
      console.log(conductorId,busId);

      return res.status(400).json({ 
        success: false, 
        message: "Both conductor ID and bus ID are required" 
      });
    }


    // Check if conductor exists
    const conductor = await Conductor.findById(conductorId);
    if (!conductor) {
      return res.status(404).json({ 
        success: false, 
        message: "Conductor not found" 
      });
    }

    // Check if bus exists
    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ 
        success: false, 
        message: "Bus not found" 
      });
    }

    // Check if another conductor is already assigned to this bus
    const existingConductorForBus = await Conductor.findOne({ assignedBusId: busId });
    if (existingConductorForBus && existingConductorForBus._id.toString() !== conductorId) {
      return res.status(400).json({
        success: false,
        message: `Bus is already assigned to conductor ${existingConductorForBus.Username}`
      });
    }

    // Update the conductor with the assigned bus
    conductor.assignedBusId = busId;
    await conductor.save();

    res.status(200).json({
      success: true,
      message: "Conductor assigned to bus successfully",
      data: {
        conductor: {
          _id: conductor._id,
          name: conductor.Username,
          phone: conductor.phoneNumber
        },
        bus: {
          _id: bus._id,
          busNo: bus.busNo,
          busRouteNo: bus.busRouteNo,
          route: `${bus.fromStage} to ${bus.toStage}`
        }
      }
    });
  } catch (error) {
    console.error("Error assigning conductor to bus:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error.message 
    });
  }
});

// Get all conductor assignments
router.get("/all", async (req, res) => {
  try {
    const conductors = await Conductor.find({ assignedBusId: { $ne: null } })
      .populate('assignedBusId', 'busRouteNo busNo fromStage toStage');

    const assignments = conductors.map(conductor => ({
      conductor: {
        _id: conductor._id,
        name: conductor.Username,
        phone: conductor.phoneNumber,
        image: conductor.image
      },
      bus: conductor.assignedBusId ? {
        _id: conductor.assignedBusId._id,
        busNo: conductor.assignedBusId.busNo,
        busRouteNo: conductor.assignedBusId.busRouteNo,
        route: `${conductor.assignedBusId.fromStage} to ${conductor.assignedBusId.toStage}`
      } : null
    }));

    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error("Error fetching conductor assignments:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error.message 
    });
  }
});

// Get assignment for a specific conductor
router.get("/conductor/:conductorId", async (req, res) => {
  try {
    const { conductorId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(conductorId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid conductor ID format" 
      });
    }

    const conductor = await Conductor.findById(conductorId)
      .populate('assignedBusId', 'busRouteNo busNo fromStage toStage');

    if (!conductor) {
      return res.status(404).json({ 
        success: false, 
        message: "Conductor not found" 
      });
    }

    if (!conductor.assignedBusId) {
      return res.status(200).json({
        success: true,
        message: "Conductor is not assigned to any bus",
        data: null
      });
    }

    const assignment = {
      conductor: {
        _id: conductor._id,
        name: conductor.Username,
        phone: conductor.phoneNumber,
        image: conductor.image
      },
      bus: {
        _id: conductor.assignedBusId._id,
        busNo: conductor.assignedBusId.busNo,
        busRouteNo: conductor.assignedBusId.busRouteNo,
        route: `${conductor.assignedBusId.fromStage} to ${conductor.assignedBusId.toStage}`
      }
    };

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error("Error fetching conductor assignment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error.message 
    });
  }
});

// Get conductors assigned to a specific bus
router.get("/bus/:busId", async (req, res) => {
  try {
    const { busId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(busId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid bus ID format" 
      });
    }

    const conductors = await Conductor.find({ assignedBusId: busId });
    const bus = await Bus.findById(busId);

    if (!bus) {
      return res.status(404).json({ 
        success: false, 
        message: "Bus not found" 
      });
    }

    const assignments = conductors.map(conductor => ({
      conductor: {
        _id: conductor._id,
        name: conductor.Username,
        phone: conductor.phoneNumber,
        image: conductor.image
      },
      bus: {
        _id: bus._id,
        busNo: bus.busNo,
        busRouteNo: bus.busRouteNo,
        route: `${bus.fromStage} to ${bus.toStage}`
      }
    }));

    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error("Error fetching bus assignments:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error.message 
    });
  }
});

// Remove a conductor's assignment
router.delete("/remove/:conductorId", async (req, res) => {
  try {
    const { conductorId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(conductorId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid conductor ID format" 
      });
    }

    const conductor = await Conductor.findById(conductorId);
    if (!conductor) {
      return res.status(404).json({ 
        success: false, 
        message: "Conductor not found" 
      });
    }

    if (!conductor.assignedBusId) {
      return res.status(400).json({
        success: false,
        message: "Conductor is not assigned to any bus"
      });
    }

    // Remove the assignment
    conductor.assignedBusId = null;
    await conductor.save();

    res.status(200).json({
      success: true,
      message: "Conductor assignment removed successfully"
    });
  } catch (error) {
    console.error("Error removing conductor assignment:", error);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error.message 
    });
  }
});

module.exports = router;
