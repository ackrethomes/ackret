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
  yesX: 412,
  noX: 460,
  naX: 510,
};

const PAGE_3_C_COLUMNS = {
  yesX: 412,
  noX: 460,
  naX: 510,
};

const PAGE_4_D_COLUMNS = {
  yesX: 412,
  noX: 460,
  naX: 510,
};

const PAGE_5_E_COLUMNS = {
  yesX: 412,
  noX: 460,
  naX: 510,
};

const PAGE_6_F_COLUMNS = {
  yesX: 412,
  noX: 460,
  naX: 510,
};

const PAGE_7_G_COLUMNS = {
  yesX: 412,
  noX: 460,
  naX: 510,
};

export const questionAnswerPdfMap: ConditionReportQuestionPdfMap = {
  /**
   * SECTION B
   * PDF page index 1 in your current setup
   * Fill these with your real y-values row by row
   */
  b1: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 218),
  b2: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 185),
  b3: makeAnswerRow(1, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 135),
  b4: makeAnswerRow(2, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 715),
  b5: makeAnswerRow(2, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 645),
  b6: makeAnswerRow(2, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 580),
  b7: makeAnswerRow(2, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 500),
  b8: makeAnswerRow(2, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 445),
  b9: makeAnswerRow(2, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 356),
  b10: makeAnswerRow(2, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 292),
  b11: makeAnswerRow(2, PAGE_2_B_COLUMNS.yesX, PAGE_2_B_COLUMNS.noX, PAGE_2_B_COLUMNS.naX, 255),
  
  /**
   * SECTION C
   * Replace page index if needed
   */
  c1: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 715),
  c2: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 695),
  c3: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 600),
  c4: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 575),
  c5: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 540),
  c6: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 507),
  c7: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 480),

  /**
   * SECTION D
   */
  d1: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 395),
  d2: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 285),
  d3: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 270),
  d4: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 245),
  d5: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 220),
  d6: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 147),
  d7: makeAnswerRow(4, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 715),
  d8: makeAnswerRow(4, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 643),
  d9: makeAnswerRow(4, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 610),

  /**
   * SECTION E
   */
  e1: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 532),
  e2: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 498),
  e3: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 472),
  e4: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 456),
  e5: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 412),
  e6: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 387),
  e7: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 345),

  /**
   * SECTION F
   */
  f1: makeAnswerRow(4, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 259),
  f2: makeAnswerRow(4, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 233),
  f3: makeAnswerRow(4, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 200),
  f4: makeAnswerRow(4, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 173),
  f5: makeAnswerRow(4, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 146),
  f6: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 712),
  f7: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 635),
  f8: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 610),
  f9: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 565),
  f10a: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 420),
  f10b: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 390),
  f10c: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 360),
  f11: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 320),
  f12: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 245),
  f13: makeAnswerRow(5, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 210),
  f14: makeAnswerRow(6, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 712),
  f15: makeAnswerRow(6, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 606),
  f16: makeAnswerRow(6, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 593),
  f17: makeAnswerRow(6, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 545),
  f18: makeAnswerRow(6, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 510),
  f19: makeAnswerRow(6, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 485),
  f20: makeAnswerRow(6, PAGE_6_F_COLUMNS.yesX, PAGE_6_F_COLUMNS.noX, PAGE_6_F_COLUMNS.naX, 410),

  /**
   * SECTION G
   */
  g1: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 303),
  g2: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 277),
  g3: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 242),
  g4: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 208),
  g5: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 105),
};

export const sectionExplanationPdfMap: SectionExplanationPdfMap = {
  B: { page: 2, x: 0, y: 0, width: 0, height: 0 },
  C: { page: 3, x: 0, y: 0, width: 0, height: 0 },
  D: { page: 4, x: 0, y: 0, width: 0, height: 0 },
  E: { page: 4, x: 0, y: 0, width: 0, height: 0 },
  F: { page: 5, x: 0, y: 0, width: 0, height: 0 },
  G: { page: 6, x: 0, y: 0, width: 0, height: 0 },
};