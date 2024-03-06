import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import SocketProvider from "@/components/SocketProvider";
import NavigationEvents from "@/components/NavigationEvents";

const pressStart2P = localFont({ src: "../fonts/PressStart2P-Regular.ttf", variable: "--font-press-start-2p" });
const inter = localFont({ src: "../fonts/Inter-VariableFont.ttf" });

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
