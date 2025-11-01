import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
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
  );
}
