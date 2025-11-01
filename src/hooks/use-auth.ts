"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export function useAuthHook() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}

export function useRequireAuth(redirectUrl = '/login') {
    const { user, loading } = useAuthHook();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace(redirectUrl);
        }
    }, [user, loading, router, redirectUrl]);

    return { user, loading };
}

export function useRedirectIfAuth(redirectUrl = '/profile') {
    const { user, loading } = useAuthHook();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace(redirectUrl);
        }
    }, [user, loading, router, redirectUrl]);

    return { user, loading };
}