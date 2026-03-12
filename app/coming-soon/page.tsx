import Hero from "@/components/Hero";
import FeatureCard from "@/components/FeatureCard";
import SavingsCalculator from "@/components/SavingsCalculator";

export default function ComingSoonPage() {
  return (
    <main>
      {/* HERO */}
      <Hero />

      {/* FEATURE SECTION */}

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
          {/* Feature cards */}

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
              description="A modern experience for pricing, communication, offer flow, and closing coordination."
            />
          </div>

          {/* Secondary brand message */}

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
              Ackret provides a modern framework for homeowners who want more
              control over the home selling process while dramatically reducing
              unnecessary commission costs.
            </p>
          </div>
        </div>
      </section>

      {/* SAVINGS CALCULATOR */}

      <SavingsCalculator />

      {/* FINAL CTA */}

      <section
        style={{
          padding: "0 24px 120px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--ackret-navy)",
              marginBottom: "16px",
            }}
          >
            The modern way to sell a home.
          </h2>

          <p
            style={{
              fontSize: "18px",
              color: "var(--ackret-muted)",
              lineHeight: 1.8,
              marginBottom: "28px",
            }}
          >
            Ackret is launching soon. Join the early access list and be among
            the first homeowners to experience a simpler, more transparent home
            sale.
          </p>

          <div
            style={{
              background: "var(--ackret-navy)",
              color: "#ffffff",
              padding: "14px 30px",
              borderRadius: "999px",
              display: "inline-block",
              letterSpacing: "0.18em",
              fontSize: "13px",
              textTransform: "uppercase",
              boxShadow: "var(--ackret-shadow)",
            }}
          >
            Coming Soon
          </div>
        </div>
      </section>
    </main>
  );
}