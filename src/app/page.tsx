
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

      <Card className="bg-secondary">
        <Marquee>
          <span className="px-4 text-xs font-medium text-primary">
            {marqueeText}
          </span>
        </Marquee>
      </Card>

      <div>
        <h2 className="mb-4 text-center text-2xl font-bold">Games</h2>
        <div className="grid grid-cols-3 gap-4">
          {games.map((game) => (
            <Link href={`/games/${game.id}`} key={game.id}>
              <Card className="overflow-hidden transition-transform hover:scale-105">
                <CardContent className="p-0">
                  <Image
                    src={game.image}
                    alt={game.name}
                    width={400}
                    height={400}
                    className="aspect-square w-full rounded-t-lg object-cover"
                  />
                  <div className="p-2 text-center">
                    <p className="truncate text-xs font-semibold">
                      {game.name}
                    </p>
                  </div>
                </CardContent>
              </Card>
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
