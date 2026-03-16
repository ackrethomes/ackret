import type {
  ConditionReportQuestionPdfMap,
  DisclaimerPdfMap,
  MunicipalityTypeCircleMap,
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

export const disclaimerPdfMap: DisclaimerPdfMap = {
  propertyAddress: { page: 1, x: 315, y: 697, width: 205, height: 16 },
  municipalityName: { page: 1, x: 430, y: 697, width: 145, height: 16 },
  county: { page: 1, x: 520, y: 697, width: 90, height: 16 },
  reportMonth: { page: 1, x: 242, y: 678, width: 78, height: 16 },
  reportDay: { page: 1, x: 292, y: 678, width: 42, height: 16 },
  reportYear: { page: 1, x: 327, y: 678, width: 58, height: 16 },
};

export const municipalityTypeCircleMap: MunicipalityTypeCircleMap = {
  City: { page: 1, x: 385, y: 687, width: 20, height: 10 },
  Village: { page: 1, x: 409, y: 687, width: 40, height: 10 },
  Town: { page: 1, x: 452, y: 687, width: 20, height: 10 },
};

export const ownerInfoPdfMap = {
  yearsOwned: { page: 7, x: 294, y: 715, width: 40, height: 14 },
  yearsOccupied: { page: 7, x: 297, y: 695, width: 40, height: 14 },
};

export const questionAnswerPdfMap: ConditionReportQuestionPdfMap = {
  // SECTION B
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

  // SECTION C
  c1: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 715),
  c2: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 695),
  c3: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 600),
  c4: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 575),
  c5: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 540),
  c6: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 507),
  c7: makeAnswerRow(3, PAGE_3_C_COLUMNS.yesX, PAGE_3_C_COLUMNS.noX, PAGE_3_C_COLUMNS.naX, 480),

  // SECTION D
  d1: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 395),
  d2: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 285),
  d3: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 270),
  d4: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 245),
  d5: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 220),
  d6: makeAnswerRow(3, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 147),
  d7: makeAnswerRow(4, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 715),
  d8: makeAnswerRow(4, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 643),
  d9: makeAnswerRow(4, PAGE_4_D_COLUMNS.yesX, PAGE_4_D_COLUMNS.noX, PAGE_4_D_COLUMNS.naX, 610),

  // SECTION E
  e1: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 532),
  e2: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 498),
  e3: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 472),
  e4: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 456),
  e5: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 412),
  e6: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 387),
  e7: makeAnswerRow(4, PAGE_5_E_COLUMNS.yesX, PAGE_5_E_COLUMNS.noX, PAGE_5_E_COLUMNS.naX, 345),

  // SECTION F
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

  // SECTION G
  g1: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 303),
  g2: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 277),
  g3: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 242),
  g4: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 208),
  g5: makeAnswerRow(6, PAGE_7_G_COLUMNS.yesX, PAGE_7_G_COLUMNS.noX, PAGE_7_G_COLUMNS.naX, 105),
};

export const sectionExplanationPdfMap: SectionExplanationPdfMap = {
  B: { page: 2, x: 150, y: 172, width: 400, height: 50 },
  C: { page: 3, x: 150, y: 409, width: 400, height: 50 },
  D: { page: 4, x: 150, y: 547, width: 400, height: 50 },
  E: { page: 4, x: 150, y: 274, width: 400, height: 50 },
  F: { page: 6, x: 150, y: 316, width: 400, height: 50 },
  G: { page: 7, x: 150, y: 636, width: 400, height: 50 },
};