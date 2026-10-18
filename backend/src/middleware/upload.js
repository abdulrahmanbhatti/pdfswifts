import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dedicated private uploads directory (outside public folder)
export const UPLOAD_DIR = path.resolve(__dirname, '../../uploads');
export const OUTPUT_DIR = path.resolve(__dirname, '../../outputs');

// Ensure directories exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  },
});

// MIME type filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf' || file.originalname.toLowerCase().endsWith('.pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
  }
};

// 50MB file size limit
export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10, // Up to 10 files for merge
  },
  fileFilter,
});

// Server-side validation of PDF magic bytes (%PDF)
export const verifyPdfMagicBytes = async (filePath) => {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath, { start: 0, end: 4 });
    const chunks = [];

    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const header = buffer.toString('utf-8', 0, 4);
      if (header === '%PDF') {
        resolve(true);
      } else {
        // Delete invalid file immediately
        try {
          fs.unlinkSync(filePath);
        } catch (e) {}
        reject(new Error('Corrupted or invalid PDF file (magic bytes mismatch).'));
      }
    });
    stream.on('error', (err) => {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {}
      reject(err);
    });
  });
};
