const express = require("express");
const crypto = require("crypto");
const razorpayInstance = require("../config/razorpay");
const Order = require("../Module/OnlineTicket");

const router = express.Router();

// 🔹 Create Payment Order
router.post("/orders", async (req, res) => {
  try {
    const { amount, busno, userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    razorpayInstance.orders.create(options, async (error, order) => {
      if (error) {
        return res.status(500).json({ message: "Something went wrong!" });
      }

      // Save order in DB with userId
      const newOrder = new Order({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: "created",
        busno: busno,
        userId: userId,
      });

      await newOrder.save();

      res.status(200).json({ order });
    });
  } catch (error) {
    console.error("❌ Error in creating order:", error);
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
      const updatedOrder = await Order.findOneAndUpdate(
        { orderId: razorpay_order_id },
        { status: "paid", paymentId: razorpay_payment_id },
        { new: true }
      );

      if (!updatedOrder) {
        return res.status(400).json({ success: false, message: "Order not found!" });
      }

      return res.status(200).json({ success: true, message: "Payment verified successfully", order: updatedOrder });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature!" });
    }
  } catch (error) {
    console.error("❌ Error in payment verification:", error);
    res.status(500).json({ success: false, message: "Internal Server Error!" });
  }
});

module.exports = router;
