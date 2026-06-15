import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leap · AI Profile Evaluation",
  description: "Find universities abroad that actually fit you — matched across 1,500+ universities.",
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
