
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
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false); // Only true when fetching profile
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthLoading(true);
      setUser(firebaseUser);
      setIsAdmin(firebaseUser?.email === 'ohshif5@gmail.com');
      if (!firebaseUser) {
        // If user logs out or is not logged in, we are done loading.
        setUserProfile(null);
        setAuthLoading(false);
      }
      // If a user *is* found, loading will be set to false inside the profile snapshot effect
    });
    
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    // This effect runs when the user's auth state changes.
    // If we have a user, we fetch their profile. If not, we are done.
    if (user) {
        setProfileLoading(true); // Start loading profile data
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, 
          (docSnap) => {
            if (docSnap.exists()) {
              setUserProfile({ ...docSnap.data(), uid: docSnap.id } as UserProfile);
            } else {
              setUserProfile(null); // User exists in auth, but not in db
              console.error(`Profile not found in Firestore for user ${user.uid}`);
            }
            setProfileLoading(false); // Finished loading profile data
            setAuthLoading(false); // Finished loading auth and profile sequence
          }, 
          (error) => {
            console.error("Error listening to user profile:", error);
            setUserProfile(null);
            setProfileLoading(false); // Finished loading, but with an error
            setAuthLoading(false);
          }
        );

        return () => unsubscribeProfile();
    } else {
        // No user, so no profile to fetch. Not loading.
        setUserProfile(null);
        setProfileLoading(false);
    }
  }, [user]);

  // The overall loading state is true if we are checking auth OR fetching the profile
  const loading = authLoading || profileLoading;

  useEffect(() => {
    // This effect handles redirection after loading is complete.
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
      // No user
      if (isProtectedRoute || isAdminRoute) {
        router.replace('/login');
      }
    }
  }, [user, loading, pathname, router, isAdmin]);

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
