"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "../ui/button";

export default function WalletBalance() {
  const { userProfile, loading, user } = useAuth();

  if (!user) {
    return null;
  }

  if (loading) {
    return <Skeleton className="h-8 w-24 rounded-full" />;
  }

  return (
    <Button asChild variant="outline" size="sm" className="h-8 rounded-full border-primary/50 text-foreground hover:bg-primary/10 hover:text-foreground">
      <Link href="/wallet" className="flex items-center gap-2">
        <Wallet className="h-4 w-4 text-primary" />
        <span className="font-semibold">
          {userProfile ? `${userProfile.walletBalance.toFixed(0)} Ks` : '0 Ks'}
        </span>
      </Link>
    </Button>
  );
}
