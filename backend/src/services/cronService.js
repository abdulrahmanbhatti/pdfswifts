import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { UPLOAD_DIR, OUTPUT_DIR } from '../middleware/upload.js';

const ONE_HOUR_MS = 60 * 60 * 1000;

const cleanDirectory = (dirPath) => {
  if (!fs.existsSync(dirPath)) return;

  fs.readdir(dirPath, (err, files) => {
    if (err) {
      console.error(`[Auto-Delete] Failed to read directory ${dirPath}:`, err.message);
      return;
    }

    const now = Date.now();
    for (const file of files) {
      const fullPath = path.join(dirPath, file);
      try {
        const stats = fs.statSync(fullPath);
        if (now - stats.mtimeMs > ONE_HOUR_MS) {
          fs.unlinkSync(fullPath);
          console.log(`[Auto-Delete] Deleted expired file: ${file}`);
        }
      } catch (e) {
        console.error(`[Auto-Delete] Error removing ${file}:`, e.message);
      }
    }
  });
};

export const initAutoDeleteCron = () => {
  // Run every 15 minutes: "*/15 * * * *"
  cron.schedule('*/15 * * * *', () => {
    console.log('[Auto-Delete] Running hourly file cleanup cron job...');
    cleanDirectory(UPLOAD_DIR);
    cleanDirectory(OUTPUT_DIR);
  });
  console.log('[Auto-Delete] Cron job scheduled (runs every 15 mins to clean files > 1 hour old)');
};
