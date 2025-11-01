"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function WalletBalance() {
  const { userProfile, loading, user } = useAuth();

  if (!user) {
    return null;
  }

  if (loading) {
    return <Skeleton className="h-8 w-24 rounded-md" />;
  }

  if (!userProfile) {
    return null;
  }

  return (
    <Link href="/wallet" className="flex items-center gap-2 rounded-full border border-primary/50 bg-secondary px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10">
      <Wallet className="h-4 w-4" />
      <span>
        {userProfile.walletBalance.toFixed(2)} Ks
      </span>
    </Link>
  );
}
