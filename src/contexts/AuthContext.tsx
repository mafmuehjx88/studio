
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { UserProfile, Notification } from '@/lib/types';
import { usePathname, useRouter } from 'next/navigation';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  hasUnreadNotifications: boolean;
  isOnline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_PAGES = ['/login', '/register'];
const PROTECTED_PAGES = ['/profile', '/wallet', '/orders', '/top-up', '/games', '/smile-coin', '/settings', '/notifications'];
const ADMIN_PAGES = ['/admin', '/admin/manual-top-up'];

// Simplified to a single admin email for consistency with security rules
const ADMIN_EMAILS = ['marrci448@gmail.com'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setLoading(true);
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      let profileUnsubscribe: () => void = () => {};
      let notificationUnsubscribe: () => void = () => {};

      if (firebaseUser) {
        setUser(firebaseUser);
        const userIsAdmin = ADMIN_EMAILS.includes(firebaseUser.email || '');
        setIsAdmin(userIsAdmin);

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
            console.error("AuthContext: Error listening to user profile:", error);
            setUserProfile(null);
            setLoading(false);
          }
        );

        // Listen for unread notifications
        const notificationsQuery = query(
            collection(db, `users/${firebaseUser.uid}/notifications`),
            where("isRead", "==", false)
        );
        notificationUnsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
            setHasUnreadNotifications(!snapshot.empty);
        });

      } else {
        setUser(null);
        setUserProfile(null);
        setIsAdmin(false);
        setHasUnreadNotifications(false);
        setLoading(false);
      }
      
      return () => {
        profileUnsubscribe();
        notificationUnsubscribe();
      };
    });

    return () => unsubscribeAuth();
  }, []);

  // Check for online/offline status
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
    }
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
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

  const value = { user, userProfile, loading, isAdmin, hasUnreadNotifications, isOnline };
  
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
