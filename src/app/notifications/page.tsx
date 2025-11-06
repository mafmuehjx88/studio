
"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  writeBatch,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, BellRing, PackageCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import type { Notification } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // Mark notifications as read when the page is loaded
  useEffect(() => {
    if (!user) return;

    const markAllAsRead = async () => {
      const unreadQuery = query(
        collection(db, `users/${user.uid}/notifications`),
        where("isRead", "==", false)
      );
      const unreadSnapshot = await getDocs(unreadQuery);

      if (unreadSnapshot.empty) return;

      const batch = writeBatch(db);
      unreadSnapshot.forEach((doc) => {
        batch.update(doc.ref, { isRead: true });
      });
      await batch.commit();
    };

    markAllAsRead();
  }, [user]);

  // Fetch notifications
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

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
  }, [user, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {notifications.length === 0 ? (
        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
          <BellRing className="h-24 w-24 text-muted-foreground/30" strokeWidth={1} />
          <h2 className="mt-6 text-2xl font-bold">No Notifications Yet</h2>
          <p className="text-muted-foreground">Your recent order updates will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((noti) => (
            <Card
              key={noti.id}
              className={cn(
                "overflow-hidden",
                !noti.isRead && "bg-primary/5 border-primary/20"
              )}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="mt-1">
                    <PackageCheck className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-foreground">{noti.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {noti.message}
                    </p>
                    <p className="text-xs text-muted-foreground/80 pt-1">
                      {noti.createdAt
                        ? formatDistanceToNow(noti.createdAt.toDate(), {
                            addSuffix: true,
                          })
                        : ""}
                    </p>
                  </div>
                   {!noti.isRead && (
                    <div className="w-2.5 h-2.5 mt-1.5 rounded-full bg-primary animate-pulse"></div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
