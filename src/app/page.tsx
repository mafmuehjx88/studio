
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
import { ShieldCheck } from 'lucide-react';


export default function Home() {
  const { isAdmin } = useAuth();
  const bannerImage = staticImages['banner'];

  // Start with games, excluding ones that will be handled specially
  const displayGames: (Game | { id: string, name: string, image: string })[] = [
    ...allGames.filter(g => g.id !== 'telegram' && g.id !== 'tiktok' && g.id !== 'hok' && g.id !== 'smile-coin')
  ];

  // Add the generic "Digital Product" card
  displayGames.push({ id: 'digital-product', name: 'Digital Product', image: 'https://i.ibb.co/wFmXwwNg/zproduct.jpg' });

  // Add smile coin game for all users now
  const smileCoinGame = allGames.find(g => g.id === 'smile-coin');
  if (smileCoinGame) {
    displayGames.push(smileCoinGame);
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

      <div className="grid grid-cols-3 gap-2 text-center">
        <Link href="/top-up" className="space-y-1 rounded-lg bg-card p-3">
            <span className="text-4xl">💰</span>
            <p className="font-semibold text-xs">ငွေဖြည့်မည်</p>
        </Link>
        <Link href="/orders" className="space-y-1 rounded-lg bg-card p-3">
             <span className="text-4xl">📦</span>
            <p className="font-semibold text-xs">အော်ဒါများ</p>
        </Link>
        <Link href="/how-to-use" className="space-y-1 rounded-lg bg-card p-3">
             <span className="text-4xl">📘</span>
            <p className="font-semibold text-xs">အသုံးပြုနည်း</p>
        </Link>
      </div>

       {isAdmin && (
        <Button variant="secondary" className="w-full justify-center gap-2" asChild>
          <Link href="/admin">
            <ShieldCheck className="h-5 w-5" />
            Admin Panel
          </Link>
        </Button>
      )}
      
      <MarqueeText />

      <div>
        <h2 className="mb-4 text-center text-2xl font-bold text-white">Games</h2>
        <div className="grid grid-cols-3 gap-3">
          {displayGames.map((game) => {
              const isDigitalProduct = game.id === 'digital-product';
              const href = isDigitalProduct ? '/digital-product' : `/games/${game.id}`;
              
              return (
                <Link key={game.id} href={href} className="group">
                  <Card className="overflow-hidden transition-transform group-hover:scale-105 rounded-lg border-2 border-transparent group-hover:border-primary">
                    <Image
                      src={game.image}
                      alt={game.name}
                      width={400}
                      height={400}
                      className="aspect-square w-full rounded-lg object-cover"
                    />
                  </Card>
                  <p className="mt-2 text-center text-sm font-semibold text-white">
                    {game.name}
                  </p>
                </Link>
              )
          })}
        </div>
      </div>
    </div>
  );
}
