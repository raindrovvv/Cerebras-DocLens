import type { Metadata } from "next";
import { EB_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cerebras-ai-doc.vercel.app"),
  title: "Cerebras DocLens - Multi-Agent PDF Analysis with Gemma 4 31B",
  description: "Turn complex PDFs into plain-language guidance with Gemma 4 31B on Cerebras. Extract summaries, risks, costs, timelines, actions, and persona-specific explanations.",
  openGraph: {
    title: "Cerebras DocLens - Multi-Agent PDF Analysis with Gemma 4 31B",
    description: "A Cerebras x Gemma 4 hackathon project for fast, multi-agent document understanding across PDFs and document images.",
    url: "https://cerebras-ai-doc.vercel.app",
    siteName: "Cerebras DocLens",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cerebras DocLens - Multi-Agent PDF Analysis with Gemma 4 31B",
    description: "Fast multi-agent document analysis powered by Gemma 4 31B on Cerebras.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
