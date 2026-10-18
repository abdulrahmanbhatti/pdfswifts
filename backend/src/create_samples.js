import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createSamplePdf(filename, pageCount, title) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 1; i <= pageCount; i++) {
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    page.drawText(`${title} - Page ${i} of ${pageCount}`, {
      x: 50,
      y: 780,
      size: 24,
      font,
      color: rgb(0.31, 0.27, 0.9), // Indigo
    });
    page.drawText(`This is a test page generated for testing PDFSwift merge, split, and compression operations.`, {
      x: 50,
      y: 740,
      size: 13,
      color: rgb(0.2, 0.2, 0.2),
    });
    page.drawRectangle({
      x: 50,
      y: 300,
      width: 495,
      height: 400,
      borderColor: rgb(0.31, 0.27, 0.9),
      borderWidth: 2,
    });
    page.drawText(`PDFSwift High Quality Processing Engine`, {
      x: 80,
      y: 500,
      size: 18,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const testDir = path.resolve(__dirname, '../../sample_test_files');
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
  const outPath = path.join(testDir, filename);
  fs.writeFileSync(outPath, pdfBytes);
  console.log(`Created sample PDF: ${outPath} (${pageCount} pages, ${pdfBytes.length} bytes)`);
  return outPath;
}

async function run() {
  await createSamplePdf('document_1.pdf', 3, 'Document One');
  await createSamplePdf('document_2.pdf', 2, 'Document Two');
  await createSamplePdf('document_3.pdf', 5, 'Document Three');
}

run();
