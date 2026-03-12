export default function PurchasePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--ackret-bg)",
        padding: "72px 24px 100px",
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
            textAlign: "center",
            maxWidth: "760px",
            margin: "0 auto 48px",
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
            Ackret DSS
          </p>

          <h1
            style={{
              marginTop: "16px",
              marginBottom: "18px",
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.02,
              color: "var(--ackret-navy)",
              fontWeight: 500,
            }}
          >
            Ackret Direct Sale System
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "18px",
              lineHeight: 1.8,
              color: "var(--ackret-muted)",
            }}
          >
            A step-by-step guided system for homeowners who want to sell their
            home without a traditional listing agent.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: "28px",
            alignItems: "start",
          }}
        >
          <section
            style={{
              background: "var(--ackret-surface)",
              border: "1px solid var(--ackret-border)",
              boxShadow: "var(--ackret-shadow)",
              borderRadius: "28px",
              padding: "36px 30px",
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
              What’s Included
            </p>

            <h2
              style={{
                marginTop: "14px",
                marginBottom: "18px",
                fontSize: "32px",
                lineHeight: 1.15,
                color: "var(--ackret-navy)",
                fontWeight: 500,
              }}
            >
              Everything you need to navigate a direct home sale.
            </h2>

            <div
              style={{
                display: "grid",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              <IncludedItem
                title="Step-by-step selling roadmap"
                description="Clear instructions for what to do first, what to do next, and how to move from listing to closing."
              />
              <IncludedItem
                title="Required forms and guidance"
                description="The documents, forms, and checkpoints sellers need to complete along the way."
              />
              <IncludedItem
                title="Offer handling instructions"
                description="Guidance on what to do when an offer comes in, what to review, and how to respond."
              />
              <IncludedItem
                title="Closing process direction"
                description="Information on who to contact, what happens next, and how to get to the finish line."
              />
            </div>

            <div
              style={{
                marginTop: "28px",
                paddingTop: "24px",
                borderTop: "1px solid rgba(22,58,112,0.12)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  lineHeight: 1.8,
                  color: "var(--ackret-muted)",
                }}
              >
                Ackret DSS is designed for homeowners who want more control,
                more clarity, and a simpler way to sell without paying a full
                traditional listing-side commission.
              </p>
            </div>
          </section>

          <aside
            style={{
              background: "var(--ackret-surface)",
              border: "1px solid var(--ackret-border)",
              boxShadow: "var(--ackret-shadow)",
              borderRadius: "28px",
              padding: "32px 28px",
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
              Purchase Access
            </p>

            <h2
              style={{
                marginTop: "14px",
                marginBottom: "10px",
                fontSize: "30px",
                color: "var(--ackret-navy)",
                fontWeight: 500,
              }}
            >
              Ackret DSS
            </h2>

            <p
              style={{
                marginTop: 0,
                marginBottom: "24px",
                fontSize: "16px",
                lineHeight: 1.7,
                color: "var(--ackret-muted)",
              }}
            >
              Direct Sale System
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "10px",
                marginBottom: "22px",
              }}
            >
              <span
                style={{
                  fontSize: "48px",
                  lineHeight: 1,
                  color: "var(--ackret-navy)",
                  fontWeight: 600,
                }}
              >
                $499
              </span>
              <span
                style={{
                  color: "var(--ackret-muted)",
                  fontSize: "15px",
                }}
              >
                one-time purchase
              </span>
            </div>

            <div
              style={{
                display: "grid",
                gap: "12px",
                marginBottom: "26px",
              }}
            >
              <PurchaseLine text="Step-by-step home sale guidance" />
              <PurchaseLine text="Forms and process checkpoints" />
              <PurchaseLine text="Offer response guidance" />
              <PurchaseLine text="Closing direction and next steps" />
            </div>

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              <a href="/sign-in" style={{ textDecoration: "none" }}>
                <div style={primaryButtonStyle}>Sign In to Purchase</div>
              </a>

              <a href="/create-account" style={{ textDecoration: "none" }}>
                <div style={secondaryButtonStyle}>Create Account</div>
              </a>
            </div>

            <p
              style={{
                marginTop: "18px",
                marginBottom: 0,
                fontSize: "13px",
                lineHeight: 1.7,
                color: "var(--ackret-muted)",
              }}
            >
              Account creation and checkout flow will connect here. For now,
              this page establishes the structure for your future login and
              purchase system.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}

function IncludedItem({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        padding: "18px 18px",
        border: "1px solid rgba(22,58,112,0.10)",
        borderRadius: "18px",
        background: "#fbfbf9",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "8px",
          fontSize: "20px",
          color: "var(--ackret-navy)",
          fontWeight: 500,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          fontSize: "15px",
          lineHeight: 1.75,
          color: "var(--ackret-muted)",
        }}
      >
        {description}
      </p>
    </div>
  );
}

function PurchaseLine({ text }: { text: string }) {
  return (
    <div
      style={{
        fontSize: "15px",
        lineHeight: 1.6,
        color: "var(--ackret-ink)",
        paddingBottom: "10px",
        borderBottom: "1px solid rgba(22,58,112,0.08)",
      }}
    >
      {text}
    </div>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  borderRadius: "999px",
  padding: "16px 20px",
  background: "var(--ackret-navy)",
  color: "#ffffff",
  fontSize: "13px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  cursor: "pointer",
  boxShadow: "var(--ackret-shadow)",
  textAlign: "center",
  boxSizing: "border-box",
};

const secondaryButtonStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: "999px",
  padding: "16px 20px",
  background: "transparent",
  color: "var(--ackret-gold-dark)",
  border: "1px solid rgba(197, 154, 74, 0.35)",
  fontSize: "13px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  cursor: "pointer",
  textAlign: "center",
  boxSizing: "border-box",
};