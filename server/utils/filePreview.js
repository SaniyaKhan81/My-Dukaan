import fs from 'fs';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import mammoth from 'mammoth';

const getFilePath = (fileUrl) => {
  if (!fileUrl) return null;
  return path.join(process.cwd(), fileUrl.replace(/^\//, ''));
};

export const getPreview = async (fileUrl) => {
  const filePath = getFilePath(fileUrl);
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error('File not found');
  }

  const ext = path.extname(filePath).toLowerCase();

  if (ext === '.pdf') {
    const bytes = fs.readFileSync(filePath);
    const src = await PDFDocument.load(bytes);
    const dst = await PDFDocument.create();
    if (src.getPageCount() > 0) {
      const [page] = await dst.copyPages(src, [0]);
      dst.addPage(page);
    }
    const previewBytes = await dst.save();
    return { type: 'pdf', buffer: Buffer.from(previewBytes) };
  }

  if (ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ path: filePath });
    const lines = result.value.split('\n').filter((l) => l.trim());
    const excerpt = lines.slice(0, 25).join('\n').slice(0, 2000);
    return {
      type: 'docx',
      excerpt: excerpt || 'No text content found in document.',
      totalLines: lines.length,
    };
  }

  if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
    return { type: 'image', buffer: fs.readFileSync(filePath), mime: `image/${ext.slice(1)}` };
  }

  if (ext === '.txt') {
    const text = fs.readFileSync(filePath, 'utf-8');
    return { type: 'text', excerpt: text.slice(0, 2000) };
  }

  return {
    type: 'unsupported',
    excerpt: 'Preview not available for this file type. Purchase to download the full document.',
  };
};

export const getFullFile = (fileUrl) => {
  const filePath = getFilePath(fileUrl);
  if (!filePath || !fs.existsSync(filePath)) {
    throw new Error('File not found');
  }
  return { filePath, filename: path.basename(filePath) };
};
