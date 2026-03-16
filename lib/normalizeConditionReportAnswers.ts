import type {
  AnswerChoice,
  ConditionReportAnswer,
  ConditionSectionKey,
} from "./conditionReportPdfTypes";

type RawFormAnswer = {
  id: string;
  section: string;
  answer: string | null | undefined;
  explanation?: string | null;
};

function normalizeAnswer(value: string | null | undefined): AnswerChoice | null {
  if (value === "YES") return "YES";
  if (value === "NO") return "NO";
  if (value === "NA") return "NA";
  return null;
}

function normalizeSection(value: string): ConditionSectionKey {
  const upper = value.trim().toUpperCase();
  if (
    upper === "B" ||
    upper === "C" ||
    upper === "D" ||
    upper === "E" ||
    upper === "F" ||
    upper === "G"
  ) {
    return upper;
  }
  throw new Error(`Invalid section: ${value}`);
}

export function normalizeConditionReportAnswers(
  items: RawFormAnswer[]
): ConditionReportAnswer[] {
  const normalized: ConditionReportAnswer[] = [];

  for (const item of items) {
    const answer = normalizeAnswer(item.answer);
    if (!answer) continue;

    normalized.push({
      questionId: item.id,
      section: normalizeSection(item.section),
      answer,
      explanation: item.explanation?.trim() || undefined,
    });
  }

  return normalized;
}