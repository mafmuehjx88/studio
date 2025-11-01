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
    if (loading) {
      // While loading, we don't know the auth state, so don't do anything.
      // The loading spinner below will be shown.
      return;
    }

    const isUserLoggedIn = !!user;

    // After loading, if the user is on an auth page (login/register) but is already logged in,
    // redirect them to the profile page.
    if (isAuthPage && isUserLoggedIn) {
      router.replace("/profile");
      return; // Stop further execution
    }

    // After loading, if the user is on a protected page but is NOT logged in,
    // redirect them to the login page.
    if (!isAuthPage && !isUserLoggedIn) {
      router.replace(`/login?redirect=${pathname}`);
      return; // Stop further execution
    }
  }, [user, loading, router, pathname, isAuthPage]);

  // Case 1: The authentication state is still being determined.
  // Show a full-screen loader.
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Case 2: We have the auth state.
  // If the user is on an auth page but is logged in, they are being redirected.
  // Show a loader during the redirect to avoid a flash of the login/register page.
  if (isAuthPage && user) {
     return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Case 3: We have the auth state.
  // If the user is on a protected page but is not logged in, they are being redirected.
  // Show a loader during the redirect.
  if (!isAuthPage && !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If none of the above conditions are met, the user is in the right place.
  // Render the page content.
  return <>{children}</>;
}
