"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { dashboardSteps } from "@/lib/dashboardSteps";
import { useSellerProfile } from "@/hooks/useSellerProfile";

type ClosingStatus =
  | "not-started"
  | "scheduled"
  | "documents-in-progress"
  | "clear-to-close"
  | "closed";

type ClosingTask = {
  id: string;
  title: string;
  status: "not-started" | "in-progress" | "complete";
  notes: string;
};

type ClosingFormState = {
  closingStatus: ClosingStatus;
  closingDate: string;
  closingTime: string;
  closingLocation: string;
  titleCompany: string;
  titleOfficer: string;
  attorneyName: string;
  buyerLender: string;
  finalWalkthroughDate: string;
  possessionDate: string;
  utilitiesTransferPlan: string;
  payoffNotes: string;
  proceedsPlan: string;
  keysGarageOpenersPlan: string;
  documentsStillNeeded: string;
  sellerClosingCostsEstimate: string;
  finalQuestions: string;
  closingNotes: string;
};

function createBlankTask(id: string, title: string): ClosingTask {
  return {
    id,
    title,
    status: "not-started",
    notes: "",
  };
}

const initialTasks: ClosingTask[] = [
  createBlankTask("title", "Title work reviewed"),
  createBlankTask("payoff", "Mortgage payoff confirmed"),
  createBlankTask("utilities", "Utilities transfer planned"),
  createBlankTask("walkthrough", "Final walkthrough scheduled"),
  createBlankTask("keys", "Keys / garage openers ready"),
  createBlankTask("closing-docs", "Closing documents reviewed"),
];

const initialFormState: ClosingFormState = {
  closingStatus: "not-started",
  closingDate: "",
  closingTime: "",
  closingLocation: "",
  titleCompany: "",
  titleOfficer: "",
  attorneyName: "",
  buyerLender: "",
  finalWalkthroughDate: "",
  possessionDate: "",
  utilitiesTransferPlan: "",
  payoffNotes: "",
  proceedsPlan: "",
  keysGarageOpenersPlan: "",
  documentsStillNeeded: "",
  sellerClosingCostsEstimate: "",
  finalQuestions: "",
  closingNotes: "",
};

export default function ClosingPage() {
  const { profile, loading, saving, error, saveProfile } = useSellerProfile();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [localSaveMessage, setLocalSaveMessage] = useState("Loading...");
  const hasLoadedProfileRef = useRef(false);

  const [form, setForm] = useState<ClosingFormState>(initialFormState);
  const [tasks, setTasks] = useState<ClosingTask[]>(initialTasks);

  const previousStep = dashboardSteps[6];

  function updateForm<K extends keyof ClosingFormState>(
    key: K,
    value: ClosingFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setLocalSaveMessage("Saving...");
  }

  function updateTask(
    taskId: string,
    key: keyof ClosingTask,
    value: string
  ) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              [key]: value,
            }
          : task
      )
    );
    setLocalSaveMessage("Saving...");
  }

  useEffect(() => {
    if (!profile || hasLoadedProfileRef.current) return;

    const saved = profile.progress?.closing;

    if (saved) {
      setForm({
        ...initialFormState,
        ...(saved.form || {}),
      });

      if (Array.isArray(saved.tasks) && saved.tasks.length > 0) {
        setTasks(saved.tasks);
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
        currentStep: "closing",
        progressPatch: {
          closing: {
            form,
            tasks,
            draftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
    }, 800);

    return () => clearTimeout(timeout);
  }, [form, tasks, draftId, saveProfile]);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.status === "complete").length,
    [tasks]
  );

  const inProgressTasks = useMemo(
    () => tasks.filter((task) => task.status === "in-progress").length,
    [tasks]
  );

  const closingCostsDisplay = useMemo(() => {
    if (!form.sellerClosingCostsEstimate.trim()) return "Not set";
    return formatCurrencyString(form.sellerClosingCostsEstimate);
  }, [form.sellerClosingCostsEstimate]);

  async function handleSaveDraft() {
    try {
      setIsWorking(true);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const nextDraftId = draftId || `closing-${Date.now()}`;
      setDraftId(nextDraftId);

      const result = await saveProfile({
        currentStep: "closing",
        progressPatch: {
          closing: {
            form,
            tasks,
            draftId: nextDraftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
      alert("Closing draft saved.");
    } catch (err) {
      console.error(err);
      alert("Unable to save closing draft.");
    } finally {
      setIsWorking(false);
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: "1180px", paddingTop: "24px" }}>
        <p style={{ color: "var(--ackret-muted)", fontSize: "16px" }}>
          Loading your closing step...
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
        Step 8 of 8
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
        Closing
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
        Organize the last details before closing day so nothing gets missed.
        Track the title company, timeline, walkthrough, utilities, keys,
        documents, and final questions before the sale is complete.
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
            <SectionHeading eyebrow="Closing Snapshot" title="Where things stand" />

            <StatRow
              label="Closing status"
              value={closingStatusLabel(form.closingStatus)}
            />
            <StatRow label="Tasks complete" value={`${completedTasks}`} />
            <StatRow label="Tasks in progress" value={`${inProgressTasks}`} />
            <StatRow
              label="Closing date"
              value={form.closingDate || "Not set"}
            />
            <StatRow
              label="Estimated seller costs"
              value={closingCostsDisplay}
              last
            />
          </Card>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <Card>
            <SectionHeading
              eyebrow="Closing Summary"
              title="Final transaction details at a glance"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <SummaryTile
                label="Closing date"
                value={form.closingDate || "Not set"}
              />
              <SummaryTile
                label="Closing status"
                value={closingStatusLabel(form.closingStatus)}
              />
              <SummaryTile
                label="Final walkthrough"
                value={form.finalWalkthroughDate || "Not set"}
              />
              <SummaryTile
                label="Seller costs"
                value={closingCostsDisplay}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Closing Logistics"
              title="Document the who, where, and when"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <SelectField
                label="Closing Status"
                value={form.closingStatus}
                onChange={(value) =>
                  updateForm(
                    "closingStatus",
                    value as ClosingFormState["closingStatus"]
                  )
                }
                options={[
                  { value: "not-started", label: "Not started" },
                  { value: "scheduled", label: "Scheduled" },
                  { value: "documents-in-progress", label: "Documents in progress" },
                  { value: "clear-to-close", label: "Clear to close" },
                  { value: "closed", label: "Closed" },
                ]}
              />

              <Field
                label="Closing Date"
                type="date"
                value={form.closingDate}
                onChange={(value) => updateForm("closingDate", value)}
              />

              <Field
                label="Closing Time"
                value={form.closingTime}
                onChange={(value) => updateForm("closingTime", value)}
                placeholder="Example: 10:00 AM"
              />

              <Field
                label="Closing Location"
                value={form.closingLocation}
                onChange={(value) => updateForm("closingLocation", value)}
                placeholder="Title company office or attorney office"
              />

              <Field
                label="Title Company"
                value={form.titleCompany}
                onChange={(value) => updateForm("titleCompany", value)}
                placeholder="Company name"
              />

              <Field
                label="Title Officer / Contact"
                value={form.titleOfficer}
                onChange={(value) => updateForm("titleOfficer", value)}
                placeholder="Contact person"
              />

              <Field
                label="Attorney Name"
                value={form.attorneyName}
                onChange={(value) => updateForm("attorneyName", value)}
                placeholder="Optional"
              />

              <Field
                label="Buyer Lender"
                value={form.buyerLender}
                onChange={(value) => updateForm("buyerLender", value)}
                placeholder="Bank or lender"
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Move-Out + Transfer Plan"
              title="Make the handoff smooth"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "18px",
              }}
            >
              <Field
                label="Final Walkthrough Date"
                type="date"
                value={form.finalWalkthroughDate}
                onChange={(value) => updateForm("finalWalkthroughDate", value)}
              />

              <Field
                label="Possession Date"
                type="date"
                value={form.possessionDate}
                onChange={(value) => updateForm("possessionDate", value)}
              />

              <TextAreaField
                label="Utilities Transfer Plan"
                value={form.utilitiesTransferPlan}
                onChange={(value) => updateForm("utilitiesTransferPlan", value)}
                placeholder="Gas, electric, water, trash, internet, HOA notifications, etc."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Keys / Garage Openers Plan"
                value={form.keysGarageOpenersPlan}
                onChange={(value) =>
                  updateForm("keysGarageOpenersPlan", value)
                }
                placeholder="What needs to be handed over and where it will be left."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Proceeds Plan"
                value={form.proceedsPlan}
                onChange={(value) => updateForm("proceedsPlan", value)}
                placeholder="Wire instructions, cashier’s check, account destination, etc."
                rows={4}
                fullWidth
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Closing Checklist"
              title="Track the last important items"
            />

            <div style={{ display: "grid", gap: "16px" }}>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  style={{
                    border: "1px solid rgba(22,58,112,0.10)",
                    borderRadius: "18px",
                    padding: "18px",
                    background: "#fbfbf9",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1.1fr 0.8fr",
                      gap: "16px",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "16px",
                          lineHeight: 1.5,
                          color: "var(--ackret-ink)",
                          fontWeight: 500,
                        }}
                      >
                        {task.title}
                      </div>

                      <div style={{ marginTop: "14px" }}>
                        <TextAreaField
                          label="Notes"
                          value={task.notes}
                          onChange={(value) => updateTask(task.id, "notes", value)}
                          placeholder="Add any details or reminders for this task."
                          rows={3}
                          fullWidth
                        />
                      </div>
                    </div>

                    <SelectField
                      label="Status"
                      value={task.status}
                      onChange={(value) => updateTask(task.id, "status", value)}
                      options={[
                        { value: "not-started", label: "Not started" },
                        { value: "in-progress", label: "In progress" },
                        { value: "complete", label: "Complete" },
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Final Notes"
              title="Document anything that still needs attention"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "18px",
              }}
            >
              <Field
                label="Estimated Seller Closing Costs"
                value={form.sellerClosingCostsEstimate}
                onChange={(value) =>
                  updateForm("sellerClosingCostsEstimate", value)
                }
                placeholder="Example: 4500"
              />

              <TextAreaField
                label="Payoff Notes"
                value={form.payoffNotes}
                onChange={(value) => updateForm("payoffNotes", value)}
                placeholder="Mortgage payoff, lien items, or anything still being confirmed."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Documents Still Needed"
                value={form.documentsStillNeeded}
                onChange={(value) => updateForm("documentsStillNeeded", value)}
                placeholder="Any missing forms, IDs, receipts, title docs, affidavits, etc."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Final Questions"
                value={form.finalQuestions}
                onChange={(value) => updateForm("finalQuestions", value)}
                placeholder="Anything still unclear before closing day."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Closing Notes"
                value={form.closingNotes}
                onChange={(value) => updateForm("closingNotes", value)}
                placeholder="Final reminders, deal notes, and anything you want recorded for this step."
                rows={5}
                fullWidth
              />
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading eyebrow="Progress" title="Closing checklist" />

            <StatRow
              label="Closing status"
              value={closingStatusLabel(form.closingStatus)}
            />
            <StatRow label="Tasks complete" value={`${completedTasks}`} />
            <StatRow label="Tasks in progress" value={`${inProgressTasks}`} />
            <StatRow label="Closing date" value={form.closingDate || "Not set"} />
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
            <SectionHeading eyebrow="Actions" title="Save and finish" />

            <div style={{ display: "grid", gap: "12px" }}>
              <button
                type="button"
                onClick={handleSaveDraft}
                style={primaryButtonStyle}
                disabled={isWorking || saving}
              >
                {isWorking ? "Saving..." : "Save Draft"}
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
                This final step is about making closing day organized, smooth,
                and free of avoidable surprises.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function closingStatusLabel(value: ClosingStatus): string {
  if (value === "not-started") return "Not started";
  if (value === "scheduled") return "Scheduled";
  if (value === "documents-in-progress") return "Documents in progress";
  if (value === "clear-to-close") return "Clear to close";
  if (value === "closed") return "Closed";
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

function formatCurrencyString(value: string): string {
  const parsed = parseCurrency(value);
  if (parsed === null) return value;
  return formatCurrency(parsed);
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