"use client";

import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
    // The middleware prevents this page from being shown if logged in.
    // No need for loading or user checks here.
    return (
      <div className="flex min-h-full flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-primary mb-8">AT Game HUB</h1>
        <div className="w-full max-w-sm space-y-6">
          <div>
            <h2 className="text-center text-lg font-bold tracking-tight text-foreground">
              သူအကောင့်ရှိပြီသာဆိုရင် Email နဲ့ Password ထည့်ပြီ တန်းဝင်လိုက်ပါ မရှိသေးဘူးဆိုရင်တော့ Register Now ကိုနိပ်ပြီ အကောင့်ဖွင့်လိုက်ပါ
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
