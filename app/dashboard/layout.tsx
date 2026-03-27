import { redirect } from "next/navigation";
import { createServerClient } from "@/hooks/supabase/server";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  // Get logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not logged in → send to login
  if (!user) {
    redirect("/login");
  }

  // Get seller profile
  const { data: profile } = await supabase
    .from("seller_profiles")
    .select("is_paid")
    .eq("user_id", user.id)
    .single();

  // Not paid → send to pricing
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
            padding: "40px 32px 60px",
            boxSizing: "border-box",
          }}
        >
          {children}
        </section>
      </div>
    </main>
  );
}