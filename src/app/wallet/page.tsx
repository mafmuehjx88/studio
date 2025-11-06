
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownLeft, ArrowUpRight, Coins } from "lucide-react";
import Link from "next/link";

export default function WalletPage() {
  const { userProfile, loading } = useAuth();

  const mainBalance = userProfile?.walletBalance ?? 0;
  const smileCoinBalance = userProfile?.smileCoinBalance ?? 0;

  const formattedMainBalance = new Intl.NumberFormat("en-US").format(mainBalance);
  const formattedSmileBalance = new Intl.NumberFormat("en-US").format(smileCoinBalance);

  return (
    <div className="space-y-8">
      <h1 className="text-center text-3xl font-bold">My Wallet</h1>

      <Card className="w-full max-w-sm mx-auto text-center">
        <CardHeader>
          <CardTitle className="text-base font-normal text-muted-foreground">
            Main Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="mx-auto h-12 w-48 rounded-md" />
          ) : (
            <p className="text-5xl font-bold text-primary">
              {formattedMainBalance} <span className="text-4xl">Ks</span>
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
      
       <Card className="w-full max-w-sm mx-auto text-center border-yellow-400/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-base font-normal text-muted-foreground">
             <Coins className="h-5 w-5 text-yellow-400"/>
             Smile Coin Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="mx-auto h-12 w-48 rounded-md" />
          ) : (
            <p className="text-5xl font-bold text-yellow-400">
              {formattedSmileBalance} <span className="text-4xl">Coins</span>
            </p>
          )}
        </CardContent>
      </Card>
      
    </div>
  );
}
