import "./globals.css";
import type { Metadata } from "next";

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
      <body>{children}</body>
    </html>
  );
}