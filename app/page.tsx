export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg,#0b0b0c 0%,#121213 100%)",
        color: "#f5f1e8",
        fontFamily: "Georgia, 'Times New Roman', serif",
        padding: "40px"
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          textAlign: "center"
        }}
      >
        {/* Brand */}
        <p
          style={{
            letterSpacing: "0.35em",
            fontSize: "12px",
            textTransform: "uppercase",
            color: "#c9b27d",
            marginBottom: "24px"
          }}
        >
          Ackret
        </p>

        {/* Headline */}
        <h1
          style={{
            fontSize: "64px",
            lineHeight: "1.1",
            marginBottom: "24px",
            fontWeight: 500
          }}
        >
          Direct home transactions,
          <span style={{ color: "#c9b27d", display: "block" }}>
            reimagined.
          </span>
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.7",
            color: "#d2cbbd",
            maxWidth: "620px",
            margin: "0 auto"
          }}
        >
          Ackret is building a modern platform that gives buyers and sellers
          more control over the home transaction process — simplifying
          negotiations, reducing costs, and making direct property transactions
          easier than ever before.
        </p>

        {/* Coming soon badge */}
        <div
          style={{
            marginTop: "48px",
            display: "inline-block",
            padding: "12px 28px",
            border: "1px solid #c9b27d",
            letterSpacing: "0.2em",
            fontSize: "12px",
            textTransform: "uppercase"
          }}
        >
          Coming Soon
        </div>

        {/* Feature row */}
        <div
          style={{
            marginTop: "80px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "28px"
          }}
        >
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "24px"
            }}
          >
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "0.25em",
                color: "#c9b27d",
                textTransform: "uppercase",
                marginBottom: "10px"
              }}
            >
              Built For
            </p>
            <p>Independent sellers</p>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "24px"
            }}
          >
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "0.25em",
                color: "#c9b27d",
                textTransform: "uppercase",
                marginBottom: "10px"
              }}
            >
              Designed For
            </p>
            <p>Confident buyers</p>
          </div>

          <div
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              padding: "24px"
            }}
          >
            <p
              style={{
                fontSize: "12px",
                letterSpacing: "0.25em",
                color: "#c9b27d",
                textTransform: "uppercase",
                marginBottom: "10px"
              }}
            >
              Focused On
            </p>
            <p>Simpler transactions</p>
          </div>
        </div>
      </div>
    </main>
  )
}