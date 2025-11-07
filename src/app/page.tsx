
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
import { ShieldCheck, UserCheck } from 'lucide-react';


export default function Home() {
  const { isAdmin } = useAuth();
  const bannerImage = staticImages['banner'];

  // Start with games, excluding ones that will be handled specially
  const displayGames: (Game | { id: string, name: string, image: string })[] = [
    ...allGames.filter(g => g.id !== 'telegram' && g.id !== 'tiktok' && g.id !== 'hok' && g.id !== 'smile-coin')
  ];

  // Add the generic "Digital Product" card
  displayGames.push({ id: 'digital-product', name: 'Digital Product', image: 'https://i.ibb.co/wFmXwwNg/zproduct.jpg' });
  
  // Add the "Game Account" card
  displayGames.push({ id: 'game-account', name: 'Game Account', image: 'https://i.ibb.co/cXSttfXb/accountl.png' });

  // Add smile coin game only if user is admin.
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
          <Skeleton className="aspect-[2.s1/1] w-full" />
        )}
      </Card>

       {isAdmin && (
        <Button variant="secondary" className="w-full justify-center gap-2" asChild>
          <Link href="/admin">
            <ShieldCheck className="h-5 w-5" />
            Admin Panel
          </Link>
        </Button>
      )}

      <div className="flex justify-center">
        <Button variant="secondary" className="border border-primary/20 bg-card hover:bg-accent" asChild>
            <a href="https://pizzoshop.com/mlchecker" target="_blank" rel="noopener noreferrer">
                <UserCheck className="mr-2 h-5 w-5 text-primary" />
                <span className="font-bold">MLBB Server Check</span>
            </a>
        </Button>
      </div>
      
      <MarqueeText />

      <div>
        <h2 className="mb-4 text-center text-2xl font-bold text-white">Games</h2>
        <div className="grid grid-cols-3 gap-4">
          {displayGames.map((game) => {
              const isDigitalProduct = game.id === 'digital-product';
              const isGameAccount = game.id === 'game-account';
              
              let href = `/games/${game.id}`;
              if (isDigitalProduct) {
                href = '/digital-product';
              } else if (isGameAccount) {
                // You can set a specific link for Game Account or use a placeholder
                href = '#'; // Or a new page like '/game-accounts'
              }
              
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
                  <p className="mt-2 text-center text-[11px] font-semibold text-white">
                    {game.name}
                  </p>
                </Link>
              )
          })}
        </div>
      </div>
       <div className="text-center text-xs text-muted-foreground space-x-4 pt-4">
        <Link href="/terms" className="hover:text-primary hover:underline">
            Terms & Conditions
        </Link>
        <span>&bull;</span>
        <Link href="/privacy" className="hover:text-primary hover:underline">
            Privacy Policy
        </Link>
      </div>
    </div>
  );
}

