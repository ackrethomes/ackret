import PublicHeader from "@/components/site/PublicHeader";
import PublicListingGallery from "@/components/site/PublicListingGallery";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
        console.error("Signed URL error for path:", path, signedError);
        return null;
      }

      return data.signedUrl;
    })
  );

  const validPhotoUrls = signedPhotos.filter(
    (url): url is string => typeof url === "string" && url.length > 0
  );

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
        <PublicListingGallery
          photos={validPhotoUrls}
          address={form.propertyAddress || "Listing photo"}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 0.8fr",
            gap: "28px",
            alignItems: "start",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "42px",
                fontWeight: 700,
                color: "var(--ackret-navy)",
                marginTop: 0,
                marginBottom: "10px",
                lineHeight: 1,
              }}
            >
              {form.listingPrice || "Price"}
            </h1>

            <div
              style={{
                fontSize: "24px",
                fontWeight: 600,
                marginBottom: "8px",
                color: "var(--ackret-navy)",
              }}
            >
              {form.propertyAddress || "Address coming soon"}
            </div>

            <div
              style={{
                color: "var(--ackret-muted)",
                marginBottom: "18px",
                fontSize: "16px",
              }}
            >
              {form.cityStateZip || "Wisconsin"}
            </div>

            {form.listingHeadline ? (
              <div
                style={{
                  fontSize: "26px",
                  lineHeight: 1.3,
                  color: "var(--ackret-navy)",
                  fontWeight: 500,
                  marginBottom: "22px",
                }}
              >
                {form.listingHeadline}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                gap: "20px",
                marginBottom: "30px",
                fontWeight: 600,
                color: "var(--ackret-navy)",
                flexWrap: "wrap",
                fontSize: "16px",
              }}
            >
              <div>{form.bedrooms || "-"} bd</div>
              <div>{form.bathrooms || "-"} ba</div>
              <div>{form.squareFeet || "-"} sqft</div>
            </div>

            <section
              style={{
                background: "var(--ackret-surface)",
                border: "1px solid var(--ackret-border)",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "var(--ackret-shadow)",
                marginBottom: "24px",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--ackret-gold-dark)",
                }}
              >
                Overview
              </p>

              <h2
                style={{
                  marginTop: "10px",
                  marginBottom: "18px",
                  fontSize: "30px",
                  lineHeight: 1.15,
                  color: "var(--ackret-navy)",
                  fontWeight: 500,
                }}
              >
                Property details
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "14px",
                }}
              >
                <DetailCard label="Bedrooms" value={form.bedrooms || "-"} />
                <DetailCard label="Bathrooms" value={form.bathrooms || "-"} />
                <DetailCard label="Square Feet" value={form.squareFeet || "-"} />
                <DetailCard label="Lot Size" value={form.lotSize || "-"} />
                <DetailCard label="Year Built" value={form.yearBuilt || "-"} />
                <DetailCard
                  label="City / State"
                  value={form.cityStateZip || "Wisconsin"}
                />
              </div>
            </section>

            <section
              style={{
                background: "var(--ackret-surface)",
                border: "1px solid var(--ackret-border)",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "var(--ackret-shadow)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--ackret-gold-dark)",
                }}
              >
                Description
              </p>

              <h2
                style={{
                  marginTop: "10px",
                  marginBottom: "18px",
                  fontSize: "30px",
                  lineHeight: 1.15,
                  color: "var(--ackret-navy)",
                  fontWeight: 500,
                }}
              >
                About this home
              </h2>

              <p
                style={{
                  fontSize: "16px",
                  lineHeight: 1.9,
                  color: "var(--ackret-muted)",
                  margin: 0,
                }}
              >
                {form.listingDescription || "Listing description coming soon."}
              </p>
            </section>
          </div>

          <aside
            style={{
              display: "grid",
              gap: "20px",
            }}
          >
            <section
              style={{
                background: "var(--ackret-surface)",
                border: "1px solid var(--ackret-border)",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "var(--ackret-shadow)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--ackret-gold-dark)",
                }}
              >
                Quick facts
              </p>

              <h2
                style={{
                  marginTop: "10px",
                  marginBottom: "18px",
                  fontSize: "28px",
                  lineHeight: 1.15,
                  color: "var(--ackret-navy)",
                  fontWeight: 500,
                }}
              >
                Listing summary
              </h2>

              <SidebarRow label="Price" value={form.listingPrice || "-"} />
              <SidebarRow label="Beds" value={form.bedrooms || "-"} />
              <SidebarRow label="Baths" value={form.bathrooms || "-"} />
              <SidebarRow label="Sq Ft" value={form.squareFeet || "-"} />
              <SidebarRow label="Lot Size" value={form.lotSize || "-"} />
              <SidebarRow label="Year Built" value={form.yearBuilt || "-"} />
            </section>

            <section
              style={{
                background: "var(--ackret-surface)",
                border: "1px solid var(--ackret-border)",
                borderRadius: "24px",
                padding: "24px",
                boxShadow: "var(--ackret-shadow)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "var(--ackret-gold-dark)",
                }}
              >
                Interested?
              </p>

              <h2
                style={{
                  marginTop: "10px",
                  marginBottom: "14px",
                  fontSize: "28px",
                  lineHeight: 1.15,
                  color: "var(--ackret-navy)",
                  fontWeight: 500,
                }}
              >
                Want to learn more?
              </h2>

              <p
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  fontSize: "15px",
                  lineHeight: 1.8,
                  color: "var(--ackret-muted)",
                }}
              >
                This listing is being offered directly by the owner through
                Ackret.
              </p>

              <a
                href="/login"
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  color: "#ffffff",
                  background: "var(--ackret-navy)",
                  padding: "14px 18px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Contact Through Ackret
              </a>
            </section>
          </aside>
        </div>
      </main>
    </div>
  );
}

function DetailCard({
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
        borderRadius: "18px",
        padding: "16px",
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

      <div
        style={{
          fontSize: "20px",
          fontWeight: 600,
          color: "var(--ackret-navy)",
          lineHeight: 1.2,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function SidebarRow({
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
        gap: "12px",
        paddingBottom: "10px",
        marginBottom: "10px",
        borderBottom: "1px solid rgba(22,58,112,0.10)",
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