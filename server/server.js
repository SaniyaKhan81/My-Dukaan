import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import fs from "fs";
import connectDB from "./config/db.js";
import Resource from "./models/Resource.js";
import User from "./models/User.js";
import Transaction from "./models/Transaction.js";
import { protect, signToken } from "./middleware/auth.js";
import { UNIVERSITIES, COURSES } from "./data/constants.js";
import { validatePaymentDetails, buildPaymentRef } from "./utils/validatePayment.js";
import { getPreview, getFullFile } from "./utils/filePreview.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

const resolveSellerId = async (resource) => {
  let sellerId = resource.seller?._id || resource.seller;
  if (sellerId) return sellerId;

  if (resource.sellerName) {
    const legacyUser = await User.findOne({
      name: new RegExp(resource.sellerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
    });
    if (legacyUser) {
      resource.seller = legacyUser._id;
      await resource.save();
      return legacyUser._id;
    }
  }

  // Legacy uploads used default sellerName 'sunny' with no real user link
  const fallbackUser = await User.findOne().sort({ createdAt: 1 });
  if (fallbackUser) {
    resource.seller = fallbackUser._id;
    await resource.save();
    return fallbackUser._id;
  }

  return null;
};

const userHasPurchased = async (userId, resourceId) => {
  const tx = await Transaction.findOne({
    buyer: userId,
    resource: resourceId,
    status: 'completed',
  });
  return !!tx;
};

// ── Health ──────────────────────────────────────────────
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running" });
});

app.get("/api/db-test", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  res.json({
    message: isConnected ? "Database connected" : "Database not connected",
  });
});

// ── Reference Data ──────────────────────────────────────
app.get("/api/universities", (req, res) => {
  res.json(UNIVERSITIES);
});

app.get("/api/courses", (req, res) => {
  res.json(COURSES);
});

// ── Auth ────────────────────────────────────────────────
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { name, email, password, studentId, university } = req.body;

    if (!name || !email || !password || !studentId || !university) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!UNIVERSITIES.includes(university)) {
      return res.status(400).json({ error: "Invalid university" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = await User.create({ name, email, password, studentId, university });
    const token = signToken(user._id);

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = signToken(user._id);
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/auth/me", protect, (req, res) => {
  res.json(req.user);
});

// ── Resources ─────────────────────────────────────────
app.get("/api/resources", async (req, res) => {
  try {
    const filter = {};
    if (req.query.category && req.query.category !== 'All') {
      filter.category = req.query.category;
    }
    if (req.query.university && req.query.university !== 'All') {
      filter.university = req.query.university;
    }

    const resources = await Resource.find(filter)
      .populate('seller', 'name university studentId')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/resources/my", protect, async (req, res) => {
  try {
    const resources = await Resource.find({ seller: req.user._id })
      .populate('seller', 'name university studentId')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/resources/:id/preview", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource?.fileUrl) {
      return res.status(404).json({ error: "No file to preview" });
    }

    const preview = await getPreview(resource.fileUrl);

    if (preview.type === 'pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="preview-page-1.pdf"');
      return res.send(preview.buffer);
    }

    if (preview.type === 'image') {
      res.setHeader('Content-Type', preview.mime);
      res.setHeader('Content-Disposition', 'inline');
      return res.send(preview.buffer);
    }

    res.json(preview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/resources/:id/download", protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource?.fileUrl) {
      return res.status(404).json({ error: "File not found" });
    }

    const sellerId = await resolveSellerId(resource);
    const isOwner = sellerId && sellerId.toString() === req.user._id.toString();
    const purchased = await userHasPurchased(req.user._id, resource._id);

    if (!isOwner && !purchased) {
      return res.status(403).json({ error: "Purchase required to download full document" });
    }

    const { filePath, filename } = getFullFile(resource.fileUrl);
    res.download(filePath, filename);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/resources/:id/purchased", protect, async (req, res) => {
  try {
    const purchased = await userHasPurchased(req.user._id, req.params.id);
    res.json({ purchased });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/resources/:id", async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('seller', 'name university studentId');

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/resources", protect, upload.single('file'), async (req, res) => {
  try {
    const { title, description, category, price, university, courseCode } = req.body;

    if (!title || !category || !price || !university || !courseCode) {
      if (req.file) fs.unlinkSync(`uploads/${req.file.filename}`);
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newResource = await Resource.create({
      title,
      description,
      category,
      price: Number(price),
      university,
      courseCode,
      seller: req.user._id,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null,
    });

    const populated = await Resource.findById(newResource._id)
      .populate('seller', 'name university studentId');

    res.status(201).json(populated);
  } catch (err) {
    if (req.file) fs.unlinkSync(`uploads/${req.file.filename}`);
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/resources/:id", protect, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const sellerId = await resolveSellerId(resource);
    if (!sellerId || sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this resource" });
    }

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Resource and file deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Storefront by user ──────────────────────────────────
app.get("/api/storefront/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('name university studentId');
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const resources = await Resource.find({ seller: user._id })
      .populate('seller', 'name university studentId')
      .sort({ createdAt: -1 });

    res.json({ user, resources });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Transactions (Payment Ledger) ───────────────────────
app.post("/api/transactions/checkout", protect, async (req, res) => {
  try {
    const { resourceId, paymentMethod, paymentDetails } = req.body;

    if (!resourceId || !paymentMethod || !paymentDetails) {
      return res.status(400).json({ error: "Payment details required" });
    }

    const validation = validatePaymentDetails(paymentMethod, paymentDetails);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.errors.join('. ') });
    }

    const resource = await Resource.findById(resourceId).populate('seller', 'name');
    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const sellerId = await resolveSellerId(resource);
    if (!sellerId) {
      return res.status(400).json({ error: "This listing has no seller. Ask the uploader to re-list it." });
    }

    if (sellerId.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: "You cannot buy your own resource" });
    }

    const existing = await Transaction.findOne({
      buyer: req.user._id,
      resource: resourceId,
      status: 'completed',
    });
    if (existing) {
      return res.status(400).json({ error: "You already purchased this resource" });
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    const orderId = `MD-${Date.now().toString(36).toUpperCase()}`;
    const paymentRef = buildPaymentRef(paymentMethod, paymentDetails);

    const transaction = await Transaction.create({
      orderId,
      buyer: req.user._id,
      seller: sellerId,
      resource: resource._id,
      amount: resource.price,
      currency: 'PKR',
      paymentMethod,
      paymentRef,
      status: 'completed',
    });

    const populated = await Transaction.findById(transaction._id)
      .populate('buyer', 'name email')
      .populate('seller', 'name email')
      .populate('resource', 'title category courseCode university fileUrl');

    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/api/transactions/my", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ buyer: req.user._id })
      .populate('seller', 'name')
      .populate('resource', 'title category price')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/transactions/ledger", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('buyer', 'name email university')
      .populate('seller', 'name email university')
      .populate('resource', 'title category price')
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
