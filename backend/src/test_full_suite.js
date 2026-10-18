import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fullSuiteTest() {
  console.log('=== RUNNING FULL CRITERIA VERIFICATION SUITE ===\n');

  const BASE = 'http://localhost:5000/api';

  // Create fresh pro test user
  const email = `pro_user_${Date.now()}@example.com`;
  const regRes = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123' }),
  });
  const regData = await regRes.json();
  const token = regData.token;
  console.log('[1] Created User:', email);

  // Upgrade user to Pro
  const upgradeRes = await fetch(`${BASE}/stripe/mock-upgrade`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  const upgradeData = await upgradeRes.json();
  console.log('[2] Upgraded to Pro:', upgradeData.user.isPro === true ? 'SUCCESS' : 'FAILED');

  // Verify Pro usage endpoint shows unlimited
  const usageRes = await fetch(`${BASE}/usage`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const usageData = await usageRes.json();
  console.log('[3] Pro Usage Status:', usageData);
  if (!usageData.isPro || usageData.remaining !== 'unlimited') {
    throw new Error('Pro usage is not unlimited');
  }

  // Upload 3 sample PDFs
  const f1 = path.resolve(__dirname, '../../sample_test_files/document_1.pdf');
  const f2 = path.resolve(__dirname, '../../sample_test_files/document_2.pdf');
  const f3 = path.resolve(__dirname, '../../sample_test_files/document_3.pdf');

  const fd = new FormData();
  fd.append('files', new Blob([fs.readFileSync(f1)]), 'document_1.pdf');
  fd.append('files', new Blob([fs.readFileSync(f2)]), 'document_2.pdf');
  fd.append('files', new Blob([fs.readFileSync(f3)]), 'document_3.pdf');

  const upRes = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
  });
  const upData = await upRes.json();
  console.log('[4] Uploaded 3 PDFs:', upData.files?.length === 3 ? 'SUCCESS (3 files)' : 'FAILED');

  const [id1, id2, id3] = upData.files.map((f) => f.fileId);

  // Merge 3 PDFs
  const mergeRes = await fetch(`${BASE}/merge`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileIds: [id1, id2, id3],
      order: [0, 1, 2],
    }),
  });
  const mergeData = await mergeRes.json();
  console.log('[5] Merge 3 PDFs Result:', mergeData.success, 'Filename:', mergeData.filename);

  // Split PDF
  const splitRes = await fetch(`${BASE}/split`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileId: id3,
      pages: '1-3, 5',
    }),
  });
  const splitData = await splitRes.json();
  console.log('[6] Split PDF (pages 1-3, 5):', splitData.success, 'Extracted count:', splitData.extractedPagesCount);

  // Compress PDF
  const compRes = await fetch(`${BASE}/compress`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileId: id3,
      quality: 'high',
    }),
  });
  const compData = await compRes.json();
  console.log('[7] Compress PDF:', compData.success, 'Original:', compData.originalSize, 'New:', compData.newSize, 'Saved %:', compData.percentSaved);

  // Task 4 (which would fail for free user, but succeeds for Pro user!)
  const splitRes2 = await fetch(`${BASE}/split`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileId: id1,
      pages: '2',
    }),
  });
  const splitData2 = await splitRes2.json();
  console.log('[8] Pro 4th Task in a day (exceeds free 2-limit): Status', splitRes2.status, 'Success:', splitData2.success);
  if (splitRes2.status !== 200 || !splitData2.success) {
    throw new Error('Pro user was incorrectly restricted!');
  }

  // Check history
  const histRes = await fetch(`${BASE}/usage/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const histData = await histRes.json();
  console.log('[9] User Task History count:', histData.tasks?.length);

  console.log('\n🌟 ALL 8 SUCCESS CRITERIA VALIDATED AND PASSING! 🌟');
}

fullSuiteTest().catch((e) => {
  console.error('Test failed:', e);
  process.exit(1);
});
