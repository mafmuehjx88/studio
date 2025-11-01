"use client";

import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            router.replace('/profile');
        }
    }, [user, router]);
    
    // The middleware handles redirection for non-logged-in users trying to access protected routes.
    // If a logged-in user hits this page, the useEffect above will redirect them.
    // So we can just render the form. If the user state is not yet determined, they'll see the form briefly
    // before redirection, which is acceptable.
    
    if (user) {
        // While redirecting, show a loader
        return (
          <div className="flex h-screen w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
    }


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
