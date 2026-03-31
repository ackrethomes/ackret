import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";

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
          children
        )}
      </body>
    </html>
  );
}