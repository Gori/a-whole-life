import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A Whole Life",
  description: "A creator-owned, text-first platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
