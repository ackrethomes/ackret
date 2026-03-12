export default function CreateAccountPage() {
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
          maxWidth: "640px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "36px",
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
              marginBottom: "16px",
              fontSize: "clamp(2.3rem, 5vw, 3.5rem)",
              lineHeight: 1.05,
              color: "var(--ackret-navy)",
              fontWeight: 500,
            }}
          >
            Create your account
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "17px",
              lineHeight: 1.8,
              color: "var(--ackret-muted)",
            }}
          >
            Create your Ackret Direct Sale System account to purchase access and begin your guided sale process.
          </p>
        </div>

        <section
          style={{
            background: "var(--ackret-surface)",
            border: "1px solid var(--ackret-border)",
            boxShadow: "var(--ackret-shadow)",
            borderRadius: "28px",
            padding: "32px 28px",
          }}
        >
          <form
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            <TwoColumn>
              <Field label="First Name" type="text" placeholder="First name" />
              <Field label="Last Name" type="text" placeholder="Last name" />
            </TwoColumn>

            <Field
              label="Email Address"
              type="email"
              placeholder="you@example.com"
            />

            <Field
              label="Password"
              type="password"
              placeholder="Create a password"
            />

            <Field
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
            />

            <button type="button" style={primaryButtonStyle}>
              Create Account
            </button>
          </form>

          <div
            style={{
              marginTop: "18px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "var(--ackret-muted)",
                lineHeight: 1.7,
              }}
            >
              Already have an account?
            </p>

            <a
              href="/sign-in"
              style={{
                display: "inline-block",
                marginTop: "10px",
                color: "var(--ackret-gold-dark)",
                fontSize: "14px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Sign In
            </a>
          </div>

          <p
            style={{
              marginTop: "22px",
              marginBottom: 0,
              fontSize: "13px",
              lineHeight: 1.7,
              color: "var(--ackret-muted)",
              textAlign: "center",
            }}
          >
            Account creation will be connected later. This page establishes the
            structure for the future Ackret DSS onboarding flow.
          </p>
        </section>
      </div>
    </main>
  );
}

function TwoColumn({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "18px",
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  type,
  placeholder,
}: {
  label: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label style={{ display: "grid", gap: "8px" }}>
      <span
        style={{
          fontSize: "12px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--ackret-gold-dark)",
        }}
      >
        {label}
      </span>

      <input
        type={type}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: "16px",
          borderRadius: "14px",
          border: "1px solid rgba(22,58,112,0.15)",
          outline: "none",
          background: "#ffffff",
          color: "var(--ackret-ink)",
          boxSizing: "border-box",
        }}
      />
    </label>
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
  marginTop: "6px",
};