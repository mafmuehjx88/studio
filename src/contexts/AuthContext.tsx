"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, DocumentData } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { setCookie, destroyCookie } from 'nookies';
import { usePathname, useRouter } from 'next/navigation';

const AUTH_COOKIE_NAME = 'firebase-auth-token';

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        // User is signed in.
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        setCookie(null, AUTH_COOKIE_NAME, token, { maxAge: 30 * 24 * 60 * 60, path: '/' });
        setIsAdmin(firebaseUser.email === 'ohshif5@gmail.com');

        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
          } else {
            setUserProfile(null);
          }
          // This is the definitive point where auth flow is complete
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user profile:", error);
          setUserProfile(null);
          setLoading(false);
        });
        
        return () => unsubscribeProfile();
      } else {
        // User is signed out.
        setUser(null);
        setUserProfile(null);
        destroyCookie(null, AUTH_COOKIE_NAME, { path: '/' });
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Effect to handle redirection after authentication state is resolved.
  useEffect(() => {
    if (loading) {
      return; // Do nothing while loading
    }
    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (user && isAuthPage) {
        // User is logged in and on an auth page, redirect to profile.
        router.replace('/profile');
    }
  }, [user, loading, pathname, router]);

  const value = { user, userProfile, loading, isAdmin };

  return (
    <AuthContext.Provider value={value}>
      {children}
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
