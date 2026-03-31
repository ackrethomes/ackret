import Link from "next/link";
import PublicHeader from "@/components/site/PublicHeader";
import { createClient as createAdminClient } from "@supabase/supabase-js";

const supabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type PublicListing = {
  id: string;
  address: string;
  cityStateZip: string;
  price: string;
  beds: string;
  baths: string;
  sqft: string;
  description: string;
  thumbnailUrl: string | null;
};

export default async function HomesForSalePage() {
  const { data: profiles, error } = await supabase
    .from("seller_profiles")
    .select("user_id, is_public, progress")
    .eq("is_public", true)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error loading public listings:", error);
  }

  const homes: PublicListing[] = await Promise.all(
    (profiles ?? []).map(async (profile: any) => {
      const listingForm = profile?.progress?.listingCenter?.form ?? {};

      let thumbnailUrl: string | null = null;

      try {
        const photoPaths: string[] = JSON.parse(
          listingForm.photoGalleryUrl || "[]"
        );

        if (Array.isArray(photoPaths) && photoPaths.length > 0) {
          const { data, error: signedError } = await supabase.storage
            .from("listing-photos")
            .createSignedUrl(photoPaths[0], 60 * 60);

          if (!signedError && data?.signedUrl) {
            thumbnailUrl = data.signedUrl;
          }
        }
      } catch (err) {
        console.error("Unable to load thumbnail for listing:", err);
      }

      return {
        id: profile.user_id,
        address: listingForm.propertyAddress || "Address coming soon",
        cityStateZip: listingForm.cityStateZip || "Wisconsin",
        price: listingForm.listingPrice || "Price coming soon",
        beds: listingForm.bedrooms || "-",
        baths: listingForm.bathrooms || "-",
        sqft: listingForm.squareFeet || "-",
        description:
          listingForm.listingDescription ||
          "Listing description coming soon.",
        thumbnailUrl,
      };
    })
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ackret-bg)",
      }}
    >
      <PublicHeader />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "56px 24px 80px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ackret-gold-dark)",
          }}
        >
          Homes for Sale
        </p>

        <h1
          style={{
            marginTop: "16px",
            marginBottom: "18px",
            fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
            lineHeight: 1.02,
            color: "var(--ackret-navy)",
            fontWeight: 500,
            maxWidth: "850px",
          }}
        >
          Browse homes being sold directly by owners.
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: "760px",
            fontSize: "19px",
            lineHeight: 1.9,
            color: "var(--ackret-muted)",
          }}
        >
          Explore listings published from the Ackret seller dashboard.
        </p>

        {homes.length === 0 ? (
          <div
            style={{
              marginTop: "40px",
              background: "var(--ackret-surface)",
              border: "1px solid var(--ackret-border)",
              borderRadius: "24px",
              padding: "32px",
              boxShadow: "var(--ackret-shadow)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "10px",
                fontSize: "28px",
                lineHeight: 1.15,
                color: "var(--ackret-navy)",
                fontWeight: 500,
              }}
            >
              No public listings yet
            </h2>

            <p
              style={{
                margin: 0,
                fontSize: "16px",
                lineHeight: 1.9,
                color: "var(--ackret-muted)",
              }}
            >
              Once a seller marks a listing as public from the Home Sale Hub, it
              will appear here.
            </p>
          </div>
        ) : (
          <div
            style={{
              marginTop: "40px",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "22px",
            }}
          >
            {homes.map((home) => (
              <Link
                key={home.id}
                href={`/homes-for-sale/${home.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <article
                  style={{
                    background: "var(--ackret-surface)",
                    border: "1px solid var(--ackret-border)",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow: "var(--ackret-shadow)",
                    height: "100%",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      height: "220px",
                      background:
                        "linear-gradient(180deg, #f4f2ec 0%, #e6e1d7 100%)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--ackret-muted)",
                      fontSize: "15px",
                      overflow: "hidden",
                    }}
                  >
                    {home.thumbnailUrl ? (
                      <img
                        src={home.thumbnailUrl}
                        alt={home.address}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    ) : (
                      "Listing Photo"
                    )}
                  </div>

                  <div style={{ padding: "22px" }}>
                    <div
                      style={{
                        fontSize: "32px",
                        fontWeight: 700,
                        color: "var(--ackret-navy)",
                        marginBottom: "10px",
                        lineHeight: 1,
                      }}
                    >
                      {home.price}
                    </div>

                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "var(--ackret-navy)",
                        marginBottom: "8px",
                        lineHeight: 1.25,
                      }}
                    >
                      {home.address}
                    </div>

                    <div
                      style={{
                        fontSize: "15px",
                        color: "var(--ackret-muted)",
                        marginBottom: "14px",
                      }}
                    >
                      {home.cityStateZip}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "14px",
                        flexWrap: "wrap",
                        marginBottom: "14px",
                        color: "var(--ackret-navy)",
                        fontWeight: 600,
                      }}
                    >
                      <span>{home.beds} bd</span>
                      <span>{home.baths} ba</span>
                      <span>{home.sqft} sqft</span>
                    </div>

                    <p
                      style={{
                        marginTop: 0,
                        marginBottom: "14px",
                        fontSize: "15px",
                        lineHeight: 1.8,
                        color: "var(--ackret-muted)",
                      }}
                    >
                      {home.description}
                    </p>

                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "var(--ackret-gold-dark)",
                      }}
                    >
                      View listing →
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}