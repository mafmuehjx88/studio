"use client";

import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.replace('/profile');
        }
    }, [user, loading, router]);
    
    // While the auth state is being determined, show a loader.
    if (loading) {
        return (
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
    }

    // If the user is already logged in (and we're not loading), they'll be redirected by the useEffect.
    // If not logged in, show the form.
    if (!user) {
      return (
        <div className="flex min-h-full flex-col items-center justify-center">
          <h1 className="text-3xl font-bold text-primary mb-8">AT Game HUB</h1>
          <div className="w-full max-w-sm space-y-6">
            <div>
              <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
                Sign in to your account
              </h2>
            </div>
            <LoginForm />
            <p className="text-center text-sm text-muted-foreground">
              Not a member?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
      );
    }
    
    // This is shown while the redirect is in flight after logging in.
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
}
