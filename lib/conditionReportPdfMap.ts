import type {
  ConditionReportQuestionPdfMap,
  SectionExplanationPdfMap,
} from "./conditionReportPdfTypes";

export const questionAnswerPdfMap: ConditionReportQuestionPdfMap = {
  b1: {
    yes: { page: 1, x: 413, y: 218, width: 16, height: 12 },
    no: { page: 1, x: 463, y: 218, width: 16, height: 12 },
    na: { page: 1, x: 513, y: 218, width: 16, height: 12 },
  },

  b2: {
    yes: { page: 1, x: 413, y: 175, width: 16, height: 12 },
    no: { page: 1, x: 463, y: 175, width: 16, height: 12 },
    na: { page: 1, x: 513, y: 175, width: 16, height: 12 },
  },

  b3: {
    yes: { page: 1, x: 413, y: 135, width: 16, height: 12 },
    no: { page: 1, x: 463, y: 135, width: 16, height: 12 },
    na: { page: 1, x: 513, y: 135, width: 16, height: 12 },
  },
};

export const sectionExplanationPdfMap: SectionExplanationPdfMap = {
  B: { page: 2, x: 125, y: 200, width: 455, height: 20 },
  C: { page: 3, x: 78, y: 650, width: 455, height: 42 },
  D: { page: 4, x: 78, y: 650, width: 455, height: 42 },
  E: { page: 4, x: 78, y: 350, width: 455, height: 42 },
  F: { page: 5, x: 78, y: 600, width: 455, height: 42 },
  G: { page: 5, x: 78, y: 250, width: 455, height: 42 },
};