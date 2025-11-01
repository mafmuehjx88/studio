"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <AuthGuard isAuthPage={true}>
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
    </AuthGuard>
  );
}
