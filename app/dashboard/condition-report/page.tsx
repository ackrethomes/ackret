"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { conditionReportQuestions } from "@/lib/conditionReportQuestions";
import { dashboardSteps } from "@/lib/dashboardSteps";
import { useSellerProfile } from "@/hooks/useSellerProfile";

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

function createInitialAnswers(): AnswersState {
  const initial: AnswersState = {};
  for (const question of conditionReportQuestions) {
    initial[question.id] = {
      answer: "",
      explanation: "",
    };
  }
  return initial;
}

const initialFormState: FormState = {
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
};

export default function ConditionReportPage() {
  const router = useRouter();
  const { profile, loading, saving, error, saveProfile } = useSellerProfile();

  const [form, setForm] = useState<FormState>(initialFormState);

  const [answers, setAnswers] = useState<AnswersState>(() => createInitialAnswers());

  const [draftId, setDraftId] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [openSection, setOpenSection] = useState<string>(
    groupedSections[0]?.[0] ?? ""
  );
  const [localSaveMessage, setLocalSaveMessage] = useState("Loading...");
  const hasLoadedProfileRef = useRef(false);

  const yesCount = useMemo(() => {
    return Object.values(answers).filter((item) => item.answer === "yes").length;
  }, [answers]);

  const sectionStats = useMemo(() => {
    return groupedSections.map(([sectionName, questions]) => {
      const answered = questions.filter(
        (q) => answers[q.id] && answers[q.id].answer !== ""
      ).length;

      const yeses = questions.filter(
        (q) => answers[q.id] && answers[q.id].answer === "yes"
      ).length;

      return {
        sectionName,
        total: questions.length,
        answered,
        yeses,
        complete: answered === questions.length,
      };
    });
  }, [answers]);

  const answeredCount = useMemo(() => {
    return Object.values(answers).filter((item) => item.answer !== "").length;
  }, [answers]);

  const totalQuestionCount = conditionReportQuestions.length;
  const nextStep = dashboardSteps[1];

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setLocalSaveMessage("Saving...");
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
    setLocalSaveMessage("Saving...");
  }

  function updateExplanation(questionId: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        explanation: value,
      },
    }));
    setLocalSaveMessage("Saving...");
  }

  useEffect(() => {
    if (!profile || hasLoadedProfileRef.current) return;

    const saved = profile.progress?.conditionReport;

    if (saved) {
      setForm({
        ...initialFormState,
        ...(saved.form || {}),
      });

      const mergedAnswers = createInitialAnswers();
      const savedAnswers = saved.answers || {};

      for (const question of conditionReportQuestions) {
        if (savedAnswers[question.id]) {
          mergedAnswers[question.id] = {
            answer: savedAnswers[question.id].answer ?? "",
            explanation: savedAnswers[question.id].explanation ?? "",
          };
        }
      }

      setAnswers(mergedAnswers);
      setDraftId(saved.draftId ?? null);
      if (saved.openSection) {
        setOpenSection(saved.openSection);
      }
    }

    hasLoadedProfileRef.current = true;
    setLocalSaveMessage("Saved");
  }, [profile]);

  useEffect(() => {
    if (!hasLoadedProfileRef.current) return;

    const timeout = setTimeout(async () => {
      const result = await saveProfile({
        currentStep: "condition-report",
        progressPatch: {
          conditionReport: {
            form,
            answers,
            draftId,
            openSection,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
    }, 800);

    return () => clearTimeout(timeout);
  }, [form, answers, draftId, openSection]);

  async function handleSaveDraft() {
    try {
      setIsWorking(true);

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

      const result = await saveProfile({
        currentStep: "condition-report",
        progressPatch: {
          conditionReport: {
            form,
            answers,
            draftId: data.id,
            openSection,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
      alert("Draft saved.");
    } catch (err) {
      console.error(err);
      alert("Unable to save draft.");
    } finally {
      setIsWorking(false);
    }
  }

  async function handleDownloadPdf() {
    try {
      setIsWorking(true);

      const response = await fetch("/api/condition-report/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form,
          answers,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "Failed to generate PDF.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Unable to generate PDF.");
    } finally {
      setIsWorking(false);
    }
  }

  async function handleContinue() {
    try {
      setIsWorking(true);

      const nextSlug = nextStep.href.replace("/dashboard/", "");

      const result = await saveProfile({
        currentStep: nextSlug,
        progressPatch: {
          conditionReport: {
            form,
            answers,
            draftId,
            openSection,
          },
        },
      });

      if (!result) {
        setLocalSaveMessage("Save failed");
        alert("Unable to save your progress before continuing.");
        return;
      }

      setLocalSaveMessage("Saved");
      router.push(nextStep.href);
    } catch (err) {
      console.error(err);
      alert("Unable to continue right now.");
    } finally {
      setIsWorking(false);
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: "1180px", paddingTop: "24px" }}>
        <p style={{ color: "var(--ackret-muted)", fontSize: "16px" }}>
          Loading your condition report...
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1180px" }}>
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
          maxWidth: "900px",
          fontSize: "18px",
          lineHeight: 1.8,
          color: "var(--ackret-muted)",
        }}
      >
        Complete the property details first, then work section by section through
        the Wisconsin disclosure questions. You only need to write explanations
        for answers marked Yes.
      </p>

      <div
        style={{
          marginTop: "28px",
          display: "grid",
          gridTemplateColumns: "0.9fr 1.6fr 0.8fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        {/* LEFT NAV */}
        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading eyebrow="Sections" title="Jump to a section" />

            <div style={{ display: "grid", gap: "10px" }}>
              {sectionStats.map((section, index) => {
                const isOpen = openSection === section.sectionName;

                return (
                  <button
                    key={section.sectionName}
                    type="button"
                    onClick={() => {
                      setOpenSection(section.sectionName);
                      setLocalSaveMessage("Saving...");
                    }}
                    style={{
                      textAlign: "left",
                      borderRadius: "16px",
                      padding: "14px",
                      border: isOpen
                        ? "1px solid rgba(197,154,74,0.45)"
                        : "1px solid rgba(22,58,112,0.10)",
                      background: isOpen ? "#fffaf0" : "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        alignItems: "center",
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
                        Section {index + 1}
                      </span>

                      <span
                        style={{
                          fontSize: "12px",
                          color: section.complete
                            ? "var(--ackret-navy)"
                            : "var(--ackret-muted)",
                          fontWeight: 600,
                        }}
                      >
                        {section.answered}/{section.total}
                      </span>
                    </div>

                    <div
                      style={{
                        marginTop: "8px",
                        fontSize: "15px",
                        lineHeight: 1.45,
                        color: "var(--ackret-ink)",
                        fontWeight: isOpen ? 600 : 500,
                      }}
                    >
                      {section.sectionName}
                    </div>

                    {section.yeses > 0 ? (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "13px",
                          color: "var(--ackret-muted)",
                        }}
                      >
                        {section.yeses} yes response{section.yeses === 1 ? "" : "s"}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        {/* CENTER CONTENT */}
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

          {groupedSections.map(([sectionName, questions]) => {
            const isOpen = openSection === sectionName;
            const section = sectionStats.find((s) => s.sectionName === sectionName);

            return (
              <Card key={sectionName}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenSection(sectionName);
                    setLocalSaveMessage("Saving...");
                  }}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "16px",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <SectionHeading
                        eyebrow="Disclosure Section"
                        title={sectionName}
                      />
                    </div>

                    <div
                      style={{
                        paddingTop: "6px",
                        textAlign: "right",
                        minWidth: "90px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--ackret-muted)",
                          fontWeight: 600,
                        }}
                      >
                        {section?.answered}/{section?.total}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--ackret-gold-dark)",
                          marginTop: "4px",
                        }}
                      >
                        {isOpen ? "Open" : "Closed"}
                      </div>
                    </div>
                  </div>
                </button>

                {isOpen ? (
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
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "16px",
                              alignItems: "start",
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

                            <span
                              style={{
                                whiteSpace: "nowrap",
                                fontSize: "12px",
                                color: "var(--ackret-muted)",
                              }}
                            >
                              {question.id.toUpperCase()}
                            </span>
                          </div>

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
                ) : (
                  <div
                    style={{
                      marginTop: "-4px",
                      fontSize: "14px",
                      color: "var(--ackret-muted)",
                    }}
                  >
                    Click to open this section and answer {questions.length} question
                    {questions.length === 1 ? "" : "s"}.
                  </div>
                )}
              </Card>
            );
          })}

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

        {/* RIGHT SUMMARY */}
        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading
              eyebrow="Progress"
              title="Condition report summary"
            />

            <StatRow label="Questions in form" value={`${totalQuestionCount}`} />
            <StatRow label="Answered" value={`${answeredCount}`} />
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
              label="Save status"
              value={saving ? "Saving..." : localSaveMessage}
            />
            <StatRow
              label="Draft status"
              value={draftId ? "Saved" : "Not saved yet"}
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
                disabled={isWorking || saving}
              >
                {isWorking ? "Saving..." : "Save Draft"}
              </button>

              <button
                type="button"
                onClick={handleDownloadPdf}
                style={secondaryActionButtonStyle}
                disabled={isWorking || saving}
              >
                {isWorking ? "Working..." : "Save and Download PDF"}
              </button>

              <button
                type="button"
                onClick={handleContinue}
                style={secondaryButtonButtonStyle}
                disabled={isWorking || saving}
              >
                Continue to Next Step
              </button>
            </div>

            {error ? (
              <p
                style={{
                  marginTop: "14px",
                  marginBottom: 0,
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "#b42318",
                }}
              >
                {error}
              </p>
            ) : (
              <p
                style={{
                  marginTop: "14px",
                  marginBottom: 0,
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "var(--ackret-muted)",
                }}
              >
                The layout is section-based so the full Wisconsin report stays
                manageable even with the complete official question set.
              </p>
            )}
          </Card>

          <div style={{ display: "none" }}>
            <Link href={nextStep.href}>Next</Link>
          </div>
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

const secondaryButtonButtonStyle: React.CSSProperties = {
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
  cursor: "pointer",
};