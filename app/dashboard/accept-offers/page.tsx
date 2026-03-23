"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardSteps } from "@/lib/dashboardSteps";
import { useSellerProfile } from "@/hooks/useSellerProfile";

type OfferStatus =
  | "received"
  | "countered"
  | "accepted"
  | "declined"
  | "withdrawn";

type FinancingType = "cash" | "conventional" | "fha" | "va" | "other" | "";

type OfferEntry = {
  id: string;
  buyerName: string;
  offerPrice: string;
  status: OfferStatus;
  financingType: FinancingType;
  downPayment: string;
  earnestMoney: string;
  appraisalGap: string;
  inspectionContingency: "yes" | "no" | "";
  financingContingency: "yes" | "no" | "";
  homeSaleContingency: "yes" | "no" | "";
  closingDate: string;
  occupancyAfterClosing: string;
  deadline: string;
  concessionsRequested: string;
  strengths: string;
  risks: string;
  notes: string;
};

type OffersFormState = {
  responseStrategy: "accept-best" | "counter-best" | "wait" | "";
  preferredClosingTimeline: string;
  minimumNetGoal: string;
  idealClosingDate: string;
  sellerPriorities: string;
  counterTerms: string;
  legalOrTitleQuestions: string;
  finalDecisionNotes: string;
};

function createBlankOffer(id: string): OfferEntry {
  return {
    id,
    buyerName: "",
    offerPrice: "",
    status: "received",
    financingType: "",
    downPayment: "",
    earnestMoney: "",
    appraisalGap: "",
    inspectionContingency: "",
    financingContingency: "",
    homeSaleContingency: "",
    closingDate: "",
    occupancyAfterClosing: "",
    deadline: "",
    concessionsRequested: "",
    strengths: "",
    risks: "",
    notes: "",
  };
}

const initialFormState: OffersFormState = {
  responseStrategy: "",
  preferredClosingTimeline: "",
  minimumNetGoal: "",
  idealClosingDate: "",
  sellerPriorities: "",
  counterTerms: "",
  legalOrTitleQuestions: "",
  finalDecisionNotes: "",
};

const initialOffersState: OfferEntry[] = [
  createBlankOffer("offer-1"),
  createBlankOffer("offer-2"),
];

export default function AcceptOffersPage() {
  const router = useRouter();
  const { profile, loading, saving, error, saveProfile } = useSellerProfile();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const [localSaveMessage, setLocalSaveMessage] = useState("Loading...");
  const hasLoadedProfileRef = useRef(false);

  const [form, setForm] = useState<OffersFormState>(initialFormState);
  const [offers, setOffers] = useState<OfferEntry[]>(initialOffersState);

  const previousStep = dashboardSteps[4];
  const nextStep = dashboardSteps[6];

  function updateForm<K extends keyof OffersFormState>(
    key: K,
    value: OffersFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setLocalSaveMessage("Saving...");
  }

  function updateOffer(
    offerId: string,
    key: keyof OfferEntry,
    value: string
  ) {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === offerId
          ? {
              ...offer,
              [key]: value,
            }
          : offer
      )
    );
    setLocalSaveMessage("Saving...");
  }

  function addOffer() {
    setOffers((prev) => [...prev, createBlankOffer(`offer-${Date.now()}`)]);
    setLocalSaveMessage("Saving...");
  }

  function removeOffer(offerId: string) {
    setOffers((prev) => {
      if (prev.length <= 1) return prev;
      return prev.filter((offer) => offer.id !== offerId);
    });
    setLocalSaveMessage("Saving...");
  }

  useEffect(() => {
    if (!profile || hasLoadedProfileRef.current) return;

    const saved = profile.progress?.acceptOffers;

    if (saved) {
      setForm({
        ...initialFormState,
        ...(saved.form || {}),
      });

      if (Array.isArray(saved.offers) && saved.offers.length > 0) {
        setOffers(saved.offers);
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
        currentStep: "accept-offers",
        progressPatch: {
          acceptOffers: {
            form,
            offers,
            draftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
    }, 800);

    return () => clearTimeout(timeout);
  }, [form, offers, draftId]);

  const enteredOffers = useMemo(() => {
    return offers.filter(
      (offer) =>
        offer.buyerName.trim() ||
        offer.offerPrice.trim() ||
        offer.closingDate.trim() ||
        offer.financingType !== ""
    );
  }, [offers]);

  const highestOffer = useMemo(() => {
    const prices = enteredOffers
      .map((offer) => parseCurrency(offer.offerPrice))
      .filter((value): value is number => value !== null);

    if (!prices.length) return null;
    return Math.max(...prices);
  }, [enteredOffers]);

  const acceptedOffers = useMemo(
    () => enteredOffers.filter((offer) => offer.status === "accepted").length,
    [enteredOffers]
  );

  const cashOffers = useMemo(
    () => enteredOffers.filter((offer) => offer.financingType === "cash").length,
    [enteredOffers]
  );

  const activeDeadlines = useMemo(
    () => enteredOffers.filter((offer) => offer.deadline.trim()).length,
    [enteredOffers]
  );

  async function handleSaveDraft() {
    try {
      setIsWorking(true);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const nextDraftId = draftId || `accept-offers-${Date.now()}`;
      setDraftId(nextDraftId);

      const result = await saveProfile({
        currentStep: "accept-offers",
        progressPatch: {
          acceptOffers: {
            form,
            offers,
            draftId: nextDraftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
      alert("Offer review draft saved.");
    } catch (err) {
      console.error(err);
      alert("Unable to save offer review draft.");
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
          acceptOffers: {
            form,
            offers,
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
          Loading your offers step...
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
        Step 6 of 8
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
        Accept Offers
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
        Review each offer carefully, compare financing and contingencies, and
        decide whether to accept, counter, wait, or decline. This step is about
        choosing the strongest overall path to closing, not just the highest
        number.
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
            <SectionHeading eyebrow="Offer Snapshot" title="Where things stand" />

            <StatRow label="Offers entered" value={`${enteredOffers.length}`} />
            <StatRow
              label="Highest offer"
              value={highestOffer ? formatCurrency(highestOffer) : "Not enough data"}
            />
            <StatRow label="Cash offers" value={`${cashOffers}`} />
            <StatRow label="Accepted offers" value={`${acceptedOffers}`} />
            <StatRow label="Open deadlines" value={`${activeDeadlines}`} last />
          </Card>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <Card>
            <SectionHeading
              eyebrow="Decision Summary"
              title="How you plan to respond"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <SummaryTile
                label="Response strategy"
                value={responseStrategyLabel(form.responseStrategy)}
              />
              <SummaryTile
                label="Minimum net goal"
                value={
                  form.minimumNetGoal.trim()
                    ? formatCurrencyString(form.minimumNetGoal)
                    : "Not set"
                }
              />
              <SummaryTile
                label="Ideal closing date"
                value={form.idealClosingDate || "Not set"}
              />
              <SummaryTile
                label="Highest offer"
                value={highestOffer ? formatCurrency(highestOffer) : "Not enough data"}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Seller Priorities"
              title="Decide what matters most before you compare offers"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <SelectField
                label="Response Strategy"
                value={form.responseStrategy}
                onChange={(value) =>
                  updateForm(
                    "responseStrategy",
                    value as OffersFormState["responseStrategy"]
                  )
                }
                options={[
                  { value: "accept-best", label: "Accept strongest offer" },
                  { value: "counter-best", label: "Counter strongest offer" },
                  { value: "wait", label: "Wait for more / better terms" },
                ]}
              />

              <Field
                label="Preferred Closing Timeline"
                value={form.preferredClosingTimeline}
                onChange={(value) => updateForm("preferredClosingTimeline", value)}
                placeholder="Example: 30 days, flexible, after school year, etc."
              />

              <Field
                label="Minimum Net Goal"
                value={form.minimumNetGoal}
                onChange={(value) => updateForm("minimumNetGoal", value)}
                placeholder="345000"
              />

              <Field
                label="Ideal Closing Date"
                type="date"
                value={form.idealClosingDate}
                onChange={(value) => updateForm("idealClosingDate", value)}
              />

              <TextAreaField
                label="Seller Priorities"
                value={form.sellerPriorities}
                onChange={(value) => updateForm("sellerPriorities", value)}
                placeholder="Price, clean financing, quick close, fewer contingencies, leaseback, occupancy flexibility, etc."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Counter Terms You Would Consider"
                value={form.counterTerms}
                onChange={(value) => updateForm("counterTerms", value)}
                placeholder="Price change, larger earnest money, fewer contingencies, different close date, occupancy terms, etc."
                rows={4}
                fullWidth
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Offer Comparison"
              title="Review each offer side by side in a structured way"
            />

            <div style={{ display: "grid", gap: "18px" }}>
              {offers.map((offer, index) => (
                <div
                  key={offer.id}
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
                      Offer {index + 1}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeOffer(offer.id)}
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
                      label="Buyer / Offer Name"
                      value={offer.buyerName}
                      onChange={(value) => updateOffer(offer.id, "buyerName", value)}
                      placeholder="Buyer A"
                    />

                    <SelectField
                      label="Status"
                      value={offer.status}
                      onChange={(value) => updateOffer(offer.id, "status", value)}
                      options={[
                        { value: "received", label: "Received" },
                        { value: "countered", label: "Countered" },
                        { value: "accepted", label: "Accepted" },
                        { value: "declined", label: "Declined" },
                        { value: "withdrawn", label: "Withdrawn" },
                      ]}
                    />

                    <Field
                      label="Offer Price"
                      value={offer.offerPrice}
                      onChange={(value) => updateOffer(offer.id, "offerPrice", value)}
                      placeholder="360000"
                    />

                    <SelectField
                      label="Financing Type"
                      value={offer.financingType}
                      onChange={(value) =>
                        updateOffer(offer.id, "financingType", value)
                      }
                      options={[
                        { value: "cash", label: "Cash" },
                        { value: "conventional", label: "Conventional" },
                        { value: "fha", label: "FHA" },
                        { value: "va", label: "VA" },
                        { value: "other", label: "Other" },
                      ]}
                    />

                    <Field
                      label="Down Payment"
                      value={offer.downPayment}
                      onChange={(value) => updateOffer(offer.id, "downPayment", value)}
                      placeholder="20%"
                    />

                    <Field
                      label="Earnest Money"
                      value={offer.earnestMoney}
                      onChange={(value) =>
                        updateOffer(offer.id, "earnestMoney", value)
                      }
                      placeholder="5000"
                    />

                    <Field
                      label="Appraisal Gap / Coverage"
                      value={offer.appraisalGap}
                      onChange={(value) =>
                        updateOffer(offer.id, "appraisalGap", value)
                      }
                      placeholder="Example: 5000 or none"
                    />

                    <Field
                      label="Closing Date"
                      type="date"
                      value={offer.closingDate}
                      onChange={(value) => updateOffer(offer.id, "closingDate", value)}
                    />

                    <SelectField
                      label="Inspection Contingency"
                      value={offer.inspectionContingency}
                      onChange={(value) =>
                        updateOffer(offer.id, "inspectionContingency", value)
                      }
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                    />

                    <SelectField
                      label="Financing Contingency"
                      value={offer.financingContingency}
                      onChange={(value) =>
                        updateOffer(offer.id, "financingContingency", value)
                      }
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                    />

                    <SelectField
                      label="Home Sale Contingency"
                      value={offer.homeSaleContingency}
                      onChange={(value) =>
                        updateOffer(offer.id, "homeSaleContingency", value)
                      }
                      options={[
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                      ]}
                    />

                    <Field
                      label="Offer Expiration / Deadline"
                      type="date"
                      value={offer.deadline}
                      onChange={(value) => updateOffer(offer.id, "deadline", value)}
                    />

                    <Field
                      label="Post-Closing Occupancy"
                      value={offer.occupancyAfterClosing}
                      onChange={(value) =>
                        updateOffer(offer.id, "occupancyAfterClosing", value)
                      }
                      placeholder="Example: possession at close or 3-day post-close occupancy"
                      fullWidth
                    />

                    <TextAreaField
                      label="Concessions Requested"
                      value={offer.concessionsRequested}
                      onChange={(value) =>
                        updateOffer(offer.id, "concessionsRequested", value)
                      }
                      placeholder="Closing costs, repairs, rate buydown, appliances, home warranty, etc."
                      rows={3}
                      fullWidth
                    />

                    <TextAreaField
                      label="Strengths"
                      value={offer.strengths}
                      onChange={(value) => updateOffer(offer.id, "strengths", value)}
                      placeholder="What makes this offer attractive?"
                      rows={3}
                      fullWidth
                    />

                    <TextAreaField
                      label="Risks / Weaknesses"
                      value={offer.risks}
                      onChange={(value) => updateOffer(offer.id, "risks", value)}
                      placeholder="What could create problems or delay closing?"
                      rows={3}
                      fullWidth
                    />

                    <TextAreaField
                      label="Notes"
                      value={offer.notes}
                      onChange={(value) => updateOffer(offer.id, "notes", value)}
                      placeholder="Anything else important to remember about this offer."
                      rows={3}
                      fullWidth
                    />
                  </div>
                </div>
              ))}

              <button type="button" onClick={addOffer} style={secondaryActionButtonStyle}>
                Add Another Offer
              </button>
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Decision Notes"
              title="Capture the final reasoning before you move forward"
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "18px",
              }}
            >
              <TextAreaField
                label="Legal / Title Questions to Confirm"
                value={form.legalOrTitleQuestions}
                onChange={(value) => updateForm("legalOrTitleQuestions", value)}
                placeholder="Earnest money timing, deadlines, title items, contingencies, or anything to confirm before accepting."
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Final Decision Notes"
                value={form.finalDecisionNotes}
                onChange={(value) => updateForm("finalDecisionNotes", value)}
                placeholder="Why this offer is best, what you want to counter, or what still needs to happen before acceptance."
                rows={5}
                fullWidth
              />
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading eyebrow="Progress" title="Offer summary" />

            <StatRow label="Offers entered" value={`${enteredOffers.length}`} />
            <StatRow
              label="Highest offer"
              value={highestOffer ? formatCurrency(highestOffer) : "Not enough data"}
            />
            <StatRow label="Cash offers" value={`${cashOffers}`} />
            <StatRow label="Accepted offers" value={`${acceptedOffers}`} />
            <StatRow
              label="Response strategy"
              value={responseStrategyLabel(form.responseStrategy)}
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
                Price matters, but the cleanest path to closing often wins. Use
                this page to compare the real quality of each offer.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function responseStrategyLabel(value: OffersFormState["responseStrategy"]): string {
  if (value === "accept-best") return "Accept strongest";
  if (value === "counter-best") return "Counter strongest";
  if (value === "wait") return "Wait / review";
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