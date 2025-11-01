"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { logoutUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LogOut, User, Mail, Wallet } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function ProfilePage() {
  const { userProfile, user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  const avatar = PlaceHolderImages.find((img) => img.id === "default-avatar");

  if (!userProfile || !user) return null;

  return (
    <AuthGuard>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                {avatar && <AvatarImage src={avatar.imageUrl} alt={userProfile.username} />}
                <AvatarFallback>{userProfile.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xl font-bold">{userProfile.username}</p>
                <p className="text-sm text-muted-foreground">{userProfile.email}</p>
              </div>
            </div>
            <div className="space-y-2 pt-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Username:</span>
                <span>{userProfile.username}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Email:</span>
                <span>{userProfile.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Balance:</span>
                <span className="font-semibold text-primary">{userProfile.walletBalance.toFixed(2)} Ks</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleLogout} variant="destructive" className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </AuthGuard>
  );
}
