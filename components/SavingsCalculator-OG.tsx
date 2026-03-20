"use client";

import { useMemo, useState } from "react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SavingsCalculator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [closingCostRate, setClosingCostRate] = useState(2.75);

  const results = useMemo(() => {
    const sellerClosingCosts = homePrice * (closingCostRate / 100);

    const traditionalAgentCommission = homePrice * 0.06;
    const traditionalTotal = traditionalAgentCommission + sellerClosingCosts;

    const ackretGuide = 499;
    const mlsFlatFee = 750;
    const buyerAgentCommission = homePrice * 0.03;

    const ackretTotal =
      ackretGuide + mlsFlatFee + buyerAgentCommission + sellerClosingCosts;

    const savings = traditionalTotal - ackretTotal;

    return {
      sellerClosingCosts,
      traditionalAgentCommission,
      traditionalTotal,
      ackretGuide,
      mlsFlatFee,
      buyerAgentCommission,
      ackretTotal,
      savings,
    };
  }, [homePrice, closingCostRate]);

  return (
    <section
      style={{
        padding: "20px 24px 110px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          background: "var(--ackret-surface)",
          border: "1px solid var(--ackret-border)",
          boxShadow: "var(--ackret-shadow)",
          borderRadius: "28px",
          padding: "40px 28px",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "760px",
            margin: "0 auto 36px",
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
            Savings Calculator
          </p>

          <h2
            style={{
              marginTop: "16px",
              marginBottom: "16px",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.05,
              color: "var(--ackret-navy)",
              fontWeight: 500,
            }}
          >
            Estimate what you could save.
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: "18px",
              lineHeight: 1.8,
              color: "var(--ackret-muted)",
            }}
          >
            Compare a traditional home sale to selling with Ackret, a flat-fee
            MLS listing, and a buyer-agent commission.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "28px",
            alignItems: "start",
          }}
        >
          <div
            style={{
              background: "#f8f8f6",
              border: "1px solid var(--ackret-border)",
              borderRadius: "22px",
              padding: "24px",
            }}
          >
            <label
              style={{
                display: "block",
                fontSize: "12px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ackret-gold-dark)",
                marginBottom: "10px",
              }}
            >
              Home Sale Price
            </label>

            <input
              type="number"
              value={homePrice}
              onChange={(e) => setHomePrice(Number(e.target.value) || 0)}
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: "18px",
                borderRadius: "14px",
                border: "1px solid rgba(22,58,112,0.15)",
                outline: "none",
                marginBottom: "24px",
              }}
            />

            <label
              style={{
                display: "block",
                fontSize: "12px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--ackret-gold-dark)",
                marginBottom: "10px",
              }}
            >
              Seller Closing Cost Estimate
            </label>

            <input
              type="range"
              min="2.5"
              max="3"
              step="0.05"
              value={closingCostRate}
              onChange={(e) => setClosingCostRate(Number(e.target.value))}
              style={{
                width: "100%",
                marginBottom: "10px",
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: "16px",
                color: "var(--ackret-muted)",
                lineHeight: 1.7,
              }}
            >
              Using <strong>{closingCostRate.toFixed(2)}%</strong> for seller
              closing costs.
            </p>

            <p
              style={{
                marginTop: "18px",
                marginBottom: 0,
                fontSize: "14px",
                color: "var(--ackret-muted)",
                lineHeight: 1.7,
              }}
            >
              Typical seller closing costs often include Wisconsin transfer tax,
              owner’s title insurance, title / closing company fees, recording
              fees, optional attorney fees, prorated property taxes, and misc.
              admin charges.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "18px",
            }}
          >
            <div
              style={{
                background: "#f8f8f6",
                border: "1px solid var(--ackret-border)",
                borderRadius: "22px",
                padding: "24px",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  fontSize: "24px",
                  color: "var(--ackret-navy)",
                  fontWeight: 500,
                }}
              >
                Traditional Sale
              </h3>

              <div style={{ display: "grid", gap: "10px" }}>
                <Row
                  label="6% agent commissions"
                  value={formatCurrency(results.traditionalAgentCommission)}
                />
                <Row
                  label={`Seller closing costs (${closingCostRate.toFixed(2)}%)`}
                  value={formatCurrency(results.sellerClosingCosts)}
                />
                <TotalRow
                  label="Estimated total"
                  value={formatCurrency(results.traditionalTotal)}
                />
              </div>
            </div>

            <div
              style={{
                background: "#f8f8f6",
                border: "1px solid var(--ackret-border)",
                borderRadius: "22px",
                padding: "24px",
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  fontSize: "24px",
                  color: "var(--ackret-navy)",
                  fontWeight: 500,
                }}
              >
                Sell with Ackret
              </h3>

              <div style={{ display: "grid", gap: "10px" }}>
                <Row
                  label="Ackret guide"
                  value={formatCurrency(results.ackretGuide)}
                />
                <Row
                  label="Flat-fee MLS listing"
                  value={formatCurrency(results.mlsFlatFee)}
                />
                <Row
                  label="Buyer agent commission (3%)"
                  value={formatCurrency(results.buyerAgentCommission)}
                />
                <Row
                  label={`Seller closing costs (${closingCostRate.toFixed(2)}%)`}
                  value={formatCurrency(results.sellerClosingCosts)}
                />
                <TotalRow
                  label="Estimated total"
                  value={formatCurrency(results.ackretTotal)}
                />
              </div>
            </div>

            <div
              style={{
                background: "var(--ackret-navy)",
                color: "#ffffff",
                borderRadius: "22px",
                padding: "28px",
                boxShadow: "var(--ackret-shadow)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: "12px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#d7bc82",
                }}
              >
                Estimated Savings
              </p>

              <p
                style={{
                  marginTop: "12px",
                  marginBottom: "8px",
                  fontSize: "clamp(2.2rem, 5vw, 4rem)",
                  lineHeight: 1,
                  fontWeight: 600,
                }}
              >
                {formatCurrency(results.savings)}
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: "15px",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                Estimated savings compared with a traditional 6% commission
                model.
              </p>
            </div>
          </div>
        </div>

        <p
          style={{
            marginTop: "24px",
            marginBottom: 0,
            fontSize: "13px",
            color: "var(--ackret-muted)",
            lineHeight: 1.7,
            textAlign: "center",
          }}
        >
          Estimates are for illustration only and do not include every possible
          transaction expense. Actual costs vary based on price, timing,
          location, title company, taxes, concessions, and negotiated terms.
        </p>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        fontSize: "16px",
        color: "var(--ackret-muted)",
      }}
    >
      <span>{label}</span>
      <span style={{ color: "var(--ackret-ink)", fontWeight: 500 }}>{value}</span>
    </div>
  );
}

function TotalRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "16px",
        paddingTop: "14px",
        marginTop: "6px",
        borderTop: "1px solid rgba(22,58,112,0.12)",
        fontSize: "17px",
      }}
    >
      <span style={{ color: "var(--ackret-navy)", fontWeight: 600 }}>{label}</span>
      <span style={{ color: "var(--ackret-navy)", fontWeight: 700 }}>{value}</span>
    </div>
  );
}