import type { Metadata } from "next";
import { Inter, Press_Start_2P } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import SocketProvider from "@/components/SocketProvider";
import NavigationEvents from "@/components/NavigationEvents";

const inter = Inter({ subsets: ["latin"] });
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start-2p",
});

export const metadata: Metadata = {
  title: "Placeholder",
  description: "placeholder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="en" className={pressStart2P.variable}>
      <body className={inter.className}>
        <NavigationEvents />
        <SocketProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
