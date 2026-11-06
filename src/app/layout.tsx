import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Towa Store | Everyday Provisions (towastore.shop)",
  description: "Modern Digital Grocery & Provisions. 100% Cash on Delivery across Bangladesh.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-white text-zinc-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
