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

    if (isAuthPage) {
      if (user) {
        router.replace(isAdmin ? "/admin" : "/");
      }
    } else {
      if (!user) {
        router.replace(`/login?redirect=${pathname}`);
      } else if (isAdminPage && !isAdmin) {
        router.replace("/");
      }
    }
  }, [user, loading, router, isAuthPage, isAdminPage, isAdmin, pathname]);

  if (loading || (!isAuthPage && !user) || (isAuthPage && user) || (isAdminPage && user && !isAdmin)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
