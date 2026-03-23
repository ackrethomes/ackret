"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardSteps } from "@/lib/dashboardSteps";
import { useSellerProfile } from "@/hooks/useSellerProfile";

type PricingStrategy = "fast" | "balanced" | "max_price" | "";

type CompEntry = {
  id: string;
  address: string;
  salePrice: string;
  saleDate: string;
  sqft: string;
  beds: string;
  baths: string;
  yearBuilt: string;
  daysOnMarket: string;
  notes: string;
};

type SetPriceFormState = {
  strategy: PricingStrategy;
  desiredTimeline: string;
  needQuickSale: "yes" | "no" | "";
  priceAggressively: "yes" | "no" | "";
  subjectSqft: string;
  subjectBeds: string;
  subjectBaths: string;
  subjectYearBuilt: string;
  subjectCondition:
    | "needs-work"
    | "average"
    | "updated"
    | "fully-renovated"
    | "";
  upgrades: string;
  defects: string;
  suggestedMinPrice: string;
  suggestedMaxPrice: string;
  suggestedListPrice: string;
  finalListPrice: string;
  minimumAcceptablePrice: string;
  pricingNotes: string;
};

function createBlankComp(id: string): CompEntry {
  return {
    id,
    address: "",
    salePrice: "",
    saleDate: "",
    sqft: "",
    beds: "",
    baths: "",
    yearBuilt: "",
    daysOnMarket: "",
    notes: "",
  };
}

const initialFormState: SetPriceFormState = {
  strategy: "",
  desiredTimeline: "",
  needQuickSale: "",
  priceAggressively: "",
  subjectSqft: "",
  subjectBeds: "",
  subjectBaths: "",
  subjectYearBuilt: "",
  subjectCondition: "",
  upgrades: "",
  defects: "",
  suggestedMinPrice: "",
  suggestedMaxPrice: "",
  suggestedListPrice: "",
  finalListPrice: "",
  minimumAcceptablePrice: "",
  pricingNotes: "",
};

const initialCompsState: CompEntry[] = [
  createBlankComp("comp-1"),
  createBlankComp("comp-2"),
  createBlankComp("comp-3"),
];

export default function SetPricePage() {
  const router = useRouter();
  const { profile, loading, saving, error, saveProfile } = useSellerProfile();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [localSaveMessage, setLocalSaveMessage] = useState("Loading...");
  const hasLoadedProfileRef = useRef(false);

  const [form, setForm] = useState<SetPriceFormState>(initialFormState);

  const [comps, setComps] = useState<CompEntry[]>(initialCompsState);

  const previousStep = dashboardSteps[1];
  const nextStep = dashboardSteps[3];

  function updateForm<K extends keyof SetPriceFormState>(
    key: K,
    value: SetPriceFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setLocalSaveMessage("Saving...");
  }

  function updateComp(
    compId: string,
    key: keyof CompEntry,
    value: string
  ) {
    setComps((prev) =>
      prev.map((comp) =>
        comp.id === compId
          ? {
              ...comp,
              [key]: value,
            }
          : comp
      )
    );
    setLocalSaveMessage("Saving...");
  }

  function addComp() {
    setComps((prev) => [...prev, createBlankComp(`comp-${Date.now()}`)]);
    setLocalSaveMessage("Saving...");
  }

  function removeComp(compId: string) {
    setComps((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((comp) => comp.id !== compId);
    });
    setLocalSaveMessage("Saving...");
  }

  useEffect(() => {
    if (!profile || hasLoadedProfileRef.current) return;

    const saved = profile.progress?.setPrice;

    if (saved) {
      setForm({
        ...initialFormState,
        ...(saved.form || {}),
      });

      if (Array.isArray(saved.comps) && saved.comps.length > 0) {
        setComps(saved.comps);
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
        currentStep: "set-price",
        progressPatch: {
          setPrice: {
            form,
            comps,
            draftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
    }, 800);

    return () => clearTimeout(timeout);
  }, [form, comps, draftId]);

  const filledComps = useMemo(() => {
    return comps.filter(
      (comp) =>
        comp.address.trim() ||
        comp.salePrice.trim() ||
        comp.saleDate.trim() ||
        comp.sqft.trim()
    );
  }, [comps]);

  const avgSoldPrice = useMemo(() => {
    const prices = filledComps
      .map((comp) => parseCurrency(comp.salePrice))
      .filter((value): value is number => value !== null);

    if (!prices.length) return null;
    return Math.round(prices.reduce((sum, value) => sum + value, 0) / prices.length);
  }, [filledComps]);

  const avgPricePerSqft = useMemo(() => {
    const values = filledComps
      .map((comp) => {
        const price = parseCurrency(comp.salePrice);
        const sqft = parseNumber(comp.sqft);
        if (!price || !sqft || sqft <= 0) return null;
        return price / sqft;
      })
      .filter((value): value is number => value !== null);

    if (!values.length) return null;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }, [filledComps]);

  const estimatedBySqft = useMemo(() => {
    const subjectSqft = parseNumber(form.subjectSqft);
    if (!avgPricePerSqft || !subjectSqft) return null;
    return Math.round(avgPricePerSqft * subjectSqft);
  }, [avgPricePerSqft, form.subjectSqft]);

  const pricingStrategyLabel = useMemo(() => {
    if (form.strategy === "fast") return "Price for speed";
    if (form.strategy === "balanced") return "Balanced approach";
    if (form.strategy === "max_price") return "Push for max price";
    return "Not selected";
  }, [form.strategy]);

  const summarySuggestedRange = useMemo(() => {
    if (form.suggestedMinPrice.trim() && form.suggestedMaxPrice.trim()) {
      return `${formatCurrencyString(form.suggestedMinPrice)} – ${formatCurrencyString(
        form.suggestedMaxPrice
      )}`;
    }
    return "Not set";
  }, [form.suggestedMinPrice, form.suggestedMaxPrice]);

  const finalListPriceDisplay = useMemo(() => {
    return form.finalListPrice.trim()
      ? formatCurrencyString(form.finalListPrice)
      : "Not set";
  }, [form.finalListPrice]);

  async function handleSaveDraft() {
    try {
      setIsWorking(true);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const nextDraftId = draftId || `set-price-${Date.now()}`;
      setDraftId(nextDraftId);

      const result = await saveProfile({
        currentStep: "set-price",
        progressPatch: {
          setPrice: {
            form,
            comps,
            draftId: nextDraftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
      alert("Pricing draft saved.");
    } catch (err) {
      console.error(err);
      alert("Unable to save pricing draft.");
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
          setPrice: {
            form,
            comps,
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
          Loading your pricing step...
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
        Step 3 of 8
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
        Set Price
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
        Choose a pricing strategy that fits the market, the condition of the
        home, and your timeline for selling. Use comparable sales and your own
        property details to land on a list price you can defend.
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
            <SectionHeading eyebrow="Pricing Snapshot" title="Where you stand" />

            <StatRow
              label="Comparable sales entered"
              value={`${filledComps.length}`}
            />
            <StatRow
              label="Average sold price"
              value={avgSoldPrice ? formatCurrency(avgSoldPrice) : "Not enough data"}
            />
            <StatRow
              label="Avg. price / sq ft"
              value={avgPricePerSqft ? `$${avgPricePerSqft}` : "Not enough data"}
            />
            <StatRow
              label="Estimated from your sq ft"
              value={estimatedBySqft ? formatCurrency(estimatedBySqft) : "Not enough data"}
            />
            <StatRow label="Strategy" value={pricingStrategyLabel} last />
          </Card>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <Card>
            <SectionHeading
              eyebrow="Pricing Summary"
              title="Your working pricing decision"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <SummaryTile
                label="Suggested range"
                value={summarySuggestedRange}
              />
              <SummaryTile
                label="Suggested list price"
                value={
                  form.suggestedListPrice.trim()
                    ? formatCurrencyString(form.suggestedListPrice)
                    : "Not set"
                }
              />
              <SummaryTile label="Final list price" value={finalListPriceDisplay} />
              <SummaryTile
                label="Minimum acceptable price"
                value={
                  form.minimumAcceptablePrice.trim()
                    ? formatCurrencyString(form.minimumAcceptablePrice)
                    : "Not set"
                }
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Seller Goals"
              title="What matters most in your pricing strategy?"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <SelectField
                label="Pricing Strategy"
                value={form.strategy}
                onChange={(value) =>
                  updateForm("strategy", value as SetPriceFormState["strategy"])
                }
                options={[
                  { value: "fast", label: "Price for speed" },
                  { value: "balanced", label: "Balanced approach" },
                  { value: "max_price", label: "Push for max price" },
                ]}
              />

              <Field
                label="Desired Timeline"
                value={form.desiredTimeline}
                onChange={(value) => updateForm("desiredTimeline", value)}
                placeholder="e.g. Within 30 days"
              />

              <SelectField
                label="Need a Quick Sale?"
                value={form.needQuickSale}
                onChange={(value) =>
                  updateForm(
                    "needQuickSale",
                    value as SetPriceFormState["needQuickSale"]
                  )
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />

              <SelectField
                label="Price Aggressively to Attract Buyers?"
                value={form.priceAggressively}
                onChange={(value) =>
                  updateForm(
                    "priceAggressively",
                    value as SetPriceFormState["priceAggressively"]
                  )
                }
                options={[
                  { value: "yes", label: "Yes" },
                  { value: "no", label: "No" },
                ]}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Comparable Sales"
              title="Enter recent homes that help define your market"
            />

            <div style={{ display: "grid", gap: "18px" }}>
              {comps.map((comp, index) => (
                <div
                  key={comp.id}
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
                      Comp {index + 1}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeComp(comp.id)}
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
                      label="Address"
                      value={comp.address}
                      onChange={(value) => updateComp(comp.id, "address", value)}
                      placeholder="123 Oak Street"
                      fullWidth
                    />

                    <Field
                      label="Sale Price"
                      value={comp.salePrice}
                      onChange={(value) => updateComp(comp.id, "salePrice", value)}
                      placeholder="350000"
                    />

                    <Field
                      label="Sale Date"
                      type="date"
                      value={comp.saleDate}
                      onChange={(value) => updateComp(comp.id, "saleDate", value)}
                    />

                    <Field
                      label="Square Feet"
                      value={comp.sqft}
                      onChange={(value) => updateComp(comp.id, "sqft", value)}
                      placeholder="1850"
                    />

                    <Field
                      label="Beds"
                      value={comp.beds}
                      onChange={(value) => updateComp(comp.id, "beds", value)}
                      placeholder="3"
                    />

                    <Field
                      label="Baths"
                      value={comp.baths}
                      onChange={(value) => updateComp(comp.id, "baths", value)}
                      placeholder="2"
                    />

                    <Field
                      label="Year Built"
                      value={comp.yearBuilt}
                      onChange={(value) => updateComp(comp.id, "yearBuilt", value)}
                      placeholder="1998"
                    />

                    <Field
                      label="Days on Market"
                      value={comp.daysOnMarket}
                      onChange={(value) =>
                        updateComp(comp.id, "daysOnMarket", value)
                      }
                      placeholder="12"
                    />

                    <TextAreaField
                      label="Notes"
                      value={comp.notes}
                      onChange={(value) => updateComp(comp.id, "notes", value)}
                      placeholder="Condition, updates, lot, location, or anything else worth noting."
                      rows={3}
                      fullWidth
                    />
                  </div>
                </div>
              ))}

              <button type="button" onClick={addComp} style={secondaryActionButtonStyle}>
                Add Another Comparable Sale
              </button>
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Your Property"
              title="Describe the home you are pricing"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <Field
                label="Square Feet"
                value={form.subjectSqft}
                onChange={(value) => updateForm("subjectSqft", value)}
                placeholder="e.g. 1900"
              />

              <Field
                label="Bedrooms"
                value={form.subjectBeds}
                onChange={(value) => updateForm("subjectBeds", value)}
                placeholder="e.g. 3"
              />

              <Field
                label="Bathrooms"
                value={form.subjectBaths}
                onChange={(value) => updateForm("subjectBaths", value)}
                placeholder="e.g. 2.5"
              />

              <Field
                label="Year Built"
                value={form.subjectYearBuilt}
                onChange={(value) => updateForm("subjectYearBuilt", value)}
                placeholder="e.g. 1997"
              />

              <SelectField
                label="Condition"
                value={form.subjectCondition}
                onChange={(value) =>
                  updateForm(
                    "subjectCondition",
                    value as SetPriceFormState["subjectCondition"]
                  )
                }
                options={[
                  { value: "needs-work", label: "Needs work" },
                  { value: "average", label: "Average" },
                  { value: "updated", label: "Updated" },
                  { value: "fully-renovated", label: "Fully renovated" },
                ]}
              />

              <div />

              <TextAreaField
                label="Upgrades / Features That Add Value"
                value={form.upgrades}
                onChange={(value) => updateForm("upgrades", value)}
                placeholder="Kitchen remodel, new roof, finished basement, acreage, lake access, etc."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Known Issues That Could Affect Price"
                value={form.defects}
                onChange={(value) => updateForm("defects", value)}
                placeholder="Anything a buyer may factor into price or negotiating leverage."
                rows={4}
                fullWidth
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Final Pricing Decision"
              title="Choose the number you want to list at"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <Field
                label="Suggested Minimum Price"
                value={form.suggestedMinPrice}
                onChange={(value) => updateForm("suggestedMinPrice", value)}
                placeholder="350000"
              />

              <Field
                label="Suggested Maximum Price"
                value={form.suggestedMaxPrice}
                onChange={(value) => updateForm("suggestedMaxPrice", value)}
                placeholder="370000"
              />

              <Field
                label="Suggested List Price"
                value={form.suggestedListPrice}
                onChange={(value) => updateForm("suggestedListPrice", value)}
                placeholder="359900"
              />

              <Field
                label="Final List Price"
                value={form.finalListPrice}
                onChange={(value) => updateForm("finalListPrice", value)}
                placeholder="359900"
              />

              <Field
                label="Minimum Acceptable Price"
                value={form.minimumAcceptablePrice}
                onChange={(value) => updateForm("minimumAcceptablePrice", value)}
                placeholder="345000"
              />

              <div />

              <TextAreaField
                label="Pricing Notes"
                value={form.pricingNotes}
                onChange={(value) => updateForm("pricingNotes", value)}
                placeholder="Explain why this price makes sense based on comps, condition, and timeline."
                rows={5}
                fullWidth
              />
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading eyebrow="Progress" title="Price summary" />

            <StatRow label="Comps entered" value={`${filledComps.length}`} />
            <StatRow
              label="Average sold price"
              value={avgSoldPrice ? formatCurrency(avgSoldPrice) : "Not enough data"}
            />
            <StatRow
              label="Avg. price / sq ft"
              value={avgPricePerSqft ? `$${avgPricePerSqft}` : "Not enough data"}
            />
            <StatRow label="Suggested range" value={summarySuggestedRange} />
            <StatRow label="Final list price" value={finalListPriceDisplay} />
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
                Save your reasoning here so your list price is backed by actual
                comps and a consistent strategy before you move into listing.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
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

function parseNumber(value: string): number | null {
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