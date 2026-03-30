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

  // ✅ CONDITION REPORT DETECTION
  const documentLinks = useMemo(() => {
    const hasConditionReport =
      profile?.progress?.conditionReport?.answers &&
      Object.values(profile.progress.conditionReport.answers).some(
        (a: any) => a.answer !== ""
      );

    return [
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
    ];
  }, [profile, form]);

  const completedDocs = documentLinks.filter((d) => d.url).length;

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div style={{ maxWidth: "1100px" }}>
      <h1>Your Home Sale Headquarters</h1>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        {/* LEFT */}
        <div>
          <h2>Property Info</h2>

          <input
            placeholder="Address"
            value={form.propertyAddress}
            onChange={(e) => updateField("propertyAddress", e.target.value)}
          />

          <textarea
            placeholder="Listing Description"
            value={form.listingDescription}
            onChange={(e) =>
              updateField("listingDescription", e.target.value)
            }
          />
        </div>

        {/* RIGHT (MLS STYLE SIDEBAR) */}
        <div>
          <h3>Documents</h3>

          {documentLinks.map((doc) => (
            <DocumentLinkCard key={doc.label} {...doc} />
          ))}

          <p>Documents: {completedDocs}/6</p>

          <p>{saving ? "Saving..." : saveMessage}</p>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>

      <Link href="/dashboard/list-home">Back</Link>
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
    <div style={{ border: "1px solid #ddd", padding: 10, marginBottom: 10 }}>
      <strong>{label}</strong>

      {isCompleted ? (
        <div style={{ color: "green" }}>✓ Completed</div>
      ) : hasUrl ? (
        <a href={url} target="_blank">
          Open document
        </a>
      ) : (
        <div>Not added yet</div>
      )}
    </div>
  );
}