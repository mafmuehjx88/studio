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
    // This is the main listener for Firebase Auth state changes.
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // Always start loading when auth state might be changing.
      
      if (firebaseUser) {
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken();
        setCookie(null, AUTH_COOKIE_NAME, token, { maxAge: 30 * 24 * 60 * 60, path: '/' });
        setIsAdmin(firebaseUser.email === 'ohshif5@gmail.com');

        // Now, listen for this user's profile data from Firestore.
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserProfile({ uid: docSnap.id, ...docSnap.data() } as UserProfile);
          } else {
            // This case might happen if the user record is deleted from Firestore but auth record still exists.
            setUserProfile(null);
          }
          // IMPORTANT: Stop loading only AFTER we've attempted to fetch the profile.
          setLoading(false);
        }, (error) => {
          // Handle errors in fetching profile
          console.error("Error fetching user profile:", error);
          setUserProfile(null);
          setLoading(false); // Also stop loading on error.
        });

        // This function will be called when the user logs out.
        // It cleans up the Firestore listener.
        return () => unsubscribeProfile();

      } else {
        // User is logged out.
        setUser(null);
        setUserProfile(null);
        destroyCookie(null, AUTH_COOKIE_NAME, { path: '/' });
        setIsAdmin(false);
        setLoading(false); // Stop loading.
      }
    });

    // This is the cleanup function for the main auth listener.
    // It runs when the AuthProvider component unmounts.
    return () => unsubscribeAuth();
  }, []); // The empty dependency array means this effect runs only once on mount.


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
