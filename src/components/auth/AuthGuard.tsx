"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AuthGuard({
  children,
  isAuthPage = false,
  isAdminPage = false,
}: {
  children: React.ReactNode;
  isAuthPage?: boolean;
  isAdminPage?: boolean;
}) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (loading) {
      return; // Wait until the auth state is loaded
    }

    const isUserLoggedIn = !!user;
    const redirectUrl = searchParams.get("redirect") || (isAdmin ? "/admin" : "/profile");

    // Logic for auth pages (e.g., /login, /register)
    if (isAuthPage) {
      if (isUserLoggedIn) {
        // If user is logged in, redirect them away from auth pages
        router.replace(redirectUrl);
      }
      // If not logged in, show the auth page content (the children)
    } 
    // Logic for protected pages
    else {
      if (!isUserLoggedIn) {
        // If user is not logged in, redirect to login page
        router.replace(`/login?redirect=${pathname}`);
      } else if (isAdminPage && !isAdmin) {
        // If it's an admin page and user is not an admin, redirect to home
        router.replace("/");
      }
      // If user is logged in (and has permissions), show the protected page content
    }
  }, [user, loading, router, isAuthPage, isAdminPage, isAdmin, pathname, searchParams]);

  // Determine if a loading spinner should be shown
  const showLoader = 
    loading || // Always show loader while auth state is loading
    (isAuthPage && !!user) || // Show loader on auth page if user is logged in (while redirecting)
    (!isAuthPage && !user); // Show loader on protected page if user is not logged in (while redirecting)

  if (showLoader) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render the page content
  return <>{children}</>;
}
