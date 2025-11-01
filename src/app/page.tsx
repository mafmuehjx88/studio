
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { games, staticImages } from '@/lib/data';
import { Marquee } from '@/components/ui/marquee';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Game } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { Megaphone } from 'lucide-react';

// Helper function to fetch data on the server
async function getMarqueeText() {
  try {
    const settingsDoc = await getDoc(doc(db, "settings", "marquee"));
    const marqueeText = settingsDoc.exists() 
      ? settingsDoc.data().text 
      : "Welcome to AT Game HUB! Your trusted partner for game top-ups.";
    
    return marqueeText;
  } catch (error) {
    console.error("Error fetching marquee data:", error);
    // Return default values in case of an error
    return "Welcome to AT Game HUB!";
  }
}

export default async function Home() {
  const marqueeText = await getMarqueeText();
  
  const bannerImage = staticImages['banner'];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none">
        {bannerImage ? (
          <Image
            src={bannerImage.imageUrl}
            alt={bannerImage.description}
            width={1200}
            height={400}
            className="aspect-[3/1] w-full object-cover"
            data-ai-hint={bannerImage.imageHint}
            priority
          />
        ) : (
          <Skeleton className="aspect-[3/1] w-full" />
        )}
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button asChild size="sm">
          <Link href="/top-up">ငွေဖြည့်မည်</Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link href="/orders">အော်ဒါများ</Link>
        </Button>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-card px-2 py-1">
          <Megaphone className="h-4 w-4 flex-shrink-0 text-primary" />
          <div className="flex-1 overflow-hidden">
            <Marquee>
              <p className="px-4 text-xs font-medium text-primary">
                {marqueeText}
              </p>
            </Marquee>
          </div>
      </div>


      <div>
        <h2 className="mb-4 text-center text-2xl font-bold">Games</h2>
        <div className="grid grid-cols-3 gap-3">
          {games.map((game) => (
            <Link href={`/games/${game.id}`} key={game.id} className="group flex flex-col gap-2 text-center">
                <Card className="overflow-hidden transition-transform group-hover:scale-105">
                    <Image
                    src={game.image}
                    alt={game.name}
                    width={400}
                    height={400}
                    className="aspect-square w-full rounded-lg object-cover"
                    />
                </Card>
                 <p className="truncate text-sm font-semibold text-foreground">
                    {game.name}
                </p>
                <Button variant="secondary" size="sm" className="h-8 w-full text-xs">ဝယ်မည်</Button>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="pt-8">
        <Separator />
        <div className="flex justify-center gap-4 py-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">
                Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">
                Privacy Policy
            </Link>
        </div>
      </div>
    </div>
  );
}
