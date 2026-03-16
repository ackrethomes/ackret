import { NextRequest, NextResponse } from "next/server";
import { renderConditionReportPdf } from "@/lib/conditionReportPdfRenderer";
import { normalizeConditionReportPayload } from "@/lib/normalizeConditionReportPayload";
import { conditionReportQuestions } from "@/lib/conditionReportQuestions";

export const runtime = "nodejs";

type RawAnswerValue = "yes" | "no" | "na" | "";

type RequestBody = {
  form?: {
    propertyAddress?: string;
    municipalityType?: string;
    municipalityName?: string;
    county?: string;
    reportDate?: string;
    owner1?: string;
    owner2?: string;
    owner3?: string;
    yearsOwned?: string;
    yearsOccupied?: string;
    occupantType?: string;
    builtBefore1978?: string;
    notes?: string;
  };
  answers: Record<
    string,
    {
      answer: RawAnswerValue;
      explanation: string;
    }
  >;
  debug?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as RequestBody;

    if (!body.answers || typeof body.answers !== "object") {
      return NextResponse.json(
        { error: "Invalid request. 'answers' is required." },
        { status: 400 }
      );
    }

    const normalizedAnswers = normalizeConditionReportPayload(
      body.answers,
      conditionReportQuestions
    );

    const pdfBytes = await renderConditionReportPdf({
      answers: normalizedAnswers,
      debug: Boolean(body.debug),
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="condition-report.pdf"',
      },
    });
  } catch (error) {
    console.error("Condition report PDF generation failed:", error);

    return NextResponse.json(
      { error: "Failed to generate condition report PDF." },
      { status: 500 }
    );
  }
}