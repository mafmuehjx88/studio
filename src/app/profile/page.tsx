
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Settings, Wallet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ProfilePage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    // The AuthContext will detect the sign-out and redirect via middleware logic.
    // For a faster UX, we can preemptively push.
    router.replace("/login");
  };

  const avatar = PlaceHolderImages.find((img) => img.id === "default-avatar");

  // The middleware protects this page. We only need to handle the loading state
  // for the user profile data itself.
  if (loading) {
    return (
        <div className="space-y-6">
            <Card className="overflow-hidden">
                <CardHeader className="flex-row items-center gap-4 p-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32 rounded-md" />
                        <Skeleton className="h-5 w-24 rounded-md" />
                    </div>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 gap-2">
                <Skeleton className="h-12 w-full rounded-md" />
                <Skeleton className="h-12 w-full rounded-md" />
            </div>
        </div>
    );
  }

  // Handle case where user is authenticated but profile is not found (e.g., deleted from db)
  if (!userProfile) {
    return (
        <div className="flex flex-col items-center justify-center text-center">
            <h2 className="text-2xl font-bold">Could Not Load Profile</h2>
            <p className="text-muted-foreground">Your profile data could not be found.</p>
            <Button onClick={handleLogout} variant="destructive" className="mt-4">
                Logout
            </Button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center gap-4 p-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            {avatar && <AvatarImage src={avatar.imageUrl} alt={userProfile.username} /> }
             <AvatarFallback>
              {userProfile.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
                <CardTitle className="text-xl">{userProfile.username}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{userProfile.walletBalance.toFixed(2)} Ks</span>
                </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" className="justify-start gap-3 text-base h-12">
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span>Settings</span>
          </Button>
          <Button 
            variant="outline" 
            className="justify-start gap-3 text-base h-12 text-destructive hover:text-destructive hover:bg-destructive/10" 
            onClick={handleLogout}
          >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
          </Button>
      </div>

    </div>
  );
}
