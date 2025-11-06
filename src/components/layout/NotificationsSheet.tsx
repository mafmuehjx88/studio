
"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BellRing, Loader2, PackageCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import type { Order } from "@/lib/types"; // Using order as it has most fields

interface Notification extends Partial<Order> {
    id: string;
    title: string;
    message: string;
    createdAt: any;
    isRead: boolean;
}

interface NotificationsSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function NotificationsSheet({
  isOpen,
  onOpenChange,
}: NotificationsSheetProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !user) {
        if (!user) {
            setNotifications([]);
            setLoading(false);
        }
        return;
    };

    setLoading(true);
    const q = query(
      collection(db, `users/${user.uid}/notifications`),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Notification[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Notification);
        });
        setNotifications(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen, user]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[320px] p-0">
        <SheetHeader className="p-4 pb-2 text-left">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <BellRing className="h-6 w-6 text-primary" />
            Notifications
          </SheetTitle>
           <SheetDescription>
            Your recent order updates and news.
          </SheetDescription>
        </SheetHeader>
        <div className="h-full overflow-y-auto pb-16">
          {loading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div className="flex h-[calc(100%-100px)] flex-col items-center justify-center text-center">
              <BellRing className="h-16 w-16 text-muted-foreground/30" strokeWidth={1} />
              <p className="mt-4 font-semibold">No notifications yet</p>
              <p className="text-sm text-muted-foreground">
                Your order updates will appear here.
              </p>
            </div>
          )}

          {!loading && notifications.length > 0 && (
            <div className="space-y-1 p-2">
              {notifications.map((noti) => (
                <div key={noti.id} className="flex gap-4 rounded-lg p-3 hover:bg-muted">
                    <div className="mt-1">
                        <PackageCheck className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-sm text-foreground">{noti.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {noti.itemName} ({noti.price?.toLocaleString()} Ks)
                        </p>
                        <p className="text-xs text-muted-foreground/80 pt-1">
                           {noti.createdAt ? formatDistanceToNow(noti.createdAt.toDate(), { addSuffix: true }) : ''}
                        </p>
                    </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
