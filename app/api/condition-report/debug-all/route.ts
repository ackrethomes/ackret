import { NextResponse } from "next/server";
import { renderConditionReportPdf } from "@/lib/conditionReportPdfRenderer";

export const runtime = "nodejs";

export async function GET() {
  const answers = [
    // SECTION B
    { questionId: "b1", section: "B", answer: "YES", explanation: "B1 test" },
    { questionId: "b2", section: "B", answer: "NO" },
    { questionId: "b3", section: "B", answer: "NA" },
    { questionId: "b4", section: "B", answer: "YES", explanation: "B4 test" },
    { questionId: "b5", section: "B", answer: "NO" },
    { questionId: "b6", section: "B", answer: "NA" },
    { questionId: "b7", section: "B", answer: "YES", explanation: "B7 test" },
    { questionId: "b8", section: "B", answer: "NO" },
    { questionId: "b9", section: "B", answer: "NA" },
    { questionId: "b10", section: "B", answer: "YES", explanation: "B10 test" },
    { questionId: "b11", section: "B", answer: "NO" },
    { questionId: "b12", section: "B", answer: "NA" },
    { questionId: "b13", section: "B", answer: "YES", explanation: "B13 test" },
    { questionId: "b14", section: "B", answer: "NO" },
    { questionId: "b15", section: "B", answer: "NA" },
    { questionId: "b16", section: "B", answer: "YES", explanation: "B16 test" },

    // SECTION C
    { questionId: "c1", section: "C", answer: "YES", explanation: "C1 test" },
    { questionId: "c2", section: "C", answer: "NO" },
    { questionId: "c3", section: "C", answer: "NA" },
    { questionId: "c4", section: "C", answer: "YES", explanation: "C4 test" },
    { questionId: "c5", section: "C", answer: "NO" },
    { questionId: "c6", section: "C", answer: "NA" },
    { questionId: "c7", section: "C", answer: "YES", explanation: "C7 test" },

    // SECTION D
    { questionId: "d1", section: "D", answer: "YES", explanation: "D1 test" },
    { questionId: "d2", section: "D", answer: "NO" },
    { questionId: "d3", section: "D", answer: "NA" },
    { questionId: "d4", section: "D", answer: "YES", explanation: "D4 test" },
    { questionId: "d5", section: "D", answer: "NO" },
    { questionId: "d6", section: "D", answer: "NA" },
    { questionId: "d7", section: "D", answer: "YES", explanation: "D7 test" },
    { questionId: "d8", section: "D", answer: "NO" },
    { questionId: "d9", section: "D", answer: "NA" },
    { questionId: "d10", section: "D", answer: "YES", explanation: "D10 test" },

    // SECTION E
    { questionId: "e1", section: "E", answer: "YES", explanation: "E1 test" },
    { questionId: "e2", section: "E", answer: "NO" },
    { questionId: "e3", section: "E", answer: "NA" },
    { questionId: "e4", section: "E", answer: "YES", explanation: "E4 test" },
    { questionId: "e5", section: "E", answer: "NO" },
    { questionId: "e6", section: "E", answer: "NA" },
    { questionId: "e7", section: "E", answer: "YES", explanation: "E7 test" },
    { questionId: "e8", section: "E", answer: "NO" },

        // SECTION F
    { questionId: "f1", section: "F", answer: "YES", explanation: "F1 test" },
    { questionId: "f2", section: "F", answer: "NO" },
    { questionId: "f3", section: "F", answer: "NA" },
    { questionId: "f4", section: "F", answer: "YES", explanation: "F4 test" },
    { questionId: "f5", section: "F", answer: "NO" },
    { questionId: "f6", section: "F", answer: "NA" },
    { questionId: "f7", section: "F", answer: "YES", explanation: "F7 test" },
    { questionId: "f8", section: "F", answer: "NO" },
    { questionId: "f9", section: "F", answer: "NA" },
    { questionId: "f10a", section: "F", answer: "YES", explanation: "F10 test" },
    { questionId: "f10b", section: "F", answer: "YES", explanation: "F10 test" },
    { questionId: "f10c", section: "F", answer: "YES", explanation: "F10 test" },
    { questionId: "f11", section: "F", answer: "NO" },
    { questionId: "f12", section: "F", answer: "NA" },
    { questionId: "f13", section: "F", answer: "YES", explanation: "F13 test" },
    { questionId: "f14", section: "F", answer: "NO" },
    { questionId: "f15", section: "F", answer: "NA" },
    { questionId: "f16", section: "F", answer: "YES", explanation: "F16 test" },
    { questionId: "f17", section: "F", answer: "NO" },
    { questionId: "f18", section: "F", answer: "NA" },
    { questionId: "f19", section: "F", answer: "YES", explanation: "F19 test" },
    { questionId: "f20", section: "F", answer: "NO" },

    // SECTION G
    { questionId: "g1", section: "G", answer: "YES", explanation: "G1 test" },
    { questionId: "g2", section: "G", answer: "NO" },
    { questionId: "g3", section: "G", answer: "NA" },
    { questionId: "g4", section: "G", answer: "YES", explanation: "G4 test" },
    { questionId: "g5", section: "G", answer: "NA" },
  ] as const;

  const pdfBytes = await renderConditionReportPdf({
    answers: answers as any,
    debug: true,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="condition-report-debug-all.pdf"',
    },
  });
}