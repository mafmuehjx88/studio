"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
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

  useEffect(() => {
    // Don't do anything while loading, useEffect will re-run when loading changes.
    if (loading) {
      return;
    }

    const isUserLoggedIn = !!user;

    // Logic for auth pages (login, register)
    if (isAuthPage) {
      if (isUserLoggedIn) {
        // If user is logged in, redirect away from auth pages.
        const targetRoute = isAdmin ? "/admin" : "/";
        router.replace(targetRoute);
      }
      // If not logged in, do nothing and show the auth page.
    } 
    // Logic for protected pages
    else {
      if (!isUserLoggedIn) {
        // If user is not logged in, redirect to login.
        router.replace(`/login?redirect=${pathname}`);
      } else if (isAdminPage && !isAdmin) {
        // If it's an admin page and the user is not an admin, redirect.
        router.replace("/");
      }
      // If user is logged in (and is admin if required), do nothing and show the protected page.
    }
  }, [user, loading, router, isAuthPage, isAdminPage, isAdmin, pathname]);

  // Show a loading spinner if auth state is loading, or if a redirect is imminent.
  if (loading || (!isAuthPage && !user) || (isAuthPage && user)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Otherwise, render the children.
  return <>{children}</>;
}
