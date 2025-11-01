
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collectionGroup, query, onSnapshot, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Order } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AdminOrdersPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);


  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const q = query(
      collectionGroup(db, 'orders'),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({ ...doc.data(), id: doc.id, userId: doc.ref.parent.parent!.id } as Order);
        });
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching all orders:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  const handleCompleteOrder = async (order: Order) => {
    if(!order.userId) {
        toast({ title: "Error", description: "User ID is missing for this order.", variant: "destructive" });
        return;
    }
    setUpdatingIds(prev => [...prev, order.id]);
    try {
      const orderRef = doc(db, `users/${order.userId}/orders`, order.id);
      await updateDoc(orderRef, {
        status: "Completed"
      });
      toast({ title: "Success", description: "Order has been marked as completed." });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({ title: "Error", description: "Failed to update order status.", variant: "destructive" });
    } finally {
        setUpdatingIds(prev => prev.filter(id => id !== order.id));
    }
  };

  const statusColors: Record<Order["status"], string> = {
    Completed: 'bg-green-500/20 text-green-400 border-green-500/30',
    Pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.username}</TableCell>
                <TableCell>
                    <div className="font-medium">{order.itemName}</div>
                    <div className="text-xs text-muted-foreground">{order.price.toLocaleString()} Ks</div>
                </TableCell>
                 <TableCell>
                     <Badge 
                      variant="outline"
                      className={cn("text-xs", statusColors[order.status])}
                    >
                      {order.status}
                    </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {order.status === 'Pending' && (
                    <Button 
                        size="sm" 
                        onClick={() => handleCompleteOrder(order)}
                        disabled={updatingIds.includes(order.id)}
                    >
                      {updatingIds.includes(order.id) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Mark as Completed
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
