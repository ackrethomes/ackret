type FeatureCardProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function FeatureCard({
  eyebrow,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div
      style={{
        background: "var(--ackret-surface)",
        border: "1px solid var(--ackret-border)",
        boxShadow: "var(--ackret-shadow)",
        padding: "28px",
        borderRadius: "20px",
        height: "100%",
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
        {eyebrow}
      </p>

      <h3
        style={{
          marginTop: "14px",
          marginBottom: "12px",
          fontSize: "24px",
          lineHeight: 1.2,
          color: "var(--ackret-navy)",
          fontWeight: 500,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          fontSize: "16px",
          lineHeight: 1.7,
          color: "var(--ackret-muted)",
        }}
      >
        {description}
      </p>
    </div>
  );
}