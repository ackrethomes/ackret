"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSellerProfile } from "@/hooks/useSellerProfile";
import { createClient as createSupabaseClient } from "@/hooks/supabase/client";

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

type UploadedPhoto = {
  path: string;
  previewUrl: string;
  name: string;
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

function parseStoredPhotoPaths(value: string | undefined) {
  if (!value) return [] as string[];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export default function ListingCenterPage() {
  const { profile, loading, saving, error, saveProfile } = useSellerProfile();

  const [form, setForm] = useState<ListingCenterForm>(initialForm);
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [showOrganizer, setShowOrganizer] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [saveMessage, setSaveMessage] = useState("Loading...");
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const hasLoadedRef = useRef(false);

  function updateField<K extends keyof ListingCenterForm>(
    key: K,
    value: ListingCenterForm[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaveMessage("Saving...");
  }

  async function buildSignedPhotos(paths: string[]) {
    const supabase = createSupabaseClient();

    const signedResults = await Promise.all(
      paths.map(async (path) => {
        const { data, error } = await supabase.storage
          .from("listing-photos")
          .createSignedUrl(path, 60 * 60 * 24 * 7);

        if (error || !data?.signedUrl) {
          console.error("Signed URL error:", path, error);
          return null;
        }

        return {
          path,
          previewUrl: data.signedUrl,
          name: path.split("/").pop() || "Photo",
        } satisfies UploadedPhoto;
      })
    );

    return signedResults.filter(
      (item): item is UploadedPhoto => item !== null
    );
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const supabase = createSupabaseClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("Unable to get current user for upload.", userError);
      alert("You must be logged in to upload photos.");
      e.target.value = "";
      return;
    }

    setIsUploadingPhotos(true);

    try {
      const uploaded: UploadedPhoto[] = [];
      const folderPath = `${user.id}/listing-center`;

      for (const file of fileArray) {
        const safeName = file.name.replace(/\s+/g, "-");
        const filePath = `${folderPath}/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2)}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-photos")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue;
        }

        const { data: signedData, error: signedError } = await supabase.storage
          .from("listing-photos")
          .createSignedUrl(filePath, 60 * 60 * 24 * 7);

        if (signedError || !signedData?.signedUrl) {
          console.error("Signed URL creation error:", signedError);
          continue;
        }

        uploaded.push({
          path: filePath,
          previewUrl: signedData.signedUrl,
          name: file.name,
        });
      }

      if (uploaded.length > 0) {
        setUploadedPhotos((prev) => {
          const next = [...prev, ...uploaded];
          const nextPaths = next.map((photo) => photo.path);

          setForm((current) => ({
            ...current,
            photosFolderUrl: folderPath,
            photoGalleryUrl: JSON.stringify(nextPaths),
          }));

          return next;
        });

        if (uploadedPhotos.length === 0) {
          setActivePhotoIndex(0);
        }

        setSaveMessage("Saving...");
      }
    } finally {
      setIsUploadingPhotos(false);
      e.target.value = "";
    }
  }

  async function togglePublicListing() {
    const nextValue = !isPublic;

    setIsPublic(nextValue);

    const supabase = createSupabaseClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error: updateError } = await supabase
      .from("seller_profiles")
      .update({ is_public: nextValue })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating public listing status:", updateError);
      setIsPublic(!nextValue);
      alert("Unable to update listing visibility right now.");
    }
  }

  function moveImageLeft(index: number) {
    if (index === 0) return;

    setUploadedPhotos((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });

    setActivePhotoIndex((prev) => {
      if (prev === index) return index - 1;
      if (prev === index - 1) return index;
      return prev;
    });

    setSaveMessage("Saving...");
  }

  function moveImageRight(index: number) {
    setUploadedPhotos((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });

    setActivePhotoIndex((prev) => {
      if (prev === index) return index + 1;
      if (prev === index + 1) return index;
      return prev;
    });

    setSaveMessage("Saving...");
  }

  function removeImage(index: number) {
    setUploadedPhotos((prev) => prev.filter((_, i) => i !== index));

    setActivePhotoIndex((prev) => {
      if (index === prev) return 0;
      if (index < prev) return prev - 1;
      return prev;
    });

    setSaveMessage("Saving...");
  }

  useEffect(() => {
    if (!profile || hasLoadedRef.current) return;

    const saved = profile.progress?.listingCenter;
    const conditionReportForm = profile.progress?.conditionReport?.form;
    const conditionReportAnswers = profile.progress?.conditionReport?.answers;
    const listHomeForm = profile.progress?.listHome?.form;

    const hasConditionReport =
      conditionReportAnswers &&
      Object.values(conditionReportAnswers).some((a: any) => a.answer !== "");

    const nextForm: ListingCenterForm = {
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
    };

    setForm(nextForm);
    setIsPublic(Boolean((profile as any)?.is_public));

    const storedPaths = parseStoredPhotoPaths(nextForm.photoGalleryUrl);

    if (storedPaths.length > 0) {
      buildSignedPhotos(storedPaths)
        .then((photos) => {
          setUploadedPhotos(photos);
          setActivePhotoIndex(0);
        })
        .catch((err) => {
          console.error("Unable to load stored listing photos.", err);
        });
    }

    hasLoadedRef.current = true;
    setSaveMessage(hasConditionReport ? "Saved" : "Saved");
  }, [profile]);

  useEffect(() => {
    if (!hasLoadedRef.current) return;

    const nextPaths = uploadedPhotos.map((photo) => photo.path);
    const nextGalleryValue = JSON.stringify(nextPaths);

    setForm((prev) => {
      if (prev.photoGalleryUrl === nextGalleryValue) return prev;

      return {
        ...prev,
        photoGalleryUrl: nextGalleryValue,
      };
    });
  }, [uploadedPhotos]);

  useEffect(() => {
    if (activePhotoIndex > uploadedPhotos.length - 1) {
      setActivePhotoIndex(0);
    }
  }, [uploadedPhotos, activePhotoIndex]);

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
        url: uploadedPhotos.length > 0 ? "completed" : form.photoGalleryUrl,
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
      uploadedPhotos.length,
    ]
  );

  const completedDocs = documentLinks.filter((d) => d.url).length;
  const activePhoto = uploadedPhotos[activePhotoIndex];

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

      <div style={{ marginTop: "20px" }}>
        <button
          type="button"
          onClick={togglePublicListing}
          style={{
            border: "none",
            borderRadius: "999px",
            padding: "14px 22px",
            background: isPublic ? "#15803d" : "var(--ackret-navy)",
            color: "#ffffff",
            fontSize: "13px",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          {isPublic ? "Listing is Public" : "Make Listing Public"}
        </button>
      </div>

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
                minHeight: "420px",
                borderRadius: "24px",
                border: "1px solid rgba(22,58,112,0.10)",
                background:
                  "linear-gradient(180deg, #f7f7f4 0%, #eceae4 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: activePhoto ? "0" : "24px",
                textAlign: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {activePhoto ? (
                <>
                  <img
                    src={activePhoto.previewUrl}
                    alt="Main listing preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: "16px",
                      bottom: "16px",
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      style={overlayButtonStyle}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {isUploadingPhotos ? "Uploading..." : "Add More Photos"}
                    </button>

                    <button
                      type="button"
                      style={overlayButtonStyle}
                      onClick={() => setShowOrganizer((prev) => !prev)}
                    >
                      {showOrganizer
                        ? "Hide Organizer"
                        : "See / Rearrange All Photos"}
                    </button>

                    <button
                      type="button"
                      style={overlayButtonStyle}
                      onClick={() => removeImage(activePhotoIndex)}
                    >
                      Remove This Photo
                    </button>
                  </div>
                </>
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

                  <button
                    type="button"
                    style={uploadButtonStyle}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhotos}
                  >
                    {isUploadingPhotos
                      ? "Uploading..."
                      : "Upload Pictures Here"}
                  </button>

                  <p
                    style={{
                      marginTop: "14px",
                      marginBottom: 0,
                      fontSize: "14px",
                      lineHeight: 1.7,
                      color: "var(--ackret-muted)",
                    }}
                  >
                    Upload multiple photos, then click any thumbnail below to
                    enlarge it.
                  </p>
                </div>
              )}

              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageUpload}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "10px",
                }}
              >
                <SectionLabel>Photo Strip</SectionLabel>

                {uploadedPhotos.length > 0 ? (
                  <button
                    type="button"
                    style={textButtonStyle}
                    onClick={() => setShowOrganizer((prev) => !prev)}
                  >
                    {showOrganizer
                      ? "Hide Organizer"
                      : "See / Rearrange All Photos"}
                  </button>
                ) : null}
              </div>

              {uploadedPhotos.length > 0 ? (
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    overflowX: "auto",
                    paddingBottom: "6px",
                  }}
                >
                  {uploadedPhotos.map((photo, index) => (
                    <button
                      key={`${photo.path}-${index}`}
                      type="button"
                      onClick={() => setActivePhotoIndex(index)}
                      style={{
                        flex: "0 0 auto",
                        width: "120px",
                        height: "88px",
                        padding: 0,
                        borderRadius: "16px",
                        overflow: "hidden",
                        border:
                          index === activePhotoIndex
                            ? "3px solid var(--ackret-gold-dark)"
                            : "1px solid rgba(22,58,112,0.12)",
                        background: "#ffffff",
                        cursor: "pointer",
                        position: "relative",
                      }}
                    >
                      <img
                        src={photo.previewUrl}
                        alt={`Photo ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--ackret-muted)",
                    lineHeight: 1.7,
                  }}
                >
                  No photos uploaded yet.
                </div>
              )}
            </div>

            {showOrganizer && uploadedPhotos.length > 0 ? (
              <div style={{ marginTop: "18px" }}>
                <SectionLabel>Photo Organizer</SectionLabel>

                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  {uploadedPhotos.map((photo, index) => (
                    <div
                      key={`${photo.path}-organizer-${index}`}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "88px 1fr auto",
                        gap: "14px",
                        alignItems: "center",
                        border: "1px solid rgba(22,58,112,0.10)",
                        borderRadius: "18px",
                        padding: "12px",
                        background:
                          index === activePhotoIndex ? "#fffaf0" : "#fbfbf9",
                      }}
                    >
                      <div
                        style={{
                          width: "88px",
                          height: "66px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          background: "#eceae4",
                          border: "1px solid rgba(22,58,112,0.08)",
                        }}
                      >
                        <img
                          src={photo.previewUrl}
                          alt={photo.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: "15px",
                            color: "var(--ackret-navy)",
                            fontWeight: 600,
                          }}
                        >
                          {photo.name}
                        </div>

                        <div
                          style={{
                            marginTop: "4px",
                            fontSize: "13px",
                            color: "var(--ackret-muted)",
                          }}
                        >
                          {index === activePhotoIndex
                            ? `Currently enlarged • Position ${index + 1}`
                            : `Position ${index + 1}`}
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          flexWrap: "wrap",
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          type="button"
                          style={miniActionButtonStyle}
                          onClick={() => setActivePhotoIndex(index)}
                        >
                          Enlarge
                        </button>

                        <button
                          type="button"
                          style={miniActionButtonStyle}
                          onClick={() => moveImageLeft(index)}
                          disabled={index === 0}
                        >
                          ←
                        </button>

                        <button
                          type="button"
                          style={miniActionButtonStyle}
                          onClick={() => moveImageRight(index)}
                          disabled={index === uploadedPhotos.length - 1}
                        >
                          →
                        </button>

                        <button
                          type="button"
                          style={miniDangerButtonStyle}
                          onClick={() => removeImage(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {uploadedPhotos.length > 0 ? (
              <div
                style={{
                  marginTop: "14px",
                  fontSize: "13px",
                  color: "var(--ackret-muted)",
                }}
              >
                Clicking a thumbnail only changes the enlarged photo. Use the
                organizer to change the saved order.
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
            <SectionHeading eyebrow="Visibility" title="Public Listing" />

            <PreviewRow
              label="Status"
              value={isPublic ? "Public" : "Private"}
            />

            <div
              style={{
                marginTop: "14px",
                fontSize: "14px",
                lineHeight: 1.8,
                color: "var(--ackret-muted)",
              }}
            >
              When public, this listing will be eligible to appear on the Homes
              for Sale page.
            </div>
          </Card>

          <Card>
            <SectionHeading eyebrow="Media" title="Photo Links" />

            <Field
              label="Photos Folder"
              value={form.photosFolderUrl}
              onChange={(value) => updateField("photosFolderUrl", value)}
              placeholder="This will fill automatically after uploads"
            />

            <div style={{ height: "12px" }} />

            <Field
              label="Stored Photo Order"
              value={form.photoGalleryUrl}
              onChange={(value) => updateField("photoGalleryUrl", value)}
              placeholder="This will fill automatically after uploads"
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
              label="Uploaded photos"
              value={uploadedPhotos.length ? `${uploadedPhotos.length}` : "0"}
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginBottom: "10px",
        fontSize: "12px",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "var(--ackret-gold-dark)",
      }}
    >
      {children}
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

const textButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "var(--ackret-gold-dark)",
  fontSize: "13px",
  cursor: "pointer",
  textDecoration: "underline",
  padding: 0,
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

const overlayButtonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "999px",
  padding: "10px 16px",
  background: "rgba(22,58,112,0.88)",
  color: "#ffffff",
  fontSize: "12px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const miniActionButtonStyle: React.CSSProperties = {
  borderRadius: "999px",
  border: "1px solid rgba(22,58,112,0.12)",
  background: "#ffffff",
  color: "var(--ackret-navy)",
  fontSize: "12px",
  padding: "8px 12px",
  cursor: "pointer",
};

const miniDangerButtonStyle: React.CSSProperties = {
  borderRadius: "999px",
  border: "1px solid rgba(180,35,24,0.18)",
  background: "#ffffff",
  color: "#b42318",
  fontSize: "12px",
  padding: "8px 12px",
  cursor: "pointer",
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