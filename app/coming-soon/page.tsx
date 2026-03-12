import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";

export default function ComingSoonPage() {
  return (
    <main>
      <Hero />

      <section
        style={{
          padding: "10px 24px 110px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "24px",
            }}
          >
            <FeatureCard
              eyebrow="Built For"
              title="Independent sellers"
              description="Homeowners who want a more direct path to market without relying on the traditional commission model."
            />

            <FeatureCard
              eyebrow="Designed For"
              title="Confident buyers"
              description="Buyers who want better visibility into the transaction and a cleaner process from first interest to closing."
            />

            <FeatureCard
              eyebrow="Focused On"
              title="Simpler transactions"
              description="A more modern experience for pricing, communication, offer flow, and closing coordination."
            />
          </div>

          <div
            style={{
              marginTop: "72px",
              background: "var(--ackret-surface)",
              border: "1px solid var(--ackret-border)",
              boxShadow: "var(--ackret-shadow)",
              borderRadius: "28px",
              padding: "44px 32px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "12px",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "var(--ackret-gold-dark)",
              }}
            >
              Ackret
            </p>

            <h2
              style={{
                marginTop: "16px",
                marginBottom: "18px",
                fontSize: "clamp(2rem, 4vw, 3.5rem)",
                lineHeight: 1.05,
                color: "var(--ackret-navy)",
                fontWeight: 500,
              }}
            >
              Direct home transactions,
              <span style={{ display: "block" }}>
                reimagined.
              </span>
            </h2>

            <p
              style={{
                maxWidth: "720px",
                margin: "0 auto",
                fontSize: "18px",
                lineHeight: 1.8,
                color: "var(--ackret-muted)",
              }}
            >
              Premium guidance. Clear structure. More control for buyers and
              sellers. Ackret is launching soon.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}