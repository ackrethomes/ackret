"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardSteps } from "@/lib/dashboardSteps";
import { useSellerProfile } from "@/hooks/useSellerProfile";

type InspectionStatus =
  | "not-scheduled"
  | "scheduled"
  | "completed"
  | "resolved";

type InspectionIssue = {
  id: string;
  title: string;
  severity: "minor" | "moderate" | "major" | "";
  requestedAction: string;
  sellerResponse: "repair" | "credit" | "decline" | "undecided" | "";
  estimatedCost: string;
  agreedResolution: string;
  notes: string;
};

type InspectionFormState = {
  inspectionStatus: InspectionStatus;
  inspectionDate: string;
  inspectionWindow: string;
  buyerInspectorName: string;
  accessInstructions: string;
  utilitiesReady: "yes" | "no" | "";
  repairPreferences: string;
  creditPreferences: string;
  repairDeadline: string;
  contractorPlan: string;
  reinspectionNeeded: "yes" | "no" | "";
  reinspectionDate: string;
  finalInspectionNotes: string;
};

function createBlankIssue(id: string): InspectionIssue {
  return {
    id,
    title: "",
    severity: "",
    requestedAction: "",
    sellerResponse: "",
    estimatedCost: "",
    agreedResolution: "",
    notes: "",
  };
}

const initialFormState: InspectionFormState = {
  inspectionStatus: "not-scheduled",
  inspectionDate: "",
  inspectionWindow: "",
  buyerInspectorName: "",
  accessInstructions: "",
  utilitiesReady: "",
  repairPreferences: "",
  creditPreferences: "",
  repairDeadline: "",
  contractorPlan: "",
  reinspectionNeeded: "",
  reinspectionDate: "",
  finalInspectionNotes: "",
};

const initialIssuesState: InspectionIssue[] = [
  createBlankIssue("issue-1"),
  createBlankIssue("issue-2"),
];

export default function InspectionPage() {
  const router = useRouter();
  const { profile, loading, saving, error, saveProfile } = useSellerProfile();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [localSaveMessage, setLocalSaveMessage] = useState("Loading...");
  const hasLoadedProfileRef = useRef(false);

  const [form, setForm] = useState<InspectionFormState>(initialFormState);
  const [issues, setIssues] = useState<InspectionIssue[]>(initialIssuesState);

  const previousStep = dashboardSteps[5];
  const nextStep = dashboardSteps[7];

  function updateForm<K extends keyof InspectionFormState>(
    key: K,
    value: InspectionFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setLocalSaveMessage("Saving...");
  }

  function updateIssue(
    issueId: string,
    key: keyof InspectionIssue,
    value: string
  ) {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId
          ? {
              ...issue,
              [key]: value,
            }
          : issue
      )
    );
    setLocalSaveMessage("Saving...");
  }

  function addIssue() {
    setIssues((prev) => [...prev, createBlankIssue(`issue-${Date.now()}`)]);
    setLocalSaveMessage("Saving...");
  }

  function removeIssue(issueId: string) {
    setIssues((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((issue) => issue.id !== issueId);
    });
    setLocalSaveMessage("Saving...");
  }

  useEffect(() => {
    if (!profile || hasLoadedProfileRef.current) return;

    const saved = profile.progress?.inspection;

    if (saved) {
      setForm({
        ...initialFormState,
        ...(saved.form || {}),
      });

      if (Array.isArray(saved.issues) && saved.issues.length > 0) {
        setIssues(saved.issues);
      }

      setDraftId(saved.draftId ?? null);
    }

    hasLoadedProfileRef.current = true;
    setLocalSaveMessage("Saved");
  }, [profile]);

  useEffect(() => {
    if (!hasLoadedProfileRef.current) return;

    const timeout = setTimeout(async () => {
      const result = await saveProfile({
        currentStep: "inspection",
        progressPatch: {
          inspection: {
            form,
            issues,
            draftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
    }, 800);

    return () => clearTimeout(timeout);
  }, [form, issues, draftId, saveProfile]);

  const enteredIssues = useMemo(() => {
    return issues.filter(
      (issue) =>
        issue.title.trim() ||
        issue.requestedAction.trim() ||
        issue.agreedResolution.trim()
    );
  }, [issues]);

  const majorIssues = useMemo(
    () => enteredIssues.filter((issue) => issue.severity === "major").length,
    [enteredIssues]
  );

  const unresolvedIssues = useMemo(
    () =>
      enteredIssues.filter(
        (issue) =>
          !issue.agreedResolution.trim() ||
          issue.sellerResponse === "" ||
          issue.sellerResponse === "undecided"
      ).length,
    [enteredIssues]
  );

  const estimatedRepairTotal = useMemo(() => {
    const values = enteredIssues
      .map((issue) => parseCurrency(issue.estimatedCost))
      .filter((value): value is number => value !== null);

    if (!values.length) return null;
    return values.reduce((sum, value) => sum + value, 0);
  }, [enteredIssues]);

  async function handleSaveDraft() {
    try {
      setIsWorking(true);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const nextDraftId = draftId || `inspection-${Date.now()}`;
      setDraftId(nextDraftId);

      const result = await saveProfile({
        currentStep: "inspection",
        progressPatch: {
          inspection: {
            form,
            issues,
            draftId: nextDraftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
      alert("Inspection draft saved.");
    } catch (err) {
      console.error(err);
      alert("Unable to save inspection draft.");
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
          inspection: {
            form,
            issues,
            draftId,
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
          Loading your inspection step...
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
        Step 7 of 8
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
        Complete Inspection
      </h1>

      <p
        style={{
          margin: 0,
          maxWidth: "920px",
          fontSize: "18px",
          lineHeight: 1.8,
          color: "var(--ackret-muted)",
        }}
      >
        Track inspection timing, document buyer requests, and decide how you
        will respond to repairs, credits, or concessions. This step keeps the
        inspection phase organized so it does not derail your closing.
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
        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading eyebrow="Inspection Snapshot" title="Current status" />

            <StatRow
              label="Inspection status"
              value={inspectionStatusLabel(form.inspectionStatus)}
            />
            <StatRow label="Issues entered" value={`${enteredIssues.length}`} />
            <StatRow label="Major issues" value={`${majorIssues}`} />
            <StatRow label="Unresolved items" value={`${unresolvedIssues}`} />
            <StatRow
              label="Estimated total"
              value={estimatedRepairTotal ? formatCurrency(estimatedRepairTotal) : "Not set"}
              last
            />
          </Card>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <Card>
            <SectionHeading
              eyebrow="Inspection Summary"
              title="Keep the phase organized from start to finish"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <SummaryTile
                label="Inspection date"
                value={form.inspectionDate || "Not scheduled"}
              />
              <SummaryTile
                label="Inspection status"
                value={inspectionStatusLabel(form.inspectionStatus)}
              />
              <SummaryTile
                label="Reinspection"
                value={
                  form.reinspectionNeeded === "yes"
                    ? form.reinspectionDate || "Needed"
                    : form.reinspectionNeeded === "no"
                      ? "Not needed"
                      : "Not decided"
                }
              />
              <SummaryTile
                label="Estimated repair total"
                value={estimatedRepairTotal ? formatCurrency(estimatedRepairTotal) : "Not set"}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Inspection Setup"
              title="Document the timing and logistics"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <SelectField
                label="Inspection Status"
                value={form.inspectionStatus}
                onChange={(value) =>
                  updateForm(
                    "inspectionStatus",
                    value as InspectionFormState["inspectionStatus"]
                  )
                }
                options={[
                  { value: "not-scheduled", label: "Not scheduled" },
                  { value: "scheduled", label: "Scheduled" },
                  { value: "completed", label: "Completed" },
                  { value: "resolved", label: "Resolved" },
                ]}
              />

              <Field
                label="Inspection Date"
                type="date"
                value={form.inspectionDate}
                onChange={(value) => updateForm("inspectionDate", value)}
              />

              <Field
                label="Inspection Window / Time"
                value={form.inspectionWindow}
                onChange={(value) => updateForm("inspectionWindow", value)}
                placeholder="Example: 9am–12pm"
              />

              <Field
                label="Buyer Inspector Name"
                value={form.buyerInspectorName}
                onChange={(value) => updateForm("buyerInspectorName", value)}
                placeholder="Inspector or company"
              />

              <SelectField
                label="Utilities Ready for Inspection?"
                value={form.utilitiesReady}
                onChange={(value) =>
                  updateForm(
                    "utilitiesReady",
                    value as InspectionFormState["utilitiesReady"]
                  )
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />

              <Field
                label="Repair Deadline"
                type="date"
                value={form.repairDeadline}
                onChange={(value) => updateForm("repairDeadline", value)}
              />

              <TextAreaField
                label="Access Instructions"
                value={form.accessInstructions}
                onChange={(value) => updateForm("accessInstructions", value)}
                placeholder="Garage code, pet instructions, alarm notes, basement access, attic access, etc."
                rows={4}
                fullWidth
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Inspection Issues"
              title="Track each requested repair, credit, or concern"
            />

            <div style={{ display: "grid", gap: "18px" }}>
              {issues.map((issue, index) => (
                <div
                  key={issue.id}
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
                      alignItems: "center",
                      marginBottom: "14px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--ackret-gold-dark)",
                      }}
                    >
                      Issue {index + 1}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeIssue(issue.id)}
                      style={smallGhostButtonStyle}
                    >
                      Remove
                    </button>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                      gap: "14px",
                    }}
                  >
                    <Field
                      label="Issue Title"
                      value={issue.title}
                      onChange={(value) => updateIssue(issue.id, "title", value)}
                      placeholder="Example: Roof flashing, furnace, radon, GFCI issue"
                      fullWidth
                    />

                    <SelectField
                      label="Severity"
                      value={issue.severity}
                      onChange={(value) => updateIssue(issue.id, "severity", value)}
                      options={[
                        { value: "minor", label: "Minor" },
                        { value: "moderate", label: "Moderate" },
                        { value: "major", label: "Major" },
                      ]}
                    />

                    <SelectField
                      label="Seller Response"
                      value={issue.sellerResponse}
                      onChange={(value) =>
                        updateIssue(issue.id, "sellerResponse", value)
                      }
                      options={[
                        { value: "repair", label: "Repair" },
                        { value: "credit", label: "Credit" },
                        { value: "decline", label: "Decline" },
                        { value: "undecided", label: "Undecided" },
                      ]}
                    />

                    <Field
                      label="Estimated Cost"
                      value={issue.estimatedCost}
                      onChange={(value) => updateIssue(issue.id, "estimatedCost", value)}
                      placeholder="1500"
                    />

                    <TextAreaField
                      label="Buyer Requested Action"
                      value={issue.requestedAction}
                      onChange={(value) =>
                        updateIssue(issue.id, "requestedAction", value)
                      }
                      placeholder="What exactly did the buyer request?"
                      rows={3}
                      fullWidth
                    />

                    <TextAreaField
                      label="Agreed Resolution"
                      value={issue.agreedResolution}
                      onChange={(value) =>
                        updateIssue(issue.id, "agreedResolution", value)
                      }
                      placeholder="What was ultimately agreed to?"
                      rows={3}
                      fullWidth
                    />

                    <TextAreaField
                      label="Notes"
                      value={issue.notes}
                      onChange={(value) => updateIssue(issue.id, "notes", value)}
                      placeholder="Contractor input, timing, risk, negotiation notes, etc."
                      rows={3}
                      fullWidth
                    />
                  </div>
                </div>
              ))}

              <button type="button" onClick={addIssue} style={secondaryActionButtonStyle}>
                Add Another Inspection Issue
              </button>
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Resolution Plan"
              title="Document how you plan to get through inspection"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "18px",
              }}
            >
              <TextAreaField
                label="Repair Preferences"
                value={form.repairPreferences}
                onChange={(value) => updateForm("repairPreferences", value)}
                placeholder="Which kinds of issues are you willing to repair before closing?"
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Credit Preferences"
                value={form.creditPreferences}
                onChange={(value) => updateForm("creditPreferences", value)}
                placeholder="When would you rather give a credit instead of making the repair?"
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Contractor / Vendor Plan"
                value={form.contractorPlan}
                onChange={(value) => updateForm("contractorPlan", value)}
                placeholder="Who will handle repairs, bids, scheduling, receipts, and documentation?"
                rows={4}
                fullWidth
              />

              <SelectField
                label="Reinspection Needed?"
                value={form.reinspectionNeeded}
                onChange={(value) =>
                  updateForm(
                    "reinspectionNeeded",
                    value as InspectionFormState["reinspectionNeeded"]
                  )
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />

              <Field
                label="Reinspection Date"
                type="date"
                value={form.reinspectionDate}
                onChange={(value) => updateForm("reinspectionDate", value)}
              />

              <TextAreaField
                label="Final Inspection Notes"
                value={form.finalInspectionNotes}
                onChange={(value) => updateForm("finalInspectionNotes", value)}
                placeholder="Summarize what still needs to happen before moving to closing."
                rows={5}
                fullWidth
              />
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading eyebrow="Progress" title="Inspection checklist" />

            <StatRow
              label="Inspection status"
              value={inspectionStatusLabel(form.inspectionStatus)}
            />
            <StatRow label="Issues entered" value={`${enteredIssues.length}`} />
            <StatRow label="Major issues" value={`${majorIssues}`} />
            <StatRow label="Unresolved items" value={`${unresolvedIssues}`} />
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
            <SectionHeading eyebrow="Actions" title="Save and continue" />

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
                onClick={handleContinue}
                style={secondaryButtonButtonStyle}
                disabled={isWorking || saving}
              >
                Continue to Next Step
              </button>

              <Link href={previousStep.href} style={{ textDecoration: "none" }}>
                <div style={secondaryActionButtonStyle}>Previous Step</div>
              </Link>
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
                The goal here is to resolve inspection issues clearly and keep the
                file organized before the closing step.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function inspectionStatusLabel(value: InspectionStatus): string {
  if (value === "not-scheduled") return "Not scheduled";
  if (value === "scheduled") return "Scheduled";
  if (value === "completed") return "Completed";
  if (value === "resolved") return "Resolved";
  return "Not set";
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
  options: Array<{ value: string; label: string }>;
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
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows,
  fullWidth = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows: number;
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

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        style={textareaStyle}
      />
    </label>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        borderRadius: "18px",
        padding: "18px",
        background: "#fbfbf9",
        border: "1px solid rgba(22,58,112,0.08)",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ackret-gold-dark)",
        }}
      >
        {label}
      </div>

      <div
        style={{
          marginTop: "10px",
          fontSize: "24px",
          lineHeight: 1.2,
          color: "var(--ackret-navy)",
          fontWeight: 600,
        }}
      >
        {value}
      </div>
    </div>
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

function parseCurrency(value: string): number | null {
  const cleaned = value.replace(/[^0-9.]/g, "").trim();
  if (!cleaned) return null;

  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
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
  textAlign: "center",
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

const smallGhostButtonStyle: React.CSSProperties = {
  borderRadius: "999px",
  padding: "8px 12px",
  background: "transparent",
  color: "var(--ackret-muted)",
  border: "1px solid rgba(22,58,112,0.12)",
  fontSize: "11px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
};