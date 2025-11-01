"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import RegisterForm from "@/components/auth/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <AuthGuard isAuthPage={true}>
      <div className="flex min-h-full flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-primary mb-8">AT Game HUB</h1>
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-center text-2xl font-bold tracking-tight text-foreground">
              Create a new account
            </h2>
          </div>
          <RegisterForm />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
