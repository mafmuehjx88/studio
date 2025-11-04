
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, onSnapshot, orderBy, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Order } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function OrdersPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const orderType = searchParams.get('type');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const isSmileCoinHistory = orderType === 'smile-coin';

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, `users/${user.uid}/orders`),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        let ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({ id: doc.id, ...doc.data() } as Order);
        });

        if (isSmileCoinHistory) {
          ordersData = ordersData.filter(order => order.gameId === 'smile-coin');
        }

        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, isSmileCoinHistory]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Code Copied!',
      description: 'The code has been copied to your clipboard.',
    });
  };

  const statusColors: Record<Order["status"], string> = {
    Completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  const pageTitle = isSmileCoinHistory ? "Smile Coin မှတ်တမ်းများ" : "ဝယ်ယူမှုမှတ်တမ်းများ";
  const emptyStateTitle = isSmileCoinHistory ? "No Smile Coin orders yet." : "No orders yet.";
  const emptyStateDescription = isSmileCoinHistory ? "Your recent Smile Coin purchases will appear here." : "Your recent purchases will appear here.";


  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-center text-3xl font-bold">{pageTitle}</h1>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-6 text-center">
        <ShoppingBag className="h-24 w-24 text-muted-foreground/50" strokeWidth={1} />
        <h2 className="text-2xl font-bold">{emptyStateTitle}</h2>
        <p className="text-muted-foreground">{emptyStateDescription}</p>
        <Button asChild size="lg">
          <Link href={isSmileCoinHistory ? "/smile-coin" : "/"}>Order Now</Link>
        </Button>
      </div>
    );
  }

  // Render different tables based on order history type
  if (isSmileCoinHistory) {
      return (
           <div className="space-y-6">
              <h1 className="text-center text-3xl font-bold">{pageTitle}</h1>
              <Card>
                <CardContent className="p-0">
                   <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Code</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.itemName}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-muted-foreground break-all">
                                    {order.smileCode}
                                </span>
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopy(order.smileCode || '')}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                                </div>
                            </TableCell>
                            <TableCell className="text-right text-xs text-muted-foreground">
                                {order.createdAt ? format(order.createdAt.toDate(), 'dd MMM, hh:mm a') : 'N/A'}
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                   </Table>
                </CardContent>
              </Card>
           </div>
      );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-bold">{pageTitle}</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.itemName}</div>
                    <div className="text-xs text-muted-foreground">
                      {order.id.substring(0, 8).toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                     <Badge 
                      variant="outline"
                      className={cn("text-xs", statusColors[order.status])}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
