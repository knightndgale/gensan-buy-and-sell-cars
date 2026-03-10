import { AuthProvider } from "@/components/providers/auth-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import type { Metadata, Viewport } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Gensan Car Buy & Sell | Find Your Next Car",
  description: "Browse 200+ verified car listings in General Santos. 100% verified dealers.",
  openGraph: {
    title: "Gensan Car Buy & Sell",
    description: "Browse verified car listings in General Santos.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.variable} font-sans antialiased`}>
        <QueryProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">{children}</div>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
