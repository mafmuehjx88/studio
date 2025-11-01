"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRedirectIfAuth } from "@/hooks/use-auth";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();

  const { loading: authLoading } = useRedirectIfAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const logo = PlaceHolderImages.find((img) => img.id === "logo");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegistering(true);

    const usernameRegex = /^(?=(?:[^a-zA-Z]*[a-zA-Z]){4,})(?=(?:[^\d]*\d){4,}).*$/;
    if (!usernameRegex.test(username)) {
      toast({
        title: "Invalid Username",
        description: "Username must contain at least 4 letters and 4 numbers.",
        variant: "destructive",
      });
      setIsRegistering(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
       setIsRegistering(false);
       return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      setIsRegistering(false);
      return;
    }

    if (!agreed) {
      toast({
        title: "Terms & Conditions",
        description: "You must agree to the terms and conditions.",
        variant: "destructive",
      });
      setIsRegistering(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: username,
        email: user.email,
        walletBalance: 0,
        createdAt: serverTimestamp(),
      });
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Redirecting...",
      });
      // The useRedirectIfAuth hook will handle the redirect on the next render cycle
      // when the auth state changes. No need to manually set isRegistering to false
      // as the component will unmount on redirect.
      
    } catch (error: any) {
      let description = "An unexpected error occurred.";
      if (error.code === 'auth/email-already-in-use') {
        description = "This email is already registered. Please log in.";
      }
      toast({
        title: "Registration Failed",
        description,
        variant: "destructive",
      });
      setIsRegistering(false);
    }
  };
  
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center text-center">
          {logo && (
            <div className="relative mb-4">
              <div className="absolute -inset-0.5 animate-pulse rounded-full bg-primary/50 blur-lg"></div>
              <Image
                src={logo.imageUrl}
                alt={logo.description}
                width={64}
                height={64}
                className="relative rounded-full"
                data-ai-hint={logo.imageHint}
              />
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join AT Game HUB and start buying game items securely.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="user1234"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={isRegistering}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isRegistering}
            />
          </div>
          <div className="relative space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isRegistering}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-7 h-7 w-7 text-muted-foreground"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isRegistering}
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <div className="relative space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={isRegistering}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-7 h-7 w-7 text-muted-foreground"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isRegistering}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
                id="terms" 
                checked={agreed}
                onCheckedChange={(checked) => setAgreed(checked as boolean)}
                disabled={isRegistering}
            />
            <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground">
              I agree to{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms & Conditions
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isRegistering}>
            {isRegistering ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
