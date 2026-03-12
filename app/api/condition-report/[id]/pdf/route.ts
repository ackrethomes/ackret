import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { conditionReportQuestions } from "@/lib/conditionReportQuestions";

type AnswerRecord = Record<
  string,
  {
    answer: "yes" | "no" | "na" | "";
    explanation: string;
  }
>;

type SectionGroup = {
  section: string;
  questions: typeof conditionReportQuestions;
};

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

    const pdfDoc = await PDFDocument.create();
    const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageWidth = 612;
    const pageHeight = 792;
    const marginX = 42;
    const topY = 760;
    const bottomY = 48;

    let page = pdfDoc.addPage([pageWidth, pageHeight]);
    let y = topY;

    const black = rgb(0.12, 0.12, 0.12);
    const gray = rgb(0.38, 0.38, 0.38);

    const labelX = marginX;
    const questionX = 88;
    const yesX = 505;
    const noX = 540;
    const naX = 575;
    const questionWidth = 395;

    function newPage() {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      y = topY;
    }

    function ensureSpace(required = 30) {
      if (y - required < bottomY) {
        newPage();
      }
    }

    function drawTextBlock(
      text: string,
      x: number,
      width: number,
      size = 10,
      useBold = false,
      color = black,
      lineGap = 3
    ) {
      const font = useBold ? bold : regular;
      const lines = wrapText(text, font, size, width);

      for (const line of lines) {
        ensureSpace(size + lineGap + 2);
        page.drawText(line, {
          x,
          y,
          size,
          font,
          color,
        });
        y -= size + lineGap;
      }
    }

    function drawInlineText(
      text: string,
      x: number,
      size = 10,
      useBold = false,
      color = black
    ) {
      page.drawText(text, {
        x,
        y,
        size,
        font: useBold ? bold : regular,
        color,
      });
    }

    function drawHeader() {
      drawInlineText("REAL ESTATE CONDITION REPORT", marginX, 16, true);
      y -= 24;

      const municipality = [
        form.municipalityType ? `(${form.municipalityType})` : "",
        form.municipalityName || "",
      ]
        .filter(Boolean)
        .join(" ");

      drawTextBlock(
        `THIS CONDITION REPORT CONCERNS THE REAL PROPERTY LOCATED AT ${form.propertyAddress || "________________"} IN THE ${municipality || "________________"}, COUNTY OF ${form.county || "________________"}, STATE OF WISCONSIN. THIS REPORT IS A DISCLOSURE OF THE CONDITION OF THAT PROPERTY IN COMPLIANCE WITH SECTION 709.02 OF THE WISCONSIN STATUTES AS OF ${form.reportDate || "________________"}.`,
        marginX,
        528,
        9,
        true
      );

      y -= 8;

      drawTextBlock(
        "IT IS NOT A WARRANTY OF ANY KIND BY THE OWNER OR ANY AGENTS REPRESENTING ANY PARTY IN THIS TRANSACTION AND IS NOT A SUBSTITUTE FOR ANY INSPECTIONS OR WARRANTIES THAT THE PARTIES MAY WISH TO OBTAIN.",
        marginX,
        528,
        9,
        false
      );

      y -= 8;

      drawTextBlock(
        "A4. The owner represents that to the best of the owner’s knowledge, the responses to the following questions have been accurately checked as yes, no, or not applicable (N/A). If the owner responds to any question with yes, the owner shall provide an explanation.",
        marginX,
        528,
        8,
        false,
        gray
      );

      y -= 12;
    }

    function drawSectionTitle(title: string) {
      ensureSpace(40);
      page.drawLine({
        start: { x: marginX, y: y + 4 },
        end: { x: pageWidth - marginX, y: y + 4 },
        thickness: 0.8,
        color: gray,
      });

      y -= 10;
      drawInlineText(title.toUpperCase(), marginX, 12, true);
      drawInlineText("YES", yesX, 9, true);
      drawInlineText("NO", noX, 9, true);
      drawInlineText("N/A", naX, 9, true);
      y -= 18;
    }

    function drawQuestionRow(
      questionId: string,
      label: string,
      helpText?: string,
      answer?: "yes" | "no" | "na" | ""
    ) {
      const startY = y;
      const labelFontSize = 9;

      page.drawText(`${questionId.toUpperCase()}.`, {
        x: labelX,
        y,
        size: labelFontSize,
        font: regular,
        color: black,
      });

      const lines = wrapText(label, regular, labelFontSize, questionWidth);
      let localY = y;

      for (const line of lines) {
        page.drawText(line, {
          x: questionX,
          y: localY,
          size: labelFontSize,
          font: regular,
          color: black,
        });
        localY -= labelFontSize + 2;
      }

      if (helpText) {
        const helpLines = wrapText(helpText, regular, 8, questionWidth);
        for (const line of helpLines) {
          page.drawText(line, {
            x: questionX,
            y: localY,
            size: 8,
            font: regular,
            color: gray,
          });
          localY -= 10;
        }
      }

      const rowBottomY = localY;
      const boxY = startY - 1;

      drawCheck(answer === "yes", yesX, boxY);
      drawCheck(answer === "no", noX, boxY);
      drawCheck(answer === "na", naX, boxY);

      y = rowBottomY - 8;
    }

    function drawCheck(checked: boolean, x: number, yPos: number) {
      page.drawRectangle({
        x,
        y: yPos - 2,
        width: 10,
        height: 10,
        borderWidth: 0.8,
        borderColor: black,
      });

      if (checked) {
        page.drawLine({
          start: { x: x + 2, y: yPos + 2 },
          end: { x: x + 5, y: yPos - 1 },
          thickness: 1,
          color: black,
        });
        page.drawLine({
          start: { x: x + 5, y: yPos - 1 },
          end: { x: x + 9, y: yPos + 6 },
          thickness: 1,
          color: black,
        });
      }
    }

    function drawExplanationBlock(sectionTitle: string, sectionQuestions: typeof conditionReportQuestions) {
      const yesExplanations = sectionQuestions
        .filter((q) => answers[q.id]?.answer === "yes" && answers[q.id]?.explanation?.trim())
        .map((q) => `${q.id.toUpperCase()}: ${answers[q.id].explanation.trim()}`);

      ensureSpace(40);

      drawTextBlock(`Explanation of "yes" responses for ${sectionTitle}:`, marginX, 528, 9, true);

      if (yesExplanations.length === 0) {
        drawTextBlock("None provided.", marginX, 528, 9, false, gray);
        y -= 6;
        return;
      }

      for (const item of yesExplanations) {
        drawTextBlock(item, marginX + 10, 518, 9);
        y -= 4;
      }
    }

    function drawCertificationBlock() {
      ensureSpace(180);

      drawTextBlock("OWNER’S CERTIFICATION", marginX, 528, 11, true);
      drawTextBlock(
        "The owner certifies that the information in this report is true and correct to the best of the owner’s knowledge as of the date on which the owner signs this report.",
        marginX,
        528,
        9
      );

      y -= 10;
      drawSignatureLine("Owner 1", form.owner1);
      drawSignatureLine("Owner 2", form.owner2);
      drawSignatureLine("Owner 3", form.owner3);

      y -= 16;

      drawTextBlock("BUYER’S ACKNOWLEDGEMENT", marginX, 528, 11, true);
      drawTextBlock(
        "The prospective buyer acknowledges that technical knowledge such as that acquired by professional inspectors may be required to detect certain defects.",
        marginX,
        528,
        9
      );

      y -= 10;
      drawBlankSignatureLine("Prospective buyer");
      drawBlankSignatureLine("Prospective buyer");
      drawBlankSignatureLine("Prospective buyer");
    }

    function drawSignatureLine(label: string, value?: string) {
      ensureSpace(24);
      const left = `${label}: ${value || "____________________________"}`;
      page.drawText(left, {
        x: marginX,
        y,
        size: 9,
        font: regular,
        color: black,
      });
      page.drawText("Date: ____________________", {
        x: 380,
        y,
        size: 9,
        font: regular,
        color: black,
      });
      y -= 18;
    }

    function drawBlankSignatureLine(label: string) {
      ensureSpace(24);
      page.drawText(`${label}: ____________________________`, {
        x: marginX,
        y,
        size: 9,
        font: regular,
        color: black,
      });
      page.drawText("Date: ____________________", {
        x: 380,
        y,
        size: 9,
        font: regular,
        color: black,
      });
      y -= 18;
    }

    drawHeader();

    const sections = groupQuestionsBySection();

    for (const { section, questions } of sections) {
      drawSectionTitle(section);

      for (const question of questions) {
        ensureSpace(40);
        drawQuestionRow(
          question.id,
          question.label,
          question.helpText,
          answers[question.id]?.answer
        );
      }

      drawExplanationBlock(section, questions);
      y -= 6;
    }

    ensureSpace(80);
    drawTextBlock(
      `G6. The owner has owned the property for ${form.yearsOwned || "____"} years.`,
      marginX,
      528,
      9
    );
    drawTextBlock(
      `G7. The owner has lived in the property for ${form.yearsOccupied || "____"} years.`,
      marginX,
      528,
      9
    );

    if (form.notes?.trim()) {
      y -= 8;
      drawTextBlock("Additional notes:", marginX, 528, 9, true);
      drawTextBlock(form.notes.trim(), marginX, 528, 9);
    }

    y -= 12;
    drawCertificationBlock();

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

function groupQuestionsBySection() {
  const map = new Map<string, typeof conditionReportQuestions>();

  for (const question of conditionReportQuestions) {
    if (!map.has(question.section)) {
      map.set(question.section, []);
    }
    map.get(question.section)!.push(question);
  }

  return Array.from(map.entries()).map(([section, questions]) => ({
    section,
    questions,
  }));
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