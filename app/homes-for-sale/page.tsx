import PublicHeader from "@/components/site/PublicHeader";

const homes = [
  {
    address: "123 Main Street",
    cityStateZip: "Elkhorn, WI 53121",
    price: "$425,000",
    beds: "4",
    baths: "2.5",
    sqft: "2,350",
    description:
      "Beautiful updated home with spacious living areas, strong natural light, and a layout that feels comfortable and functional.",
  },
  {
    address: "456 Lakeview Drive",
    cityStateZip: "Lake Geneva, WI 53147",
    price: "$589,000",
    beds: "3",
    baths: "2",
    sqft: "1,980",
    description:
      "Charming property with inviting outdoor space, polished interior finishes, and a location close to everything buyers want.",
  },
  {
    address: "789 Country Lane",
    cityStateZip: "Delavan, WI 53115",
    price: "$369,000",
    beds: "3",
    baths: "2",
    sqft: "1,740",
    description:
      "A warm, move-in-ready home with practical space, appealing curb appeal, and room to enjoy both indoors and out.",
  },
];

export default function HomesForSalePage() {
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
          This page will eventually pull in real public listings created from
          the seller dashboard.
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "22px",
          }}
        >
          {homes.map((home) => (
            <article
              key={home.address}
              style={{
                background: "var(--ackret-surface)",
                border: "1px solid var(--ackret-border)",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "var(--ackret-shadow)",
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
                }}
              >
                Listing Photo
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
                    marginBottom: 0,
                    fontSize: "15px",
                    lineHeight: 1.8,
                    color: "var(--ackret-muted)",
                  }}
                >
                  {home.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}