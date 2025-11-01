"use client";

import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "../ui/button";

export default function WalletBalance() {
  const { userProfile, loading, user } = useAuth();

  if (!user) {
    return null;
  }

  if (loading) {
    return <Skeleton className="h-8 w-32 rounded-full" />;
  }

  if (!userProfile) {
    return null;
  }

  return (
    <Button asChild variant="outline" size="sm" className="h-8 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
      <Link href="/wallet">
        <span>
          {userProfile.walletBalance.toFixed(2)} Ks
        </span>
        <PlusCircle className="h-4 w-4" />
      </Link>
    </Button>
  );
}
