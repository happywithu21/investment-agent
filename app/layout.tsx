import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "AI Investment Research Agent | InsideIIM",
  description:
    "Production-grade AI Investment Research Agent powered by Gemini 2.5 Flash and LangGraph. Analyzes companies with multi-agent workflows and returns structured INVEST or PASS recommendations.",
  keywords: ["AI investment research", "stock analysis", "LangGraph", "Gemini AI"],
  authors: [{ name: "InsideIIM" }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
