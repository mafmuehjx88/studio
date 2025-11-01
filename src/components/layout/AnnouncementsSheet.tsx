"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BellRing, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Announcement } from "@/lib/types";

interface AnnouncementsSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AnnouncementsSheet({
  isOpen,
  onOpenChange,
}: AnnouncementsSheetProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);
    const q = query(
      collection(db, "announcements"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const data: Announcement[] = [];
        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() } as Announcement);
        });
        setAnnouncements(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching announcements:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[320px] p-4">
        <SheetHeader className="mb-6 text-left">
          <SheetTitle className="flex items-center gap-2 text-xl font-bold">
            <BellRing className="h-6 w-6 text-primary" />
            Announcements
          </SheetTitle>
           <SheetDescription>
            Stay updated with the latest news and information.
          </SheetDescription>
        </SheetHeader>
        <div className="h-full overflow-y-auto pb-16">
          {loading && (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && announcements.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <BellRing className="h-16 w-16 text-muted-foreground/30" strokeWidth={1} />
              <p className="mt-4 font-semibold">No announcements yet</p>
              <p className="text-sm text-muted-foreground">
                Check back later for new updates.
              </p>
            </div>
          )}

          {!loading && announcements.length > 0 && (
            <div className="space-y-6">
              {announcements.map((ann) => (
                <div key={ann.id} className="relative border-l-2 border-primary pl-6">
                    <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full border-2 border-background bg-primary"></div>
                    <p className="text-xs text-muted-foreground">
                        {ann.createdAt ? formatDistanceToNow(ann.createdAt.toDate(), { addSuffix: true }) : ''}
                    </p>
                    <h3 className="font-semibold text-foreground">{ann.title}</h3>
                    <p className="text-sm text-muted-foreground">
                        {ann.content}
                    </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
