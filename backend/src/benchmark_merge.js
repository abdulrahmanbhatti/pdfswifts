import { mergePDFs } from './services/pdfService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function benchmark() {
  const f1 = path.resolve(__dirname, '../../sample_test_files/document_1.pdf');
  const f2 = path.resolve(__dirname, '../../sample_test_files/document_2.pdf');
  const f3 = path.resolve(__dirname, '../../sample_test_files/document_3.pdf');

  console.log('Testing merge speed for 3 PDFs...');
  const start = performance.now();
  const res = await mergePDFs([f1, f2, f3]);
  const duration = performance.now() - start;

  console.log(`⚡ Merge took ${duration.toFixed(2)}ms! Output: ${res.filename} (${res.fileSize} bytes)`);
}

benchmark();
