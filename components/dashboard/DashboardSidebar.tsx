"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardSteps } from "@/lib/dashboardSteps";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const currentIndex = dashboardSteps.findIndex((step) => step.href === pathname);

  return (
    <aside
      style={{
        width: "320px",
        minWidth: "320px",
        background: "var(--ackret-surface)",
        borderRight: "1px solid var(--ackret-border)",
        padding: "28px 20px",
        boxSizing: "border-box",
      }}
    >
      <div style={{ marginBottom: "28px" }}>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--ackret-gold-dark)",
          }}
        >
          Ackret DSS
        </p>

        <h2
          style={{
            marginTop: "12px",
            marginBottom: "10px",
            fontSize: "28px",
            lineHeight: 1.1,
            color: "var(--ackret-navy)",
            fontWeight: 500,
          }}
        >
          Your Sale Progress
        </h2>

        <p
          style={{
            margin: 0,
            fontSize: "15px",
            lineHeight: 1.7,
            color: "var(--ackret-muted)",
          }}
        >
          Complete each step in order to move from listing to closing.
        </p>
      </div>

      <nav style={{ display: "grid", gap: "12px" }}>
        {dashboardSteps.map((step, index) => {
          const isCurrent = pathname === step.href;
          const isComplete = currentIndex > index;
          const isUpcoming = currentIndex < index;

          return (
            <Link
              key={step.href}
              href={step.href}
              style={{
                textDecoration: "none",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "38px 1fr",
                  gap: "12px",
                  alignItems: "start",
                  padding: "14px 14px",
                  borderRadius: "16px",
                  border: isCurrent
                    ? "1px solid rgba(197, 154, 74, 0.4)"
                    : "1px solid rgba(22,58,112,0.08)",
                  background: isCurrent ? "#fffaf0" : "#ffffff",
                  boxShadow: isCurrent ? "var(--ackret-shadow)" : "none",
                }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: 600,
                    background: isComplete
                      ? "var(--ackret-navy)"
                      : isCurrent
                      ? "var(--ackret-gold-dark)"
                      : "#eef2f7",
                    color: isComplete || isCurrent ? "#ffffff" : "var(--ackret-navy)",
                  }}
                >
                  {isComplete ? "✓" : index + 1}
                </div>

                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: isCurrent
                        ? "var(--ackret-gold-dark)"
                        : "var(--ackret-muted)",
                    }}
                  >
                    Step {index + 1}
                  </p>

                  <p
                    style={{
                      marginTop: "6px",
                      marginBottom: 0,
                      fontSize: "15px",
                      lineHeight: 1.45,
                      color: isUpcoming
                        ? "var(--ackret-muted)"
                        : "var(--ackret-ink)",
                      fontWeight: isCurrent ? 600 : 500,
                    }}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}