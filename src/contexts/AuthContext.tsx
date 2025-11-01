
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_PAGES = ['/login', '/register'];
const PROTECTED_PAGES = ['/profile', '/wallet', '/orders', '/top-up', '/games'];
const ADMIN_PAGES = ['/admin'];


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      const isAdminUser = firebaseUser?.email === 'ohshif5@gmail.com';
      setIsAdmin(isAdminUser);
      
      if (!firebaseUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });
    
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false); // Ensure loading is false if there's no user.
      return;
    }

    setLoading(true); // Set loading to true when we start fetching the profile
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeProfile = onSnapshot(userDocRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
        } else {
          setUserProfile(null);
        }
        setLoading(false); // Set loading to false after fetching profile
      }, 
      (error) => {
        console.error("Error listening to user profile:", error);
        setUserProfile(null);
        setLoading(false); // Also set loading to false on error
      }
    );

    return () => unsubscribeProfile();

  }, [user]);

  useEffect(() => {
    if (loading) return;

    const isAuthPage = AUTH_PAGES.includes(pathname);
    const isProtectedRoute = PROTECTED_PAGES.some(p => pathname.startsWith(p));
    const isAdminRoute = ADMIN_PAGES.some(p => pathname.startsWith(p));

    if (user) {
      if (isAuthPage) {
        router.replace('/profile');
      } else if (isAdminRoute && !isAdmin) {
        router.replace('/');
      }
    } else {
      if (isProtectedRoute || isAdminRoute) {
        router.replace('/login');
      }
    }
  }, [user, loading, pathname, router, isAdmin]);

  const value = { user, userProfile, loading, isAdmin };

  const isAuthPage = AUTH_PAGES.includes(pathname);
  if (loading && !isAuthPage) {
     return (
        <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background">
            <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/50 bg-background/95 px-4 backdrop-blur-lg">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <Skeleton className="h-8 w-24 rounded-full" />
            </header>
            <main className="flex-1 px-4 pb-24 pt-6 space-y-6">
                 <Skeleton className="h-48 w-full rounded-lg" />
                 <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-14 w-full rounded-md" />
                    <Skeleton className="h-14 w-full rounded-md" />
                 </div>
                 <Skeleton className="h-24 w-full rounded-lg" />
            </main>
            <footer className="fixed bottom-0 left-0 right-0 z-20 mx-auto h-16 w-full max-w-md border-t border-border/50 bg-background/95 backdrop-blur-lg">
                <div className="flex h-full items-center justify-around">
                    <Skeleton className="h-8 w-1/4 rounded-md" />
                    <Skeleton className="h-8 w-1/4 rounded-md" />
                    <Skeleton className="h-8 w-1/4 rounded-md" />
                    <Skeleton className="h-8 w-1/4 rounded-md" />
                </div>
            </footer>
        </div>
     );
  }

  return (
    <AuthContext.Provider value={value}>
      <FirebaseErrorListener>
        {children}
      </FirebaseErrorListener>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
