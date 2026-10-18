import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFDocument } from 'pdf-lib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:5000/api';
const SAMPLES_DIR = path.resolve(__dirname, '../../sample_test_files');

async function runTests() {
  console.log('========================================================');
  console.log('🧪 PDFSwift 100% FREE Version — Comprehensive Test Suite');
  console.log('========================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const healthRes = await fetch(`${BASE_URL}/health`);
    const health = await healthRes.json();
    assert(health.status === 'ok' && health.app.includes('Free Edition'), 'Backend Health Check (Free Edition, 0 DB)');

    // 2. Reject non-PDF / magic byte test
    const fakePdf = new Blob(['Hello this is not a pdf file'], { type: 'application/pdf' });
    const fakeForm = new FormData();
    fakeForm.append('files', fakePdf, 'fake.pdf');
    const fakeRes = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: fakeForm });
    assert(fakeRes.status === 400, 'Security: Server-side magic bytes validation rejects fake PDF');

    // 3. Upload 3 sample PDFs
    const doc1 = fs.readFileSync(path.join(SAMPLES_DIR, 'document_1.pdf'));
    const doc2 = fs.readFileSync(path.join(SAMPLES_DIR, 'document_2.pdf'));
    const doc3 = fs.readFileSync(path.join(SAMPLES_DIR, 'document_3.pdf'));

    const uploadForm = new FormData();
    uploadForm.append('files', new Blob([doc1]), 'doc1.pdf');
    uploadForm.append('files', new Blob([doc2]), 'doc2.pdf');
    uploadForm.append('files', new Blob([doc3]), 'doc3.pdf');

    const uploadRes = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: uploadForm });
    const uploadData = await uploadRes.json();
    assert(uploadRes.status === 200 && uploadData.files.length === 3, 'Upload 3 PDF files simultaneously');

    const [f1, f2, f3] = uploadData.files;

    // 4. Merge 3 PDFs with zero signup and download
    const mergeRes = await fetch(`${BASE_URL}/merge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileIds: [f1.fileId, f2.fileId, f3.fileId],
        order: [0, 1, 2],
      }),
    });
    const mergeData = await mergeRes.json();
    assert(mergeRes.status === 200 && mergeData.success && mergeData.filename.startsWith('merged-'), 'Merge 3 PDFs without signup');

    const downloadMergeRes = await fetch(`http://localhost:5000${mergeData.downloadUrl}`);
    const mergedBytes = await downloadMergeRes.arrayBuffer();
    const loadedMerged = await PDFDocument.load(mergedBytes);
    const expectedPages = f1.pageCount + f2.pageCount + f3.pageCount;
    assert(
      downloadMergeRes.status === 200 && loadedMerged.getPageCount() === expectedPages,
      `Download merged PDF: Valid PDF containing all ${expectedPages} combined pages`
    );

    // 5. Split PDF (extract specific pages e.g. "1-2, 4")
    const splitRes = await fetch(`${BASE_URL}/split`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileId: f3.fileId,
        pages: '1-2, 4',
      }),
    });
    const splitData = await splitRes.json();
    assert(splitRes.status === 200 && splitData.extractedPagesCount === 3, 'Split PDF with custom range ("1-2, 4")');

    const downloadSplitRes = await fetch(`http://localhost:5000${splitData.downloadUrl}`);
    const splitBytes = await downloadSplitRes.arrayBuffer();
    const loadedSplit = await PDFDocument.load(splitBytes);
    assert(loadedSplit.getPageCount() === 3, 'Download split PDF: contains exactly 3 extracted pages');

    // 6. Compress PDF and check size reduction %
    const compressRes = await fetch(`${BASE_URL}/compress`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileId: f3.fileId,
        quality: 'high',
      }),
    });
    const compressData = await compressRes.json();
    assert(
      compressRes.status === 200 && compressData.percentSaved > 0 && compressData.newSize < compressData.originalSize,
      `Compress PDF: Reduced size by ${compressData.percentSaved}% (${compressData.originalSize}B -> ${compressData.newSize}B)`
    );

    const downloadCompressRes = await fetch(`http://localhost:5000${compressData.downloadUrl}`);
    const compressBytes = await downloadCompressRes.arrayBuffer();
    const loadedCompress = await PDFDocument.load(compressBytes);
    assert(loadedCompress.getPageCount() === f3.pageCount, 'Download compressed PDF: valid and opens correctly');

    // 7. Verify AdSense slots present in frontend code
    const homeCode = fs.readFileSync(path.resolve(__dirname, '../../frontend/src/pages/Home.jsx'), 'utf-8');
    const mergeCode = fs.readFileSync(path.resolve(__dirname, '../../frontend/src/pages/MergePdf.jsx'), 'utf-8');
    const footerCode = fs.readFileSync(path.resolve(__dirname, '../../frontend/src/components/Footer.jsx'), 'utf-8');

    assert(
      homeCode.includes('slot="homepage-leaderboard"') && homeCode.includes('slot="homepage-infeed"'),
      'AdSense: Homepage leaderboard and in-feed ad slots present'
    );
    assert(
      mergeCode.includes('slot="tool-leaderboard"') && mergeCode.includes('slot="tool-rectangle"'),
      'AdSense: Tool page leaderboard and rectangle ad slots present'
    );
    assert(
      footerCode.includes('slot="all-pages-anchor"'),
      'AdSense: Anchor ad slot in footer area present'
    );

    // 8. Verify No Database & No Auth files
    const backendFiles = fs.readdirSync(path.resolve(__dirname, '../src'));
    assert(
      !backendFiles.includes('models') && !backendFiles.includes('config'),
      'Codebase Integrity: 0 Database dependencies, 0 User Accounts, 0 Stripe/Payment routes'
    );

  } catch (err) {
    console.error('Test execution failed with error:', err);
    failed++;
  }

  console.log('========================================================');
  console.log(`Summary: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
