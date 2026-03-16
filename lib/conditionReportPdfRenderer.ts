import fs from "fs/promises";
import path from "path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import {
  disclaimerPdfMap,
  municipalityTypeCircleMap,
  questionAnswerPdfMap,
  sectionExplanationPdfMap,
} from "./conditionReportPdfMap";
import type {
  ConditionReportAnswer,
  ConditionReportPdfFormData,
  ConditionSectionKey,
  PdfRect,
  QuestionPdfMap,
} from "./conditionReportPdfTypes";

type RenderOptions = {
  form?: ConditionReportPdfFormData;
  answers: ConditionReportAnswer[];
  debug?: boolean;
};

function getSelectedRect(
  map: QuestionPdfMap,
  answer: "YES" | "NO" | "NA"
): PdfRect {
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

function drawDebugRect(
  page: any,
  rect: PdfRect,
  label: string,
  color = rgb(1, 0, 0)
) {
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

function fitSingleLineText(
  text: string,
  font: any,
  fontSize: number,
  maxWidth: number
): string {
  const trimmed = text.trim();
  if (!trimmed) return "";

  if (font.widthOfTextAtSize(trimmed, fontSize) <= maxWidth) {
    return trimmed;
  }

  const shortened = trimmed
    .replace(/\bStreet\b/gi, "St")
    .replace(/\bAvenue\b/gi, "Ave")
    .replace(/\bRoad\b/gi, "Rd")
    .replace(/\bDrive\b/gi, "Dr")
    .replace(/\bLane\b/gi, "Ln")
    .replace(/\bCourt\b/gi, "Ct")
    .replace(/\bBoulevard\b/gi, "Blvd")
    .replace(/\bApartment\b/gi, "Apt")
    .replace(/\bSuite\b/gi, "Ste");

  if (font.widthOfTextAtSize(shortened, fontSize) <= maxWidth) {
    return shortened;
  }

  let result = shortened;
  while (
    result.length > 0 &&
    font.widthOfTextAtSize(`${result}...`, fontSize) > maxWidth
  ) {
    result = result.slice(0, -1);
  }

  return result ? `${result}...` : "";
}

function drawSingleLineText(
  page: any,
  text: string,
  rect: PdfRect,
  font: any,
  fontSize = 8.5
) {
  if (!text.trim()) return;

  const fitted = fitSingleLineText(text, font, fontSize, rect.width);
  if (!fitted) return;

  page.drawText(fitted, {
    x: rect.x,
    y: rect.y - 2,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });
}

function drawOval(
  page: any,
  oval: { x: number; y: number; width: number; height: number }
) {
  page.drawEllipse({
    x: oval.x + oval.width / 2,
    y: oval.y + oval.height / 2,
    xScale: oval.width / 2,
    yScale: oval.height / 2,
    borderColor: rgb(0, 0, 0),
    borderWidth: 1.2,
  });
}

function formatDateParts(reportDate?: string): {
  month: string;
  day: string;
  year: string;
} {
  if (!reportDate) {
    return { month: "", day: "", year: "" };
  }

  const date = new Date(`${reportDate}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return { month: "", day: "", year: "" };
  }

  const month = date.toLocaleString("en-US", { month: "long" });
  const day = String(date.getDate());
  const year = String(date.getFullYear());

  return { month, day, year };
}

function wrapLines(
  text: string,
  font: any,
  fontSize: number,
  maxWidth: number
): string[] {
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
  fontSize = 8.5
) {
  const lineHeight = fontSize + 2;
  const maxLines = Math.max(1, Math.floor(rect.height / lineHeight));

  const paragraphs = text.split("\n");
  const finalLines: string[] = [];

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    const wrapped = wrapLines(trimmed, font, fontSize, rect.width);
    for (const line of wrapped) {
      finalLines.push(line);
    }
  }

  const visibleLines = finalLines.slice(0, maxLines);

  for (let i = 0; i < visibleLines.length; i++) {
    page.drawText(visibleLines[i], {
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
    .map(
      (item) => `${item.questionId.toUpperCase()}: ${item.explanation!.trim()}`
    );

  return lines.join("\n");
}

function drawDisclaimerFields(
  pages: any[],
  form: ConditionReportPdfFormData | undefined,
  font: any,
  debug: boolean
) {
  if (!form) return;

  const {
    propertyAddress = "",
    municipalityType = "",
    municipalityName = "",
    county = "",
    reportDate = "",
  } = form;

  const { month, day, year } = formatDateParts(reportDate);

  const fieldValues = [
    { key: "propertyAddress", value: propertyAddress },
    { key: "municipalityName", value: municipalityName },
    { key: "county", value: county },
    { key: "reportMonth", value: month },
    { key: "reportDay", value: day },
    { key: "reportYear", value: year },
  ] as const;

  for (const field of fieldValues) {
    const rect = disclaimerPdfMap[field.key];
    const page = pages[rect.page];
    if (!page) continue;

    drawSingleLineText(page, field.value, rect, font, 8.5);

    if (debug) {
      drawDebugRect(page, rect, `disclaimer.${field.key}`, rgb(0.8, 0.2, 0.8));
    }
  }

    if (debug) {
    const municipalityOptions: Array<"City" | "Village" | "Town"> = [
      "City",
      "Village",
      "Town",
    ];

    for (const option of municipalityOptions) {
      const oval = municipalityTypeCircleMap[option];
      const page = pages[oval.page];
      if (!page) continue;

      drawDebugRect(
        page,
        {
          page: oval.page,
          x: oval.x,
          y: oval.y,
          width: oval.width,
          height: oval.height,
        },
        `municipalityType.${option}`,
        rgb(0.1, 0.5, 0.8)
      );
    }
  }

  const normalizedMunicipalityType =
    municipalityType === "City" ||
    municipalityType === "Village" ||
    municipalityType === "Town"
      ? municipalityType
      : null;

  if (normalizedMunicipalityType) {
    const oval = municipalityTypeCircleMap[normalizedMunicipalityType];
    const page = pages[oval.page];

    if (page) {
      drawOval(page, oval);
    }
  }
}

export async function renderConditionReportPdf({
  form,
  answers,
  debug = false,
}: RenderOptions): Promise<Uint8Array> {
  const templatePath = path.join(
    process.cwd(),
    "public",
    "forms",
    "wi-condition-report.pdf"
  );
  const templateBytes = await fs.readFile(templatePath);

  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  drawDisclaimerFields(pages, form, font, debug);

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