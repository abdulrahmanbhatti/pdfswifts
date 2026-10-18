import express from 'express';
import path from 'path';
import fs from 'fs';
import { upload, verifyPdfMagicBytes, UPLOAD_DIR, OUTPUT_DIR } from '../middleware/upload.js';
import { mergePDFs, splitPDF, compressPDF, getPDFInfo } from '../services/pdfService.js';

const router = express.Router();

// Middleware to handle both 'files' array and single 'file'
const uploadMiddleware = (req, res, next) => {
  const handler = upload.any();
  handler(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds maximum limit of 50MB.' });
      }
      return res.status(400).json({ error: err.message || 'File upload error.' });
    }
    next();
  });
};

// POST /api/upload — upload PDF file(s), returns fileId(s)
router.post('/upload', uploadMiddleware, async (req, res) => {
  try {
    const uploadedFiles = req.files || [];
    if (uploadedFiles.length === 0) {
      return res.status(400).json({ error: 'Please select at least one PDF file to upload.' });
    }

    if (uploadedFiles.length > 10) {
      // Remove excess files
      for (const f of uploadedFiles) {
        try { fs.unlinkSync(f.path); } catch (e) {}
      }
      return res.status(400).json({ error: 'Maximum 10 files allowed per upload.' });
    }

    const processedFiles = [];

    for (const file of uploadedFiles) {
      // Server-side validation of PDF magic bytes (%PDF)
      try {
        await verifyPdfMagicBytes(file.path);
      } catch (err) {
        return res.status(400).json({
          error: `File "${file.originalname}" is not a valid PDF document (magic bytes check failed).`,
        });
      }

      // Read metadata (page count, size)
      let pageCount = 1;
      try {
        const info = await getPDFInfo(file.path);
        pageCount = info.pageCount;
      } catch (e) {
        console.warn('Could not read page count for', file.filename, e.message);
      }

      processedFiles.push({
        fileId: file.filename,
        originalName: file.originalname,
        size: file.size,
        pageCount,
      });
    }

    return res.status(200).json({
      message: 'Files uploaded successfully',
      files: processedFiles,
      fileId: processedFiles[0]?.fileId, // Convenience for single file upload
    });
  } catch (error) {
    console.error('Upload handler error:', error);
    return res.status(500).json({ error: error.message || 'File upload failed.' });
  }
});

// GET /api/info/:fileId — get info on an uploaded file (page count, etc.)
router.get('/info/:fileId', async (req, res) => {
  try {
    const sanitized = path.basename(req.params.fileId);
    const filePath = path.join(UPLOAD_DIR, sanitized);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found or has expired.' });
    }

    const info = await getPDFInfo(filePath);
    return res.json({
      fileId: sanitized,
      ...info,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get file information.' });
  }
});

// POST /api/merge — body: { fileIds: [], order: [] } → returns download URL
router.post('/merge', async (req, res) => {
  try {
    const { fileIds, order } = req.body;

    if (!fileIds || !Array.isArray(fileIds) || fileIds.length < 2) {
      return res.status(400).json({ error: 'Please provide at least 2 PDF files to merge.' });
    }

    if (fileIds.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 files allowed for merge.' });
    }

    // Determine sequence according to order array if provided
    let sequence = fileIds;
    if (order && Array.isArray(order) && order.length === fileIds.length) {
      sequence = order.map((idx) => fileIds[idx]).filter(Boolean);
    }

    const fullPaths = sequence.map((id) => path.join(UPLOAD_DIR, path.basename(id)));

    // Verify all files exist
    for (const fPath of fullPaths) {
      if (!fs.existsSync(fPath)) {
        return res.status(404).json({
          error: `One of the files has expired or was not found: ${path.basename(fPath)}`,
        });
      }
    }

    const result = await mergePDFs(fullPaths);

    return res.json({
      success: true,
      filename: result.filename,
      downloadUrl: `/api/download/${result.filename}`,
      size: result.fileSize,
    });
  } catch (error) {
    console.error('Merge error:', error);
    return res.status(500).json({ error: error.message || 'Failed to merge PDFs.' });
  }
});

// POST /api/split — body: { fileId, pages: "1-3,5" } → returns download URL
router.post('/split', async (req, res) => {
  try {
    const { fileId, pages } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'File ID is required.' });
    }

    const sanitized = path.basename(fileId);
    const filePath = path.join(UPLOAD_DIR, sanitized);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found or has expired.' });
    }

    const result = await splitPDF(filePath, pages);

    return res.json({
      success: true,
      filename: result.filename,
      downloadUrl: `/api/download/${result.filename}`,
      size: result.fileSize,
      totalPages: result.totalPages,
      extractedPagesCount: result.extractedPagesCount,
    });
  } catch (error) {
    console.error('Split error:', error);
    return res.status(500).json({ error: error.message || 'Failed to split PDF.' });
  }
});

// POST /api/compress — body: { fileId, quality: "high|medium|low" } → returns download URL
router.post('/compress', async (req, res) => {
  try {
    const { fileId, quality = 'medium' } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: 'File ID is required.' });
    }

    const sanitized = path.basename(fileId);
    const filePath = path.join(UPLOAD_DIR, sanitized);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found or has expired.' });
    }

    const result = await compressPDF(filePath, quality);

    return res.json({
      success: true,
      filename: result.filename,
      downloadUrl: `/api/download/${result.filename}`,
      originalSize: result.originalSize,
      newSize: result.newSize,
      percentSaved: result.percentSaved,
    });
  } catch (error) {
    console.error('Compress error:', error);
    return res.status(500).json({ error: error.message || 'Failed to compress PDF.' });
  }
});

// GET /api/download/:taskId — download processed file
router.get('/download/:taskId', (req, res) => {
  try {
    const sanitized = path.basename(req.params.taskId);
    const filePath = path.join(OUTPUT_DIR, sanitized);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Requested download is not found or has expired (auto-deleted after 1 hour).' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${sanitized}"`);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ error: 'Failed to stream download.' });
  }
});

export default router;
