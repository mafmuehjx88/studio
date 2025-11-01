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
    if (loading) return;

    // If it's an authentication page (login/register)
    if (isAuthPage) {
      // and the user is logged in, redirect them away.
      if (user) {
        router.replace(isAdmin ? "/admin" : "/");
      }
    } 
    // If it's a protected page
    else {
      // and the user is not logged in, redirect them to login.
      if (!user) {
        router.replace(`/login?redirect=${pathname}`);
      } 
      // If it's an admin-only page and the user is not an admin, redirect.
      else if (isAdminPage && !isAdmin) {
        router.replace("/");
      }
    }
  }, [user, loading, router, isAuthPage, isAdminPage, isAdmin, pathname]);

  // Show a loader under these conditions:
  // 1. Auth state is still loading.
  // 2. It's a protected page and there's no user (will be redirected).
  // 3. It's an auth page and there IS a user (will be redirected).
  // 4. It's an admin page, user is logged in, but is not an admin (will be redirected).
  if (loading || (!isAuthPage && !user) || (isAuthPage && user) || (isAdminPage && user && !isAdmin)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
