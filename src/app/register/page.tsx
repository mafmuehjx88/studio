
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { useRouter } from "next/navigation";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";


export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  
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
    
    const usernameRegex = /^(?=(?:[^a-zA-Z]*[a-zA-Z]){4,})(?=(?:[^\d]*\d){4,}).*$/;
    if (!usernameRegex.test(username)) {
      toast({
        title: "Invalid Username",
        description: "Username must contain at least 4 letters and 4 numbers.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
       return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (!agreed) {
      toast({
        title: "Terms & Conditions",
        description: "You must agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2. Prepare user profile data for Firestore
      const userProfileData = {
        uid: user.uid,
        username: username,
        email: user.email,
        walletBalance: 0,
        createdAt: serverTimestamp(),
      };
      
      // 3. Create user document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, userProfileData);
      
      // 4. Show success and redirect (AuthContext will handle redirection)
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Redirecting...",
      });
      // The redirect is now handled by the AuthContext, so we don't need to do it here.

    } catch (error: any) {
      let description = "An unexpected error occurred.";
      // Handle Auth errors
      if (error.code === 'auth/email-already-in-use') {
        description = "This email is already registered. Please log in.";
      } else if (error.name === 'FirestoreError') {
        // This is a generic Firestore error, which might be a permission error.
        // We'll construct our detailed error and emit it.
         const permissionError = new FirestorePermissionError({
            path: `users/${email}`, // Approximate path for context
            operation: 'create',
          });
          errorEmitter.emit('permission-error', permissionError);
          description = "Could not create user profile. Please check permissions.";
      }
      
      toast({
        title: "Registration Failed",
        description,
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };
  
  return (
    <div className="flex min-h-full flex-col items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center text-center">
          {logo && (
             <div className="relative mb-4 h-16 w-16">
               <div className="absolute -inset-1 animate-pulse rounded-full bg-primary/50 blur-lg"></div>
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
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
