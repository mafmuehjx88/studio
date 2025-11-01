
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsAdmin(firebaseUser.email === 'ohshif5@gmail.com');
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, 
          (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
            } else {
              // This can happen if the user is created in Auth but the Firestore doc fails.
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
        return () => unsubscribeProfile();
      } else {
        // User is signed out.
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // This effect handles redirection based on auth state.
    // It's the single source of truth for navigation logic.
    if (loading) return; // Don't do anything while still loading

    const authPages = ['/login', '/register'];
    const isAuthPage = authPages.includes(pathname);

    if (user && isAuthPage) {
      // If user is logged in and on an auth page, redirect to home/profile.
      router.replace('/profile');
    } else if (!user && !isAuthPage) {
      // If user is not logged in and not on an auth page, redirect to login.
      router.replace('/login');
    }
  }, [user, loading, pathname, router]);

  const value = { user, userProfile, loading, isAdmin };

  // While loading, we can show a blank screen or a global loader
  // to prevent content flashing.
  if (loading) {
     const authPages = ['/login', '/register'];
     const isAuthPage = authPages.includes(pathname);
     // Don't show a blank screen for auth pages, let them render their own UI
     if (!isAuthPage) {
        return null; // Or a full-page loader
     }
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
