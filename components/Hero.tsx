export default function Hero() {
  return (
    <section
      style={{
        padding: "110px 24px 70px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "140px",
              height: "4px",
              background: "linear-gradient(90deg, var(--ackret-gold), var(--ackret-gold-dark))",
              margin: "0 auto 24px",
              borderRadius: "999px",
            }}
          />

          <p
            style={{
              margin: 0,
              fontSize: "12px",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--ackret-gold-dark)",
            }}
          >
            Direct Home Transactions
          </p>
        </div>

        <h1
          style={{
            margin: "0 auto",
            maxWidth: "900px",
            fontSize: "clamp(3rem, 8vw, 6.5rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            color: "var(--ackret-navy)",
            fontWeight: 500,
          }}
        >
          Buy or sell a home
          <span
            style={{
              display: "block",
              color: "var(--ackret-gold-dark)",
              marginTop: "10px",
            }}
          >
            with more control.
          </span>
        </h1>

        <p
          style={{
            maxWidth: "760px",
            margin: "28px auto 0",
            fontSize: "20px",
            lineHeight: 1.8,
            color: "var(--ackret-muted)",
          }}
        >
          Ackret is building a premium platform for direct home transactions —
          helping buyers and sellers move through the process with clarity,
          confidence, and less unnecessary cost.
        </p>

        <div
          style={{
            marginTop: "38px",
            display: "flex",
            gap: "14px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              background: "var(--ackret-navy)",
              color: "#ffffff",
              padding: "14px 24px",
              borderRadius: "999px",
              fontSize: "13px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              boxShadow: "var(--ackret-shadow)",
            }}
          >
            Coming Soon
          </div>

          <div
            style={{
              background: "transparent",
              color: "var(--ackret-gold-dark)",
              border: "1px solid rgba(197, 154, 74, 0.35)",
              padding: "14px 24px",
              borderRadius: "999px",
              fontSize: "13px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Modern FSBO Guidance
          </div>
        </div>
      </div>
    </section>
  );
}