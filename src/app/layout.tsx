
'use client';

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/toaster";
import { usePathname } from "next/navigation";
import LoadingScreen from "@/components/layout/LoadingScreen";
import { useState } from "react";
import OfflineIndicator from "@/components/layout/OfflineIndicator";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

function AppContent({ children }: { children: React.ReactNode }) {
  const { loading, isOnline } = useAuth();
  
  const isAuthPage = usePathname() === '/login' || usePathname() === '/register';


  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className="relative mx-auto flex min-h-screen w-full max-w-md flex-col"
    >
      <OfflineIndicator isOnline={isOnline} />
      {!isAuthPage && <Header />}
      <main className="flex-1 px-4 pb-24 pt-6">{children}</main>
      {!isAuthPage && <Footer />}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={cn("font-sans antialiased bg-background", poppins.variable)}>
        <AuthProvider>
          <AppContent>{children}</AppContent>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
