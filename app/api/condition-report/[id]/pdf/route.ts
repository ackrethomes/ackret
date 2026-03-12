import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { conditionReportQuestions } from "@/lib/conditionReportQuestions";
import {
  pdfHeaderTargets,
  pdfQuestionTargets,
  pdfExplanationTargets,
  pdfFooterTargets,
} from "@/lib/conditionReportPdfMap";

type AnswerRecord = Record<
  string,
  {
    answer: "yes" | "no" | "na" | "";
    explanation: string;
  }
>;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const { data, error } = await supabaseAdmin
      .from("condition_report_drafts")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Condition report not found." },
        { status: 404 }
      );
    }

    const form = data.form_data as Record<string, string>;
    const answers = data.answers as AnswerRecord;

    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates",
      "wi-condition-report.pdf"
    );

    const templateBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const pages = pdfDoc.getPages();

    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const black = rgb(0, 0, 0);

    function drawText(
      pageNumber: number,
      text: string,
      x: number,
      y: number,
      maxWidth = 200,
      fontSize = 9,
      useBold = false
    ) {
      const page = pages[pageNumber - 1];
      const font = useBold ? bold : regular;
      const lines = wrapText(text, font, fontSize, maxWidth);

      let currentY = y;
      for (const line of lines) {
        page.drawText(line, {
          x,
          y: currentY,
          size: fontSize,
          font,
          color: black,
        });
        currentY -= fontSize + 2;
      }
    }

    function drawCheck(pageNumber: number, x: number, y: number) {
      const page = pages[pageNumber - 1];

      page.drawLine({
        start: { x: x + 1, y: y + 3 },
        end: { x: x + 4, y: y },
        thickness: 1,
        color: black,
      });

      page.drawLine({
        start: { x: x + 4, y: y },
        end: { x: x + 9, y: y + 8 },
        thickness: 1,
        color: black,
      });
    }

    function fillAnswer(questionId: string, answer?: "yes" | "no" | "na" | "") {
      if (!answer) return;

      const target = pdfQuestionTargets[questionId];
      if (!target) return;

      if (answer === "yes") drawCheck(target.page, target.yes.x, target.yes.y);
      if (answer === "no") drawCheck(target.page, target.no.x, target.no.y);
      if (answer === "na") drawCheck(target.page, target.na.x, target.na.y);
    }

    function fillExplanationBlock(prefix: string) {
      const target = pdfExplanationTargets[prefix];
      if (!target) return;

      const lines = conditionReportQuestions
        .filter((q) => q.id.startsWith(prefix))
        .filter(
          (q) =>
            answers[q.id]?.answer === "yes" &&
            answers[q.id]?.explanation?.trim()
        )
        .map((q) => `${q.id.toUpperCase()}: ${answers[q.id].explanation.trim()}`);

      if (!lines.length) return;

      drawText(
        target.page,
        lines.join("  "),
        target.x,
        target.y,
        target.maxWidth,
        target.fontSize ?? 8
      );
    }

    // Header fields
    drawText(
      pdfHeaderTargets.propertyAddress.page,
      form.propertyAddress || "",
      pdfHeaderTargets.propertyAddress.x,
      pdfHeaderTargets.propertyAddress.y,
      pdfHeaderTargets.propertyAddress.maxWidth,
      pdfHeaderTargets.propertyAddress.fontSize
    );

    drawText(
      pdfHeaderTargets.municipalityName.page,
      form.municipalityName || "",
      pdfHeaderTargets.municipalityName.x,
      pdfHeaderTargets.municipalityName.y,
      pdfHeaderTargets.municipalityName.maxWidth,
      pdfHeaderTargets.municipalityName.fontSize
    );

    drawText(
      pdfHeaderTargets.county.page,
      form.county || "",
      pdfHeaderTargets.county.x,
      pdfHeaderTargets.county.y,
      pdfHeaderTargets.county.maxWidth,
      pdfHeaderTargets.county.fontSize
    );

    drawText(
      pdfHeaderTargets.reportDate.page,
      form.reportDate || "",
      pdfHeaderTargets.reportDate.x,
      pdfHeaderTargets.reportDate.y,
      pdfHeaderTargets.reportDate.maxWidth,
      pdfHeaderTargets.reportDate.fontSize
    );

    drawText(
      pdfHeaderTargets.owner1.page,
      form.owner1 || "",
      pdfHeaderTargets.owner1.x,
      pdfHeaderTargets.owner1.y,
      pdfHeaderTargets.owner1.maxWidth,
      pdfHeaderTargets.owner1.fontSize
    );

    drawText(
      pdfHeaderTargets.owner2.page,
      form.owner2 || "",
      pdfHeaderTargets.owner2.x,
      pdfHeaderTargets.owner2.y,
      pdfHeaderTargets.owner2.maxWidth,
      pdfHeaderTargets.owner2.fontSize
    );

    drawText(
      pdfHeaderTargets.owner3.page,
      form.owner3 || "",
      pdfHeaderTargets.owner3.x,
      pdfHeaderTargets.owner3.y,
      pdfHeaderTargets.owner3.maxWidth,
      pdfHeaderTargets.owner3.fontSize
    );

    // Answers
    for (const [questionId, entry] of Object.entries(answers)) {
      fillAnswer(questionId, entry.answer);
    }

    // Explanation areas
    fillExplanationBlock("b");
    fillExplanationBlock("c");
    fillExplanationBlock("d");
    fillExplanationBlock("e");
    fillExplanationBlock("f");
    fillExplanationBlock("g");

    // Footer / signature-related text
    drawText(
      pdfFooterTargets.yearsOwned.page,
      form.yearsOwned || "",
      pdfFooterTargets.yearsOwned.x,
      pdfFooterTargets.yearsOwned.y,
      pdfFooterTargets.yearsOwned.maxWidth,
      pdfFooterTargets.yearsOwned.fontSize
    );

    drawText(
      pdfFooterTargets.yearsOccupied.page,
      form.yearsOccupied || "",
      pdfFooterTargets.yearsOccupied.x,
      pdfFooterTargets.yearsOccupied.y,
      pdfFooterTargets.yearsOccupied.maxWidth,
      pdfFooterTargets.yearsOccupied.fontSize
    );

    drawText(
      pdfFooterTargets.owner1.page,
      form.owner1 || "",
      pdfFooterTargets.owner1.x,
      pdfFooterTargets.owner1.y,
      pdfFooterTargets.owner1.maxWidth,
      pdfFooterTargets.owner1.fontSize
    );

    drawText(
      pdfFooterTargets.owner2.page,
      form.owner2 || "",
      pdfFooterTargets.owner2.x,
      pdfFooterTargets.owner2.y,
      pdfFooterTargets.owner2.maxWidth,
      pdfFooterTargets.owner2.fontSize
    );

    drawText(
      pdfFooterTargets.owner3.page,
      form.owner3 || "",
      pdfFooterTargets.owner3.x,
      pdfFooterTargets.owner3.y,
      pdfFooterTargets.owner3.maxWidth,
      pdfFooterTargets.owner3.fontSize
    );

    const today = new Date().toLocaleDateString("en-US");
    drawText(
      pdfFooterTargets.owner1Date.page,
      today,
      pdfFooterTargets.owner1Date.x,
      pdfFooterTargets.owner1Date.y,
      pdfFooterTargets.owner1Date.maxWidth,
      pdfFooterTargets.owner1Date.fontSize
    );
    drawText(
      pdfFooterTargets.owner2Date.page,
      today,
      pdfFooterTargets.owner2Date.x,
      pdfFooterTargets.owner2Date.y,
      pdfFooterTargets.owner2Date.maxWidth,
      pdfFooterTargets.owner2Date.fontSize
    );
    drawText(
      pdfFooterTargets.owner3Date.page,
      today,
      pdfFooterTargets.owner3Date.x,
      pdfFooterTargets.owner3Date.y,
      pdfFooterTargets.owner3Date.maxWidth,
      pdfFooterTargets.owner3Date.fontSize
    );

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="wisconsin-condition-report-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Generate PDF error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF." },
      { status: 500 }
    );
  }
}

function wrapText(
  text: string,
  font: any,
  size: number,
  maxWidth: number
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const width = font.widthOfTextAtSize(test, size);

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