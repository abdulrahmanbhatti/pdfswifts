import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testHttpMergeSpeed() {
  const BASE = 'http://localhost:5000/api';

  // Create clean user with fresh 6 tasks
  const reg = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `speed_test_${Date.now()}@example.com`, password: 'password123' }),
  });
  const regJson = await reg.json();
  const token = regJson.token;

  const f1 = path.resolve(__dirname, '../../sample_test_files/document_1.pdf');
  const f2 = path.resolve(__dirname, '../../sample_test_files/document_2.pdf');
  const f3 = path.resolve(__dirname, '../../sample_test_files/document_3.pdf');

  // Upload 3 files
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
  const fileIds = upData.files.map((f) => f.fileId);

  // Time merge API call
  const start = performance.now();
  const mergeRes = await fetch(`${BASE}/merge`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fileIds, order: [0, 1, 2] }),
  });
  const mergeData = await mergeRes.json();
  const duration = performance.now() - start;

  console.log(`⚡ HTTP Merge API roundtrip: ${duration.toFixed(2)}ms!`);
  console.log('Result:', mergeData);
}

testHttpMergeSpeed();
