import "./globals.css";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ackret",
  description: "Wisconsin FSBO Guidance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Header */}
        <header className="w-full border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            
            {/* Logo (left) */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Ackret Logo"
                width={180}
                height={50}
                className="h-10 w-auto"
              />
            </Link>

            {/* Right side (optional CTA) */}
            <Link
              href="/pricing"
              className="hidden sm:inline-flex bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800"
            >
              Start My Home Sale
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main>{children}</main>
      </body>
    </html>
  );
}