import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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