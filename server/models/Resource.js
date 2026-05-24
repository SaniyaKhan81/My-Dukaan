import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., "Assignment" or "Lab Manual"
  university: { type: String, required: true }, // IMPORTANT for our filters!
  courseCode: String,
  sellerName: String,
  createdAt: { type: Date, default: Date.now }
});

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;