'use client';

import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import UserTopUpRow from '@/components/admin/UserTopUpRow';
import { useCollection } from 'react-firebase-hooks/firestore';

export default function ManualTopUpPage() {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const usersCollectionRef = query(
    collection(db, 'users'),
    orderBy('createdAt', 'desc')
  );

  const [usersSnapshot, loading, error] = useCollection(usersCollectionRef);

  const users: UserProfile[] = useMemo(() => {
    if (!usersSnapshot) return [];
    return usersSnapshot.docs.map(
      (doc) => ({ ...doc.data(), uid: doc.id } as UserProfile)
    );
  }, [usersSnapshot]);

  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    return users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  if (!isAdmin) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
            You do not have permission to view this page.
            </AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Manual Wallet Top-Up</h1>
        <p className="text-muted-foreground">
          Find users and add funds to their wallets directly.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading && (
        <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
        </div>
      )}

      {error && (
         <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Failed to load user data. Please try again later.
            </AlertDescription>
        </Alert>
      )}

      {!loading && !error && (
        <div className="space-y-4">
            {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                    <UserTopUpRow key={user.uid} user={user} />
                ))
            ) : (
                <div className="text-center py-10">
                    <p className="text-muted-foreground">No users found.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
}
