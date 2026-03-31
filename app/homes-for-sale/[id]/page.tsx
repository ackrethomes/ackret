import Link from "next/link";
import PublicHeader from "@/components/site/PublicHeader";
import { createClient } from "@/lib/supabase/server";

export default async function ListingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ photo?: string }>;
}) {
  const { id } = await params;
  const { photo } = await searchParams;
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("seller_profiles")
    .select("user_id, is_public, progress")
    .eq("user_id", id)
    .single();

  if (error || !profile || !profile.is_public) {
    return (
      <div style={{ background: "var(--ackret-bg)", minHeight: "100vh" }}>
        <PublicHeader />
        <main
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "40px 24px 80px",
          }}
        >
          <div
            style={{
              background: "var(--ackret-surface)",
              border: "1px solid var(--ackret-border)",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "var(--ackret-shadow)",
            }}
          >
            <h1
              style={{
                marginTop: 0,
                marginBottom: "10px",
                fontSize: "32px",
                lineHeight: 1.1,
                color: "var(--ackret-navy)",
                fontWeight: 600,
              }}
            >
              Listing not found
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: "16px",
                lineHeight: 1.8,
                color: "var(--ackret-muted)",
              }}
            >
              This listing is either not public or no longer available.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const form = profile.progress?.listingCenter?.form ?? {};

  const photoPaths: string[] = (() => {
    try {
      return JSON.parse(form.photoGalleryUrl || "[]");
    } catch {
      return [];
    }
  })();

  const signedPhotos = await Promise.all(
    photoPaths.map(async (path) => {
      const { data, error: signedError } = await supabase.storage
        .from("listing-photos")
        .createSignedUrl(path, 60 * 60);

      if (signedError || !data?.signedUrl) {
        console.error("Signed URL error:", signedError);
        return null;
      }

      return data.signedUrl;
    })
  );

  const validPhotoUrls = signedPhotos.filter(
    (url): url is string => typeof url === "string" && url.length > 0
  );

  const requestedIndex = Number(photo ?? "0");
  const activePhotoIndex =
    Number.isInteger(requestedIndex) &&
    requestedIndex >= 0 &&
    requestedIndex < validPhotoUrls.length
      ? requestedIndex
      : 0;

  const mainPhoto = validPhotoUrls[activePhotoIndex] ?? null;

  return (
    <div style={{ background: "var(--ackret-bg)", minHeight: "100vh" }}>
      <PublicHeader />

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 24px 80px",
        }}
      >
        {mainPhoto ? (
          <div
            style={{
              height: "420px",
              borderRadius: "24px",
              overflow: "hidden",
              marginBottom: "18px",
              boxShadow: "var(--ackret-shadow)",
              background: "#f3efe6",
            }}
          >
            <img
              src={mainPhoto}
              alt={form.propertyAddress || "Listing photo"}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              height: "420px",
              borderRadius: "24px",
              overflow: "hidden",
              marginBottom: "18px",
              background: "linear-gradient(180deg, #f4f2ec 0%, #e6e1d7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--ackret-muted)",
              fontSize: "16px",
            }}
          >
            Listing Photo
          </div>
        )}

        {validPhotoUrls.length > 1 ? (
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "30px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {validPhotoUrls.map((url, index) => (
              <Link
                key={index}
                href={`/homes-for-sale/${id}?photo=${index}`}
                style={{
                  display: "block",
                  flex: "0 0 auto",
                  width: "132px",
                  height: "88px",
                  borderRadius: "14px",
                  overflow: "hidden",
                  border:
                    index === activePhotoIndex
                      ? "3px solid var(--ackret-gold-dark)"
                      : "1px solid rgba(22,58,112,0.12)",
                  boxShadow:
                    index === activePhotoIndex
                      ? "0 0 0 1px rgba(22,58,112,0.04)"
                      : "none",
                }}
              >
                <img
                  src={url}
                  alt={`Listing photo ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </Link>
            ))}
          </div>
        ) : null}

        <h1
          style={{
            fontSize: "42px",
            fontWeight: 700,
            color: "var(--ackret-navy)",
            marginBottom: "10px",
            lineHeight: 1,
          }}
        >
          {form.listingPrice || "Price"}
        </h1>

        <div
          style={{
            fontSize: "22px",
            fontWeight: 600,
            marginBottom: "6px",
            color: "var(--ackret-navy)",
          }}
        >
          {form.propertyAddress || "Address coming soon"}
        </div>

        <div
          style={{
            color: "var(--ackret-muted)",
            marginBottom: "20px",
            fontSize: "16px",
          }}
        >
          {form.cityStateZip || "Wisconsin"}
        </div>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
            fontWeight: 600,
            color: "var(--ackret-navy)",
            flexWrap: "wrap",
          }}
        >
          <div>{form.bedrooms || "-"} bd</div>
          <div>{form.bathrooms || "-"} ba</div>
          <div>{form.squareFeet || "-"} sqft</div>
        </div>

        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.9,
            color: "var(--ackret-muted)",
            maxWidth: "700px",
            margin: 0,
          }}
        >
          {form.listingDescription || "Listing description coming soon."}
        </p>
      </main>
    </div>
  );
}