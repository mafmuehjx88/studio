
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { games as allGames, staticImages } from '@/lib/data';
import type { Game } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import MarqueeText from '@/components/MarqueeText';


export default function Home() {
  
  const bannerImage = staticImages['banner'];
  const logoImage = staticImages['logo'];

  // Filter out telegram and tiktok from the main games list to avoid duplication
  const displayGames = allGames.filter(g => g.id !== 'telegram' && g.id !== 'tiktok');

  const games: (Game | { id: string, name: string, image: string })[] = [
    ...displayGames,
    { id: 'digital-product', name: 'Digital Product', image: 'https://i.ibb.co/wFmXwwNg/zproduct.jpg' }
  ];


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

      <MarqueeText />

      <div>
        <h2 className="mb-4 text-center text-2xl font-bold">Games</h2>
        <div className="grid grid-cols-3 gap-3">
          {games.map((game) => {
              const isComingSoon = false; // All products are available now
              const isDigitalProduct = game.id === 'digital-product';
              const Wrapper = Link;
              const props = { href: isDigitalProduct ? `/digital-product` : `/games/${game.id}` };
              
              return (
                <React.Fragment key={`game-${game.id}`}>
                    <Wrapper {...props} className="group flex flex-col gap-2 text-center">
                        <Card className={cn("overflow-hidden transition-transform", !isComingSoon && "group-hover:scale-105")}>
                            <Image
                            src={game.image}
                            alt={game.name}
                            width={400}
                            height={400}
                            className={cn("aspect-square w-full rounded-lg object-cover", isComingSoon && "grayscale opacity-50")}
                            />
                        </Card>
                         <p className="text-xs font-semibold text-foreground">
                            {game.name}
                        </p>
                        <Button variant="secondary" size="sm" className="h-8 w-full text-xs" disabled={isComingSoon}>
                            {isDigitalProduct ? "ဝယ်မည်" : (isComingSoon ? "မကြာမီလာမည်" : "ဝယ်မည်")}
                        </Button>
                    </Wrapper>
                </React.Fragment>
              )
          })}
        </div>
      </div>
      
      <div className="space-y-4 pt-8">
        <Separator />
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

    
