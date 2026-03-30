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
  conditionReportUrl: string;
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
  conditionReportUrl: "",
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
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSaveMessage("Saving...");
  }

  useEffect(() => {
    if (!profile || hasLoadedRef.current) return;

    const saved = profile.progress?.listingCenter;

    if (saved?.form) {
      setForm({
        ...initialForm,
        ...saved.form,
      });
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
          listingCenter: {
            form,
          },
        },
      });

      setSaveMessage(result ? "Saved" : "Save failed");
    }, 800);

    return () => clearTimeout(timeout);
  }, [form, saveProfile]);

  const documentLinks = useMemo(
    () => [
      {
        label: "Condition Report",
        url: form.conditionReportUrl,
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
      form.conditionReportUrl,
      form.leadPaintUrl,
      form.photosFolderUrl,
      form.photoGalleryUrl,
      form.floorPlanUrl,
      form.featureSheetUrl,
    ]
  );

  const completedDocs = documentLinks.filter((item) => item.url.trim()).length;

  if (loading) {
    return (
      <div style={{ maxWidth: "1100px", paddingTop: "24px" }}>
        <p style={{ color: "var(--ackret-muted)", fontSize: "16px" }}>
          Loading your listing center...
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
        Listing Center
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
        Your MLS-Style Listing Hub
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
        Keep your home information, listing description, photos, and disclosure
        links in one place so everything is organized before you publish.
      </p>

      <div
        style={{
          marginTop: "28px",
          display: "grid",
          gridTemplateColumns: "1.6fr 0.9fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: "24px" }}>
          <Card>
            <SectionHeading
              eyebrow="Property Snapshot"
              title="Main listing details"
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
                placeholder="123 Main Street"
              />
              <Field
                label="City, State, ZIP"
                value={form.cityStateZip}
                onChange={(value) => updateField("cityStateZip", value)}
                placeholder="Elkhorn, WI 53121"
              />
              <Field
                label="List Price"
                value={form.listPrice}
                onChange={(value) => updateField("listPrice", value)}
                placeholder="$425,000"
              />
              <Field
                label="Bedrooms"
                value={form.bedrooms}
                onChange={(value) => updateField("bedrooms", value)}
                placeholder="4"
              />
              <Field
                label="Bathrooms"
                value={form.bathrooms}
                onChange={(value) => updateField("bathrooms", value)}
                placeholder="2.5"
              />
              <Field
                label="Square Feet"
                value={form.squareFeet}
                onChange={(value) => updateField("squareFeet", value)}
                placeholder="2,350"
              />
              <Field
                label="Lot Size"
                value={form.lotSize}
                onChange={(value) => updateField("lotSize", value)}
                placeholder="0.42 acres"
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
              title="MLS headline and listing description"
            />

            <div style={{ display: "grid", gap: "18px" }}>
              <Field
                label="MLS Headline"
                value={form.mlsHeadline}
                onChange={(value) => updateField("mlsHeadline", value)}
                placeholder="Beautiful updated 4-bedroom home near downtown Elkhorn"
              />

              <TextAreaField
                label="Listing Description"
                value={form.listingDescription}
                onChange={(value) => updateField("listingDescription", value)}
                placeholder="Paste the final listing description here..."
                rows={10}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Documents and Media"
              title="Save all of your important links"
            />

            <div style={{ display: "grid", gap: "18px" }}>
              <Field
                label="Condition Report PDF Link"
                value={form.conditionReportUrl}
                onChange={(value) => updateField("conditionReportUrl", value)}
                placeholder="Paste PDF link"
              />

              <Field
                label="Lead-Based Paint Disclosure Link"
                value={form.leadPaintUrl}
                onChange={(value) => updateField("leadPaintUrl", value)}
                placeholder="Paste PDF link"
              />

              <Field
                label="Photos Folder Link"
                value={form.photosFolderUrl}
                onChange={(value) => updateField("photosFolderUrl", value)}
                placeholder="Paste Google Drive / Dropbox / folder link"
              />

              <Field
                label="Photo Gallery Link"
                value={form.photoGalleryUrl}
                onChange={(value) => updateField("photoGalleryUrl", value)}
                placeholder="Paste public gallery link"
              />

              <Field
                label="Floor Plan Link"
                value={form.floorPlanUrl}
                onChange={(value) => updateField("floorPlanUrl", value)}
                placeholder="Paste link"
              />

              <Field
                label="Feature Sheet Link"
                value={form.featureSheetUrl}
                onChange={(value) => updateField("featureSheetUrl", value)}
                placeholder="Paste link"
              />
            </div>
          </Card>

          <Card>
            <SectionHeading
              eyebrow="Showing Notes"
              title="Internal notes for your sale"
            />

            <div style={{ display: "grid", gap: "18px" }}>
              <TextAreaField
                label="Showing Instructions"
                value={form.showingInstructions}
                onChange={(value) => updateField("showingInstructions", value)}
                placeholder="Example: 24-hour notice preferred. Text seller before showings."
                rows={4}
              />

              <TextAreaField
                label="Buyer Agent Compensation Notes"
                value={form.agentCompensationNotes}
                onChange={(value) =>
                  updateField("agentCompensationNotes", value)
                }
                placeholder="Example: Will review buyer-agent compensation requests case by case."
                rows={4}
              />

              <TextAreaField
                label="Private Notes"
                value={form.privateNotes}
                onChange={(value) => updateField("privateNotes", value)}
                placeholder="Anything you want to keep handy for your own workflow"
                rows={5}
              />
            </div>
          </Card>
        </div>

        <div style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}>
          <Card>
            <SectionHeading eyebrow="MLS Preview" title="Quick property card" />

            <div style={{ display: "grid", gap: "12px" }}>
              <PreviewRow
                label="Address"
                value={form.propertyAddress || "Not added yet"}
              />
              <PreviewRow
                label="Location"
                value={form.cityStateZip || "Not added yet"}
              />
              <PreviewRow
                label="Price"
                value={form.listPrice || "Not added yet"}
              />
              <PreviewRow
                label="Beds / Baths"
                value={
                  form.bedrooms || form.bathrooms
                    ? `${form.bedrooms || "-"} / ${form.bathrooms || "-"}`
                    : "Not added yet"
                }
              />
              <PreviewRow
                label="Sq Ft"
                value={form.squareFeet || "Not added yet"}
              />
              <PreviewRow
                label="Lot"
                value={form.lotSize || "Not added yet"}
              />
              <PreviewRow
                label="Year Built"
                value={form.yearBuilt || "Not added yet"}
              />
            </div>
          </Card>

          <Card>
            <SectionHeading eyebrow="Document Links" title="Side panel" />

            <div style={{ display: "grid", gap: "10px" }}>
              {documentLinks.map((item) => (
                <DocumentLinkCard
                  key={item.label}
                  label={item.label}
                  url={item.url}
                />
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeading eyebrow="Status" title="Progress" />

            <PreviewRow
              label="Documents linked"
              value={`${completedDocs} / 6`}
            />
            <PreviewRow
              label="Save status"
              value={saving ? "Saving..." : saveMessage}
            />
            <PreviewRow
              label="Listing description"
              value={
                form.listingDescription.trim()
                  ? "Added"
                  : "Not added yet"
              }
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
            style={{
              textDecoration: "none",
            }}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows: number;
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
  const hasUrl = Boolean(url.trim());

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

      {hasUrl ? (
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
          No link added yet
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