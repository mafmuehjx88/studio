
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
const PROTECTED_PAGES = ['/profile', '/wallet', '/orders', '/top-up', '/games']; // Add any other protected routes here

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true); // Start loading whenever auth state changes
      setUser(firebaseUser);
      setIsAdmin(firebaseUser?.email === 'ohshif5@gmail.com');
      
      if (!firebaseUser) {
        // User is signed out, no profile to fetch.
        setUserProfile(null);
        setLoading(false);
      }
    });
    
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      // User is signed out, no need to listen to profile.
      return;
    }

    // User is logged in, start listening for profile changes.
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeProfile = onSnapshot(userDocRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setUserProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
        } else {
          setUserProfile(null);
        }
        setLoading(false); // Finished loading profile
      }, 
      (error) => {
        console.error("Error listening to user profile:", error);
        setUserProfile(null);
        setLoading(false); // Finished loading (with error)
      }
    );

    return () => unsubscribeProfile();

  }, [user]); // This effect re-runs only when the user object itself changes.

  useEffect(() => {
    // This effect handles ALL redirection logic after loading is complete.
    if (loading) return;

    const isAuthPage = AUTH_PAGES.includes(pathname);
    const isProtectedRoute = PROTECTED_PAGES.some(p => pathname.startsWith(p));

    if (user && isAuthPage) {
      // Logged-in user on an auth page (e.g., /login) -> redirect to profile
      router.replace('/profile');
    } else if (!user && isProtectedRoute) {
      // Logged-out user trying to access a protected page -> redirect to login
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  const value = { user, userProfile, loading, isAdmin };

  // While loading, we can show a global skeleton loader to prevent content flashing.
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
