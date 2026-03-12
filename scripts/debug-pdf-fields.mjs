import fs from "fs";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

async function main() {
  const inputPath = path.join(
    process.cwd(),
    "public",
    "templates",
    "wi-condition-report-fillable.pdf"
  );

  const outputPath = path.join(
    process.cwd(),
    "public",
    "templates",
    "wi-condition-report-debug.pdf"
  );

  const pdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();
  const pages = pdfDoc.getPages();

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  console.log(`Found ${fields.length} fields`);

  fields.forEach((field, index) => {
    const widgets = field.acroField.getWidgets();

    widgets.forEach((widget) => {
      const rect = widget.getRectangle();
      const pageRef = widget.P();

      let pageIndex = -1;

      for (let i = 0; i < pages.length; i++) {
        if (pages[i].ref === pageRef) {
          pageIndex = i;
          break;
        }
      }

      if (pageIndex === -1) return;

      const page = pages[pageIndex];

      const label = `${index + 1}`;

      page.drawRectangle({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        borderColor: rgb(1, 0, 0),
        borderWidth: 1.5,
      });

      page.drawText(label, {
        x: rect.x + rect.width + 5,
        y: rect.y + rect.height / 2,
        size: 14,
        font,
        color: rgb(0, 0, 1),
      });

      console.log(
        `${index + 1}. ${field.getName()} | page ${pageIndex + 1} | x=${rect.x} y=${rect.y}`
      );
    });
  });

  const out = await pdfDoc.save();
  fs.writeFileSync(outputPath, out);

  console.log(`Saved debug PDF to ${outputPath}`);
}

main();