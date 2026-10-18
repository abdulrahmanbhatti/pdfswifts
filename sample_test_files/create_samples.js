import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

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
      color: rgb(0.2, 0.4, 0.8),
    });
    page.drawText(`Sample content for demonstration and testing of PDFSwift operations.`, {
      x: 50,
      y: 740,
      size: 14,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  const pdfBytes = await pdfDoc.save();
  const testDir = path.resolve('./sample_test_files');
  if (!fs.existsSync(testDir)) fs.mkdirSync(testDir, { recursive: true });
  const outPath = path.join(testDir, filename);
  fs.writeFileSync(outPath, pdfBytes);
  console.log(`Created sample PDF: ${outPath} (${pageCount} pages, ${pdfBytes.length} bytes)`);
  return outPath;
}

async function run() {
  await createSamplePdf('doc_a.pdf', 3, 'Document A');
  await createSamplePdf('doc_b.pdf', 2, 'Document B');
  await createSamplePdf('doc_c.pdf', 5, 'Document C (Large)');
}

run();
