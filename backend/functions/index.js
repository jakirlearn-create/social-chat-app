const functions = require("firebase-functions");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");

const app = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// MongoDB Connection
const MONGODB_URI = "mongodb+srv://jakirlearn:Jakir%404219@fwp.kr8blow.mongodb.net/social_chat_app?retryWrites=true&w=majority&appName=FWP";
process.env.JWT_SECRET = "fwp_audiochat_jwt_secret_key_2025_super_secure";

let isConnected = false;
async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("✓ MongoDB Connected");
  } catch (err) {
    console.error("MongoDB Error:", err.message);
  }
}

// Import routes
const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/users");
const postRoutes = require("../routes/posts");
const messageRoutes = require("../routes/messages");
const conversationRoutes = require("../routes/conversations");
const walletRoutes = require("../routes/wallet");
const adminRoutes = require("../routes/admin");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Firebase Functions API is running!", timestamp: new Date() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Export Express app as Firebase Function
exports.api = functions.https.onRequest(async (req, res) => {
  await connectDB();
  return app(req, res);
});
