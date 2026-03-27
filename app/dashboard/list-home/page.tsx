"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dashboardSteps } from "@/lib/dashboardSteps";
import { useSellerProfile } from "@/hooks/useSellerProfile";

type ListingPromptForm = {
  cityState: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  squareFootage: string;
  lotSize: string;
  homeFeatures: string;
  kitchenDetails: string;
  livingAreas: string;
  primaryBedroom: string;
  outdoorSpace: string;
  locationHighlights: string;
  recentUpdates: string;
  additionalNotes: string;
};

const initialFormState: ListingPromptForm = {
  cityState: "",
  price: "",
  bedrooms: "",
  bathrooms: "",
  squareFootage: "",
  lotSize: "",
  homeFeatures: "",
  kitchenDetails: "",
  livingAreas: "",
  primaryBedroom: "",
  outdoorSpace: "",
  locationHighlights: "",
  recentUpdates: "",
  additionalNotes: "",
};

export default function ListHomePage() {
  const router = useRouter();
  const { profile, loading, saving, error, saveProfile } = useSellerProfile();

  const [form, setForm] = useState<ListingPromptForm>(initialFormState);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [localSaveMessage, setLocalSaveMessage] = useState("Loading...");
  const [isWorking, setIsWorking] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const hasLoadedProfileRef = useRef(false);

  const previousStep = dashboardSteps[2];
  const nextStep = dashboardSteps[4];

  function updateForm<K extends keyof ListingPromptForm>(
    key: K,
    value: ListingPromptForm[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
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
            draftId,
          },
        },
      });

      setLocalSaveMessage(result ? "Saved" : "Save failed");
    }, 800);

    return () => clearTimeout(timeout);
  }, [form, draftId, saveProfile]);

  const completedFields = useMemo(() => {
    return Object.values(form).filter((value) => value.trim().length > 0).length;
  }, [form]);

  const listingPrompt = useMemo(() => buildListingPrompt(form), [form]);

  async function handleCopyPrompt() {
    try {
      await navigator.clipboard.writeText(listingPrompt);
      setCopyMessage("Prompt copied.");
      setTimeout(() => setCopyMessage(""), 2500);
    } catch (err) {
      console.error(err);
      setCopyMessage("Unable to copy prompt.");
      setTimeout(() => setCopyMessage(""), 2500);
    }
  }

  async function handleSaveDraft() {
    try {
      setIsWorking(true);

      const nextDraftId = draftId || `list-home-${Date.now()}`;

      const result = await saveProfile({
        currentStep: "list-home",
        progressPatch: {
          listHome: {
            form,
            draftId: nextDraftId,
          },
        },
      });

      if (result) {
        setDraftId(nextDraftId);
        setLocalSaveMessage("Saved");
        alert("List-home draft saved.");
      } else {
        setLocalSaveMessage("Save failed");
        alert("Unable to save your draft.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to save your draft.");
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
          Loading your list-home step...
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
        Build your listing materials, take strong photos, and get ready to post
        the property. This page gives you a fill-in-the-blank prompt you can
        paste into ChatGPT or another AI writing tool to generate your home
        description.
      </p>

      <div
        style={{
          marginTop: "28px",
          display: "grid",
          gridTemplateColumns: "1.65fr 0.8fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: "24px" }}>
          <Card>
            <SectionHeading
              eyebrow="Home Description Prompt"
              title="Fill in the blanks for your AI listing prompt"
            />

            <p
              style={{
                marginTop: 0,
                marginBottom: "18px",
                fontSize: "15px",
                lineHeight: 1.8,
                color: "var(--ackret-muted)",
              }}
            >
              Fill out the details below. Then copy the finished prompt and paste
              it into ChatGPT or any other AI writing software to create a
              polished listing description.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "18px",
              }}
            >
              <Field
                label="Location (City, State)"
                value={form.cityState}
                onChange={(value) => updateForm("cityState", value)}
                placeholder="Example: Elkhorn, Wisconsin"
              />

              <Field
                label="Price"
                value={form.price}
                onChange={(value) => updateForm("price", value)}
                placeholder="Example: $425,000"
              />

              <Field
                label="Bedrooms"
                value={form.bedrooms}
                onChange={(value) => updateForm("bedrooms", value)}
                placeholder="Example: 4"
              />

              <Field
                label="Bathrooms"
                value={form.bathrooms}
                onChange={(value) => updateForm("bathrooms", value)}
                placeholder="Example: 2.5"
              />

              <Field
                label="Square Footage"
                value={form.squareFootage}
                onChange={(value) => updateForm("squareFootage", value)}
                placeholder="Example: 2,350"
              />

              <Field
                label="Lot Size"
                value={form.lotSize}
                onChange={(value) => updateForm("lotSize", value)}
                placeholder="Example: 0.42 acres"
              />

              <TextAreaField
                label="Home Features"
                value={form.homeFeatures}
                onChange={(value) => updateForm("homeFeatures", value)}
                placeholder="Updated kitchen, hardwood floors, finished basement, new roof"
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Kitchen Details"
                value={form.kitchenDetails}
                onChange={(value) => updateForm("kitchenDetails", value)}
                placeholder="Granite countertops, stainless steel appliances, open concept"
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Living Areas"
                value={form.livingAreas}
                onChange={(value) => updateForm("livingAreas", value)}
                placeholder="Natural light, fireplace, vaulted ceilings"
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Primary Bedroom"
                value={form.primaryBedroom}
                onChange={(value) => updateForm("primaryBedroom", value)}
                placeholder="Walk-in closet, en-suite bathroom"
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Outdoor Space"
                value={form.outdoorSpace}
                onChange={(value) => updateForm("outdoorSpace", value)}
                placeholder="Fenced yard, patio, deck, lake view"
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Location Highlights"
                value={form.locationHighlights}
                onChange={(value) => updateForm("locationHighlights", value)}
                placeholder="Near schools, downtown, lake, golf course"
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Recent Updates"
                value={form.recentUpdates}
                onChange={(value) => updateForm("recentUpdates", value)}
                placeholder="New furnace, new roof, remodeled bathroom"
                rows={4}
                fullWidth
              />

              <TextAreaField
                label="Additional Notes"
                value={form.additionalNotes}
                onChange={(value) => updateForm("additionalNotes", value)}
                placeholder="Anything unique or special about the home"
                rows={4}
                fullWidth
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Copy and Paste"
              title="Your finished prompt"
            />

            <p
              style={{
                marginTop: 0,
                marginBottom: "18px",
                fontSize: "15px",
                lineHeight: 1.8,
                color: "var(--ackret-muted)",
              }}
            >
              Copy this prompt and paste it into ChatGPT or another AI writing
              tool. Then bring the description back into your listing workflow.
            </p>

            <textarea
              value={listingPrompt}
              readOnly
              rows={22}
              style={textareaStyle}
            />

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "18px",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={handleCopyPrompt}
                style={primaryButtonInlineStyle}
              >
                Copy Prompt
              </button>

              {copyMessage ? (
                <span
                  style={{
                    fontSize: "14px",
                    color: "var(--ackret-muted)",
                  }}
                >
                  {copyMessage}
                </span>
              ) : null}
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Photography"
              title="How to take listing photos that look clean and professional"
            />

            <div style={{ display: "grid", gap: "16px" }}>
              <InstructionBlock
                title="1. Clean and declutter first"
                body="Clear countertops, hide trash cans, put away pet items, straighten pillows, and remove anything that makes a room feel crowded. Simple and clean always photographs better."
              />
              <InstructionBlock
                title="2. Shoot during bright daylight"
                body="Open all blinds and curtains. Turn on interior lights if the room feels dark, but avoid taking photos at night unless you are intentionally capturing exterior lighting."
              />
              <InstructionBlock
                title="3. Use horizontal photos"
                body="Take wide, level photos in landscape orientation. This gives buyers a better sense of the room layout and tends to work better on MLS sites."
              />
              <InstructionBlock
                title="4. Stand in corners, not doorways"
                body="Whenever possible, stand back into a corner to show more of the room. Keep the camera level and avoid extreme angles that make rooms look distorted."
              />
              <InstructionBlock
                title="5. Photograph the key spaces"
                body="At minimum, get strong photos of the front exterior, kitchen, living room, primary bedroom, bathrooms, backyard, and any standout features like a fireplace, deck, finished basement, barn, or lake view."
              />
              <InstructionBlock
                title="6. Take more photos than you think you need"
                body="Take multiple versions of every room. Then choose the cleanest, brightest, and most flattering one. Do not use blurry, crooked, or dark photos."
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="MLS Posting"
              title="General directions for getting your property onto the MLS"
            />

            <div style={{ display: "grid", gap: "16px" }}>
              <InstructionBlock
                title="1. Choose a flat-fee MLS service"
                body="Most FSBO sellers need a flat-fee MLS listing service because individual homeowners usually cannot post directly to the MLS on their own. Look for one that covers your Wisconsin market."
              />
              <InstructionBlock
                title="2. Gather your listing information"
                body="Before starting, have your price, square footage, room counts, property taxes, inclusions, exclusions, showing instructions, and completed disclosure forms ready."
              />
              <InstructionBlock
                title="3. Upload your best photos"
                body="Use your cleanest exterior shot as the lead image. Then upload the strongest interior photos in a logical order so buyers can understand the flow of the home."
              />
              <InstructionBlock
                title="4. Paste in your home description"
                body="Use the prompt above to create your listing description, then edit it so it is accurate and clear. Make sure you do not exaggerate features or promise something that is not true."
              />
              <InstructionBlock
                title="5. Review buyer-agent compensation and showing setup"
                body="Your MLS entry may ask how showings are handled and whether buyer agents will be compensated. Make those decisions before submitting the listing."
              />
              <InstructionBlock
                title="6. Double-check everything before it goes live"
                body="Review spelling, price, room counts, included items, school information, and photo order. Small mistakes can make the property look sloppy or create confusion with buyers."
              />
            </div>

            <p
              style={{
                marginTop: "18px",
                marginBottom: 0,
                fontSize: "14px",
                lineHeight: 1.8,
                color: "var(--ackret-muted)",
              }}
            >
              Ackret gives general guidance here. Your flat-fee MLS provider may
              have its own required fields, timelines, and submission process.
            </p>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading eyebrow="Progress" title="List-home status" />

            <StatRow label="Filled fields" value={`${completedFields} / 14`} />
            <StatRow
              label="Prompt ready"
              value={completedFields >= 6 ? "Yes" : "In progress"}
            />
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
                This step is meant to make your listing feel polished before it
                goes public.
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function buildListingPrompt(form: ListingPromptForm) {
  return `Write a professional real estate listing description for a home using the details below. The tone should be polished, inviting, and similar to what a top real estate agent would write. Avoid sounding robotic. Highlight lifestyle benefits, not just features.

Property Details:

* Location (City, State): ${valueOrPlaceholder(form.cityState)}
* Price: ${valueOrPlaceholder(form.price)}
* Bedrooms: ${valueOrPlaceholder(form.bedrooms)}
* Bathrooms: ${valueOrPlaceholder(form.bathrooms)}
* Square Footage: ${valueOrPlaceholder(form.squareFootage)}
* Lot Size: ${valueOrPlaceholder(form.lotSize)}

Home Features:
${valueOrPlaceholder(form.homeFeatures)}

Kitchen Details:
${valueOrPlaceholder(form.kitchenDetails)}

Living Areas:
${valueOrPlaceholder(form.livingAreas)}

Primary Bedroom:
${valueOrPlaceholder(form.primaryBedroom)}

Outdoor Space:
${valueOrPlaceholder(form.outdoorSpace)}

Location Highlights:
${valueOrPlaceholder(form.locationHighlights)}

Recent Updates:
${valueOrPlaceholder(form.recentUpdates)}

Additional Notes:
${valueOrPlaceholder(form.additionalNotes)}

Instructions:

* Start with a strong, attention-grabbing opening sentence
* Keep it around 150–250 words
* Make it feel warm and aspirational
* Avoid bullet points — write in paragraph form
* End with a subtle call to action (e.g. “schedule your showing today”)`;
}

function valueOrPlaceholder(value: string) {
  return value.trim() || "[INSERT]";
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

function InstructionBlock({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(22,58,112,0.10)",
        borderRadius: "18px",
        padding: "18px",
        background: "#fbfbf9",
      }}
    >
      <div
        style={{
          fontSize: "16px",
          lineHeight: 1.5,
          color: "var(--ackret-ink)",
          fontWeight: 600,
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "15px",
          lineHeight: 1.8,
          color: "var(--ackret-muted)",
        }}
      >
        {body}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label
      style={{
        display: "grid",
        gap: "8px",
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
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={inputStyle}
      />
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

const primaryButtonInlineStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "999px",
  padding: "12px 18px",
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