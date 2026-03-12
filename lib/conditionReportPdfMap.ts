export type PdfCheckTarget = {
  page: number;
  yes: { x: number; y: number };
  no: { x: number; y: number };
  na: { x: number; y: number };
};

export type PdfTextTarget = {
  page: number;
  x: number;
  y: number;
  maxWidth?: number;
  fontSize?: number;
};

export const pdfHeaderTargets = {
  propertyAddress: { page: 1, x: 215, y: 690, maxWidth: 230, fontSize: 9 },
  municipalityName: { page: 1, x: 260, y: 676, maxWidth: 110, fontSize: 9 },
  county: { page: 1, x: 430, y: 676, maxWidth: 90, fontSize: 9 },
  reportDate: { page: 1, x: 390, y: 662, maxWidth: 140, fontSize: 9 },
  owner1: { page: 1, x: 120, y: 585, maxWidth: 240, fontSize: 9 },
  owner2: { page: 1, x: 120, y: 570, maxWidth: 240, fontSize: 9 },
  owner3: { page: 1, x: 120, y: 555, maxWidth: 240, fontSize: 9 },
};

export const pdfQuestionTargets: Record<string, PdfCheckTarget> = {
  b1: { page: 2, yes: { x: 503, y: 650 }, no: { x: 538, y: 650 }, na: { x: 573, y: 650 } },
  b2: { page: 2, yes: { x: 503, y: 612 }, no: { x: 538, y: 612 }, na: { x: 573, y: 612 } },
  b3: { page: 2, yes: { x: 503, y: 563 }, no: { x: 538, y: 563 }, na: { x: 573, y: 563 } },
  b4: { page: 2, yes: { x: 503, y: 506 }, no: { x: 538, y: 506 }, na: { x: 573, y: 506 } },
  b5: { page: 2, yes: { x: 503, y: 455 }, no: { x: 538, y: 455 }, na: { x: 573, y: 455 } },
  b6: { page: 2, yes: { x: 503, y: 401 }, no: { x: 538, y: 401 }, na: { x: 573, y: 401 } },
  b7: { page: 2, yes: { x: 503, y: 354 }, no: { x: 538, y: 354 }, na: { x: 573, y: 354 } },
  b8: { page: 2, yes: { x: 503, y: 304 }, no: { x: 538, y: 304 }, na: { x: 573, y: 304 } },
  b9: { page: 2, yes: { x: 503, y: 231 }, no: { x: 538, y: 231 }, na: { x: 573, y: 231 } },
  b10:{ page: 2, yes: { x: 503, y: 189 }, no: { x: 538, y: 189 }, na: { x: 573, y: 189 } },
  b11:{ page: 2, yes: { x: 503, y: 150 }, no: { x: 538, y: 150 }, na: { x: 573, y: 150 } },

  c1: { page: 3, yes: { x: 503, y: 639 }, no: { x: 538, y: 639 }, na: { x: 573, y: 639 } },
  c2: { page: 3, yes: { x: 503, y: 597 }, no: { x: 538, y: 597 }, na: { x: 573, y: 597 } },
  c3: { page: 3, yes: { x: 503, y: 520 }, no: { x: 538, y: 520 }, na: { x: 573, y: 520 } },
  c4: { page: 3, yes: { x: 503, y: 470 }, no: { x: 538, y: 470 }, na: { x: 573, y: 470 } },
  c5: { page: 3, yes: { x: 503, y: 418 }, no: { x: 538, y: 418 }, na: { x: 573, y: 418 } },
  c6: { page: 3, yes: { x: 503, y: 367 }, no: { x: 538, y: 367 }, na: { x: 573, y: 367 } },
  c7: { page: 3, yes: { x: 503, y: 332 }, no: { x: 538, y: 332 }, na: { x: 573, y: 332 } },

  d1: { page: 4, yes: { x: 503, y: 654 }, no: { x: 538, y: 654 }, na: { x: 573, y: 654 } },
  d2: { page: 4, yes: { x: 503, y: 562 }, no: { x: 538, y: 562 }, na: { x: 573, y: 562 } },
  d3: { page: 4, yes: { x: 503, y: 521 }, no: { x: 538, y: 521 }, na: { x: 573, y: 521 } },
  d4: { page: 4, yes: { x: 503, y: 480 }, no: { x: 538, y: 480 }, na: { x: 573, y: 480 } },
  d5: { page: 4, yes: { x: 503, y: 439 }, no: { x: 538, y: 439 }, na: { x: 573, y: 439 } },
  d6: { page: 4, yes: { x: 503, y: 349 }, no: { x: 538, y: 349 }, na: { x: 573, y: 349 } },
  d7: { page: 4, yes: { x: 503, y: 290 }, no: { x: 538, y: 290 }, na: { x: 573, y: 290 } },
  d8: { page: 4, yes: { x: 503, y: 215 }, no: { x: 538, y: 215 }, na: { x: 573, y: 215 } },
  d9: { page: 4, yes: { x: 503, y: 175 }, no: { x: 538, y: 175 }, na: { x: 573, y: 175 } },

  e1: { page: 5, yes: { x: 503, y: 640 }, no: { x: 538, y: 640 }, na: { x: 573, y: 640 } },
  e2: { page: 5, yes: { x: 503, y: 598 }, no: { x: 538, y: 598 }, na: { x: 573, y: 598 } },
  e3: { page: 5, yes: { x: 503, y: 558 }, no: { x: 538, y: 558 }, na: { x: 573, y: 558 } },
  e4: { page: 5, yes: { x: 503, y: 521 }, no: { x: 538, y: 521 }, na: { x: 573, y: 521 } },
  e5: { page: 5, yes: { x: 503, y: 466 }, no: { x: 538, y: 466 }, na: { x: 573, y: 466 } },
  e6: { page: 5, yes: { x: 503, y: 429 }, no: { x: 538, y: 429 }, na: { x: 573, y: 429 } },
  e7: { page: 5, yes: { x: 503, y: 351 }, no: { x: 538, y: 351 }, na: { x: 573, y: 351 } },

  g1: { page: 7, yes: { x: 503, y: 260 }, no: { x: 538, y: 260 }, na: { x: 573, y: 260 } },
  g2: { page: 7, yes: { x: 503, y: 220 }, no: { x: 538, y: 220 }, na: { x: 573, y: 220 } },
  g3: { page: 7, yes: { x: 503, y: 176 }, no: { x: 538, y: 176 }, na: { x: 573, y: 176 } },
  g4: { page: 7, yes: { x: 503, y: 136 }, no: { x: 538, y: 136 }, na: { x: 573, y: 136 } },
  g5: { page: 7, yes: { x: 503, y: 72 },  no: { x: 538, y: 72 },  na: { x: 573, y: 72 } },
};

export const pdfExplanationTargets: Record<
  string,
  { page: number; x: number; y: number; maxWidth: number; fontSize?: number }
> = {
  b: { page: 2, x: 170, y: 103, maxWidth: 360, fontSize: 8 },
  c: { page: 3, x: 170, y: 280, maxWidth: 360, fontSize: 8 },
  d: { page: 4, x: 170, y: 112, maxWidth: 360, fontSize: 8 },
  e: { page: 5, x: 170, y: 288, maxWidth: 360, fontSize: 8 },
  f: { page: 7, x: 170, y: 315, maxWidth: 360, fontSize: 8 },
  g: { page: 8, x: 170, y: 585, maxWidth: 360, fontSize: 8 },
};

export const pdfFooterTargets = {
  yearsOwned: { page: 8, x: 245, y: 662, maxWidth: 40, fontSize: 9 },
  yearsOccupied: { page: 8, x: 240, y: 647, maxWidth: 40, fontSize: 9 },

  owner1: { page: 8, x: 105, y: 548, maxWidth: 180, fontSize: 9 },
  owner1Date: { page: 8, x: 358, y: 548, maxWidth: 80, fontSize: 9 },
  owner2: { page: 8, x: 105, y: 532, maxWidth: 180, fontSize: 9 },
  owner2Date: { page: 8, x: 358, y: 532, maxWidth: 80, fontSize: 9 },
  owner3: { page: 8, x: 105, y: 516, maxWidth: 180, fontSize: 9 },
  owner3Date: { page: 8, x: 358, y: 516, maxWidth: 80, fontSize: 9 },
};