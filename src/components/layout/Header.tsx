"use client";

import Link from 'next/link';
import WalletBalance from './WalletBalance';
import { Button } from '../ui/button';
import { Bell, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { useState } from 'react';

export default function Header() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <>
      <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur-lg">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          {user && (
             <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
          )}
        </div>
        <WalletBalance />
      </header>
      <Sidebar isOpen={isSidebarOpen} onOpenChange={setIsSidebarOpen} />
    </>
  );
}
