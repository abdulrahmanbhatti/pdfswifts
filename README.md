# PDFSwift — 100% Free Online PDF Tools Suite

**PDFSwift** is a fast, clean, private online PDF processing suite inspired by SmallPDF and iLovePDF. Built exclusively as a **100% FREE** service powered solely by Google AdSense display advertisements:
- **Zero user accounts, logins, or signups**
- **Zero databases needed**
- **Zero payment or subscription friction**
- **1-Hour automated server-side file purge**
- **Mobile-optimized touch UI (tested down to 375px)**

---

## ⚡ Tools Included

### 1. Merge PDF (`/merge-pdf`)
- Upload 2 to 10 PDF files (drag & drop or browse)
- Drag handles and visual Up/Down controls to reorder pages
- Combines into `merged-<timestamp>.pdf`
- Instant one-click download

### 2. Split PDF (`/split-pdf`)
- Upload 1 PDF (up to 50MB)
- Displays total page count
- Input custom page ranges (e.g., `1-3, 5, 8-10`) or toggle interactive visual page tiles
- Instant download of extracted pages

### 3. Compress PDF (`/compress-pdf`)
- Upload 1 PDF
- Displays original file size
- 3 quality levels:
  - **High Compression**: Maximum space saved (~50–70% reduction)
  - **Medium Compression**: Balanced standard quality (~30–45% reduction)
  - **Low Compression**: High-fidelity quality preservation (~15–25% reduction)
- Real-time comparison metrics (Original vs. Compressed vs. % Saved)

---

## 🧭 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Homepage | Centered hero, tool cards grid, 3-step workflow, FAQ accordion, trust badge, footer |
| `/merge-pdf` | Merge tool | Upload → reorder → merge → download |
| `/split-pdf` | Split tool | Upload → select pages / range → split → download |
| `/compress-pdf` | Compress tool | Upload → quality select → compress → download |
| `/privacy` | Legal | Privacy policy detailing 1-hour auto-deletion, zero tracking |
| `/terms` | Legal | Terms of service for free fair use |
| `/sitemap.xml` | SEO | Search engine crawler sitemap |
| `/robots.txt` | SEO | Search engine bot guidelines |

---

## 📢 Google AdSense Placements

The codebase includes designated AdSense placeholder containers marked with exact HTML comments for easy ad snippet insertion:
1. **Homepage:**
   - `<!-- AdSense: homepage-leaderboard -->` (Leaderboard below hero)
   - `<!-- AdSense: homepage-infeed -->` (In-feed ad between tool cards)
2. **Tool Pages:**
   - `<!-- AdSense: tool-leaderboard -->` (Leaderboard above tool area)
   - `<!-- AdSense: tool-rectangle -->` (Rectangle ad below result card)
3. **All Pages:**
   - `<!-- AdSense: all-pages-anchor -->` (Anchor ad slot in footer area)

*All ad slots are styled to never block or overlap tool buttons or inputs.*

---

## 🔒 Security & Privacy

- **Server-Side Magic Bytes Validation:** Rejects corrupted files or non-PDF uploads before processing.
- **50MB File Size Limits:** Strictly enforced via Multer disk limits.
- **Private Temp Storage:** Uploaded files stored outside public root.
- **Automated 1-Hour Purge Daemon:** `node-cron` daemon sweeps uploads and output folders every 15 minutes, permanently deleting anything older than 60 minutes.
- **In-Memory Rate Limiting:** 60 requests/minute per IP to prevent abusive scrapers.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, React Router 6, Axios
- **Backend:** Node.js (ESM), Express.js, `pdf-lib`, `multer`, `node-cron`, `express-rate-limit`
- **Database:** None required!

---

## 🚀 Running the Application

### 1. Start Backend Server
```bash
cd backend
npm install
node src/server.js
```
Runs at: `http://localhost:5000`

### 2. Start Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```
Runs at: `http://localhost:5173`

---

## 🧪 Automated Verification Suite

Run the full end-to-end automated test suite:
```bash
cd backend
node src/test_free_suite.js
```
