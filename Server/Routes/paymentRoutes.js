import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// 1. Create Razorpay Order
router.post("/createOrder", async (req, res) => {
  try {
    const { amount, plan } = req.body;

    const options = {
      amount: amount, // in paise (₹1 = 100 paise)
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).send("Error creating Razorpay order");
  }
});

// 2. Verify Payment & Send Email
router.post("/verify", async (req, res) => {
  try {
    const { paymentId, orderId, signature, plan, email } = req.body;

    const body = orderId + "|" + paymentId;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === signature) {
      // Payment verified ✅ → Send confirmation email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "✅ Subscription Plan Purchased Successfully",
        text: `Thank you for purchasing the ${plan} plan! Your payment has been received successfully.`,
      };

      await transporter.sendMail(mailOptions);

      res.json({ success: true, message: "Payment verified & email sent" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).send("Error verifying payment");
  }
});

export default router;
