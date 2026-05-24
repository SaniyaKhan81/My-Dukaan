import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose"; // Add this!
import connectDB from "./config/db.js"; 
import Resource from "./models/Resource.js"; 

dotenv.config();

const app = express();

// Connect to the Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// 1. Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running 🚀" });
});

// 2. Database Connection Test (MongoDB style)
app.get("/api/db-test", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({ 
    message: isConnected ? "Database connected ✅" : "Database not connected ❌" 
  });
});

// 3. Get All Resources (No more JOINs!)
app.get("/api/resources", async (req, res) => {
  try {
    // In NoSQL, we just find the data. It's much faster!
    const resources = await Resource.find(); 
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});