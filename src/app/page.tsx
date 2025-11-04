
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
import { BookOpen, History, Info } from 'lucide-react';


export default function Home() {
  const bannerImage = staticImages['banner'];

  const displayGames = allGames.filter(g => g.id !== 'telegram' && g.id !== 'tiktok' && g.id !== 'smile-coin' && g.id !== 'hok');
  
  const gamesList: (Game | { id: string, name: string, image: string })[] = [
    ...displayGames
  ];

  gamesList.push({ id: 'digital-product', name: 'Digital Product', image: 'https://i.ibb.co/wFmXwwNg/zproduct.jpg' });

  const mainButtons = [
    { href: "/top-up", icon: BookOpen, label: "ငွေဖြည့်မည်" },
    { href: "/orders", icon: History, label: "အော်ဒါများ" },
    { href: "/how-to-use", icon: Info, label: "အသုံးပြုနည်း" },
  ];

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none rounded-lg">
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

      <div className="grid grid-cols-3 gap-3">
        {mainButtons.map((item) => (
          <Button
            key={item.href}
            variant="secondary"
            className="flex flex-col items-center justify-center h-20 rounded-lg bg-card text-foreground"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          </Button>
        ))}
      </div>
      
      <MarqueeText />

      <div>
        <div className="grid grid-cols-3 gap-3">
          {gamesList.map((game) => {
              const isDigitalProduct = game.id === 'digital-product';
              
              const Wrapper = Link;
              const props = { href: isDigitalProduct ? '/digital-product' : `/games/${game.id}` };
              
              return (
                <React.Fragment key={`game-${game.id}`}>
                    <Wrapper {...props} className="group flex flex-col gap-2 text-center">
                        <Card className="overflow-hidden transition-transform group-hover:scale-105 rounded-lg">
                            <Image
                            src={game.image}
                            alt={game.name}
                            width={400}
                            height={400}
                            className="aspect-square w-full rounded-lg object-cover"
                            />
                        </Card>
                         <p className="text-sm font-semibold text-foreground">
                            {game.name}
                        </p>
                    </Wrapper>
                </React.Fragment>
              )
          })}
        </div>
      </div>
    </div>
  );
}
