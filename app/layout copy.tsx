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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Ackret Logo"
                width={220}
                height={70}
                className="h-12 w-auto"
                priority
              />
            </Link>

            <Link href="/pricing" className="btn-primary text-sm">
              Start My Home Sale
            </Link>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}