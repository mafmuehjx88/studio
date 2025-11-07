
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { staticImages } from '@/lib/data';
import Link from 'next/link';
import { Send } from 'lucide-react';

export default function ProfilePage() {
  const { userProfile, loading } = useAuth();
  const router = useRouter();

  const zenithLogo = staticImages['zenith-logo'];

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full rounded-lg" />
        <Skeleton className="h-48 w-full rounded-lg" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold">Could Not Load Profile</h2>
        <p className="text-muted-foreground">
          Your profile data could not be found.
        </p>
        <Button onClick={handleLogout} variant="destructive" className="mt-4">
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-lg bg-white p-4 text-black">
      {/* Profile Card */}
      <div className="rounded-lg bg-gray-100 p-4 text-black">
        <div className="flex items-center gap-4">
          {zenithLogo && (
            <div className="h-16 w-16 flex-shrink-0 rounded-md bg-white p-1">
              <Image
                src={zenithLogo.imageUrl}
                alt={zenithLogo.description}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          )}
          <div className="space-y-1">
            <p className="text-xl font-bold">{userProfile.username}</p>
            <p className="text-lg font-semibold text-blue-600">
              {userProfile.walletBalance.toLocaleString()} ကျပ်
            </p>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-white text-black">
        <CardContent className="space-y-4 p-4">
          <p className="text-center text-sm leading-relaxed text-gray-600">
            မြန်မာစံတော်ချိန် မနက်၉နာရီ မှ ည ၁၀နာရီ အတွင်း ငွေဖြည့်သွင်း
            ဝယ်ယူပါက ၁၅မိနစ် အတွင်းအကောင့်ထဲ ရောက်လာမှာဖြစ်ပါတယ်
            သိလိုသည်များကို ဖုန်းဆက်မေးပါ။(အရေးကြီး မှဆက်ပါ)
            ယုံကြည်စွာဝယ်ယူနိုင်ပါတယ်ဗျ..
          </p>
          <div className="grid grid-cols-1 gap-2">
            <Button variant="outline" asChild className="text-black border-gray-300">
              <a href="tel:09769181524" className="text-base">
                09769181524
              </a>
            </Button>
            <Button asChild className="bg-[#2AABEE] hover:bg-[#2AABEE]/90 text-white">
              <Link href="https://t.me/Atgamehub" target="_blank" className="text-base">
                <Send className="mr-2 h-4 w-4" />
                Channel
              </Link>
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
              <Link href="https://t.me/zenthegod" target="_blank" className="text-base">
                <Send className="mr-2 h-4 w-4" />
                Account
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logout Button as a separate card */}
       <Card className="bg-white">
        <CardContent className="p-2">
            <Button
                variant="destructive"
                className="w-full text-base h-11"
                onClick={handleLogout}
                >
                Logout
            </Button>
        </CardContent>
       </Card>

    </div>
  );
}
