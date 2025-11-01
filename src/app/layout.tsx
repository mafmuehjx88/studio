
'use client';

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

// We can't use `export const metadata` in a client component, but we can leave this here
// as it might be used if this component is converted back to a server component.
// export const metadata: Metadata = {
//   title: "AT Game HUB",
//   description: "Your one-stop shop for game top-ups.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isGamePage = pathname.startsWith('/games/');

  const backgroundStyle = isGamePage
    ? { background: 'linear-gradient(to bottom, #002D72, #000000)'}
    : { background: 'radial-gradient(circle, #007BFF 0%, #002D72 100%)' };

  return (
    <html lang="en" className="dark">
      <body className={cn("font-sans antialiased", poppins.variable)}>
        <AuthProvider>
          <div
            className="relative mx-auto flex min-h-screen w-full max-w-md flex-col"
            style={backgroundStyle}
          >
            <Header />
            <main className="flex-1 px-4 pb-24 pt-6">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
