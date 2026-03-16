import type {
  ConditionReportQuestionPdfMap,
  PdfRect,
  SectionExplanationPdfMap,
} from "./conditionReportPdfTypes";

function makeAnswerRow(
  page: number,
  yesX: number,
  noX: number,
  naX: number,
  y: number,
  width = 16,
  height = 12
) {
  return {
    yes: { page, x: yesX, y, width, height },
    no: { page, x: noX, y, width, height },
    na: { page, x: naX, y, width, height },
  };
}

/**
 * REPLACE THESE CONSTANTS WITH YOUR REAL VALUES
 * Start with the values you already know are correct from B1/B2.
 */
const PAGE_2_B_COLUMNS = {
  yesX: 500,
  noX: 550,
  naX: 600,
};

const PAGE_3_C_COLUMNS = {
  yesX: 0,
  noX: 0,
  naX: 0,
};

const PAGE_4_D_COLUMNS = {
  yesX: 0,
  noX: 0,
  naX: 0,
};

const PAGE_5_E_COLUMNS = {
  yesX: 0,
  noX: 0,
  naX: 0,
};

const PAGE_6_F_COLUMNS = {
  yesX: 0,
  noX: 0,
  naX: 0,
};

const PAGE_7_G_COLUMNS = {
  yesX: 0,
  noX: 0,
  naX: 0,
};

export const questionAnswerPdfMap: ConditionReportQuestionPdfMap = {
  /**
   * SECTION B
   * PDF page index 1 in your current setup
   * Fill these with your real y-values row by row
   */
  b1: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 250),
  b2: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 90),
  b3: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 80),
  b4: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b5: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b6: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b7: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b8: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b9: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b10: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b11: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b12: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b13: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b14: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b15: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),
  b16: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 0),

  /**
   * SECTION C
   * Replace page index if needed
   */
  c1: makeAnswerRow(2, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 0),
  c2: makeAnswerRow(2, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 0),
  c3: makeAnswerRow(2, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 0),
  c4: makeAnswerRow(2, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 0),
  c5: makeAnswerRow(2, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 0),
  c6: makeAnswerRow(2, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 0),
  c7: makeAnswerRow(2, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 0),

  /**
   * SECTION D
   */
  d1: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 0),
  d2: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 0),
  d3: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 0),
  d4: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 0),
  d5: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 0),
  d6: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 0),
  d7: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 0),
  d8: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 0),
  d9: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 0),
  d10: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 0),

  /**
   * SECTION E
   */
  e1: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 0),
  e2: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 0),
  e3: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 0),
  e4: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 0),
  e5: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 0),
  e6: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 0),
  e7: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 0),
  e8: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 0),

  /**
   * SECTION F
   */
  f1: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 0),
  f2: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 0),
  f3: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 0),
  f4: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 0),
  f5: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 0),
  f6: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 0),
  f7: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 0),

  /**
   * SECTION G
   */
  g1: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 0),
  g2: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 0),
  g3: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 0),
  g4: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 0),
};

export const sectionExplanationPdfMap: SectionExplanationPdfMap = {
  B: { page: 2, x: 0, y: 0, width: 0, height: 0 },
  C: { page: 3, x: 0, y: 0, width: 0, height: 0 },
  D: { page: 4, x: 0, y: 0, width: 0, height: 0 },
  E: { page: 4, x: 0, y: 0, width: 0, height: 0 },
  F: { page: 5, x: 0, y: 0, width: 0, height: 0 },
  G: { page: 6, x: 0, y: 0, width: 0, height: 0 },
};