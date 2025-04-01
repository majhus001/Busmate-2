const express = require("express");
const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");
const Order = require("../Module/OnlineTicket");

const router = express.Router();

// 🔹 Create Payment Order
router.post("/orders", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100, // Convert to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, async (error, order) => {
      if (error) {
        return res.status(500).json({ message: "Something went wrong!" });
      }

      // Save order in DB
      await new Order({
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: "created",
      }).save();

      res.status(200).json({ order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

// 🔹 Verify Payment
router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await Order.findOneAndUpdate({ receipt: razorpay_order_id }, { status: "paid" });
      return res.status(200).json({ success: true, message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature!" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

module.exports = router;
