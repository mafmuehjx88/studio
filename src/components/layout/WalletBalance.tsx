
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Wallet, Coins, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function WalletBalance() {
  const { userProfile, loading, user } = useAuth();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  if (loading) {
    return <Skeleton className="h-9 w-28 rounded-md" />;
  }
  
  const balance = (userProfile?.walletBalance ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <Button asChild variant="outline" size="sm" className="h-9 rounded-md bg-black text-white hover:bg-gray-800 border border-white/50 hover:text-white shadow-md">
      <Link href="/wallet" className="flex items-center gap-2">
        <span className="font-semibold text-sm">
          {balance} Ks
        </span>
        <Plus className="h-4 w-4" />
      </Link>
    </Button>
  );
}
