import type {
  AnswerChoice,
  ConditionReportAnswer,
  ConditionSectionKey,
} from "./conditionReportPdfTypes";

type RawAnswerValue = "yes" | "no" | "na" | "";

type RawAnswersState = Record<
  string,
  {
    answer: RawAnswerValue;
    explanation: string;
  }
>;

type QuestionConfig = {
  id: string;
  section: string;
};

function normalizeAnswer(value: RawAnswerValue): AnswerChoice | null {
  if (value === "yes") return "YES";
  if (value === "no") return "NO";
  if (value === "na") return "NA";
  return null;
}

function normalizeSection(sectionLabel: string): ConditionSectionKey {
  const firstChar = sectionLabel.trim().charAt(0).toUpperCase();

  if (
    firstChar === "B" ||
    firstChar === "C" ||
    firstChar === "D" ||
    firstChar === "E" ||
    firstChar === "F" ||
    firstChar === "G"
  ) {
    return firstChar;
  }

  throw new Error(`Unsupported section label: ${sectionLabel}`);
}

export function normalizeConditionReportPayload(
  answers: RawAnswersState,
  questions: QuestionConfig[]
): ConditionReportAnswer[] {
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  const normalized: ConditionReportAnswer[] = [];

  for (const [questionId, value] of Object.entries(answers)) {
    const question = questionMap.get(questionId);
    if (!question) continue;

    const answer = normalizeAnswer(value.answer);
    if (!answer) continue;

    normalized.push({
      questionId,
      section: normalizeSection(question.section),
      answer,
      explanation: value.explanation?.trim() || undefined,
    });
  }

  return normalized;
}