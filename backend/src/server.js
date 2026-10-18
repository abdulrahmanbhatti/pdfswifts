import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { apiLimiter } from './middleware/rateLimit.js';
import { initAutoDeleteCron } from './services/cronService.js';
import pdfRoutes from './routes/pdf.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize File Cleanup Cron (1 hour auto-delete daemon)
initAutoDeleteCron();

// CORS setup
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General Rate Limiter on API (60 req/min per IP)
app.use('/api', apiLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'PDFSwift API (Free Edition)',
    version: '1.0.0',
    time: new Date().toISOString(),
  });
});

// Mount PDF Tools API Endpoints
app.use('/api', pdfRoutes);

// Serve Frontend in Production if dist folder exists
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  console.log(`📦 Serving production frontend from: ${frontendDist}`);
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]', err.stack || err.message || err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 PDFSwift Free Backend running on port ${PORT}`);
  console.log(`⏱️ Auto-delete files older than 1 hour enabled`);
  console.log(`🛡️ Magic bytes & 50MB upload limits active`);
  console.log(`⚡ 100% Free — No Database, No Auth, No Limits`);
  console.log(`===============================================`);
});

export default app;
