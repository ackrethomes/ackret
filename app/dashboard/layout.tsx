import { redirect } from "next/navigation";
import { createClient } from "@/hooks/supabase/server";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("seller_profiles")
    .select("is_paid")
    .eq("user_id", user.id)
    .single();

  if (!profile?.is_paid) {
    redirect("/pricing");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--ackret-bg)",
        display: "flex",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <DashboardSidebar />

        <section
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "20px 32px",
              borderBottom: "1px solid var(--ackret-border)",
              background: "var(--ackret-surface)",
            }}
          >
            <a
              href="/"
              style={{
                textDecoration: "none",
                color: "var(--ackret-navy)",
                border: "1px solid rgba(22,58,112,0.2)",
                padding: "10px 16px",
                borderRadius: "999px",
                fontSize: "12px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              View Public Site
            </a>
          </div>

          <div
            style={{
              flex: 1,
              padding: "40px 32px 60px",
              boxSizing: "border-box",
            }}
          >
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}