
"use client";

import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collectionGroup, query, onSnapshot, doc, updateDoc, writeBatch, serverTimestamp, collection } from "firebase/firestore";
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
import { Input } from "@/components/ui/input";
import { formatDistanceToNow } from "date-fns";

export default function AdminOrdersPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingIds, setUpdatingIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    // Remove orderBy from the query to prevent index errors.
    // We will sort the data on the client-side.
    const q = query(collectionGroup(db, 'orders'));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const ordersData: Order[] = [];
        querySnapshot.forEach((doc) => {
          ordersData.push({ ...doc.data(), id: doc.id, userId: doc.ref.parent.parent!.id } as Order);
        });
        
        // Sort the data on the client-side by creation date, descending
        ordersData.sort((a, b) => {
            if (a.createdAt && b.createdAt) {
                // @ts-ignore
                return b.createdAt.toMillis() - a.createdAt.toMillis();
            }
            return 0;
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
    
    const batch = writeBatch(db);
    const orderRef = doc(db, `users/${order.userId}/orders`, order.id);
    const notificationRef = doc(collection(db, `users/${order.userId}/notifications`));

    try {
      // 1. Update the order status
      batch.update(orderRef, {
        status: "Completed"
      });

      // 2. Create a notification for the user
      batch.set(notificationRef, {
        title: "Order Completed",
        message: `Your order for ${order.itemName} (${order.price.toLocaleString()} Ks) has been successfully completed.`,
        createdAt: serverTimestamp(),
        isRead: false,
        orderId: order.id,
        gameName: order.gameName,
        itemName: order.itemName,
        price: order.price,
      });

      // 3. Commit the batch
      await batch.commit();

      toast({ title: "Success", description: "Order has been marked as completed and user notified." });
    } catch (error) {
      console.error("Error updating order:", error);
      toast({ title: "Error", description: "Failed to update order status.", variant: "destructive" });
    } finally {
        setUpdatingIds(prev => prev.filter(id => id !== order.id));
    }
  };

  const filteredOrders = useMemo(() => {
    if (!searchTerm) {
      return orders;
    }
    return orders.filter(order => 
      order.username && order.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orders, searchTerm]);

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
      <CardHeader className="p-4">
        <CardTitle>All Orders</CardTitle>
        <div className="pt-2">
          <Input 
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm h-9"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-3 py-2">Username</TableHead>
              <TableHead className="px-3 py-2">Item</TableHead>
              <TableHead className="px-3 py-2">Date</TableHead>
              <TableHead className="px-3 py-2">Status</TableHead>
              <TableHead className="text-right px-3 py-2">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="p-3 font-medium">{order.username}</TableCell>
                <TableCell className="p-3">
                    <div className="font-medium text-xs">{order.itemName}</div>
                    <div className="text-xs text-muted-foreground">{order.price.toLocaleString()} Ks</div>
                </TableCell>
                <TableCell className="p-3 text-xs text-muted-foreground">
                  {order.createdAt ? formatDistanceToNow(order.createdAt.toDate(), { addSuffix: true }) : 'N/A'}
                </TableCell>
                 <TableCell className="p-3">
                     <Badge 
                      variant="outline"
                      className={cn("text-xs", statusColors[order.status])}
                    >
                      {order.status}
                    </Badge>
                </TableCell>
                <TableCell className="p-3 text-right">
                  {order.status === 'Pending' && (
                    <Button 
                        size="sm" 
                        onClick={() => handleCompleteOrder(order)}
                        disabled={updatingIds.includes(order.id)}
                    >
                      {updatingIds.includes(order.id) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Complete
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
