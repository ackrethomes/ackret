export type AnswerChoice = "YES" | "NO" | "NA";

export type ConditionSectionKey = "B" | "C" | "D" | "E" | "F" | "G";

export type ConditionReportAnswer = {
  questionId: string;
  section: ConditionSectionKey;
  answer: AnswerChoice;
  explanation?: string;
};

export type PdfRect = {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type QuestionPdfMap = {
  yes: PdfRect;
  no: PdfRect;
  na: PdfRect;
};

export type SectionExplanationPdfMap = {
  [section in ConditionSectionKey]?: PdfRect;
};

export type ConditionReportQuestionPdfMap = Record<string, QuestionPdfMap>;