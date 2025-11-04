
"use client";

import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import WalletBalance from './WalletBalance';
import Link from 'next/link';
import { Bell, Menu } from 'lucide-react';

interface HeaderProps {
    onBellClick: () => void;
}

export default function Header({ onBellClick }: HeaderProps) {
  const { user, loading } = useAuth();
  
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-card px-4">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" disabled>
             <Menu className="h-6 w-6" />
        </Button>
         <Button variant="ghost" size="icon" onClick={onBellClick}>
             <Bell className="h-6 w-6" />
        </Button>
      </div>

      {/* Center Section */}
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
         <h1 className="text-xl font-bold text-white">AT Game HUB</h1>
       </div>


      {/* Right Section */}
      <div className="flex items-center">
        {!loading && (
          user ? (
            <WalletBalance />
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
