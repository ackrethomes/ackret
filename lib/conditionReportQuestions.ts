export type ConditionQuestion = {
  id: string;
  section: string;
  label: string;
  helpText?: string;
};

export const conditionReportQuestions: ConditionQuestion[] = [
  // B. STRUCTURAL AND MECHANICAL
  {
    id: "b1",
    section: "B. Structural and Mechanical",
    label: "Are you aware of defects in the roof?",
    helpText:
      "Roof defects may include items such as leakage or significant problems with gutters or eaves.",
  },
  {
    id: "b2",
    section: "B. Structural and Mechanical",
    label: "Are you aware of defects in the electrical system?",
    helpText:
      "Electrical defects may include items such as electrical wiring not in compliance with applicable code, knob and tube wiring, 60 amp service, or aluminum-branch circuit wiring.",
  },
  {
    id: "b3",
    section: "B. Structural and Mechanical",
    label:
      "Are you aware of defects in part of the plumbing system (including the water heater, water softener, and swimming pool)?",
    helpText:
      "Other plumbing system defects may include items such as leaks or defects in pipes, toilets, interior or exterior faucets, bathtubs, showers, or any sprinkler system.",
  },
  {
    id: "b4",
    section: "B. Structural and Mechanical",
    label:
      "Are you aware of defects in the heating and air conditioning system (including the air filters and humidifiers)?",
    helpText:
      "Heating and air conditioning defects may include items such as defects in the heating ventilation and air conditioning (HVAC) equipment, supplemental heaters, ventilating fans or fixtures, or solar collectors.",
  },
  {
    id: "b5",
    section: "B. Structural and Mechanical",
    label:
      "Are you aware of defects in a woodburning stove or fireplace or of other defects caused by a fire in a stove or fireplace or elsewhere on the property?",
    helpText:
      "Such defects may include items such as defects in the chimney, fireplace flue, inserts, or other installed fireplace equipment; or woodburning stoves not installed pursuant to applicable code.",
  },
  {
    id: "b6",
    section: "B. Structural and Mechanical",
    label:
      "Are you aware of defects related to smoke detectors or carbon monoxide detectors or a violation of applicable state or local smoke detector or carbon monoxide detector laws?",
    helpText:
      "State law requires operating smoke detectors on all levels of all residential properties and operating carbon monoxide detectors on all levels of most residential properties.",
  },
  {
    id: "b7",
    section: "B. Structural and Mechanical",
    label:
      "Are you aware of defects in the basement or foundation (including cracks, seepage, and bulges)?",
    helpText:
      "Other basement defects may include items such as flooding, defects in drain tiling or sump pumps, or movement, shifting, or deterioration in the foundation.",
  },
  {
    id: "b8",
    section: "B. Structural and Mechanical",
    label: "Are you aware of defects in any structure on the property?",
    helpText:
      "Structural defects with respect to the residence or other improvements may include items such as movement, shifting, or deterioration in walls; major cracks or flaws in interior or exterior walls, partitions, or the foundation; wood rot; and significant problems with driveways, sidewalks, patios, decks, fences, waterfront piers or walls, windows, doors, floors, ceilings, stairways, or insulation.",
  },
  {
    id: "b9",
    section: "B. Structural and Mechanical",
    label:
      "Are you aware of defects in mechanical equipment included in the sale either as fixtures or personal property?",
    helpText:
      "Mechanical equipment defects may include items such as defects in any appliance, central vacuum, garage door opener, in-ground sprinkler, or in-ground pet containment system that is included in the sale.",
  },
  {
    id: "b10",
    section: "B. Structural and Mechanical",
    label:
      "Are you aware of rented items located on the property such as a water softener or other water conditioner system or other items affixed to or closely associated with the property?",
  },
  {
    id: "b11",
    section: "B. Structural and Mechanical",
    label:
      "Are you aware of basement, window, or plumbing leaks, overflow from sinks, bathtubs, or sewers, or other ongoing water or moisture intrusions or conditions?",
  },

  // C. ENVIRONMENTAL
  {
    id: "c1",
    section: "C. Environmental",
    label: "Are you aware of the presence of unsafe levels of mold?",
  },
  {
    id: "c2",
    section: "C. Environmental",
    label:
      "Are you aware of a defect caused by unsafe concentrations of, or unsafe conditions relating to, radon, radium in water supplies, high voltage electric (100 KV or greater) or steel natural gas transmission lines located on but not directly serving the property, lead in paint, lead in soil, or other potentially hazardous or toxic substances on the property?",
    helpText:
      "Specific federal lead paint disclosure requirements must be complied with in the sale of most residential properties built before 1978.",
  },
  {
    id: "c3",
    section: "C. Environmental",
    label:
      "Are you aware of the presence of asbestos or asbestos-containing materials on the property?",
  },
  {
    id: "c4",
    section: "C. Environmental",
    label:
      "Are you aware of the presence of or a defect caused by unsafe concentrations of, unsafe conditions relating to, or the storage of hazardous or toxic substances on neighboring properties?",
  },
  {
    id: "c5",
    section: "C. Environmental",
    label:
      "Are you aware of current or previous termite, powder post beetle, or carpenter ant infestations or defects caused by animal, reptile, or insect infestations?",
  },
  {
    id: "c6",
    section: "C. Environmental",
    label:
      "Are you aware of water quality issues caused by unsafe concentrations of or unsafe conditions relating to lead?",
  },
  {
    id: "c7",
    section: "C. Environmental",
    label:
      "Are you aware of the manufacture of methamphetamine or other hazardous or toxic substances on the property?",
  },

  // D. WELLS, SEPTIC SYSTEMS, STORAGE TANKS
  {
    id: "d1",
    section: "D. Wells, Septic Systems, Storage Tanks",
    label:
      "Are you aware of defects in a well on the property or in a well that serves the property, including unsafe well water?",
    helpText:
      "Well defects may include items such as an unused well not properly closed in conformance with state regulations, a well that was not constructed pursuant to state standards or local code, or a well that requires modifications to bring it into compliance with current code specifications. Well water defects might include, but are not limited to, unsafe levels of bacteria (total Coliform and E. coli), nitrate, arsenic, or other substances affecting human consumption safety.",
  },
  {
    id: "d2",
    section: "D. Wells, Septic Systems, Storage Tanks",
    label: "Are you aware of a joint well serving the property?",
  },
  {
    id: "d3",
    section: "D. Wells, Septic Systems, Storage Tanks",
    label: "Are you aware of a defect related to a joint well serving the property?",
  },
  {
    id: "d4",
    section: "D. Wells, Septic Systems, Storage Tanks",
    label:
      "Are you aware that a septic system or other private sanitary disposal system serves the property?",
  },
  {
    id: "d5",
    section: "D. Wells, Septic Systems, Storage Tanks",
    label:
      "Are you aware of defects in the septic system or other private sanitary disposal system on the property or any out-of-service septic system that serves the property and that is not closed or abandoned according to applicable regulations?",
    helpText:
      "Septic system defects may include items such as backups in toilets or in the basement; exterior ponding, overflows, or backups; or defective or missing baffles.",
  },
  {
    id: "d6",
    section: "D. Wells, Septic Systems, Storage Tanks",
    label:
      "Are you aware of underground or aboveground fuel storage tanks on or previously located on the property?",
    helpText:
      "If yes, the owner may have to register the tanks with the Wisconsin Department of Agriculture, Trade and Consumer Protection. Regulations may require the closure or removal of unused tanks.",
  },
  {
    id: "d7",
    section: "D. Wells, Septic Systems, Storage Tanks",
    label:
      "Are you aware of defects in the underground or aboveground fuel storage tanks on or previously located on the property?",
    helpText:
      "Defects in underground or aboveground fuel storage tanks may include items such as abandoned tanks not closed in conformance with applicable local, state, and federal law; leaking; corrosion; or failure to meet operating standards.",
  },
  {
    id: "d8",
    section: "D. Wells, Septic Systems, Storage Tanks",
    label:
      "Are you aware of an “LP” tank on the property?",
    helpText:
      "If yes, specify in the additional information space whether the owner of the property either owns or leases the tank.",
  },
  {
    id: "d9",
    section: "D. Wells, Septic Systems, Storage Tanks",
    label: "Are you aware of defects in an “LP” tank on the property?",
  },

  // E. TAXES, SPECIAL ASSESSMENTS, PERMITS, ETC.
  {
    id: "e1",
    section: "E. Taxes, Special Assessments, Permits, Etc.",
    label:
      "Have you received notice of property tax increases, other than normal annual increases, or are you aware of a pending property reassessment?",
  },
  {
    id: "e2",
    section: "E. Taxes, Special Assessments, Permits, Etc.",
    label:
      "Are you aware that remodeling was done that may increase the property’s assessed value?",
  },
  {
    id: "e3",
    section: "E. Taxes, Special Assessments, Permits, Etc.",
    label: "Are you aware of pending special assessments?",
  },
  {
    id: "e4",
    section: "E. Taxes, Special Assessments, Permits, Etc.",
    label:
      "Are you aware that the property is located within a special purpose district, such as a drainage district, that has the authority to impose assessments against the real property located within the district?",
  },
  {
    id: "e5",
    section: "E. Taxes, Special Assessments, Permits, Etc.",
    label:
      "Are you aware of any proposed construction of a public project that may affect the use of the property?",
  },
  {
    id: "e6",
    section: "E. Taxes, Special Assessments, Permits, Etc.",
    label:
      "Are you aware of any remodeling, replacements, or repairs affecting the property’s structure or mechanical systems that were done or additions to this property that were made during your period of ownership without the required permits?",
  },
  {
    id: "e7",
    section: "E. Taxes, Special Assessments, Permits, Etc.",
    label:
      "Are you aware of any land division involving the property for which a required state or local permit was not obtained?",
  },

  // F. LAND USE
  {
    id: "f1",
    section: "F. Land Use",
    label:
      "Are you aware of the property being part of or subject to a subdivision homeowners’ association?",
  },
  {
    id: "f2",
    section: "F. Land Use",
    label:
      "If the property is not a condominium unit, are you aware of common areas associated with the property that are co-owned with others?",
  },
  {
    id: "f3",
    section: "F. Land Use",
    label:
      "Are you aware of any zoning code violations with respect to the property?",
  },
  {
    id: "f4",
    section: "F. Land Use",
    label:
      "Are you aware of the property or any portion of the property being located in a floodplain, wetland, or shoreland zoning area?",
  },
  {
    id: "f5",
    section: "F. Land Use",
    label: "Are you aware of nonconforming uses of the property?",
    helpText:
      "A nonconforming use is a use of land, a dwelling, or a building that existed lawfully before the current zoning ordinance was enacted or amended, but that does not conform to the use restrictions in the current ordinance.",
  },
  {
    id: "f6",
    section: "F. Land Use",
    label: "Are you aware of conservation easements on the property?",
    helpText:
      "A conservation easement is a legal agreement in which a property owner conveys some of the rights associated with ownership of the property to an easement holder such as a governmental unit or a qualified nonprofit organization to protect the natural habitat of fish, wildlife, or plants or a similar ecosystem, preserve areas for outdoor recreation or education, or for similar purposes.",
  },
  {
    id: "f7",
    section: "F. Land Use",
    label:
      "Are you aware of restrictive covenants or deed restrictions on the property?",
  },
  {
    id: "f8",
    section: "F. Land Use",
    label:
      "Other than public rights-of-way, are you aware of nonowners having rights to use part of the property, including, but not limited to, private rights-of-way and easements other than recorded utility easements?",
  },
  {
    id: "f9",
    section: "F. Land Use",
    label:
      "Are you aware of the property being subject to a mitigation plan required under administrative rules of the Wisconsin Department of Natural Resources related to county shoreland zoning ordinances, which obligates the owner of the property to establish or maintain certain measures related to shoreland conditions and which is enforceable by the county?",
  },
  {
    id: "f10a",
    section: "F. Land Use",
    label:
      "Are you aware of all or part of the property having been assessed as agricultural land under Wis. Stat. s. 70.32 (2r) (use value assessment)?",
    helpText:
      "This item is part of the use value assessment system disclosure.",
  },
  {
    id: "f10b",
    section: "F. Land Use",
    label:
      "Are you aware of the property having been assessed a use-value assessment conversion charge relating to this property?",
    helpText:
      "Wis. Stat. s. 74.485 (2).",
  },
  {
    id: "f10c",
    section: "F. Land Use",
    label:
      "Are you aware of the payment of a use-value assessment conversion charge having been deferred relating to this property?",
    helpText:
      "Wis. Stat. s. 74.485 (4).",
  },
  {
    id: "f11",
    section: "F. Land Use",
    label:
      "Is all or part of the property subject to or in violation of a farmland preservation agreement?",
    helpText:
      "Early termination of a farmland preservation agreement or removal of land from such an agreement can trigger payment of a conversion fee equal to 3 times the class 1 use value of the land.",
  },
  {
    id: "f12",
    section: "F. Land Use",
    label:
      "Is all or part of the property subject to, enrolled in, or in violation of the Forest Crop Law, Managed Forest Law, the Conservation Reserve Program, or a comparable program?",
  },
  {
    id: "f13",
    section: "F. Land Use",
    label:
      "Are you aware of a dam that is totally or partially located on the property or that an ownership in a dam that is not located on the property will be transferred with the property because it is owned collectively by members of a homeowners’ association, lake district, or similar group?",
    helpText:
      "If yes, contact the Wisconsin Department of Natural Resources to find out if dam transfer requirements or agency orders apply.",
  },
  {
    id: "f14",
    section: "F. Land Use",
    label:
      "Are you aware of boundary or lot line disputes, encroachments, or encumbrances (including a joint driveway) affecting the property?",
    helpText:
      "Encroachments may involve fences, houses, garages, driveways, gardens, landscaping, liens, licenses, or other claims affecting the property.",
  },
  {
    id: "f15",
    section: "F. Land Use",
    label: "Are you aware there is not legal access to the property?",
  },
  {
    id: "f16",
    section: "F. Land Use",
    label:
      "Are you aware of federal, state, or local regulations requiring repairs, alterations, or corrections of an existing condition?",
    helpText:
      "This may include items such as orders to correct building code violations.",
  },
  {
    id: "f17",
    section: "F. Land Use",
    label:
      "Are you aware of a pier attached to the property that is not in compliance with state or local pier regulations?",
  },
  {
    id: "f18",
    section: "F. Land Use",
    label:
      "Are you aware of a written agreement affecting riparian rights related to the property?",
  },
  {
    id: "f19",
    section: "F. Land Use",
    label:
      "Are you aware that the property abuts the bed of a navigable waterway that is owned by a hydroelectric operator?",
    helpText:
      "The owner may be required to ask permission of the hydroelectric operator to place a structure on the bed of the waterway.",
  },
  {
    id: "f20",
    section: "F. Land Use",
    label:
      "Are you aware of one or more burial sites on the property?",
    helpText:
      "For information regarding the presence, preservation, and potential disturbance of burial sites, contact the Wisconsin Historical Society.",
  },

  // G. ADDITIONAL INFORMATION
  {
    id: "g1",
    section: "G. Additional Information",
    label:
      "Have you filed any insurance claims relating to damage to this property or premises within the last five years?",
  },
  {
    id: "g2",
    section: "G. Additional Information",
    label:
      "Are you aware of a structure on the property that is designated as a historic building or that all or any part of the property is in a historic district?",
  },
  {
    id: "g3",
    section: "G. Additional Information",
    label:
      "Are you aware of any agreements that bind subsequent owners of the property, such as a lease agreement or an extension of credit from an electric cooperative?",
  },
  {
    id: "g4",
    section: "G. Additional Information",
    label:
      "Is the owner a foreign person, as defined in 26 USC 1445 (f)?",
    helpText:
      "For example: a nonresident alien individual, foreign corporation, foreign partnership, foreign trust, or foreign estate. FIRPTA may require buyer withholding unless an exception applies.",
  },
  {
    id: "g5",
    section: "G. Additional Information",
    label: "Are you aware of other defects affecting the property?",
    helpText:
      "Other defects might include items such as drainage easement or grading problems; excessive sliding, settling, earth movements, or upheavals; or any other defect or material condition.",
  },
];