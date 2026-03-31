import PublicHeader from "@/components/site/PublicHeader";
import { createClient } from "@/lib/supabase/server";

export default async function ListingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from("seller_profiles")
    .select("user_id, is_public, progress")
    .eq("user_id", params.id)
    .single();

  if (error || !profile || !profile.is_public) {
    return (
      <div style={{ padding: "40px" }}>
        Listing not found or not public
      </div>
    );
  }

  const form = profile.progress?.listingCenter?.form ?? {};

  const photos: string[] = (() => {
    try {
      return JSON.parse(form.photoGalleryUrl || "[]");
    } catch {
      return [];
    }
  })();

  const supabaseClient = await createClient();

  const photoUrls = await Promise.all(
    photos.map(async (path) => {
      const { data } = await supabaseClient.storage
        .from("listing-photos")
        .createSignedUrl(path, 60 * 60);

      return data?.signedUrl;
    })
  );

  const mainPhoto = photoUrls[0];

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
        {/* Main Image */}
        {mainPhoto ? (
          <div
            style={{
              height: "420px",
              borderRadius: "24px",
              overflow: "hidden",
              marginBottom: "20px",
            }}
          >
            <img
              src={mainPhoto}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ) : null}

        {/* Thumbnail strip */}
        {photoUrls.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "30px",
              overflowX: "auto",
            }}
          >
            {photoUrls.map((url, i) => (
              <img
                key={i}
                src={url || ""}
                style={{
                  width: "120px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <h1
          style={{
            fontSize: "42px",
            fontWeight: 700,
            color: "var(--ackret-navy)",
            marginBottom: "10px",
          }}
        >
          {form.listingPrice || "Price"}
        </h1>

        {/* Address */}
        <div
          style={{
            fontSize: "22px",
            fontWeight: 600,
            marginBottom: "6px",
          }}
        >
          {form.propertyAddress}
        </div>

        <div style={{ color: "var(--ackret-muted)", marginBottom: "20px" }}>
          {form.cityStateZip}
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
            fontWeight: 600,
          }}
        >
          <div>{form.bedrooms} bd</div>
          <div>{form.bathrooms} ba</div>
          <div>{form.squareFeet} sqft</div>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: "16px",
            lineHeight: 1.9,
            color: "var(--ackret-muted)",
            maxWidth: "700px",
          }}
        >
          {form.listingDescription}
        </p>
      </main>
    </div>
  );
}