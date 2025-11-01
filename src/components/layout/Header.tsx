"use client";

import { Button } from '../ui/button';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { useEffect, useState } from 'react';
import { AnnouncementsSheet } from './AnnouncementsSheet';
import WalletBalance from './WalletBalance';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function Header() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAnnouncementsOpen, setIsAnnouncementsOpen] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [latestTimestamp, setLatestTimestamp] = useState<Timestamp | null>(null);

  const LOCAL_STORAGE_KEY = 'lastSeenAnnouncementTimestamp';

  useEffect(() => {
    if (!user) return;

    const checkNewAnnouncements = async () => {
      const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"), limit(1));
      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const latestAnnouncement = querySnapshot.docs[0].data();
          const latestDbTimestamp = latestAnnouncement.createdAt as Timestamp;

          if (latestDbTimestamp) {
              setLatestTimestamp(latestDbTimestamp); // Store latest timestamp from DB
              const lastSeenTimestampMs = localStorage.getItem(LOCAL_STORAGE_KEY);
              
              if (!lastSeenTimestampMs || latestDbTimestamp.toMillis() > parseInt(lastSeenTimestampMs, 10)) {
                  setHasNewNotification(true);
              }
          }
        }
      } catch (error) {
        console.error("Error checking for new announcements:", error);
      }
    };

    checkNewAnnouncements();
  }, [user]);

  const handleOpenAnnouncements = () => {
    setIsAnnouncementsOpen(true);
    if (hasNewNotification) {
      setHasNewNotification(false);
      if (latestTimestamp) {
         localStorage.setItem(LOCAL_STORAGE_KEY, latestTimestamp.toMillis().toString());
      }
    }
  };
  
  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/50 bg-card px-4">
        {/* Left Section */}
        <div className="flex flex-1 items-center justify-start gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          {user && (
             <Button variant="ghost" size="icon" className="relative h-8 w-8" onClick={handleOpenAnnouncements}>
              {hasNewNotification && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          )}
        </div>

        {/* Center Section - Title Removed */}
        <div className="flex-shrink-0">
        </div>

        {/* Right Section */}
        <div className="flex flex-1 items-center justify-end">
            <WalletBalance />
        </div>
      </header>
      <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
      <AnnouncementsSheet isOpen={isAnnouncementsOpen} onOpenChange={setIsAnnouncementsOpen} />
    </>
  );
}
