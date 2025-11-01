
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LogOut, Settings, Wallet, ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { staticImages } from "@/lib/data";
import Link from 'next/link';
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Order } from "@/lib/types";

export default function ProfilePage() {
  const { userProfile, user, loading } = useAuth();
  const router = useRouter();
  
  const [totalSpent, setTotalSpent] = useState(0);
  const [spentLoading, setSpentLoading] = useState(true);

  const avatarUrl = staticImages['default-avatar']?.imageUrl;

  useEffect(() => {
    if (!user) {
      setSpentLoading(false);
      return;
    }

    const fetchTotalSpent = async () => {
      setSpentLoading(true);
      try {
        const ordersQuery = query(
          collection(db, `users/${user.uid}/orders`),
          where("status", "==", "Completed")
        );
        const querySnapshot = await getDocs(ordersQuery);
        let total = 0;
        querySnapshot.forEach((doc) => {
          const order = doc.data() as Order;
          total += order.price;
        });
        setTotalSpent(total);
      } catch (error) {
        console.error("Error fetching total spent:", error);
      } finally {
        setSpentLoading(false);
      }
    };

    fetchTotalSpent();
  }, [user]);


  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  if (loading) {
    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <CardHeader className="flex-row items-center gap-4 p-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32 rounded-md" />
                        <Skeleton className="h-5 w-24 rounded-md" />
                    </div>
                </CardHeader>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">ငွေသုံးစွဲမှု</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <Skeleton className="h-8 w-28" />
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 gap-2">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
            </div>
        </div>
    );
  }

  if (!userProfile) {
    return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold">Could Not Load Profile</h2>
            <p className="text-muted-foreground">Your profile data could not be found.</p>
            <Button onClick={handleLogout} variant="destructive" className="mt-4">
                Logout
            </Button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center gap-4 p-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={userProfile.username} /> }
             <AvatarFallback>
              {userProfile.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
                <CardTitle className="text-xl">{userProfile.username}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{userProfile.walletBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Ks</span>
                </div>
          </div>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ငွေသုံးစွဲမှု</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
             {spentLoading ? (
                <Skeleton className="h-8 w-28" />
             ) : (
                <p className="text-3xl font-bold text-foreground">
                    {totalSpent.toLocaleString()} Ks
                </p>
             )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" className="justify-start gap-3 text-base h-12" asChild>
            <Link href="/settings">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </Button>
          <Button 
            variant="outline" 
            className="justify-start gap-3 text-base h-12 text-destructive hover:text-destructive hover:bg-destructive/10" 
            onClick={handleLogout}
          >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
          </Button>
      </div>

    </div>
  );
}
