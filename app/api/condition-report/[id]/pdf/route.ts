import { NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import fs from "fs";
import path from "path";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
  conditionQuestionFieldMap,
  explanationFieldMap,
  textFieldMap,
} from "@/lib/conditionReportFieldMap";

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

    const formData = data.form_data as Record<string, string>;
    const answers = data.answers as AnswerRecord;

    const templatePath = path.join(
      process.cwd(),
      "public",
      "templates",
      "wi-condition-report-fillable.pdf"
    );

    const templateBytes = fs.readFileSync(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const pdfForm = pdfDoc.getForm();

    function setText(fieldName: string | undefined, value: string | undefined) {
      if (!fieldName || !value) return;
      try {
        pdfForm.getTextField(fieldName).setText(value);
      } catch (error) {
        console.error(`Unable to set text field ${fieldName}`, error);
      }
    }

    function setCheckboxGroup(
      mapping:
        | {
            yes: string;
            no: string;
            na: string;
          }
        | undefined,
      value: "yes" | "no" | "na" | ""
    ) {
      if (!mapping || !value) return;

      try {
        const yesField = pdfForm.getCheckBox(mapping.yes);
        const noField = pdfForm.getCheckBox(mapping.no);
        const naField = pdfForm.getCheckBox(mapping.na);

        yesField.uncheck();
        noField.uncheck();
        naField.uncheck();

        if (value === "yes") yesField.check();
        if (value === "no") noField.check();
        if (value === "na") naField.check();
      } catch (error) {
        console.error(`Unable to set checkbox group`, mapping, error);
      }
    }

    // Fill question answers
    Object.entries(conditionQuestionFieldMap).forEach(([questionId, mapping]) => {
      const answer = answers[questionId]?.answer ?? "";
      setCheckboxGroup(mapping, answer);
    });

    // Fill explanation sections
    const sectionPrefixes = ["b", "c", "d", "e", "f", "g"] as const;

    sectionPrefixes.forEach((prefix) => {
      const explanationText = Object.entries(answers)
        .filter(([key, value]) => key.startsWith(prefix) && value.answer === "yes")
        .map(([key, value]) =>
          value.explanation?.trim()
            ? `${key.toUpperCase()}: ${value.explanation.trim()}`
            : ""
        )
        .filter(Boolean)
        .join("\n");

      setText(explanationFieldMap[prefix], explanationText);
    });

    // Fill years / owner block
    setText(textFieldMap.yearsOwned, formData.yearsOwned);
    setText(textFieldMap.yearsOccupied, formData.yearsOccupied);

    setText(textFieldMap.owner1, formData.owner1);
    setText(textFieldMap.owner2, formData.owner2);
    setText(textFieldMap.owner3, formData.owner3);

    const today = new Date().toLocaleDateString("en-US");
    setText(textFieldMap.owner1Date, today);
    setText(textFieldMap.owner2Date, today);
    setText(textFieldMap.owner3Date, today);

    // Optional supplier fields left blank for now
    setText(textFieldMap.supplier1Name, "");
    setText(textFieldMap.supplier1Items, "");
    setText(textFieldMap.supplier1Date, "");
    setText(textFieldMap.supplier2Name, "");
    setText(textFieldMap.supplier2Items, "");
    setText(textFieldMap.supplier2Date, "");
    setText(textFieldMap.supplier3Name, "");
    setText(textFieldMap.supplier3Items, "");
    setText(textFieldMap.supplier3Date, "");

    // Buyer acknowledgement left blank for later signing
    setText(textFieldMap.buyer1Name, "");
    setText(textFieldMap.buyer1Date, "");
    setText(textFieldMap.buyer2Name, "");

    pdfForm.flatten();

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