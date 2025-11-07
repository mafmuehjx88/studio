
'use client';

import { useState, useEffect } from 'react';
import { collectionGroup, query, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Order, UserProfile } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, Crown, Medal, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TopBuyer {
  userId: string;
  username: string;
  totalSpent: number;
}

export default function TopBuyersList() {
  const { userProfile } = useAuth();
  const [topBuyers, setTopBuyers] = useState<TopBuyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);

  useEffect(() => {
    const fetchTopBuyers = async () => {
      setLoading(true);
      try {
        // Query all orders without filtering by status to avoid index requirement
        const ordersQuery = query(collectionGroup(db, 'orders'));

        const ordersSnapshot = await getDocs(ordersQuery);
        const userSpending: { [key: string]: { totalSpent: number, username: string } } = {};

        ordersSnapshot.forEach((doc) => {
          const order = doc.data() as Order;
          // Filter for completed orders on the client-side
          if (order.status === 'Completed' && order.userId && order.price > 0) {
            if (!userSpending[order.userId]) {
              userSpending[order.userId] = { totalSpent: 0, username: order.username };
            }
            userSpending[order.userId].totalSpent += order.price;
          }
        });
        
        const sortedBuyers: TopBuyer[] = Object.entries(userSpending)
          .map(([userId, data]) => ({
            userId,
            username: data.username,
            totalSpent: data.totalSpent,
          }))
          .sort((a, b) => b.totalSpent - a.totalSpent);
          
        setTopBuyers(sortedBuyers);

        if (userProfile) {
          const rank = sortedBuyers.findIndex(buyer => buyer.userId === userProfile.uid) + 1;
          setCurrentUserRank(rank > 0 ? rank : null);
        }

      } catch (error) {
        // If there's a permission error, we'll just show an empty list for non-admins
        // and log the error for debugging.
        console.error("Error fetching top buyers (this is expected for non-admins):", error);
        setTopBuyers([]);
      } finally {
        setLoading(false);
      }
    };

    // We only run this complex query if the user is an admin
    // Or if we decide to change the rules to allow it for everyone.
    // For now, let's assume the rules are restrictive.
    // Let's try to fetch regardless and catch the error.
    fetchTopBuyers();
  }, [userProfile]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />;
    if (rank === 2) return <Award className="h-5 w-5 text-slate-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">{rank}</span>;
  };

  const getRankColor = (rank: number) => {
      if (rank === 1) return "border-yellow-400/50 bg-yellow-500/10";
      if (rank === 2) return "border-slate-400/50 bg-slate-500/10";
      if (rank === 3) return "border-amber-600/50 bg-amber-500/10";
      return "border-border";
  }


  if (loading) {
    return (
      <Card className='bg-card'>
        <CardHeader>
          <CardTitle className="text-center font-bold text-lg">Top Buyers List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  // If fetching failed (likely due to permissions for non-admins), we can hide the component
  // or show a message. For now, let's just not render the list if it's empty.
  if (topBuyers.length === 0 && !loading) {
      return (
           <Card className='bg-card'>
                <CardHeader>
                    <CardTitle className="text-center font-bold text-lg">Top Buyers List</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                     <div className="text-center text-muted-foreground py-4">
                        <p>Leaderboard is being calculated.</p>
                    </div>
                </CardContent>
           </Card>
      )
  }


  const top10Buyers = topBuyers.slice(0, 10);
  const isCurrentUserInTop10 = currentUserRank !== null && currentUserRank <= 10;

  return (
    <Card className='bg-card'>
      <CardHeader>
        <CardTitle className="text-center font-bold text-lg">Top Buyers List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-4">
        {top10Buyers.length > 0 ? (
          top10Buyers.map((buyer, index) => {
            const rank = index + 1;
            const isCurrentUser = buyer.userId === userProfile?.uid;
            return (
              <div
                key={buyer.userId}
                className={cn(
                    "flex items-center gap-4 rounded-lg border p-3", 
                    getRankColor(rank),
                    isCurrentUser && "ring-2 ring-primary"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    {getRankIcon(rank)}
                </div>
                <Avatar>
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <User />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-semibold text-foreground">{buyer.username}</p>
                   <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className="text-sm text-muted-foreground">
                          {buyer.totalSpent.toLocaleString()} Ks
                        </p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Total Spent: {buyer.totalSpent.toLocaleString()} Ks</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-muted-foreground py-4">
            <p>No completed orders yet.</p>
          </div>
        )}

        {userProfile && !isCurrentUserInTop10 && (
          <div className="pt-4 text-center">
            {currentUserRank ? (
                 <p className="text-sm text-muted-foreground">
                    သင်၏အဆင့်မှာ <span className="font-bold text-primary">{currentUserRank}</span> ဖြစ်ပါသည်။
                </p>
            ) : (
                 <p className="text-sm font-bold text-yellow-500">
                    သင်သည် အဆင့်မဝင်သေးပါ။
                </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
