"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
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
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in.
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        setCookie(null, AUTH_COOKIE_NAME, token, { maxAge: 30 * 24 * 60 * 60, path: '/' });
        setIsAdmin(firebaseUser.email === 'ohshif5@gmail.com');

        // Listen for realtime updates on the user profile for things like walletBalance
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
          } else {
            // This could happen if the user record in Firestore is deleted
            setUserProfile(null);
          }
           // Once we get the first snapshot, we can consider the initial loading complete.
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user profile:", error);
          setUserProfile(null);
          setLoading(false);
        });
        
        // Return the profile listener's unsubscribe function.
        // It will be called when the user logs out.
        return () => unsubscribeProfile();

      } else {
        // User is logged out.
        setUser(null);
        setUserProfile(null);
        destroyCookie(null, AUTH_COOKIE_NAME, { path: '/' });
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);


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
