import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  university: { type: String, required: true },
  courseCode: { type: String, required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sellerName: { type: String },
  fileUrl: { type: String },
}, { timestamps: true });

resourceSchema.index({ category: 1, university: 1 });
resourceSchema.index({ university: 1, courseCode: 1 });
resourceSchema.index({ seller: 1 });

const deleteFileFromDisk = (fileUrl) => {
  if (!fileUrl) return;
  const filePath = path.join(process.cwd(), fileUrl.replace(/^\//, ''));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

resourceSchema.pre('findOneAndDelete', async function () {
  const doc = await this.model.findOne(this.getFilter());
  if (doc) deleteFileFromDisk(doc.fileUrl);
});

resourceSchema.pre('deleteOne', { document: true, query: false }, function () {
  deleteFileFromDisk(this.fileUrl);
});

export default mongoose.model('Resource', resourceSchema);
