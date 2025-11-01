"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { logoutUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { LogOut, Settings, Wallet, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logoutUser();
    router.replace("/login");
  };

  const avatar = PlaceHolderImages.find((img) => img.id === "default-avatar");

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex-row items-center gap-4 p-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <>
              {avatar && userProfile && <AvatarImage src={avatar.imageUrl} alt={userProfile?.username} />}
              <AvatarFallback>
                {userProfile ? userProfile.username.charAt(0).toUpperCase() : '?'}
              </AvatarFallback>
            </>
          </Avatar>
          <div className="space-y-1">
            {userProfile ? (
              <>
                <CardTitle className="text-xl">{userProfile.username}</CardTitle>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{userProfile.walletBalance.toFixed(2)} Ks</span>
                </div>
              </>
            ) : (
               <>
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-5 w-24 rounded-md" />
              </>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" className="justify-start gap-3 text-base h-12" disabled={loading}>
              <Settings className="h-5 w-5 text-muted-foreground" />
              <span>Settings</span>
          </Button>
          <Button 
            variant="outline" 
            className="justify-start gap-3 text-base h-12 text-destructive hover:text-destructive hover:bg-destructive/10" 
            onClick={handleLogout}
            disabled={loading}
          >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
          </Button>
      </div>

    </div>
  );
}
