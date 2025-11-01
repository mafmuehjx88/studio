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
    // Don't do anything while loading to prevent premature redirects.
    if (loading) {
      return;
    }

    const isUserLoggedIn = !!user;

    // For auth pages (like /login, /register)
    if (isAuthPage) {
      // If the user is logged in, redirect them away from auth pages to the profile page.
      if (isUserLoggedIn) {
        router.replace("/profile");
      }
    } 
    // For protected pages (most other pages)
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

  // If on an auth page and a user is logged in, they are being redirected.
  // Show a spinner during the redirect.
  if (isAuthPage && user) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If on a protected page and no user is logged in, they are being redirected.
  // Show a spinner during the redirect.
  if (!isAuthPage && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If we've passed all checks, the user is in the right place. Render the page.
  return <>{children}</>;
}
