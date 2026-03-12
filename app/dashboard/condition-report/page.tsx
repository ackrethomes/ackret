"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { conditionReportQuestions } from "@/lib/conditionReportQuestions";
import { dashboardSteps } from "@/lib/dashboardSteps";

type AnswerValue = "yes" | "no" | "na" | "";

type AnswersState = Record<
  string,
  {
    answer: AnswerValue;
    explanation: string;
  }
>;

type FormState = {
  propertyAddress: string;
  municipalityType: "City" | "Village" | "Town" | "";
  municipalityName: string;
  county: string;
  reportDate: string;
  owner1: string;
  owner2: string;
  owner3: string;
  yearsOwned: string;
  yearsOccupied: string;
  occupantType: "owner" | "tenant" | "vacant" | "";
  builtBefore1978: "yes" | "no" | "";
  notes: string;
};

const groupedSections = groupQuestionsBySection(conditionReportQuestions);

export default function ConditionReportPage() {
  const [form, setForm] = useState<FormState>({
    propertyAddress: "",
    municipalityType: "",
    municipalityName: "",
    county: "",
    reportDate: "",
    owner1: "",
    owner2: "",
    owner3: "",
    yearsOwned: "",
    yearsOccupied: "",
    occupantType: "",
    builtBefore1978: "",
    notes: "",
  });

  const [answers, setAnswers] = useState<AnswersState>(() => {
    const initial: AnswersState = {};
    for (const question of conditionReportQuestions) {
      initial[question.id] = {
        answer: "",
        explanation: "",
      };
    }
    return initial;
  });

  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const yesCount = useMemo(() => {
    return Object.values(answers).filter((item) => item.answer === "yes").length;
  }, [answers]);

  const nextStep = dashboardSteps[1];

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function updateAnswer(questionId: string, value: AnswerValue) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        answer: value,
        explanation: value === "yes" ? prev[questionId].explanation : "",
      },
    }));
  }

  function updateExplanation(questionId: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        explanation: value,
      },
    }));
  }

  async function handleSaveDraft() {
    try {
      setIsSaving(true);

      const response = await fetch("/api/condition-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: draftId,
          form,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to save draft.");
      }

      setDraftId(data.id);
      alert("Draft saved.");
    } catch (error) {
      console.error(error);
      alert("Unable to save draft.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDownloadPdf() {
    try {
      let activeDraftId = draftId;

      if (!activeDraftId) {
        setIsSaving(true);

        const response = await fetch("/api/condition-report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            form,
            answers,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Failed to save draft before PDF generation.");
        }

        activeDraftId = data.id;
        setDraftId(data.id);
      }

      window.open(`/api/condition-report/${activeDraftId}/pdf`, "_blank");
    } catch (error) {
      console.error(error);
      alert("Unable to generate PDF.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: "1100px" }}>
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--ackret-gold-dark)",
        }}
      >
        Step 1 of 8
      </p>

      <h1
        style={{
          marginTop: "14px",
          marginBottom: "16px",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          lineHeight: 1.05,
          color: "var(--ackret-navy)",
          fontWeight: 500,
        }}
      >
        Fill out the Real Estate Condition Report
      </h1>

      <p
        style={{
          margin: 0,
          maxWidth: "860px",
          fontSize: "18px",
          lineHeight: 1.8,
          color: "var(--ackret-muted)",
        }}
      >
        Complete the property details and answer each disclosure question using
        Yes, No, or N/A. If you answer Yes, add an explanation so the report is
        ready for the final downloadable version.
      </p>

      <div
        style={{
          marginTop: "28px",
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: "24px" }}>
          <Card>
            <SectionHeading
              eyebrow="Property Information"
              title="Basic report details"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <Field
                label="Property Address"
                value={form.propertyAddress}
                onChange={(value) => updateForm("propertyAddress", value)}
                placeholder="123 Main Street"
                fullWidth
              />

              <SelectField
                label="City / Village / Town"
                value={form.municipalityType}
                onChange={(value) =>
                  updateForm(
                    "municipalityType",
                    value as FormState["municipalityType"]
                  )
                }
                options={["City", "Village", "Town"]}
              />

              <Field
                label="Municipality Name"
                value={form.municipalityName}
                onChange={(value) => updateForm("municipalityName", value)}
                placeholder="Elkhorn"
              />

              <Field
                label="County"
                value={form.county}
                onChange={(value) => updateForm("county", value)}
                placeholder="Walworth"
              />

              <Field
                label="Report Date"
                type="date"
                value={form.reportDate}
                onChange={(value) => updateForm("reportDate", value)}
              />

              <SelectField
                label="Built Before 1978?"
                value={form.builtBefore1978}
                onChange={(value) =>
                  updateForm(
                    "builtBefore1978",
                    value as FormState["builtBefore1978"]
                  )
                }
                options={["yes", "no"]}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Owner Information"
              title="Who is completing this report?"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <Field
                label="Owner 1"
                value={form.owner1}
                onChange={(value) => updateForm("owner1", value)}
                placeholder="Full name"
              />

              <Field
                label="Owner 2"
                value={form.owner2}
                onChange={(value) => updateForm("owner2", value)}
                placeholder="Optional"
              />

              <Field
                label="Owner 3"
                value={form.owner3}
                onChange={(value) => updateForm("owner3", value)}
                placeholder="Optional"
              />

              <Field
                label="Years Owned"
                value={form.yearsOwned}
                onChange={(value) => updateForm("yearsOwned", value)}
                placeholder="e.g. 8"
              />

              <Field
                label="Years Occupied"
                value={form.yearsOccupied}
                onChange={(value) => updateForm("yearsOccupied", value)}
                placeholder="e.g. 8"
              />

              <SelectField
                label="Property Occupancy"
                value={form.occupantType}
                onChange={(value) =>
                  updateForm("occupantType", value as FormState["occupantType"])
                }
                options={["owner", "tenant", "vacant"]}
              />
            </div>
          </Card>

          {groupedSections.map(([sectionName, questions]) => (
            <Card key={sectionName}>
              <SectionHeading
                eyebrow="Disclosure Section"
                title={sectionName}
              />

              <div style={{ display: "grid", gap: "18px" }}>
                {questions.map((question) => {
                  const answerObj = answers[question.id];

                  return (
                    <div
                      key={question.id}
                      style={{
                        border: "1px solid rgba(22,58,112,0.10)",
                        borderRadius: "18px",
                        padding: "18px",
                        background: "#fbfbf9",
                      }}
                    >
                      <p
                        style={{
                          marginTop: 0,
                          marginBottom: "12px",
                          fontSize: "16px",
                          lineHeight: 1.7,
                          color: "var(--ackret-ink)",
                          fontWeight: 500,
                        }}
                      >
                        {question.label}
                      </p>

                      {question.helpText ? (
                        <p
                          style={{
                            marginTop: 0,
                            marginBottom: "12px",
                            fontSize: "14px",
                            lineHeight: 1.6,
                            color: "var(--ackret-muted)",
                          }}
                        >
                          {question.helpText}
                        </p>
                      ) : null}

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        {(["yes", "no", "na"] as AnswerValue[]).map((choice) => {
                          const active = answerObj.answer === choice;

                          return (
                            <button
                              key={choice}
                              type="button"
                              onClick={() => updateAnswer(question.id, choice)}
                              style={{
                                borderRadius: "999px",
                                padding: "10px 16px",
                                border: active
                                  ? "1px solid rgba(197,154,74,0.55)"
                                  : "1px solid rgba(22,58,112,0.12)",
                                background: active ? "#fff7e7" : "#ffffff",
                                color: active
                                  ? "var(--ackret-gold-dark)"
                                  : "var(--ackret-navy)",
                                fontSize: "13px",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                cursor: "pointer",
                              }}
                            >
                              {choice === "na" ? "N/A" : choice}
                            </button>
                          );
                        })}
                      </div>

                      {answerObj.answer === "yes" ? (
                        <div style={{ marginTop: "14px" }}>
                          <label
                            style={{
                              display: "block",
                              marginBottom: "8px",
                              fontSize: "12px",
                              letterSpacing: "0.14em",
                              textTransform: "uppercase",
                              color: "var(--ackret-gold-dark)",
                            }}
                          >
                            Explain this yes response
                          </label>

                          <textarea
                            value={answerObj.explanation}
                            onChange={(e) =>
                              updateExplanation(question.id, e.target.value)
                            }
                            placeholder="Describe the issue, what happened, repairs made, dates if known, or any other relevant details."
                            rows={4}
                            style={textareaStyle}
                          />
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}

          <Card>
            <SectionHeading
              eyebrow="Additional Notes"
              title="Anything else you want included?"
            />

            <textarea
              value={form.notes}
              onChange={(e) => updateForm("notes", e.target.value)}
              rows={5}
              placeholder="Use this area for any additional notes you want to keep with the report draft."
              style={textareaStyle}
            />
          </Card>
        </div>

        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading
              eyebrow="Progress"
              title="Condition report summary"
            />

            <StatRow
              label="Questions in form"
              value={`${conditionReportQuestions.length}`}
            />
            <StatRow label="Yes responses" value={`${yesCount}`} />
            <StatRow
              label="Lead paint follow-up"
              value={
                form.builtBefore1978 === "yes"
                  ? "Needed"
                  : "Not needed / unknown"
              }
            />
            <StatRow
              label="Draft status"
              value={draftId ? "Saved" : "Not saved yet"}
            />
            <StatRow
              label="Next dashboard step"
              value="Lead Paint Disclosure"
              last
            />
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Actions"
              title="Save and continue"
            />

            <div style={{ display: "grid", gap: "12px" }}>
              <button
                type="button"
                onClick={handleSaveDraft}
                style={primaryButtonStyle}
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save Draft"}
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                style={secondaryActionButtonStyle}
                disabled={isSaving}
              >
                {isSaving ? "Working..." : "Save and Download PDF"}
              </button>

              <Link href={nextStep.href} style={{ textDecoration: "none" }}>
                <div style={secondaryButtonStyle}>Continue to Next Step</div>
              </Link>
            </div>

            <p
              style={{
                marginTop: "14px",
                marginBottom: 0,
                fontSize: "13px",
                lineHeight: 1.7,
                color: "var(--ackret-muted)",
              }}
            >
              This version saves your answers to the database and generates a
              downloadable PDF from the saved report.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

function groupQuestionsBySection(questions: typeof conditionReportQuestions) {
  const map = new Map<string, typeof conditionReportQuestions>();

  for (const question of questions) {
    if (!map.has(question.section)) {
      map.set(question.section, []);
    }
    map.get(question.section)!.push(question);
  }

  return Array.from(map.entries());
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "var(--ackret-surface)",
        border: "1px solid var(--ackret-border)",
        borderRadius: "24px",
        padding: "24px",
        boxShadow: "var(--ackret-shadow)",
      }}
    >
      {children}
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--ackret-gold-dark)",
        }}
      >
        {eyebrow}
      </p>

      <h2
        style={{
          marginTop: "10px",
          marginBottom: 0,
          fontSize: "28px",
          lineHeight: 1.15,
          color: "var(--ackret-navy)",
          fontWeight: 500,
        }}
      >
        {title}
      </h2>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  fullWidth = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  fullWidth?: boolean;
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: "8px",
        gridColumn: fullWidth ? "1 / -1" : undefined,
      }}
    >
      <span
        style={{
          fontSize: "12px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ackret-gold-dark)",
        }}
      >
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label style={{ display: "grid", gap: "8px" }}>
      <span
        style={{
          fontSize: "12px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ackret-gold-dark)",
        }}
      >
        {label}
      </span>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      >
        <option value="">Select one</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function StatRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        paddingBottom: last ? 0 : "12px",
        marginBottom: last ? 0 : "12px",
        borderBottom: last ? "none" : "1px solid rgba(22,58,112,0.10)",
      }}
    >
      <span
        style={{
          fontSize: "15px",
          color: "var(--ackret-muted)",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: "15px",
          color: "var(--ackret-navy)",
          fontWeight: 600,
          textAlign: "right",
        }}
      >
        {value}
      </span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  fontSize: "16px",
  borderRadius: "14px",
  border: "1px solid rgba(22,58,112,0.15)",
  outline: "none",
  background: "#ffffff",
  color: "var(--ackret-ink)",
  boxSizing: "border-box",
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  fontSize: "16px",
  borderRadius: "14px",
  border: "1px solid rgba(22,58,112,0.15)",
  outline: "none",
  background: "#ffffff",
  color: "var(--ackret-ink)",
  boxSizing: "border-box",
  resize: "vertical",
};

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderRadius: "999px",
  padding: "16px 20px",
  background: "var(--ackret-navy)",
  color: "#ffffff",
  fontSize: "13px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  cursor: "pointer",
  boxShadow: "var(--ackret-shadow)",
};

const secondaryActionButtonStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "999px",
  padding: "16px 20px",
  background: "#ffffff",
  color: "var(--ackret-navy)",
  border: "1px solid rgba(22,58,112,0.15)",
  fontSize: "13px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  cursor: "pointer",
  boxSizing: "border-box",
};

const secondaryButtonStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "999px",
  padding: "16px 20px",
  background: "transparent",
  color: "var(--ackret-gold-dark)",
  border: "1px solid rgba(197, 154, 74, 0.35)",
  fontSize: "13px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  textAlign: "center",
  boxSizing: "border-box",
};