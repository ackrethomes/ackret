import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/auth/LogoutButton";

export const metadata: Metadata = {
  title: "Ackret",
  description: "Wisconsin FSBO Guidance",
};

const isLive = process.env.SITE_LIVE === "true";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;

  if (isLive) {
    const supabase = await createClient();
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();

    session = currentSession;
  }

  return (
    <html lang="en">
      <body>
        {!isLive ? (
          <main className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
            <div className="max-w-lg">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/logo.png"
                  alt="Ackret Logo"
                  width={220}
                  height={70}
                  className="h-16 w-auto"
                />
              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                Coming Soon
              </h1>

              <p className="mt-4 text-lg text-slate-600">
                Ackret is getting ready to launch. Sell your home without a
                realtor — step by step.
              </p>

              <p className="mt-6 text-sm text-slate-500">
                We’re putting the final touches on everything.
              </p>
            </div>
          </main>
        ) : (
          <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="Ackret Logo"
                    width={180}
                    height={50}
                    className="h-10 w-auto"
                  />
                </Link>

                <div className="flex items-center gap-3">
                  {session ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="text-sm"
                        style={{
                          padding: "10px 16px",
                          borderRadius: "999px",
                          border: "1px solid rgba(22,58,112,0.2)",
                          color: "var(--ackret-navy)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        Dashboard
                      </Link>

                      <LogoutButton />
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-sm"
                        style={{
                          padding: "10px 16px",
                          borderRadius: "999px",
                          border: "1px solid rgba(22,58,112,0.2)",
                          color: "var(--ackret-navy)",
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        Log In
                      </Link>

                      <Link href="/pricing" className="btn-primary text-sm">
                        Start My Home Sale
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </header>

            {children}
          </>
        )}
      </body>
    </html>
  );
}