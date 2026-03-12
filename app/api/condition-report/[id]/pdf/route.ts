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
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    let page = pdfDoc.addPage([612, 792]);
    let y = 740;

    const navy = rgb(0.09, 0.23, 0.44);
    const gold = rgb(0.72, 0.56, 0.23);
    const text = rgb(0.15, 0.18, 0.23);

    function newPage() {
      page = pdfDoc.addPage([612, 792]);
      y = 740;
    }

    function drawLine(
      content: string,
      opts?: { size?: number; bold?: boolean; color?: ReturnType<typeof rgb> }
    ) {
      const size = opts?.size ?? 11;
      const activeFont = opts?.bold ? bold : font;
      const color = opts?.color ?? text;

      const wrapped = wrapText(content, activeFont, size, 500);

      for (const line of wrapped) {
        if (y < 60) newPage();

        page.drawText(line, {
          x: 56,
          y,
          size,
          font: activeFont,
          color,
        });

        y -= size + 6;
      }
    }

    page.drawText("Ackret DSS", {
      x: 56,
      y,
      size: 12,
      font: bold,
      color: gold,
    });
    y -= 26;

    page.drawText("Real Estate Condition Report", {
      x: 56,
      y,
      size: 24,
      font: bold,
      color: navy,
    });
    y -= 28;

    drawLine("Generated from the online Ackret condition report form.", {
      size: 12,
      color: text,
    });
    y -= 10;

    drawLine(`Property Address: ${form.propertyAddress || "-"}`, {
      bold: true,
    });
    drawLine(
      `Municipality: ${[
        form.municipalityType,
        form.municipalityName,
        form.county ? `County of ${form.county}` : "",
      ]
        .filter(Boolean)
        .join(", ") || "-"}`
    );
    drawLine(`Report Date: ${form.reportDate || "-"}`);
    drawLine(
      `Owners: ${[form.owner1, form.owner2, form.owner3]
        .filter(Boolean)
        .join(", ") || "-"}`
    );
    drawLine(`Years Owned: ${form.yearsOwned || "-"}`);
    drawLine(`Years Occupied: ${form.yearsOccupied || "-"}`);
    drawLine(`Occupancy: ${form.occupantType || "-"}`);
    drawLine(`Built Before 1978: ${form.builtBefore1978 || "-"}`);

    y -= 18;

    const grouped = groupQuestionsBySection();

    for (const [sectionName, questions] of grouped) {
      if (y < 120) newPage();

      drawLine(sectionName, {
        size: 16,
        bold: true,
        color: navy,
      });
      y -= 2;

      for (const question of questions) {
        const entry = answers[question.id] ?? { answer: "", explanation: "" };
        const answerLabel =
          entry.answer === "yes"
            ? "Yes"
            : entry.answer === "no"
            ? "No"
            : entry.answer === "na"
            ? "N/A"
            : "Not answered";

        drawLine(`${question.label}`, { bold: true });
        drawLine(`Answer: ${answerLabel}`);

        if (entry.answer === "yes" && entry.explanation?.trim()) {
          drawLine(`Explanation: ${entry.explanation.trim()}`);
        }

        y -= 8;
      }

      y -= 10;
    }

    if (form.notes?.trim()) {
      if (y < 140) newPage();

      drawLine("Additional Notes", {
        size: 16,
        bold: true,
        color: navy,
      });
      drawLine(form.notes.trim());
    }

    const pdfBytes = await pdfDoc.save();

    const fileName = `condition-report-${id}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
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

  return Array.from(map.entries());
}

function wrapText(
  text: string,
  font: StandardFonts extends never ? never : any,
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