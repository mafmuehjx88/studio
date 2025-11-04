
"use client";

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { games as allGames, staticImages } from '@/lib/data';
import type { Game } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import MarqueeText from '@/components/MarqueeText';
import { useAuth } from '@/contexts/AuthContext';


export default function Home() {
  const { isAdmin } = useAuth();
  const bannerImage = staticImages['banner'];
  const logoImage = staticImages['logo'];

  // Filter out telegram and tiktok from the main games list to avoid duplication
  // Also filter out smile-coin by default, we will add it back in explicitly.
  const displayGames = allGames.filter(g => g.id !== 'telegram' && g.id !== 'tiktok' && g.id !== 'smile-coin');
  
  const smileCoinGame = allGames.find(g => g.id === 'smile-coin');

  const gamesList: (Game | { id: string, name: string, image: string })[] = [
    ...displayGames
  ];

  // Add smile coin to the list for everyone now
  if (smileCoinGame) {
      gamesList.push(smileCoinGame);
  }

  // Add digital product at the end
  gamesList.push({ id: 'digital-product', name: 'Digital Product', image: 'https://i.ibb.co/wFmXwwNg/zproduct.jpg' });


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

      <div className="mt-2 flex justify-center">
          <Button asChild variant="outline" size="sm">
              <Link href="/how-to-use">Website အသုံးပြုနည်း</Link>
          </Button>
      </div>

      <MarqueeText />

      <div>
        <h2 className="mb-4 text-center text-2xl font-bold">Games</h2>
        <div className="grid grid-cols-3 gap-3">
          {gamesList.map((game) => {
              const isDigitalProduct = game.id === 'digital-product';
              const isSmileCoin = game.id === 'smile-coin';
              
              const Wrapper = Link;
              let props;
              if (isDigitalProduct) {
                props = { href: '/digital-product' };
              } else if (isSmileCoin) {
                props = { href: '/smile-coin' };
              } else {
                props = { href: `/games/${game.id}` };
              }
              
              return (
                <React.Fragment key={`game-${game.id}`}>
                    <Wrapper {...props} className="group flex flex-col gap-2 text-center">
                        <Card className="overflow-hidden transition-transform group-hover:scale-105">
                            <Image
                            src={game.image}
                            alt={game.name}
                            width={400}
                            height={400}
                            className="aspect-square w-full rounded-lg object-cover"
                            />
                        </Card>
                         <p className="text-xs font-semibold text-foreground">
                            {game.name}
                        </p>
                        <Button variant="secondary" size="sm" className="h-8 w-full text-xs">
                            {isDigitalProduct ? "ဝယ်မည်" : "ဝယ်မည်"}
                        </Button>
                    </Wrapper>
                </React.Fragment>
              )
          })}
        </div>
      </div>
      
      <div className="space-y-4 pt-8">
        {logoImage && (
            <div className="flex flex-col items-center gap-2">
                <div className="w-1/4">
                    <Card className="overflow-hidden border-none bg-transparent shadow-none">
                        <Image
                            src={logoImage.imageUrl}
                            alt={logoImage.description}
                            width={400}
                            height={400}
                            className="aspect-square w-full object-cover"
                            data-ai-hint={logoImage.imageHint}
                        />
                    </Card>
                </div>
                <p className="text-center text-lg font-bold text-primary">AT Game HUB</p>
            </div>
        )}
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
