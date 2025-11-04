
"use client";

import { Button } from '../ui/button';
import { useAuth } from '@/contexts/AuthContext';
import WalletBalance from './WalletBalance';
import Link from 'next/link';

export default function Header() {
  const { user, loading } = useAuth();
  
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-transparent px-4">
      {/* Left Section */}
      <div className="flex flex-1 items-center justify-start">
        <h1 className="text-xl font-bold text-white">AT Game Hub</h1>
      </div>

      {/* Right Section */}
      <div className="flex flex-1 items-center justify-end">
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
