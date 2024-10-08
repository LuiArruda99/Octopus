import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Footer from "./components/footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Octopus",
  description: "Resumos, exercícios e flashcards personalizados com inteligência artificial para te ajudar a conquistar sua nota 10!",
  keywords: ["Gemini", "Estudar", "Resumos", "Exercícios", "Flashcards", "Inteligência Artificial", "Google", "Generative AI"],
  openGraph: {
    images: '/preview.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col justify-between min-h-screen bg-neutral-900 font-roboto">
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </div>
      </body>
    </html>
  );
}
