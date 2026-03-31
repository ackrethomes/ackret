"use client";

import Link from "next/link";

export default function PublicHeader() {
  return (
    <header
      style={{
        width: "100%",
        borderBottom: "1px solid var(--ackret-border)",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(10px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "18px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "var(--ackret-navy)",
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Ackret
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "22px",
            flexWrap: "wrap",
          }}
        >
          <Link href="/about-us" style={navLinkStyle}>
            About Us
          </Link>

          <Link href="/blog" style={navLinkStyle}>
            Blog
          </Link>

          <Link href="/homes-for-sale" style={navLinkStyle}>
            Homes for Sale
          </Link>

          <Link href="/login" style={ctaLinkStyle}>
            Log In
          </Link>
        </nav>
      </div>
    </header>
  );
}

const navLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "var(--ackret-navy)",
  fontSize: "15px",
  fontWeight: 500,
};

const ctaLinkStyle: React.CSSProperties = {
  textDecoration: "none",
  color: "#ffffff",
  background: "var(--ackret-navy)",
  padding: "10px 16px",
  borderRadius: "999px",
  fontSize: "14px",
  fontWeight: 600,
};