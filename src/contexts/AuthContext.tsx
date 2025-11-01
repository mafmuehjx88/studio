"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile } from '@/lib/types';
import { setCookie, destroyCookie } from 'nookies';

// The cookie name for the Firebase auth token
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
  const [loading, setLoading] = useState(true); // Single loading state
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // Start loading whenever auth state might change
      setUser(firebaseUser);

      if (firebaseUser) {
        // Set cookie and admin status
        const token = await firebaseUser.getIdToken();
        setCookie(null, AUTH_COOKIE_NAME, token, { maxAge: 30 * 24 * 60 * 60, path: '/' });
        setIsAdmin(firebaseUser.email === 'ohshif5@gmail.com');

        // Listen for profile changes
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
          } else {
            setUserProfile(null);
          }
          setLoading(false); // Stop loading once profile is fetched (or not found)
        }, (error) => {
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
          setLoading(false); // Stop loading on error
        });
        
        // Return the profile listener unsubscribe function to be called on cleanup
        return () => unsubscribeProfile();
      } else {
        // User is logged out
        destroyCookie(null, AUTH_COOKIE_NAME, { path: '/' });
        setUserProfile(null);
        setIsAdmin(false);
        setLoading(false); // Stop loading on logout
      }
    });

    // Return the auth listener unsubscribe function to be called on component unmount
    return () => unsubscribeAuth();
  }, []);


  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAdmin }}>
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
