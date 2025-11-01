
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function WalletPage() {
  const { userProfile, loading } = useAuth();

  const balance = userProfile?.walletBalance ?? 0;

  const formattedBalance = new Intl.NumberFormat("en-US").format(balance);

  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="mb-6 text-3xl font-bold">My Wallet</h1>

      <Card className="w-full max-w-xs text-center">
        <CardHeader>
          <CardTitle className="text-base font-normal text-muted-foreground">
            Total Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="mx-auto h-12 w-48 rounded-md" />
          ) : (
            <p className="text-5xl font-bold text-primary">
              {formattedBalance} <span className="text-4xl">Ks</span>
            </p>
          )}
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-4">
          <Button asChild className="h-12 text-base">
            <Link href="/top-up">
              <ArrowUpRight className="mr-2 h-5 w-5" />
              ငွေဖြည့်ရန်
            </Link>
          </Button>
          <Button variant="secondary" className="h-12 text-base" disabled>
            <ArrowDownLeft className="mr-2 h-5 w-5" />
            Withdraw
          </Button>
        </CardFooter>
      </Card>
      
      {/* Transaction History will be added later */}
    </div>
  );
}
