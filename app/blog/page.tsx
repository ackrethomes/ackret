import Link from "next/link";
import PublicHeader from "@/components/site/PublicHeader";

const blogPosts = [
  {
    slug: "how-to-sell-your-house-without-a-realtor-in-wisconsin",
    title: "How to Sell Your House Without a Realtor in Wisconsin",
    excerpt:
      "A simple overview of the FSBO process in Wisconsin, from pricing and disclosures to marketing and closing.",
  },
  {
    slug: "wisconsin-real-estate-condition-report-guide",
    title: "Wisconsin Real Estate Condition Report Guide",
    excerpt:
      "What sellers need to know about completing the condition report accurately and confidently.",
  },
  {
    slug: "fsbo-checklist-for-home-sellers",
    title: "FSBO Checklist for Home Sellers",
    excerpt:
      "A practical checklist to keep your home sale organized from preparation through closing.",
  },
];

export default function BlogPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ackret-bg)",
      }}
    >
      <PublicHeader />

      <main
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "56px 24px 80px",
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
          Ackret Blog
        </p>

        <h1
          style={{
            marginTop: "16px",
            marginBottom: "18px",
            fontSize: "clamp(2.4rem, 5vw, 4.5rem)",
            lineHeight: 1.02,
            color: "var(--ackret-navy)",
            fontWeight: 500,
            maxWidth: "850px",
          }}
        >
          Guides and insights for selling your home on your own.
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: "760px",
            fontSize: "19px",
            lineHeight: 1.9,
            color: "var(--ackret-muted)",
          }}
        >
          This section will help Ackret grow through SEO while giving sellers
          useful information they can actually use.
        </p>

        <div
          style={{
            marginTop: "40px",
            display: "grid",
            gap: "20px",
          }}
        >
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              style={{
                background: "var(--ackret-surface)",
                border: "1px solid var(--ackret-border)",
                borderRadius: "24px",
                padding: "28px",
                boxShadow: "var(--ackret-shadow)",
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: "10px",
                  fontSize: "28px",
                  lineHeight: 1.15,
                  color: "var(--ackret-navy)",
                  fontWeight: 500,
                }}
              >
                {post.title}
              </h2>

              <p
                style={{
                  marginTop: 0,
                  marginBottom: "18px",
                  fontSize: "16px",
                  lineHeight: 1.9,
                  color: "var(--ackret-muted)",
                  maxWidth: "760px",
                }}
              >
                {post.excerpt}
              </p>

              <Link
                href={`/blog/${post.slug}`}
                style={{
                  textDecoration: "none",
                  color: "var(--ackret-gold-dark)",
                  fontWeight: 600,
                }}
              >
                Read article →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}