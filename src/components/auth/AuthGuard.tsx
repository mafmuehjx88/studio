"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthGuard({
  children,
  isAuthPage = false,
}: {
  children: React.ReactNode;
  isAuthPage?: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while loading
    if (loading) {
      return;
    }

    const isUserLoggedIn = !!user;

    // For auth pages (login, register)
    if (isAuthPage) {
      // If the user is logged in, redirect them away from auth pages to the profile page.
      if (isUserLoggedIn) {
        router.replace("/profile");
      }
    } 
    // For protected pages
    else {
      // If the user is not logged in, redirect them to the login page.
      if (!isUserLoggedIn) {
        router.replace(`/login?redirect=${pathname}`);
      }
    }
  }, [user, loading, router, pathname, isAuthPage]);
  
  // While the authentication state is loading, always show a spinner.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If on an auth page and the user is logged in, show a spinner during the redirect.
  if (isAuthPage && user) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If on a protected page and the user is not logged in, show a spinner during the redirect.
  if (!isAuthPage && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Otherwise, render the requested page content.
  return <>{children}</>;
}
