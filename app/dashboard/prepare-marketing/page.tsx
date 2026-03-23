"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardSteps } from "@/lib/dashboardSteps";
import { useSellerProfile } from "@/hooks/useSellerProfile";

type MarketingAsset = {
  id: string;
  name: string;
  status: "not-started" | "in-progress" | "ready";
  notes: string;
};

type MarketingFormState = {
  photoPlan: string;
  photoDate: string;
  photoNotes: string;
  videoPlan: "yes" | "no" | "";
  videoDate: string;
  videoNotes: string;
  openHousePlan: "yes" | "no" | "";
  openHouseDate: string;
  openHouseNotes: string;
  brochurePlan: "yes" | "no" | "";
  socialMediaPlan: "yes" | "no" | "";
  emailBlastPlan: "yes" | "no" | "";
  propertyHighlights: string;
  idealBuyer: string;
  neighborhoodHighlights: string;
  stagingChecklist: string;
  curbAppealChecklist: string;
  showingPrepChecklist: string;
  marketingNotes: string;
};

const initialAssets: MarketingAsset[] = [
  { id: "photos", name: "Professional photos", status: "not-started", notes: "" },
  { id: "video", name: "Walkthrough video / reel", status: "not-started", notes: "" },
  { id: "flyer", name: "Property flyer / brochure", status: "not-started", notes: "" },
  { id: "social", name: "Social media graphics", status: "not-started", notes: "" },
  { id: "signage", name: "Yard sign / directional signage", status: "not-started", notes: "" },
];

const initialFormState: MarketingFormState = {
  photoPlan: "",
  photoDate: "",
  photoNotes: "",
  videoPlan: "",
  videoDate: "",
  videoNotes: "",
  openHousePlan: "",
  openHouseDate: "",
  openHouseNotes: "",
  brochurePlan: "",
  socialMediaPlan: "",
  emailBlastPlan: "",
  propertyHighlights: "",
  idealBuyer: "",
  neighborhoodHighlights: "",
  stagingChecklist: "",
  curbAppealChecklist: "",
  showingPrepChecklist: "",
  marketingNotes: "",
};

export default function PrepareMarketingPage() {
  const router = useRouter();
  const { profile, loading, saving, error, saveProfile } = useSellerProfile();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [localSaveMessage, setLocalSaveMessage] = useState("Loading...");
  const hasLoadedProfileRef = useRef(false);

  const [form, setForm] = useState<MarketingFormState>(initialFormState);
  const [assets, setAssets] = useState<MarketingAsset[]>(initialAssets);

  const previousStep = dashboardSteps[3];
  const nextStep = dashboardSteps[5];

  function updateForm<K extends keyof MarketingFormState>(
    key: K,
    value: MarketingFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setLocalSaveMessage("Saving...");
  }

  function updateAsset(
    assetId: string,
    key: keyof MarketingAsset,
    value: string
  ) {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              [key]: value,
            }
          : asset
      )
    );
    setLocalSaveMessage("Saving...");
  }

  useEffect(() => {
    if (!profile || hasLoadedProfileRef.current) return;

    const saved = profile.progress?.prepareMarketing;

    if (saved) {
      setForm({
        ...initialFormState,
        ...(saved.form || {}),
      });

      if (Array.isArray(saved.assets) && saved.assets.length > 0) {
        setAssets(saved.assets);
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
        currentStep: "prepare-marketing",
        progressPatch: {
          prepareMarketing: {
            form,
            assets,
            draftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
    }, 800);

    return () => clearTimeout(timeout);
  }, [form, assets, draftId]);

  const readyAssetsCount = useMemo(
    () => assets.filter((asset) => asset.status === "ready").length,
    [assets]
  );

  const inProgressAssetsCount = useMemo(
    () => assets.filter((asset) => asset.status === "in-progress").length,
    [assets]
  );

  const summaryStatus = useMemo(() => {
    if (readyAssetsCount >= 4) return "Marketing nearly ready";
    if (readyAssetsCount >= 2 || inProgressAssetsCount >= 2) return "In progress";
    return "Just getting started";
  }, [readyAssetsCount, inProgressAssetsCount]);

  async function handleSaveDraft() {
    try {
      setIsWorking(true);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const nextDraftId = draftId || `prepare-marketing-${Date.now()}`;
      setDraftId(nextDraftId);

      const result = await saveProfile({
        currentStep: "prepare-marketing",
        progressPatch: {
          prepareMarketing: {
            form,
            assets,
            draftId: nextDraftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
      alert("Marketing draft saved.");
    } catch (err) {
      console.error(err);
      alert("Unable to save marketing draft.");
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
          prepareMarketing: {
            form,
            assets,
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
          Loading your marketing step...
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
        Step 5 of 8
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
        Prepare Marketing
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
        Get the home photo-ready, build the materials buyers will see, and set a
        plan for promoting the property once it is live. This step is about
        making your listing look polished and intentional.
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
            <SectionHeading eyebrow="Readiness" title="Marketing status" />

            <StatRow label="Assets ready" value={`${readyAssetsCount}`} />
            <StatRow label="Assets in progress" value={`${inProgressAssetsCount}`} />
            <StatRow label="Photo date set" value={form.photoDate ? "Yes" : "No"} />
            <StatRow label="Open house plan" value={yesNoLabel(form.openHousePlan)} />
            <StatRow label="Social media plan" value={yesNoLabel(form.socialMediaPlan)} />
            <StatRow label="Overall status" value={summaryStatus} last />
          </Card>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <Card>
            <SectionHeading
              eyebrow="Marketing Summary"
              title="What buyers will experience first"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <SummaryTile label="Photo session" value={form.photoDate || "Not scheduled"} />
              <SummaryTile
                label="Video plan"
                value={yesNoLongLabel(form.videoPlan)}
              />
              <SummaryTile
                label="Open house"
                value={
                  form.openHousePlan === "yes"
                    ? form.openHouseDate || "Planned"
                    : form.openHousePlan === "no"
                    ? "Not planned"
                    : "Not decided"
                }
              />
              <SummaryTile label="Asset status" value={summaryStatus} />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Core Marketing Plan"
              title="Decide how the property will be presented"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <Field
                label="Photo Plan"
                value={form.photoPlan}
                onChange={(value) => updateForm("photoPlan", value)}
                placeholder="Who is taking the photos and what rooms/areas need special attention?"
                fullWidth
              />

              <Field
                label="Photo Date"
                type="date"
                value={form.photoDate}
                onChange={(value) => updateForm("photoDate", value)}
              />

              <SelectField
                label="Video / Reel Plan"
                value={form.videoPlan}
                onChange={(value) =>
                  updateForm("videoPlan", value as MarketingFormState["videoPlan"])
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />

              <Field
                label="Video Date"
                type="date"
                value={form.videoDate}
                onChange={(value) => updateForm("videoDate", value)}
              />

              <SelectField
                label="Open House Plan"
                value={form.openHousePlan}
                onChange={(value) =>
                  updateForm(
                    "openHousePlan",
                    value as MarketingFormState["openHousePlan"]
                  )
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />

              <Field
                label="Open House Date"
                type="date"
                value={form.openHouseDate}
                onChange={(value) => updateForm("openHouseDate", value)}
              />

              <SelectField
                label="Brochure / Flyer Plan"
                value={form.brochurePlan}
                onChange={(value) =>
                  updateForm(
                    "brochurePlan",
                    value as MarketingFormState["brochurePlan"]
                  )
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />

              <SelectField
                label="Social Media Plan"
                value={form.socialMediaPlan}
                onChange={(value) =>
                  updateForm(
                    "socialMediaPlan",
                    value as MarketingFormState["socialMediaPlan"]
                  )
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />

              <SelectField
                label="Email / Direct Share Plan"
                value={form.emailBlastPlan}
                onChange={(value) =>
                  updateForm(
                    "emailBlastPlan",
                    value as MarketingFormState["emailBlastPlan"]
                  )
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />

              <div />

              <TextAreaField
                label="Photo Notes"
                value={form.photoNotes}
                onChange={(value) => updateForm("photoNotes", value)}
                placeholder="List rooms to emphasize, exterior shots needed, best time of day, or cleanup reminders."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Video Notes"
                value={form.videoNotes}
                onChange={(value) => updateForm("videoNotes", value)}
                placeholder="Walkthrough path, narration ideas, drone shots, highlight features, etc."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Open House Notes"
                value={form.openHouseNotes}
                onChange={(value) => updateForm("openHouseNotes", value)}
                placeholder="Visitor flow, sign-in plan, snacks, printed sheets, shoe covers, security steps, etc."
                rows={4}
                fullWidth
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Marketing Assets"
              title="Track each piece of marketing material"
            />

            <div style={{ display: "grid", gap: "16px" }}>
              {assets.map((asset) => (
                <div
                  key={asset.id}
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
                        {asset.name}
                      </div>

                      <div style={{ marginTop: "14px" }}>
                        <TextAreaField
                          label="Notes"
                          value={asset.notes}
                          onChange={(value) => updateAsset(asset.id, "notes", value)}
                          placeholder="What still needs to happen for this asset?"
                          rows={3}
                          fullWidth
                        />
                      </div>
                    </div>

                    <SelectField
                      label="Status"
                      value={asset.status}
                      onChange={(value) => updateAsset(asset.id, "status", value)}
                      options={[
                        { value: "not-started", label: "Not started" },
                        { value: "in-progress", label: "In progress" },
                        { value: "ready", label: "Ready" },
                      ]}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Messaging"
              title="Clarify what makes this home stand out"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <TextAreaField
                label="Top Property Highlights"
                value={form.propertyHighlights}
                onChange={(value) => updateForm("propertyHighlights", value)}
                placeholder="What should buyers remember after seeing the home?"
                rows={5}
                fullWidth
              />

              <TextAreaField
                label="Ideal Buyer"
                value={form.idealBuyer}
                onChange={(value) => updateForm("idealBuyer", value)}
                placeholder="Who is most likely to love this home?"
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Neighborhood Highlights"
                value={form.neighborhoodHighlights}
                onChange={(value) => updateForm("neighborhoodHighlights", value)}
                placeholder="Walkability, schools, parks, downtown access, lake access, quiet street, etc."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Marketing Notes"
                value={form.marketingNotes}
                onChange={(value) => updateForm("marketingNotes", value)}
                placeholder="Anything else you want to keep top of mind while promoting the home."
                rows={4}
                fullWidth
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Prep Checklist"
              title="Make sure the home is ready before buyers see it"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "18px",
              }}
            >
              <TextAreaField
                label="Staging Checklist"
                value={form.stagingChecklist}
                onChange={(value) => updateForm("stagingChecklist", value)}
                placeholder="Declutter counters, remove personal photos, brighten rooms, neutral bedding, etc."
                rows={5}
                fullWidth
              />

              <TextAreaField
                label="Curb Appeal Checklist"
                value={form.curbAppealChecklist}
                onChange={(value) => updateForm("curbAppealChecklist", value)}
                placeholder="Mulch, mow, edge, sweep driveway, put out planters, touch up paint, etc."
                rows={5}
                fullWidth
              />

              <TextAreaField
                label="Showing Prep Checklist"
                value={form.showingPrepChecklist}
                onChange={(value) => updateForm("showingPrepChecklist", value)}
                placeholder="Lights on, blinds open, temperature set, valuables away, pets out, music off, etc."
                rows={5}
                fullWidth
              />
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading eyebrow="Progress" title="Marketing checklist" />

            <StatRow label="Assets ready" value={`${readyAssetsCount}`} />
            <StatRow label="Assets in progress" value={`${inProgressAssetsCount}`} />
            <StatRow label="Photo date" value={form.photoDate || "Not set"} />
            <StatRow label="Video plan" value={yesNoLongLabel(form.videoPlan)} />
            <StatRow label="Open house" value={yesNoLongLabel(form.openHousePlan)} />
            <StatRow label="Save status" value={saving ? "Saving..." : localSaveMessage} />
            <StatRow label="Draft status" value={draftId ? "Saved" : "Not saved yet"} last />
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
                This step gets the property presentation dialed in before buyers
                see the home online or in person.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function yesNoLabel(value: "yes" | "no" | ""): string {
  if (value === "yes") return "Yes";
  if (value === "no") return "No";
  return "Not set";
}

function yesNoLongLabel(value: "yes" | "no" | ""): string {
  if (value === "yes") return "Planned";
  if (value === "no") return "Not planned";
  return "Not decided";
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