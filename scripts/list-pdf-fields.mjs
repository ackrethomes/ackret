import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

async function main() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "templates",
    "wi-condition-report-fillable.pdf"
  );

  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  console.log(`Found ${fields.length} fields:\n`);

  fields.forEach((field, index) => {
    console.log(`${index + 1}. ${field.getName()} (${field.constructor.name})`);
  });
}

main().catch(console.error);