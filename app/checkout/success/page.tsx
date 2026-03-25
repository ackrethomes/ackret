import Link from "next/link";

export default function CheckoutSuccessPage() {
  return (
    <main
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "64px 24px",
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
        Payment complete
      </p>

      <h1
        style={{
          marginTop: "14px",
          marginBottom: "16px",
          fontSize: "clamp(2.25rem, 5vw, 4rem)",
          lineHeight: 1.05,
          color: "var(--ackret-navy)",
          fontWeight: 600,
        }}
      >
        You’re in.
      </h1>

      <p
        style={{
          margin: 0,
          fontSize: "18px",
          lineHeight: 1.8,
          color: "var(--ackret-muted)",
        }}
      >
        Your payment was successful. The next step is connecting this payment to
        account access so customers land in their dashboard automatically.
      </p>

      <div style={{ marginTop: "24px" }}>
        <Link
          href="/login"
          style={{
            display: "inline-block",
            borderRadius: "999px",
            padding: "14px 18px",
            background: "var(--ackret-navy)",
            color: "#fff",
            textDecoration: "none",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontSize: "13px",
          }}
        >
          Go to Login
        </Link>
      </div>
    </main>
  );
}