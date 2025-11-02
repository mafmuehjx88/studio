
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
    // This effect should only run once on mount to set up the auth listener.
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsAdmin(firebaseUser?.email === 'marrci448@gmail.com');
      
      if (firebaseUser) {
        // User is logged in, now fetch their profile.
        // Loading will be set to false inside the onSnapshot listener.
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, 
          (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile({ ...docSnap.data(), uid: docSnap.id } as UserProfile);
            } else {
              setUserProfile(null); // Auth record exists, but no profile doc.
            }
            setLoading(false); // Finished loading profile data
          }, 
          (error) => {
            console.error("Error listening to user profile:", error);
            setUserProfile(null);
            setLoading(false); // Finished loading, but with an error
          }
        );
        // We don't return unsubscribeProfile here because onAuthStateChanged
        // gives us a new one every time auth state changes. We need to handle
        // cleanup inside the auth callback itself if needed, but onSnapshot
        // for a specific user doc will be implicitly cleaned when the user logs out
        // and this whole block is re-evaluated.
      } else {
        // User is logged out or session is expired.
        setUserProfile(null);
        setLoading(false); // We are done loading.
      }
    });

    return () => unsubscribeAuth(); // Cleanup the auth subscription on unmount.
  }, []);


  useEffect(() => {
    // This effect handles redirection logic after loading is complete.
    if (loading) return;

    const isAuthPage = AUTH_PAGES.includes(pathname);
    const isProtectedRoute = PROTECTED_PAGES.some(p => pathname.startsWith(p));
    const isAdminRoute = ADMIN_PAGES.some(p => pathname.startsWith(p));

    if (user) {
      // User is logged in
      if (isAuthPage) {
        // If on an auth page, redirect to a default authenticated page
        router.replace('/profile');
      } else if (isAdminRoute && !isAdmin) {
        // If on an admin page without admin rights, redirect to home
        router.replace('/');
      }
    } else {
      // No user is logged in
      if (isProtectedRoute || isAdminRoute) {
        // If trying to access a protected or admin page, redirect to login
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
