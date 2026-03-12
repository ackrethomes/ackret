import Link from "next/link";
import { dashboardSteps } from "@/lib/dashboardSteps";

type DashboardStepPageProps = {
  stepNumber: number;
  title: string;
  description: string;
  bullets: string[];
};

export default function DashboardStepPage({
  stepNumber,
  title,
  description,
  bullets,
}: DashboardStepPageProps) {
  const currentIndex = stepNumber - 1;
  const nextStep = dashboardSteps[currentIndex + 1];
  const previousStep = dashboardSteps[currentIndex - 1];

  return (
    <div
      style={{
        maxWidth: "900px",
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
        Step {stepNumber} of {dashboardSteps.length}
      </p>

      <h1
        style={{
          marginTop: "14px",
          marginBottom: "16px",
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          lineHeight: 1.05,
          color: "var(--ackret-navy)",
          fontWeight: 500,
        }}
      >
        {title}
      </h1>

      <p
        style={{
          margin: 0,
          maxWidth: "760px",
          fontSize: "18px",
          lineHeight: 1.8,
          color: "var(--ackret-muted)",
        }}
      >
        {description}
      </p>

      <div
        style={{
          marginTop: "32px",
          background: "var(--ackret-surface)",
          border: "1px solid var(--ackret-border)",
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "var(--ackret-shadow)",
        }}
      >
        <p
          style={{
            marginTop: 0,
            marginBottom: "18px",
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ackret-gold-dark)",
          }}
        >
          What you’ll do here
        </p>

        <div style={{ display: "grid", gap: "14px" }}>
          {bullets.map((bullet) => (
            <div
              key={bullet}
              style={{
                display: "grid",
                gridTemplateColumns: "24px 1fr",
                gap: "12px",
                alignItems: "start",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "999px",
                  background: "#eef2f7",
                  color: "var(--ackret-navy)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  marginTop: "2px",
                }}
              >
                ✓
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: "16px",
                  lineHeight: 1.7,
                  color: "var(--ackret-ink)",
                }}
              >
                {bullet}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: "28px",
          display: "flex",
          gap: "14px",
          flexWrap: "wrap",
        }}
      >
        {previousStep ? (
          <Link href={previousStep.href} style={{ textDecoration: "none" }}>
            <div style={secondaryButtonStyle}>Previous Step</div>
          </Link>
        ) : null}

        {nextStep ? (
          <Link href={nextStep.href} style={{ textDecoration: "none" }}>
            <div style={primaryButtonStyle}>Continue to Next Step</div>
          </Link>
        ) : (
          <div style={primaryButtonStyle}>Sale Complete</div>
        )}
      </div>
    </div>
  );
}

const primaryButtonStyle: React.CSSProperties = {
  display: "inline-block",
  borderRadius: "999px",
  padding: "16px 22px",
  background: "var(--ackret-navy)",
  color: "#ffffff",
  fontSize: "13px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  boxShadow: "var(--ackret-shadow)",
};

const secondaryButtonStyle: React.CSSProperties = {
  display: "inline-block",
  borderRadius: "999px",
  padding: "16px 22px",
  background: "transparent",
  color: "var(--ackret-gold-dark)",
  border: "1px solid rgba(197, 154, 74, 0.35)",
  fontSize: "13px",
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};