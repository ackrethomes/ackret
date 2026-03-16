import fs from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  questionAnswerPdfMap,
  sectionExplanationPdfMap,
} from "./conditionReportPdfMap";
import type {
  ConditionReportAnswer,
  ConditionSectionKey,
  PdfRect,
  QuestionPdfMap,
} from "./conditionReportPdfTypes";

type RenderOptions = {
  answers: ConditionReportAnswer[];
  debug?: boolean;
};

function getSelectedRect(map: QuestionPdfMap, answer: "YES" | "NO" | "NA"): PdfRect {
  if (answer === "YES") return map.yes;
  if (answer === "NO") return map.no;
  return map.na;
}

function drawCenteredX(page: any, rect: PdfRect) {
  const size = 11;

  page.drawText("X", {
    x: rect.x + 2,
    y: rect.y,
    size,
    color: rgb(0, 0, 0),
  });
}

function drawDebugRect(page: any, rect: PdfRect, label: string, color = rgb(1, 0, 0)) {
  page.drawRectangle({
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    borderColor: color,
    borderWidth: 0.8,
  });

  page.drawText(label, {
    x: rect.x,
    y: rect.y + rect.height + 2,
    size: 6,
    color,
  });
}

function wrapLines(text: string, font: any, fontSize: number, maxWidth: number): string[] {
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(test, fontSize);

    if (width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);

  return lines;
}

function drawWrappedParagraph(
  page: any,
  text: string,
  rect: PdfRect,
  font: any,
  fontSize = 9
) {
  const lineHeight = fontSize + 2;
  const maxLines = Math.max(1, Math.floor(rect.height / lineHeight));
  const lines = wrapLines(text, font, fontSize, rect.width).slice(0, maxLines);

  for (let i = 0; i < lines.length; i++) {
    page.drawText(lines[i], {
      x: rect.x,
      y: rect.y + rect.height - fontSize - i * lineHeight,
      size: fontSize,
      font,
      color: rgb(0, 0, 0),
    });
  }
}

function buildSectionExplanationText(
  answers: ConditionReportAnswer[],
  section: ConditionSectionKey
): string {
  const lines = answers
    .filter(
      (item) =>
        item.section === section &&
        item.answer === "YES" &&
        item.explanation &&
        item.explanation.trim().length > 0
    )
    .map((item) => `${item.questionId.toUpperCase()}: ${item.explanation!.trim()}`);

  return lines.join("   ");
}

export async function renderConditionReportPdf({
  answers,
  debug = false,
}: RenderOptions): Promise<Uint8Array> {
  const templatePath = path.join(process.cwd(), "public", "forms", "wi-condition-report.pdf");
  const templateBytes = await fs.readFile(templatePath);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const item of answers) {
    const map = questionAnswerPdfMap[item.questionId];
    if (!map) continue;

    const rect = getSelectedRect(map, item.answer);
    const page = pages[rect.page];
    if (!page) continue;

    drawCenteredX(page, rect);

    if (debug) {
      drawDebugRect(pages[map.yes.page], map.yes, `${item.questionId}.yes`, rgb(1, 0, 0));
      drawDebugRect(pages[map.no.page], map.no, `${item.questionId}.no`, rgb(0, 0, 1));
      drawDebugRect(pages[map.na.page], map.na, `${item.questionId}.na`, rgb(0, 0.6, 0));
    }
  }

  const sections: ConditionSectionKey[] = ["B", "C", "D", "E", "F", "G"];

  for (const section of sections) {
    const rect = sectionExplanationPdfMap[section];
    if (!rect) continue;

    const page = pages[rect.page];
    if (!page) continue;

    const text = buildSectionExplanationText(answers, section);

    if (text) {
      drawWrappedParagraph(page, text, rect, font, 8.5);
    }

    if (debug) {
      drawDebugRect(page, rect, `${section}.explanation`, rgb(0.6, 0, 0.6));
    }
  }

  return await pdfDoc.save();
}