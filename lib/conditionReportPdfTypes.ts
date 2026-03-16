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

export type ConditionReportPdfFormData = {
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

export type DisclaimerPdfMap = {
  propertyAddress: PdfRect;
  municipalityName: PdfRect;
  county: PdfRect;
  reportMonth: PdfRect;
  reportDay: PdfRect;
  reportYear: PdfRect;
};

export type PdfOval = {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type MunicipalityTypeCircleMap = {
  City: PdfOval;
  Village: PdfOval;
  Town: PdfOval;
};

export type ConditionReportQuestionPdfMap = Record<string, QuestionPdfMap>;