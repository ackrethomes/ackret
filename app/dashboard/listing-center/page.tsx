"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSellerProfile } from "@/hooks/useSellerProfile";

type ListingCenterForm = {
  propertyAddress: string;
  cityStateZip: string;
  listPrice: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  lotSize: string;
  yearBuilt: string;
  mlsHeadline: string;
  listingDescription: string;
  leadPaintUrl: string;
  photosFolderUrl: string;
  photoGalleryUrl: string;
  floorPlanUrl: string;
  featureSheetUrl: string;
  showingInstructions: string;
  agentCompensationNotes: string;
  privateNotes: string;
};

const initialForm: ListingCenterForm = {
  propertyAddress: "",
  cityStateZip: "",
  listPrice: "",
  bedrooms: "",
  bathrooms: "",
  squareFeet: "",
  lotSize: "",
  yearBuilt: "",
  mlsHeadline: "",
  listingDescription: "",
  leadPaintUrl: "",
  photosFolderUrl: "",
  photoGalleryUrl: "",
  floorPlanUrl: "",
  featureSheetUrl: "",
  showingInstructions: "",
  agentCompensationNotes: "",
  privateNotes: "",
};

export default function ListingCenterPage() {
  const { profile, loading, saving, error, saveProfile } = useSellerProfile();

  const [form, setForm] = useState<ListingCenterForm>(initialForm);
  const [saveMessage, setSaveMessage] = useState("Loading...");
  const hasLoadedRef = useRef(false);

  function updateField<K extends keyof ListingCenterForm>(
    key: K,
    value: ListingCenterForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaveMessage("Saving...");
  }

  useEffect(() => {
    if (!profile || hasLoadedRef.current) return;

    const saved = profile.progress?.listingCenter;

    if (saved?.form) {
      setForm({ ...initialForm, ...saved.form });
    }

    hasLoadedRef.current = true;
    setSaveMessage("Saved");
  }, [profile]);

  useEffect(() => {
    if (!hasLoadedRef.current) return;

    const timeout = setTimeout(async () => {
      const result = await saveProfile({
        currentStep: "listing-center",
        progressPatch: {
          listingCenter: { form },
        },
      });

      setSaveMessage(result ? "Saved" : "Save failed");
    }, 800);

    return () => clearTimeout(timeout);
  }, [form, saveProfile]);

  const conditionReportForm = profile?.progress?.conditionReport?.form;
  const conditionReportAnswers = profile?.progress?.conditionReport?.answers;
  const listHomeForm = profile?.progress?.listHome?.form;

  const hasConditionReport =
    conditionReportAnswers &&
    Object.values(conditionReportAnswers).some((a: any) => a.answer !== "");

  const derivedAddress =
    form.propertyAddress || conditionReportForm?.propertyAddress || "";

  const derivedCityStateZip =
    form.cityStateZip || listHomeForm?.cityState || "";

  const derivedPrice = form.listPrice || listHomeForm?.price || "";

  const derivedBedrooms = form.bedrooms || listHomeForm?.bedrooms || "";

  const derivedBathrooms = form.bathrooms || listHomeForm?.bathrooms || "";

  const derivedSquareFeet = form.squareFeet || listHomeForm?.squareFootage || "";

  const derivedLotSize = form.lotSize || listHomeForm?.lotSize || "";

  const documentLinks = useMemo(
    () => [
      {
        label: "Condition Report",
        url: hasConditionReport ? "completed" : "",
      },
      {
        label: "Lead-Based Paint Disclosure",
        url: form.leadPaintUrl,
      },
      {
        label: "Photos Folder",
        url: form.photosFolderUrl,
      },
      {
        label: "Photo Gallery",
        url: form.photoGalleryUrl,
      },
      {
        label: "Floor Plan",
        url: form.floorPlanUrl,
      },
      {
        label: "Feature Sheet",
        url: form.featureSheetUrl,
      },
    ],
    [
      hasConditionReport,
      form.leadPaintUrl,
      form.photosFolderUrl,
      form.photoGalleryUrl,
      form.floorPlanUrl,
      form.featureSheetUrl,
    ]
  );

  const completedDocs = documentLinks.filter((d) => d.url).length;

  const readinessItems = [
    {
      label: "Property address",
      done: Boolean(derivedAddress),
    },
    {
      label: "Price",
      done: Boolean(derivedPrice),
    },
    {
      label: "Beds / baths",
      done: Boolean(derivedBedrooms && derivedBathrooms),
    },
    {
      label: "Square footage",
      done: Boolean(derivedSquareFeet),
    },
    {
      label: "Listing description",
      done: Boolean(form.listingDescription.trim()),
    },
    {
      label: "Condition report",
      done: Boolean(hasConditionReport),
    },
  ];

  if (loading) {
    return (
      <div style={{ maxWidth: "1180px", paddingTop: "24px" }}>
        <p style={{ color: "var(--ackret-muted)", fontSize: "16px" }}>
          Loading your home sale hub...
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1220px" }}>
      <p
        style={{
          margin: 0,
          fontSize: "12px",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--ackret-gold-dark)",
        }}
      >
        Home Sale Hub
      </p>

      <h1
        style={{
          marginTop: "14px",
          marginBottom: "14px",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          lineHeight: 1.05,
          color: "var(--ackret-navy)",
          fontWeight: 500,
        }}
      >
        Your Home Sale Headquarters
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
        This is the center of your home sale. Keep your documents, listing
        details, photos, and notes all in one organized place.
      </p>

      <div
        style={{
          marginTop: "28px",
          display: "grid",
          gridTemplateColumns: "1.45fr 1.1fr 0.9fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: "24px" }}>
          <Card>
            <SectionHeading
              eyebrow="MLS Snapshot"
              title="Property details"
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
                onChange={(value) => updateField("propertyAddress", value)}
                placeholder={conditionReportForm?.propertyAddress || "123 Main Street"}
                fullWidth
              />

              <Field
                label="City, State, ZIP"
                value={form.cityStateZip}
                onChange={(value) => updateField("cityStateZip", value)}
                placeholder={listHomeForm?.cityState || "Elkhorn, WI 53121"}
              />

              <Field
                label="List Price"
                value={form.listPrice}
                onChange={(value) => updateField("listPrice", value)}
                placeholder={listHomeForm?.price || "$425,000"}
              />

              <Field
                label="Bedrooms"
                value={form.bedrooms}
                onChange={(value) => updateField("bedrooms", value)}
                placeholder={listHomeForm?.bedrooms || "4"}
              />

              <Field
                label="Bathrooms"
                value={form.bathrooms}
                onChange={(value) => updateField("bathrooms", value)}
                placeholder={listHomeForm?.bathrooms || "2.5"}
              />

              <Field
                label="Square Feet"
                value={form.squareFeet}
                onChange={(value) => updateField("squareFeet", value)}
                placeholder={listHomeForm?.squareFootage || "2,350"}
              />

              <Field
                label="Lot Size"
                value={form.lotSize}
                onChange={(value) => updateField("lotSize", value)}
                placeholder={listHomeForm?.lotSize || "0.42 acres"}
              />

              <Field
                label="Year Built"
                value={form.yearBuilt}
                onChange={(value) => updateField("yearBuilt", value)}
                placeholder="1998"
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Public Remarks"
              title="Headline and listing description"
            />

            <div style={{ display: "grid", gap: "18px" }}>
              <Field
                label="MLS Headline"
                value={form.mlsHeadline}
                onChange={(value) => updateField("mlsHeadline", value)}
                placeholder="Beautiful updated home with strong curb appeal"
              />

              <TextAreaField
                label="Listing Description"
                value={form.listingDescription}
                onChange={(value) => updateField("listingDescription", value)}
                placeholder="Paste your final listing description here after generating it from the List the Home page."
                rows={12}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Notes"
              title="Showing and sale notes"
            />

            <div style={{ display: "grid", gap: "18px" }}>
              <TextAreaField
                label="Showing Instructions"
                value={form.showingInstructions}
                onChange={(value) => updateField("showingInstructions", value)}
                placeholder="24-hour notice preferred. Text seller before showings."
                rows={4}
              />

              <TextAreaField
                label="Buyer Agent Compensation Notes"
                value={form.agentCompensationNotes}
                onChange={(value) =>
                  updateField("agentCompensationNotes", value)
                }
                placeholder="Keep notes here for how you want to handle buyer-agent conversations."
                rows={4}
              />

              <TextAreaField
                label="Private Notes"
                value={form.privateNotes}
                onChange={(value) => updateField("privateNotes", value)}
                placeholder="Anything you want to keep handy for your sale."
                rows={5}
              />
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "24px" }}>
          <Card>
            <SectionHeading
              eyebrow="Live Summary"
              title="What you have so far"
            />

            <SummaryBlock
              title={derivedAddress || "Property address not added yet"}
              subtitle={derivedCityStateZip || "City / State / ZIP not added yet"}
            />

            <div
              style={{
                marginTop: "18px",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "12px",
              }}
            >
              <MiniStat
                label="Price"
                value={derivedPrice || "Missing"}
              />
              <MiniStat
                label="Beds / Baths"
                value={
                  derivedBedrooms || derivedBathrooms
                    ? `${derivedBedrooms || "-"} / ${derivedBathrooms || "-"}`
                    : "Missing"
                }
              />
              <MiniStat
                label="Sq Ft"
                value={derivedSquareFeet || "Missing"}
              />
              <MiniStat
                label="Lot Size"
                value={derivedLotSize || "Missing"}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Readiness"
              title="What is complete?"
            />

            <div style={{ display: "grid", gap: "10px" }}>
              {readinessItems.map((item) => (
                <ReadinessRow
                  key={item.label}
                  label={item.label}
                  done={item.done}
                />
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Description Preview"
              title="Listing copy"
            />

            <div
              style={{
                minHeight: "220px",
                border: "1px solid rgba(22,58,112,0.10)",
                borderRadius: "18px",
                padding: "18px",
                background: "#fbfbf9",
              }}
            >
              {form.listingDescription.trim() ? (
                <p
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    lineHeight: 1.9,
                    color: "var(--ackret-ink)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {form.listingDescription}
                </p>
              ) : (
                <p
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    lineHeight: 1.8,
                    color: "var(--ackret-muted)",
                  }}
                >
                  No listing description has been added yet. Once you write your
                  listing copy from the List the Home page, paste it here so this
                  hub becomes the central source of truth for the property.
                </p>
              )}
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading eyebrow="Documents" title="Side panel" />

            <div style={{ display: "grid", gap: "10px" }}>
              {documentLinks.map((doc) => (
                <DocumentLinkCard key={doc.label} {...doc} />
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeading eyebrow="Status" title="Progress" />

            <PreviewRow
              label="Documents"
              value={`${completedDocs}/6`}
            />
            <PreviewRow
              label="Save status"
              value={saving ? "Saving..." : saveMessage}
            />
            <PreviewRow
              label="Description"
              value={form.listingDescription.trim() ? "Added" : "Missing"}
            />

            {error ? (
              <p
                style={{
                  marginTop: "16px",
                  marginBottom: 0,
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "#b42318",
                }}
              >
                {error}
              </p>
            ) : null}
          </Card>

          <Link
            href="/dashboard/list-home"
            style={{ textDecoration: "none" }}
          >
            <div style={secondaryActionButtonStyle}>Back to List the Home</div>
          </Link>
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
  fullWidth = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows: number;
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

function SummaryBlock({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
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
          fontSize: "22px",
          lineHeight: 1.3,
          color: "var(--ackret-navy)",
          fontWeight: 600,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "15px",
          lineHeight: 1.7,
          color: "var(--ackret-muted)",
        }}
      >
        {subtitle}
      </div>
    </div>
  );
}

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        border: "1px solid rgba(22,58,112,0.10)",
        borderRadius: "16px",
        padding: "14px",
        background: "#ffffff",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ackret-gold-dark)",
          marginBottom: "8px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontSize: "18px",
          color: "var(--ackret-navy)",
          fontWeight: 600,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function ReadinessRow({
  label,
  done,
}: {
  label: string;
  done: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        padding: "12px 14px",
        borderRadius: "16px",
        border: "1px solid rgba(22,58,112,0.10)",
        background: "#fbfbf9",
      }}
    >
      <span
        style={{
          fontSize: "15px",
          color: "var(--ackret-ink)",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: done ? "green" : "var(--ackret-muted)",
        }}
      >
        {done ? "Complete" : "Missing"}
      </span>
    </div>
  );
}

function PreviewRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "14px",
        paddingBottom: "10px",
        marginBottom: "10px",
        borderBottom: "1px solid rgba(22,58,112,0.10)",
      }}
    >
      <span
        style={{
          fontSize: "14px",
          color: "var(--ackret-muted)",
        }}
      >
        {label}
      </span>

      <span
        style={{
          fontSize: "14px",
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

function DocumentLinkCard({
  label,
  url,
}: {
  label: string;
  url: string;
}) {
  const isCompleted = url === "completed";
  const hasUrl = Boolean(url.trim()) && !isCompleted;

  return (
    <div
      style={{
        border: "1px solid rgba(22,58,112,0.12)",
        borderRadius: "16px",
        padding: "14px 16px",
        background: "#fbfbf9",
      }}
    >
      <div
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--ackret-navy)",
          marginBottom: "6px",
        }}
      >
        {label}
      </div>

      {isCompleted ? (
        <div
          style={{
            fontSize: "14px",
            color: "green",
            fontWeight: 600,
          }}
        >
          ✓ Completed
        </div>
      ) : hasUrl ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: "14px",
            color: "var(--ackret-gold-dark)",
            textDecoration: "underline",
            wordBreak: "break-word",
          }}
        >
          Open document
        </a>
      ) : (
        <div
          style={{
            fontSize: "14px",
            color: "var(--ackret-muted)",
          }}
        >
          Not added yet
        </div>
      )}
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