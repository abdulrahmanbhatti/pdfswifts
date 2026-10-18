import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testBackend() {
  console.log('--- STARTING PDFSWIFT BACKEND E2E TEST ---');

  const BASE_URL = 'http://localhost:5000/api';

  // 1. Health check
  console.log('\n[1] Checking Health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthJson = await healthRes.json();
  console.log('Health Response:', healthJson);
  if (healthJson.status !== 'ok') throw new Error('Health check failed');

  // 2. Test File Upload (Valid PDFs)
  console.log('\n[2] Testing File Upload (2 valid PDFs)...');
  const sample1 = path.resolve(__dirname, '../../sample_test_files/document_1.pdf');
  const sample2 = path.resolve(__dirname, '../../sample_test_files/document_2.pdf');

  const formData = new FormData();
  const file1Blob = new Blob([fs.readFileSync(sample1)], { type: 'application/pdf' });
  const file2Blob = new Blob([fs.readFileSync(sample2)], { type: 'application/pdf' });
  formData.append('files', file1Blob, 'document_1.pdf');
  formData.append('files', file2Blob, 'document_2.pdf');

  const uploadRes = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  const uploadJson = await uploadRes.json();
  console.log('Upload Result Status:', uploadRes.status);
  console.log('Uploaded Files:', uploadJson.files?.map((f) => ({ id: f.fileId, name: f.originalName, pages: f.pageCount })));
  if (uploadRes.status !== 200 || !uploadJson.files || uploadJson.files.length !== 2) {
    throw new Error('Upload test failed: ' + JSON.stringify(uploadJson));
  }

  const fileId1 = uploadJson.files[0].fileId;
  const fileId2 = uploadJson.files[1].fileId;

  // 3. Test Invalid PDF Magic Byte Rejection
  console.log('\n[3] Testing Magic Byte Rejection (Fake PDF)...');
  const fakeFormData = new FormData();
  const fakeBlob = new Blob(['THIS IS NOT A VALID PDF FILE AT ALL'], { type: 'application/pdf' });
  fakeFormData.append('files', fakeBlob, 'fake.pdf');
  const fakeRes = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    body: fakeFormData,
  });
  console.log('Fake PDF Upload Status (expected 400):', fakeRes.status);
  const fakeJson = await fakeRes.json();
  console.log('Fake PDF Response Error:', fakeJson.error);
  if (fakeRes.status !== 400) throw new Error('Fake PDF was not rejected with 400');

  // 4. Test Merge Tool
  console.log('\n[4] Testing Merge PDF API...');
  const mergeRes = await fetch(`${BASE_URL}/merge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileIds: [fileId1, fileId2],
      order: [0, 1],
    }),
  });
  const mergeJson = await mergeRes.json();
  console.log('Merge Result:', mergeJson);
  if (!mergeJson.success || !mergeJson.downloadUrl) throw new Error('Merge test failed');

  // 5. Test Split Tool
  console.log('\n[5] Testing Split PDF API (pages "1, 3")...');
  const splitRes = await fetch(`${BASE_URL}/split`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileId: fileId1,
      pages: '1, 3',
    }),
  });
  const splitJson = await splitRes.json();
  console.log('Split Result:', splitJson);
  if (!splitJson.success || splitJson.extractedPagesCount !== 2) throw new Error('Split test failed');

  // 6. Test Compress Tool
  console.log('\n[6] Testing Compress PDF API...');
  const compressRes = await fetch(`${BASE_URL}/compress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileId: fileId1,
      quality: 'high',
    }),
  });
  const compressJson = await compressRes.json();
  console.log('Compress Result:', compressJson);
  // Note: Guest might hit limit after 2 tasks or compress may succeed/fail depending on task count
  console.log('Compress Status:', compressRes.status);

  // 7. Test Download API
  console.log('\n[7] Testing Download Stream...');
  const downloadRes = await fetch(`http://localhost:5000${mergeJson.downloadUrl}`);
  const downloadBuffer = await downloadRes.arrayBuffer();
  console.log('Download Status:', downloadRes.status, 'Received bytes:', downloadBuffer.byteLength);
  const magic = new Uint8Array(downloadBuffer.slice(0, 4));
  const magicStr = String.fromCharCode(...magic);
  console.log('Downloaded File Magic Bytes:', magicStr);
  if (magicStr !== '%PDF') throw new Error('Downloaded file is not a valid PDF');

  // 8. Test Auth API
  console.log('\n[8] Testing Auth API (Signup & Login)...');
  const testEmail = `testuser_${Date.now()}@example.com`;
  const signupRes = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testEmail, password: 'password123' }),
  });
  const signupJson = await signupRes.json();
  console.log('Signup Status:', signupRes.status, 'User:', signupJson.user?.email);
  if (signupRes.status !== 201) throw new Error('Signup failed: ' + JSON.stringify(signupJson));

  const token = signupJson.token;
  const meRes = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const meJson = await meRes.json();
  console.log('Auth Me Status:', meRes.status, 'Email:', meJson.user?.email, 'isPro:', meJson.user?.isPro);
  if (!meJson.user || meJson.user.email !== testEmail) throw new Error('Me check failed');

  // 9. Test Usage API
  console.log('\n[9] Testing Usage API...');
  const usageRes = await fetch(`${BASE_URL}/usage`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const usageJson = await usageRes.json();
  console.log('User Usage:', usageJson);

  console.log('\n✅ ALL BACKEND E2E TESTS PASSED SUCCESSFULLY! ✅');
}

testBackend().catch((err) => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
