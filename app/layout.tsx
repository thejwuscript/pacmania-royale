import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ['latin'],
  variable: '--font-press-start-2p'
})

export const metadata: Metadata = {
  title: "Placeholder",
  description: "placeholder"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={pressStart2P.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
