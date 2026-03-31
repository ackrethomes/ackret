import PublicHeader from "@/components/site/PublicHeader";

export default function AboutUsPage() {
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
          maxWidth: "1100px",
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
          About Ackret
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
          A simpler way to sell your home without a realtor.
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
          Ackret helps homeowners navigate the for sale by owner process with
          clear, step-by-step guidance. Our goal is to make selling your home on
          your own feel more organized, less overwhelming, and more affordable.
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: "24px",
            alignItems: "start",
          }}
        >
          <section
            style={{
              background: "var(--ackret-surface)",
              border: "1px solid var(--ackret-border)",
              borderRadius: "28px",
              padding: "28px",
              boxShadow: "var(--ackret-shadow)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "14px",
                fontSize: "30px",
                lineHeight: 1.15,
                color: "var(--ackret-navy)",
                fontWeight: 500,
              }}
            >
              Why Ackret exists
            </h2>

            <p style={bodyTextStyle}>
              Selling a home without a realtor can save a significant amount of
              money, but most homeowners still feel like the process is hard to
              understand. There are forms, pricing decisions, listing details,
              disclosures, marketing, negotiations, inspections, and closing
              steps that can feel scattered and intimidating.
            </p>

            <p style={bodyTextStyle}>
              Ackret was built to bring all of that into one place. Instead of
              forcing sellers to piece everything together themselves, we guide
              them through the process step by step so they can stay organized
              and confident.
            </p>
          </section>

          <section
            style={{
              background: "var(--ackret-surface)",
              border: "1px solid var(--ackret-border)",
              borderRadius: "28px",
              padding: "28px",
              boxShadow: "var(--ackret-shadow)",
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: "14px",
                fontSize: "26px",
                lineHeight: 1.15,
                color: "var(--ackret-navy)",
                fontWeight: 500,
              }}
            >
              What we believe
            </h2>

            <div style={{ display: "grid", gap: "14px" }}>
              <ValueCard
                title="Clarity over confusion"
                body="Home sellers should know what step comes next and what matters most right now."
              />
              <ValueCard
                title="Savings with structure"
                body="Saving money should not mean feeling like you are doing everything alone."
              />
              <ValueCard
                title="Simple tools win"
                body="The best experience feels organized, calm, and straightforward."
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function ValueCard({
  title,
  body,
}: {
  title: string;
  body: string;
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
          fontSize: "16px",
          fontWeight: 600,
          color: "var(--ackret-navy)",
          marginBottom: "8px",
        }}
      >
        {title}
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "15px",
          lineHeight: 1.8,
          color: "var(--ackret-muted)",
        }}
      >
        {body}
      </p>
    </div>
  );
}

const bodyTextStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "16px",
  fontSize: "16px",
  lineHeight: 1.9,
  color: "var(--ackret-muted)",
};