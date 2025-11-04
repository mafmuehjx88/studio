
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_PAGES = ['/login', '/register'];
const PROTECTED_PAGES = ['/profile', '/wallet', '/orders', '/top-up', '/games', '/smile-coin', '/settings'];
const ADMIN_PAGES = ['/admin'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      let profileUnsubscribe: () => void = () => {};

      if (firebaseUser) {
        setUser(firebaseUser);

        // Force a refresh of the token to get the latest custom claims.
        const idTokenResult = await firebaseUser.getIdTokenResult(true);
        const claimsIsAdmin = idTokenResult.claims.admin === true;
        setIsAdmin(claimsIsAdmin);

        const userDocRef = doc(db, 'users', firebaseUser.uid);
        profileUnsubscribe = onSnapshot(userDocRef, 
          (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile({ ...docSnap.data(), uid: docSnap.id } as UserProfile);
            } else {
              setUserProfile(null);
            }
            setLoading(false);
          }, 
          (error) => {
            console.error("Error listening to user profile:", error);
            setUserProfile(null);
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
      
      return () => {
        profileUnsubscribe();
      };
    });

    return () => unsubscribeAuth();
  }, []);


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
  }, [user, isAdmin, loading, pathname, router]);

  const value = { user, userProfile, loading, isAdmin };
  
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
