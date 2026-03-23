"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardSteps } from "@/lib/dashboardSteps";
import { useSellerProfile } from "@/hooks/useSellerProfile";

type ShowingMode = "open-house" | "appointment" | "flexible" | "";

type ListingReadinessState = {
  listingHeadline: string;
  publicDescription: string;
  privateNotes: string;
  mlsDescriptionDraft: string;
  listDate: string;
  showingMode: ShowingMode;
  showingInstructions: string;
  occupancyStatus: "owner-occupied" | "vacant" | "tenant-occupied" | "";
  availableDate: string;
  lockboxPlan: "yes" | "no" | "";
  yardSignPlan: "yes" | "no" | "";
  onlinePostingPlan: "yes" | "no" | "";
  buyerAgentCommissionPlan: string;
  inclusions: string;
  exclusions: string;
  financingNotes: string;
  offerDeadline: string;
};

type ListingChannel = {
  id: string;
  label: string;
  planned: boolean;
  notes: string;
};

const initialChannels: ListingChannel[] = [
  { id: "mls", label: "MLS listing service", planned: true, notes: "" },
  {
    id: "zillow",
    label: "Zillow / Homes.com / consumer portals",
    planned: true,
    notes: "",
  },
  {
    id: "facebook",
    label: "Facebook Marketplace / local groups",
    planned: false,
    notes: "",
  },
  { id: "yard-sign", label: "Yard sign + local traffic", planned: true, notes: "" },
  { id: "email", label: "Share by email / word of mouth", planned: false, notes: "" },
];

const initialFormState: ListingReadinessState = {
  listingHeadline: "",
  publicDescription: "",
  privateNotes: "",
  mlsDescriptionDraft: "",
  listDate: "",
  showingMode: "",
  showingInstructions: "",
  occupancyStatus: "",
  availableDate: "",
  lockboxPlan: "",
  yardSignPlan: "",
  onlinePostingPlan: "",
  buyerAgentCommissionPlan: "",
  inclusions: "",
  exclusions: "",
  financingNotes: "",
  offerDeadline: "",
};

export default function ListHomePage() {
  const router = useRouter();
  const { profile, loading, saving, error, saveProfile } = useSellerProfile();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [localSaveMessage, setLocalSaveMessage] = useState("Loading...");
  const hasLoadedProfileRef = useRef(false);

  const [form, setForm] = useState<ListingReadinessState>(initialFormState);
  const [channels, setChannels] = useState<ListingChannel[]>(initialChannels);

  const previousStep = dashboardSteps[2];
  const nextStep = dashboardSteps[4];

  function updateForm<K extends keyof ListingReadinessState>(
    key: K,
    value: ListingReadinessState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setLocalSaveMessage("Saving...");
  }

  function updateChannel(
    id: string,
    key: keyof ListingChannel,
    value: boolean | string
  ) {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === id
          ? {
              ...channel,
              [key]: value,
            }
          : channel
      )
    );
    setLocalSaveMessage("Saving...");
  }

  useEffect(() => {
    if (!profile || hasLoadedProfileRef.current) return;

    const saved = profile.progress?.listHome;

    if (saved) {
      setForm({
        ...initialFormState,
        ...(saved.form || {}),
      });

      if (Array.isArray(saved.channels) && saved.channels.length > 0) {
        setChannels(saved.channels);
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
        currentStep: "list-home",
        progressPatch: {
          listHome: {
            form,
            channels,
            draftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
    }, 800);

    return () => clearTimeout(timeout);
  }, [form, channels, draftId]);

  const plannedChannelsCount = useMemo(
    () => channels.filter((channel) => channel.planned).length,
    [channels]
  );

  const headlineReady = form.listingHeadline.trim().length > 0;
  const descriptionReady = form.publicDescription.trim().length > 0;
  const showingReady =
    form.showingMode !== "" && form.showingInstructions.trim().length > 0;
  const listDateReady = form.listDate.trim().length > 0;

  const readinessScore = useMemo(() => {
    let score = 0;
    if (headlineReady) score += 1;
    if (descriptionReady) score += 1;
    if (showingReady) score += 1;
    if (listDateReady) score += 1;
    if (plannedChannelsCount > 0) score += 1;
    return score;
  }, [headlineReady, descriptionReady, showingReady, listDateReady, plannedChannelsCount]);

  const readinessLabel = useMemo(() => {
    if (readinessScore <= 1) return "Just getting started";
    if (readinessScore <= 3) return "Partially ready";
    if (readinessScore <= 4) return "Nearly ready";
    return "Ready to list";
  }, [readinessScore]);

  async function handleSaveDraft() {
    try {
      setIsWorking(true);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const nextDraftId = draftId || `list-home-${Date.now()}`;
      setDraftId(nextDraftId);

      const result = await saveProfile({
        currentStep: "list-home",
        progressPatch: {
          listHome: {
            form,
            channels,
            draftId: nextDraftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
      alert("Listing draft saved.");
    } catch (err) {
      console.error(err);
      alert("Unable to save listing draft.");
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
          listHome: {
            form,
            channels,
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
          Loading your listing step...
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
        Step 4 of 8
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
        List the Home
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
        Turn your pricing decision into a real listing plan. Decide where the
        home will be posted, how buyers will schedule showings, what details
        will appear publicly, and what listing terms you want in place before
        offers arrive.
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
            <SectionHeading eyebrow="Readiness" title="Listing status" />

            <StatRow label="Listing channels planned" value={`${plannedChannelsCount}`} />
            <StatRow label="Headline drafted" value={headlineReady ? "Yes" : "No"} />
            <StatRow label="Description drafted" value={descriptionReady ? "Yes" : "No"} />
            <StatRow label="Showing plan set" value={showingReady ? "Yes" : "No"} />
            <StatRow label="Planned list date" value={listDateReady ? "Yes" : "No"} />
            <StatRow label="Overall status" value={readinessLabel} last />
          </Card>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <Card>
            <SectionHeading
              eyebrow="Listing Summary"
              title="What your listing is shaping up to be"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <SummaryTile
                label="Planned list date"
                value={form.listDate || "Not set"}
              />
              <SummaryTile
                label="Showing setup"
                value={showingModeLabel(form.showingMode)}
              />
              <SummaryTile
                label="Occupancy"
                value={occupancyLabel(form.occupancyStatus)}
              />
              <SummaryTile
                label="Offer deadline"
                value={form.offerDeadline || "No deadline set"}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Public Listing Content"
              title="Write the listing buyers will see"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <Field
                label="Listing Headline"
                value={form.listingHeadline}
                onChange={(value) => updateForm("listingHeadline", value)}
                placeholder="Example: Updated 3-bedroom ranch near downtown Elkhorn"
                fullWidth
              />

              <TextAreaField
                label="Public Description"
                value={form.publicDescription}
                onChange={(value) => updateForm("publicDescription", value)}
                placeholder="Describe what makes the home appealing, who it is ideal for, and the biggest selling points."
                rows={6}
                fullWidth
              />

              <TextAreaField
                label="MLS Description Draft"
                value={form.mlsDescriptionDraft}
                onChange={(value) => updateForm("mlsDescriptionDraft", value)}
                placeholder="Shorter, more structured listing copy for MLS input."
                rows={5}
                fullWidth
              />

              <TextAreaField
                label="Private Listing Notes"
                value={form.privateNotes}
                onChange={(value) => updateForm("privateNotes", value)}
                placeholder="Anything you want to remember internally before posting."
                rows={4}
                fullWidth
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Posting Plan"
              title="Where will the listing appear?"
            />

            <div style={{ display: "grid", gap: "16px" }}>
              {channels.map((channel) => (
                <div
                  key={channel.id}
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
                    }}
                  >
                    <div
                      style={{
                        fontSize: "16px",
                        lineHeight: 1.5,
                        color: "var(--ackret-ink)",
                        fontWeight: 500,
                      }}
                    >
                      {channel.label}
                    </div>

                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "var(--ackret-muted)",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={channel.planned}
                        onChange={(e) =>
                          updateChannel(channel.id, "planned", e.target.checked)
                        }
                      />
                      Planned
                    </label>
                  </div>

                  <div style={{ marginTop: "14px" }}>
                    <TextAreaField
                      label="Notes"
                      value={channel.notes}
                      onChange={(value) => updateChannel(channel.id, "notes", value)}
                      placeholder="Add posting details, timing, or anything you need to remember for this channel."
                      rows={3}
                      fullWidth
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Showing Plan"
              title="Decide how buyers will view the home"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <Field
                label="Planned List Date"
                type="date"
                value={form.listDate}
                onChange={(value) => updateForm("listDate", value)}
              />

              <Field
                label="Available for Showings Starting"
                type="date"
                value={form.availableDate}
                onChange={(value) => updateForm("availableDate", value)}
              />

              <SelectField
                label="Showing Mode"
                value={form.showingMode}
                onChange={(value) =>
                  updateForm("showingMode", value as ListingReadinessState["showingMode"])
                }
                options={[
                  { value: "open-house", label: "Open houses only" },
                  { value: "appointment", label: "By appointment only" },
                  { value: "flexible", label: "Flexible / mixed approach" },
                ]}
              />

              <SelectField
                label="Occupancy Status"
                value={form.occupancyStatus}
                onChange={(value) =>
                  updateForm(
                    "occupancyStatus",
                    value as ListingReadinessState["occupancyStatus"]
                  )
                }
                options={[
                  { value: "owner-occupied", label: "Owner occupied" },
                  { value: "vacant", label: "Vacant" },
                  { value: "tenant-occupied", label: "Tenant occupied" },
                ]}
              />

              <SelectField
                label="Plan to use a lockbox?"
                value={form.lockboxPlan}
                onChange={(value) =>
                  updateForm("lockboxPlan", value as ListingReadinessState["lockboxPlan"])
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />

              <SelectField
                label="Plan to use a yard sign?"
                value={form.yardSignPlan}
                onChange={(value) =>
                  updateForm("yardSignPlan", value as ListingReadinessState["yardSignPlan"])
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />

              <SelectField
                label="Post online yourself?"
                value={form.onlinePostingPlan}
                onChange={(value) =>
                  updateForm(
                    "onlinePostingPlan",
                    value as ListingReadinessState["onlinePostingPlan"]
                  )
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />

              <Field
                label="Offer Deadline"
                type="date"
                value={form.offerDeadline}
                onChange={(value) => updateForm("offerDeadline", value)}
              />

              <TextAreaField
                label="Showing Instructions"
                value={form.showingInstructions}
                onChange={(value) => updateForm("showingInstructions", value)}
                placeholder="Example: 24-hour notice required. Remove dog before showings. Weekend afternoons preferred."
                rows={5}
                fullWidth
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Listing Terms"
              title="Decide what goes with the sale and how offers should be framed"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <Field
                label="Buyer Agent Commission Plan"
                value={form.buyerAgentCommissionPlan}
                onChange={(value) => updateForm("buyerAgentCommissionPlan", value)}
                placeholder="Example: 2.4%, flat fee, or case-by-case"
                fullWidth
              />

              <TextAreaField
                label="Included in Sale"
                value={form.inclusions}
                onChange={(value) => updateForm("inclusions", value)}
                placeholder="Appliances, window treatments, shed, playset, dock, etc."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Excluded from Sale"
                value={form.exclusions}
                onChange={(value) => updateForm("exclusions", value)}
                placeholder="Anything the seller intends to keep."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Financing / Offer Notes"
                value={form.financingNotes}
                onChange={(value) => updateForm("financingNotes", value)}
                placeholder="Cash preferred, proof of funds required, pre-approval requested, closing flexibility, etc."
                rows={4}
                fullWidth
              />
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading eyebrow="Progress" title="Listing checklist" />

            <StatRow label="Channels planned" value={`${plannedChannelsCount}`} />
            <StatRow label="Headline drafted" value={headlineReady ? "Yes" : "No"} />
            <StatRow label="Description drafted" value={descriptionReady ? "Yes" : "No"} />
            <StatRow label="Showing plan" value={showingReady ? "Ready" : "Not ready"} />
            <StatRow label="List date" value={form.listDate || "Not set"} />
            <StatRow label="Save status" value={saving ? "Saving..." : localSaveMessage} />
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
                This step is about making your listing feel intentional before it
                goes public — not just posting it quickly.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function showingModeLabel(value: ShowingMode): string {
  if (value === "open-house") return "Open houses only";
  if (value === "appointment") return "By appointment";
  if (value === "flexible") return "Flexible";
  return "Not set";
}

function occupancyLabel(value: ListingReadinessState["occupancyStatus"]): string {
  if (value === "owner-occupied") return "Owner occupied";
  if (value === "vacant") return "Vacant";
  if (value === "tenant-occupied") return "Tenant occupied";
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