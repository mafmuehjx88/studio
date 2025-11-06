
"use client";

import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import WalletBalance from './WalletBalance';
import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';

export default function Header() {
  const { user, loading, hasUnreadNotifications } = useAuth();
  
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-card px-4">
      {/* Left Section */}
      <div className="flex items-center gap-2">
         <h1 className="text-xl font-bold text-white">AT Game HUB</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {!loading && (
          user ? (
            <>
              <WalletBalance />
              <Button asChild variant="ghost" size="icon" className="relative">
                <Link href="/notifications">
                  <Bell className="h-6 w-6" />
                  {hasUnreadNotifications && (
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-card"></span>
                  )}
                </Link>
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )
        )}
      </div>
    </header>
  );
}
