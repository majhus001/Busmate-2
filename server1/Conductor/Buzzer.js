const express = require("express");
const axios = require("axios");

const router = express.Router();
const ESP_IP = process.env.ESP_IP || "http://192.168.85.158";

router.post("/trigger", async (req, res) => {
  try {
    const { selectedBusNo } = req.body; // Use selectedBusNo from frontend

    if (!selectedBusNo) {
      return res.status(400).json({ success: false, message: "Bus number is required" });
    }

    console.log(`🔔 Triggering buzzer for Bus No: ${selectedBusNo}`);

    const espResponse = await axios.post(
      `${ESP_IP}/triggerBuzzer`,
      { selectedBusNo: selectedBusNo, action: "buzz" }, // Pass selectedBusNo as-is
      { timeout: 5000 }
    );

    console.log("✅ ESP Response:", espResponse.data);

    if (espResponse.status === 200) {
      return res.json({ success: true, message: `Buzzer triggered for Bus ${selectedBusNo}` });
    } else {
      return res.status(502).json({
        success: false,
        message: `ESP8266 responded with status ${espResponse.status}`,
      });
    }
  } catch (error) {
    console.error("❌ Error triggering buzzer:", error.message);

    if (error.response) {
      console.error("ESP Response Data:", error.response.data);
      console.error("ESP Status Code:", error.response.status);
      return res.status(502).json({
        success: false,
        message: `ESP8266 error: ${error.response.data?.message || "Unknown response"}`,
      });
    }

    return res.status(500).json({
      success: false,
      message: `Failed to trigger buzzer: ${error.message}`,
    });
  }
});

module.exports = router;