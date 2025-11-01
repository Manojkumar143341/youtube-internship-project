import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";

// Route imports
import videoroutes from "./Routes/video.js";
import userroutes from "./Routes/User.js";
import commentroutes from "./Routes/comment.js";
import groupRoutes from "./Routes/groups.js";
import downloadsRoutes from "./Routes/downloads.js";
import paymentRoutes from "./Routes/paymentRoutes.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(bodyParser.json());

// Routes
app.use("/api/payment", paymentRoutes);
app.use("/groups", groupRoutes);
app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/comment", commentroutes);
app.use("/api/downloads", downloadsRoutes);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/Download", express.static(path.join(__dirname, "Download")));

// Default route
app.get("/", (req, res) => {
  res.send("YourTube server is running 🚀");
});

// MongoDB connection
const DB_URL = process.env.MONGO_URI;

const PORT = process.env.PORT || 5000;

mongoose
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB Database connected");
    app.listen(PORT, () => console.log(`🚀 Server running on Port ${PORT}`));
  })
  .catch((error) => console.error("❌ Database connection error:", error));
