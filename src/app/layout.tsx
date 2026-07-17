import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";

const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
  axes: ["slnt"],
});

export const metadata: Metadata = {
  title: "Mario Kart World Nuzlocke",
  description: "Fan-made companion tracker for Mario Kart World nuzlocke runs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geologica.variable} h-full`}>
      <body className="min-h-full bg-white text-[var(--n-ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
