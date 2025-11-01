'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { games as staticGames } from '@/lib/data';
import { Marquee } from '@/components/ui/marquee';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Game, PlaceholderImage } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [imagesMap, setImagesMap] = useState<Record<string, PlaceholderImage>>({});
  const [marqueeText, setMarqueeText] = useState('');
  const [loading, setLoading] = useState(true);

  const games = staticGames;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "marquee"));
        const text = settingsDoc.exists() 
          ? settingsDoc.data().text 
          : "Welcome to AT Game HUB! Your trusted partner for game top-ups.";
        setMarqueeText(text);

        const imagesDoc = await getDoc(doc(db, "settings", "placeholderImages"));
        if (imagesDoc.exists()) {
            setImagesMap(imagesDoc.data().images || {});
        }

      } catch (error) {
        console.error("Error fetching initial data:", error);
        setMarqueeText("Welcome to AT Game HUB!");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);
  
  const bannerImage = imagesMap['banner'];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="aspect-[3/1] w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-8 w-full" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="aspect-square w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none">
        {bannerImage && (
          <Image
            src={bannerImage.imageUrl}
            alt={bannerImage.description}
            width={1200}
            height={400}
            className="aspect-[3/1] w-full object-cover"
            data-ai-hint={bannerImage.imageHint}
            priority
          />
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
        <h2 className="mb-4 text-2xl font-bold">Games</h2>
        <div className="grid grid-cols-3 gap-4">
          {games.map((game) => {
            const gameImage = imagesMap[game.image];
            return (
              <Link href={`/games/${game.id}`} key={game.id}>
                <Card className="overflow-hidden transition-transform hover:scale-105">
                  <CardContent className="p-0">
                    {gameImage ? (
                      <Image
                        src={gameImage.imageUrl}
                        alt={game.name}
                        width={400}
                        height={400}
                        className="aspect-square w-full rounded-t-lg object-cover"
                        data-ai-hint={gameImage.imageHint}
                      />
                    ) : (
                      <div className="aspect-square w-full bg-muted"></div>
                    )}
                    <div className="p-2 text-center">
                      <p className="truncate text-xs font-semibold">
                        {game.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
