export type ConditionQuestion = {
  id: string;
  section: string;
  label: string;
  helpText?: string;
};

export const conditionReportQuestions: ConditionQuestion[] = [
  {
    id: "b1",
    section: "B. Structural and Mechanical",
    label: "Are you aware of defects in the roof?",
  },
  {
    id: "b2",
    section: "B. Structural and Mechanical",
    label: "Are you aware of defects in the foundation or basement?",
  },
  {
    id: "b3",
    section: "B. Structural and Mechanical",
    label: "Are you aware of defects in electrical, plumbing, heating, or air conditioning systems?",
  },
  {
    id: "b4",
    section: "B. Structural and Mechanical",
    label: "Are you aware of defects in doors, windows, or exterior walls?",
  },

  {
    id: "c1",
    section: "C. Environmental",
    label: "Are you aware of unsafe concentrations of radon, asbestos, lead in water, mold, or other hazardous substances?",
  },
  {
    id: "c2",
    section: "C. Environmental",
    label: "Are you aware of fuel or chemical storage tanks on the property?",
  },
  {
    id: "c3",
    section: "C. Environmental",
    label: "Are you aware of underground storage tanks or contamination on or affecting the property?",
  },

  {
    id: "d1",
    section: "D. Wells, Septic Systems, and Storage Tanks",
    label: "Are you aware of defects in the well, septic system, or private sewage system?",
  },
  {
    id: "d2",
    section: "D. Wells, Septic Systems, and Storage Tanks",
    label: "Are you aware of any abandoned well, septic system, or storage tank on the property?",
  },

  {
    id: "e1",
    section: "E. Taxes, Special Assessments, Permits, and Legal Matters",
    label: "Are you aware of any pending special assessments or property tax changes?",
  },
  {
    id: "e2",
    section: "E. Taxes, Special Assessments, Permits, and Legal Matters",
    label: "Are you aware of any remodeling, additions, or work done without required permits?",
  },
  {
    id: "e3",
    section: "E. Taxes, Special Assessments, Permits, and Legal Matters",
    label: "Are you aware of any shared walls, shared driveways, or other shared-use agreements affecting the property?",
  },

  {
    id: "f1",
    section: "F. Additional Information",
    label: "Are you aware of flooding, standing water, drainage problems, or other water problems on or affecting the property?",
  },
  {
    id: "f2",
    section: "F. Additional Information",
    label: "Are you aware of material damage from fire, wind, flood, earthquake, erosion, or landslide?",
  },
  {
    id: "f3",
    section: "F. Additional Information",
    label: "Are you aware of significant odor, noise, water diversion, water intrusion, or other irritants emanating from neighboring property?",
  },
  {
    id: "f4",
    section: "F. Additional Information",
    label: "Are you aware of any agreements that bind subsequent owners of the property, such as lease agreements or utility obligations?",
  },
  {
    id: "f5",
    section: "F. Additional Information",
    label: "Are you aware of other defects affecting the property?",
  },
];