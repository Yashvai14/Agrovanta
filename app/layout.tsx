import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "Agrovanta",
  description: "An intelligent livestock management platform that monitors antimicrobial usage, predicts residue risks, and ensures MRL compliance to safeguard food safety and prevent antimicrobial resistance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[#BEBBBB]"
      >
        {children}
      </body>
    </html>
  );
}
