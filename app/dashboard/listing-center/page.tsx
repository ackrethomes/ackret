"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSellerProfile } from "@/hooks/useSellerProfile";

type ListingCenterForm = {
  listingPrice: string;
  propertyAddress: string;
  cityStateZip: string;
  bedrooms: string;
  bathrooms: string;
  squareFeet: string;
  lotSize: string;
  yearBuilt: string;
  listingHeadline: string;
  listingDescription: string;
  photosFolderUrl: string;
  leadPaintUrl: string;
  photoGalleryUrl: string;
  floorPlanUrl: string;
  featureSheetUrl: string;
};

const initialForm: ListingCenterForm = {
  listingPrice: "",
  propertyAddress: "",
  cityStateZip: "",
  bedrooms: "",
  bathrooms: "",
  squareFeet: "",
  lotSize: "",
  yearBuilt: "",
  listingHeadline: "",
  listingDescription: "",
  photosFolderUrl: "",
  leadPaintUrl: "",
  photoGalleryUrl: "",
  floorPlanUrl: "",
  featureSheetUrl: "",
};

export default function ListingCenterPage() {
  const { profile, loading, saving, error, saveProfile } = useSellerProfile();

  const [form, setForm] = useState<ListingCenterForm>(initialForm);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [saveMessage, setSaveMessage] = useState("Loading...");
  const hasLoadedRef = useRef(false);

  function updateField<K extends keyof ListingCenterForm>(
    key: K,
    value: ListingCenterForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaveMessage("Saving...");
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setSelectedImages(fileArray);
  }

  useEffect(() => {
    const urls = selectedImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedImages]);

  useEffect(() => {
    if (!profile || hasLoadedRef.current) return;

    const saved = profile.progress?.listingCenter;
    const conditionReportForm = profile.progress?.conditionReport?.form;
    const conditionReportAnswers = profile.progress?.conditionReport?.answers;
    const listHomeForm = profile.progress?.listHome?.form;

    const hasConditionReport =
      conditionReportAnswers &&
      Object.values(conditionReportAnswers).some((a: any) => a.answer !== "");

    setForm({
      ...initialForm,
      ...(saved?.form || {}),
      propertyAddress:
        saved?.form?.propertyAddress ||
        conditionReportForm?.propertyAddress ||
        "",
      cityStateZip:
        saved?.form?.cityStateZip || listHomeForm?.cityState || "",
      listingPrice: saved?.form?.listingPrice || listHomeForm?.price || "",
      bedrooms: saved?.form?.bedrooms || listHomeForm?.bedrooms || "",
      bathrooms: saved?.form?.bathrooms || listHomeForm?.bathrooms || "",
      squareFeet: saved?.form?.squareFeet || listHomeForm?.squareFootage || "",
      lotSize: saved?.form?.lotSize || listHomeForm?.lotSize || "",
      leadPaintUrl:
        saved?.form?.leadPaintUrl ||
        (conditionReportForm?.builtBefore1978 === "yes" ? "needed" : ""),
      listingDescription: saved?.form?.listingDescription || "",
    });

    hasLoadedRef.current = true;
    setSaveMessage(hasConditionReport ? "Saved" : "Saved");
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

  const conditionReportAnswers = profile?.progress?.conditionReport?.answers;

  const hasConditionReport =
    conditionReportAnswers &&
    Object.values(conditionReportAnswers).some((a: any) => a.answer !== "");

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

  if (loading) {
    return (
      <div style={{ maxWidth: "1180px", paddingTop: "24px" }}>
        <p style={{ color: "var(--ackret-muted)", fontSize: "16px" }}>
          Loading your listing center...
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1240px" }}>
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
        Build this page like a live property listing. Add your price, photos,
        description, and documents here.
      </p>

      <div
        style={{
          marginTop: "28px",
          display: "grid",
          gridTemplateColumns: "1.6fr 0.75fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "grid", gap: "24px" }}>
          <section
            style={{
              background: "var(--ackret-surface)",
              border: "1px solid var(--ackret-border)",
              borderRadius: "28px",
              padding: "24px",
              boxShadow: "var(--ackret-shadow)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2.2fr 1fr",
                gap: "16px",
              }}
            >
              <div
                style={{
                  minHeight: "380px",
                  borderRadius: "24px",
                  border: "1px solid rgba(22,58,112,0.10)",
                  background:
                    "linear-gradient(180deg, #f7f7f4 0%, #eceae4 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "24px",
                  textAlign: "center",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {previewUrls[0] ? (
                  <img
                    src={previewUrls[0]}
                    alt="Main listing preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "20px",
                    }}
                  />
                ) : (
                  <div>
                    <div
                      style={{
                        fontSize: "18px",
                        color: "var(--ackret-navy)",
                        fontWeight: 600,
                        marginBottom: "14px",
                      }}
                    >
                      Main Listing Photo Area
                    </div>

                    <>
                      <button
                        type="button"
                        style={uploadButtonStyle}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Pictures Here
                      </button>

                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                    </>

                    <p
                      style={{
                        marginTop: "14px",
                        marginBottom: 0,
                        fontSize: "14px",
                        lineHeight: 1.7,
                        color: "var(--ackret-muted)",
                      }}
                    >
                      Later we can connect this button to real photo uploads.
                    </p>
                  </div>
                )}
              </div>

              <div style={{ display: "grid", gap: "16px" }}>
                <SmallPhotoCard
                  title="Kitchen Photo"
                  previewUrl={previewUrls[1]}
                />
                <SmallPhotoCard
                  title="Living Room Photo"
                  previewUrl={previewUrls[2]}
                />
                <SmallPhotoCard
                  title="Exterior / Feature Photo"
                  previewUrl={previewUrls[3]}
                />
              </div>
            </div>

            {selectedImages.length > 0 ? (
              <div
                style={{
                  marginTop: "16px",
                  display: "grid",
                  gap: "8px",
                }}
              >
                {selectedImages.map((file, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: "13px",
                      color: "var(--ackret-muted)",
                    }}
                  >
                    {file.name}
                  </div>
                ))}
              </div>
            ) : null}

            <div style={{ marginTop: "24px" }}>
              <label style={labelStyle}>Listing Price</label>
              <input
                type="text"
                value={form.listingPrice}
                onChange={(e) => updateField("listingPrice", e.target.value)}
                placeholder="Listing Price"
                style={priceInputStyle}
              />
            </div>

            <div style={{ marginTop: "18px" }}>
              <div
                style={{
                  display: "flex",
                  gap: "18px",
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <StatPill
                  label="Bedrooms"
                  value={form.bedrooms}
                  placeholder="Bedrooms"
                  onChange={(value) => updateField("bedrooms", value)}
                />
                <StatPill
                  label="Bathrooms"
                  value={form.bathrooms}
                  placeholder="Bathrooms"
                  onChange={(value) => updateField("bathrooms", value)}
                />
                <StatPill
                  label="Sq Ft"
                  value={form.squareFeet}
                  placeholder="Square Feet"
                  onChange={(value) => updateField("squareFeet", value)}
                />
                <StatPill
                  label="Lot Size"
                  value={form.lotSize}
                  placeholder="Lot Size"
                  onChange={(value) => updateField("lotSize", value)}
                />
              </div>
            </div>

            <div style={{ marginTop: "22px" }}>
              <label style={labelStyle}>Property Address</label>
              <input
                type="text"
                value={form.propertyAddress}
                onChange={(e) => updateField("propertyAddress", e.target.value)}
                placeholder="Property Address"
                style={headlineInputStyle}
              />
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>City, State, ZIP</label>
              <input
                type="text"
                value={form.cityStateZip}
                onChange={(e) => updateField("cityStateZip", e.target.value)}
                placeholder="City, State, ZIP"
                style={standardInputStyle}
              />
            </div>

            <div style={{ marginTop: "18px" }}>
              <label style={labelStyle}>Listing Headline</label>
              <input
                type="text"
                value={form.listingHeadline}
                onChange={(e) => updateField("listingHeadline", e.target.value)}
                placeholder="Example: Beautiful updated home with strong curb appeal"
                style={headlineInputStyle}
              />
            </div>

            <div style={{ marginTop: "18px" }}>
              <label style={labelStyle}>Listing Description</label>
              <textarea
                value={form.listingDescription}
                onChange={(e) =>
                  updateField("listingDescription", e.target.value)
                }
                placeholder="Paste your listing description here"
                rows={10}
                style={descriptionStyle}
              />
            </div>
          </section>
        </div>

        <div
          style={{ display: "grid", gap: "20px", position: "sticky", top: 24 }}
        >
          <Card>
            <SectionHeading eyebrow="Documents" title="Listing Documents" />

            <div style={{ display: "grid", gap: "10px" }}>
              {documentLinks.map((doc) => (
                <DocumentLinkCard key={doc.label} {...doc} />
              ))}
            </div>
          </Card>

          <Card>
            <SectionHeading eyebrow="Media" title="Photo Links" />

            <Field
              label="Photos Folder Link"
              value={form.photosFolderUrl}
              onChange={(value) => updateField("photosFolderUrl", value)}
              placeholder="Paste photo folder link"
            />

            <div style={{ height: "12px" }} />

            <Field
              label="Photo Gallery Link"
              value={form.photoGalleryUrl}
              onChange={(value) => updateField("photoGalleryUrl", value)}
              placeholder="Paste photo gallery link"
            />
          </Card>

          <Card>
            <SectionHeading eyebrow="Extras" title="Optional Links" />

            <Field
              label="Floor Plan Link"
              value={form.floorPlanUrl}
              onChange={(value) => updateField("floorPlanUrl", value)}
              placeholder="Paste floor plan link"
            />

            <div style={{ height: "12px" }} />

            <Field
              label="Feature Sheet Link"
              value={form.featureSheetUrl}
              onChange={(value) => updateField("featureSheetUrl", value)}
              placeholder="Paste feature sheet link"
            />
          </Card>

          <Card>
            <SectionHeading eyebrow="Status" title="Progress" />

            <PreviewRow label="Documents" value={`${completedDocs}/6`} />
            <PreviewRow
              label="Save status"
              value={saving ? "Saving..." : saveMessage}
            />
            <PreviewRow
              label="Listing description"
              value={form.listingDescription.trim() ? "Added" : "Missing"}
            />
            <PreviewRow
              label="Selected photos"
              value={selectedImages.length ? `${selectedImages.length}` : "0"}
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

function SmallPhotoCard({
  title,
  previewUrl,
}: {
  title: string;
  previewUrl?: string;
}) {
  return (
    <div
      style={{
        minHeight: "116px",
        borderRadius: "20px",
        border: "1px solid rgba(22,58,112,0.10)",
        background: "#f6f4ee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: previewUrl ? "0" : "12px",
        color: "var(--ackret-muted)",
        fontSize: "14px",
        lineHeight: 1.6,
        overflow: "hidden",
      }}
    >
      {previewUrl ? (
        <img
          src={previewUrl}
          alt={title}
          style={{
            width: "100%",
            height: "116px",
            objectFit: "cover",
          }}
        />
      ) : (
        title
      )}
    </div>
  );
}

function StatPill({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      style={{
        minWidth: "150px",
        border: "1px solid rgba(22,58,112,0.10)",
        borderRadius: "18px",
        padding: "14px 16px",
        background: "#fbfbf9",
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

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "28px",
          fontWeight: 600,
          color: "var(--ackret-navy)",
          padding: 0,
        }}
      />
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

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={standardInputStyle}
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
  const isCompleted = url === "completed";
  const isNeeded = url === "needed";
  const hasUrl = Boolean(url.trim()) && !isCompleted && !isNeeded;

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
      ) : isNeeded ? (
        <div
          style={{
            fontSize: "14px",
            color: "var(--ackret-gold-dark)",
            fontWeight: 600,
          }}
        >
          Needed
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

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontSize: "12px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ackret-gold-dark)",
};

const standardInputStyle: React.CSSProperties = {
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

const priceInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 0",
  fontSize: "54px",
  lineHeight: 1,
  fontWeight: 700,
  border: "none",
  outline: "none",
  background: "transparent",
  color: "var(--ackret-navy)",
  boxSizing: "border-box",
};

const headlineInputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  fontSize: "22px",
  lineHeight: 1.3,
  fontWeight: 600,
  borderRadius: "14px",
  border: "1px solid rgba(22,58,112,0.15)",
  outline: "none",
  background: "#ffffff",
  color: "var(--ackret-navy)",
  boxSizing: "border-box",
};

const descriptionStyle: React.CSSProperties = {
  width: "100%",
  padding: "18px",
  fontSize: "16px",
  lineHeight: 1.9,
  borderRadius: "18px",
  border: "1px solid rgba(22,58,112,0.15)",
  outline: "none",
  background: "#ffffff",
  color: "var(--ackret-ink)",
  boxSizing: "border-box",
  resize: "vertical",
};

const uploadButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "999px",
  padding: "14px 22px",
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