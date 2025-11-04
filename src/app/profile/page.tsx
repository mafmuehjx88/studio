
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { LogOut, Settings, History, Wallet, Coins } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { staticImages } from '@/lib/data';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Order } from '@/lib/types';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { userProfile, user, loading } = useAuth();
  const router = useRouter();

  const [totalSpent, setTotalSpent] = useState(0);
  const [spentLoading, setSpentLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const avatarUrl = staticImages['default-avatar']?.imageUrl;

  useEffect(() => {
    if (!user) {
      setSpentLoading(false);
      setOrdersLoading(false);
      return;
    }

    const fetchOrderData = async () => {
      setSpentLoading(true);
      setOrdersLoading(true);
      try {
        const ordersQuery = query(
          collection(db, `users/${user.uid}/orders`),
          orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(ordersQuery);
        
        let total = 0;
        const fetchedOrders: Order[] = [];
        
        querySnapshot.forEach((doc) => {
          const order = doc.data() as Order;
          fetchedOrders.push(order);
          // Only add to total spent if it's not a smile coin purchase
          if (order.status === 'Completed' && order.gameId !== 'smile-coin') {
            total += order.price;
          }
        });

        const completedOrders = fetchedOrders.filter(order => order.status === 'Completed');

        setTotalSpent(total);
        setOrders(completedOrders);
      } catch (error) {
        console.error('Error fetching order data:', error);
      } finally {
        setSpentLoading(false);
        setOrdersLoading(false);
      }
    };

    fetchOrderData();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
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
        <p className="text-muted-foreground">
          Your profile data could not be found.
        </p>
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
            {avatarUrl && (
              <AvatarImage src={avatarUrl} alt={userProfile.username} />
            )}
            <AvatarFallback>
              {userProfile.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <CardTitle className="text-xl">{userProfile.username}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">
                {userProfile.walletBalance.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                Ks
              </span>
            </div>
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Coins className="h-4 w-4 text-yellow-400" />
              <span className="font-semibold text-yellow-400">
                {(userProfile.smileCoinBalance ?? 0).toLocaleString()}
              </span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between p-4">
          <div className='flex flex-col'>
            <CardTitle className="text-lg">ငွေသုံးစွဲမှု (Main Wallet)</CardTitle>
            <CardDescription className="text-xs">Smile Coin purchases are not included.</CardDescription>
          </div>
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-sm">
                <History className="h-4 w-4" />
                History
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-lg">
              <SheetHeader className="text-left">
                <SheetTitle>Transaction History</SheetTitle>
              </SheetHeader>
              <div className="mt-4 max-h-[60vh] overflow-y-auto">
                {ordersLoading ? (
                  <div className="space-y-4 p-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                ) : orders.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>
                            <div className="font-medium">{order.itemName}</div>
                            <div className="text-xs text-muted-foreground">
                              {order.price.toLocaleString()} Ks
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-xs">
                            {order.createdAt
                              ? format(
                                  order.createdAt.toDate(),
                                  'dd MMM, hh:mm a'
                                )
                              : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="py-10 text-center text-sm text-muted-foreground">
                    No completed orders found.
                  </p>
                )}
              </div>
            </SheetContent>
          </Sheet>
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
        <Button
          variant="outline"
          className="justify-start gap-3 text-base h-12"
          asChild
        >
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
