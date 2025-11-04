
"use client";

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { games as allGames, staticImages } from '@/lib/data';
import type { Game } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import MarqueeText from '@/components/MarqueeText';


export default function Home() {
  const { isAdmin } = useAuth();
  const bannerImage = staticImages['banner'];

  const displayGames: (Game | { id: string, name: string, image: string })[] = [
    ...allGames.filter(g => g.id !== 'telegram' && g.id !== 'tiktok' && g.id !== 'hok')
  ];

  displayGames.push({ id: 'digital-product', name: 'Digital Product', image: 'https://i.ibb.co/wFmXwwNg/zproduct.jpg' });

  if (isAdmin) {
    const smileCoinGame = allGames.find(g => g.id === 'smile-coin');
    if (smileCoinGame) {
      displayGames.push(smileCoinGame);
    }
  }
  

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none rounded-lg">
        {bannerImage ? (
          <Image
            src={bannerImage.imageUrl}
            alt={bannerImage.description}
            width={1200}
            height={400}
            className="aspect-[2.5/1] w-full object-cover"
            data-ai-hint={bannerImage.imageHint}
            priority
          />
        ) : (
          <Skeleton className="aspect-[2.5/1] w-full" />
        )}
      </Card>

      <div className="grid grid-cols-2 gap-4">
          <Button asChild className="h-12 bg-white text-blue-600 font-bold hover:bg-gray-200">
              <Link href="/top-up">ငွေဖြည့်မည်</Link>
          </Button>
          <Button asChild className="h-12 bg-gray-800 text-white font-bold hover:bg-gray-700">
              <Link href="/orders">အော်ဒါများ</Link>
          </Button>
      </div>

       <Button asChild className="w-full h-12 bg-black text-white font-bold hover:bg-gray-900">
          <Link href="/how-to-use">Website အသုံးပြုနည်း</Link>
      </Button>
      
      <MarqueeText />

      <div>
        <h2 className="mb-4 text-center text-2xl font-bold text-white">Games</h2>
        <div className="grid grid-cols-3 gap-4">
          {displayGames.map((game) => {
              const isDigitalProduct = game.id === 'digital-product';
              const href = isDigitalProduct ? '/digital-product' : `/games/${game.id}`;
              
              return (
                <div key={game.id} className="flex flex-col items-center gap-2">
                    <Link href={href} className="w-full">
                        <Card className="overflow-hidden transition-transform hover:scale-105 rounded-lg border-2 border-transparent hover:border-blue-400">
                            <Image
                            src={game.image}
                            alt={game.name}
                            width={400}
                            height={400}
                            className="aspect-square w-full rounded-lg object-cover"
                            />
                        </Card>
                    </Link>
                    <p className="text-sm font-semibold text-white">
                        {game.name}
                    </p>
                    <Button asChild size="sm" className="w-full bg-gray-800 hover:bg-gray-700">
                        <Link href={href}>ဝယ်မည်</Link>
                    </Button>
                </div>
              )
          })}
        </div>
      </div>
    </div>
  );
}
