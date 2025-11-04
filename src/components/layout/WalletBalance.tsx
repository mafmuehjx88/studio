
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Wallet, Coins } from "lucide-react";
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
    return <Skeleton className="h-8 w-24 rounded-full" />;
  }

  const isSmileCoinPage = pathname.startsWith('/smile-coin');
  
  const balance = isSmileCoinPage 
    ? (userProfile?.smileCoinBalance ?? 0).toLocaleString()
    : `${(userProfile?.walletBalance ?? 0).toFixed(0)} Ks`;

  const Icon = isSmileCoinPage ? Coins : Wallet;
  
  const iconColor = isSmileCoinPage ? "text-yellow-400" : "text-primary";
  
  const borderColor = isSmileCoinPage ? "border-yellow-400/50" : "border-primary/50";
  
  const hoverBgColor = isSmileCoinPage ? "hover:bg-yellow-400/10" : "hover:bg-primary/10";

  return (
    <Button asChild variant="outline" size="sm" className={cn("h-8 rounded-full text-foreground hover:text-foreground", borderColor, hoverBgColor)}>
      <Link href="/wallet" className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", iconColor)} />
        <span className="font-semibold">
          {balance}
        </span>
      </Link>
    </Button>
  );
}
