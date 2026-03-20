import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ackret",
  description: "Wisconsin FSBO Guidance",
};

const isLive = process.env.SITE_LIVE === "true";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {!isLive ? (
          // 🔒 COMING SOON PAGE
          <main className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
            <div className="max-w-lg">
              <div className="flex justify-center mb-6">
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
                Ackret is getting ready to launch.  
                Sell your home without a realtor — step by step.
              </p>

              <p className="mt-6 text-sm text-slate-500">
                We’re putting the final touches on everything.
              </p>
            </div>
          </main>
        ) : (
          // ✅ FULL SITE
          <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
              <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/">
                  <Image
                    src="/logo.png"
                    alt="Ackret Logo"
                    width={180}
                    height={50}
                    className="h-10 w-auto"
                  />
                </Link>

                <Link href="/pricing" className="btn-primary text-sm">
                  Start My Home Sale
                </Link>
              </div>
            </header>

            {children}
          </>
        )}
      </body>
    </html>
  );
}