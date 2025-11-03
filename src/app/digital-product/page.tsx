
'use client';

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { staticImages } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// Static data for digital products as shown in the user's screenshot
const digitalProducts = [
  {
    name: 'Telegram',
    image: 'https://i.ibb.co/1nC3VSp/telegram-logo-512.png',
    link: '/games/telegram'
  },
  {
    name: 'Tiktok',
    image: 'https://i.ibb.co/3s2R9zM/tiktok-logo-512.png',
    link: '/games/tiktok'
  }
];

export default function DigitalProductPage() {
  const router = useRouter();
  const bannerImage = staticImages['banner'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">AT Game HUB</h1>
      </div>

      <Card className="overflow-hidden border-none bg-card">
        {bannerImage ? (
          <Image
            src={bannerImage.imageUrl}
            alt={bannerImage.description}
            width={1200}
            height={400}
            className="aspect-[2.5/1] w-full object-cover"
          />
        ) : null}
      </Card>
      
      <div className="space-y-4">
        <h2 className="text-center text-xl font-bold text-foreground">OUR PRODUCTS</h2>
        <div className="grid grid-cols-2 gap-4">
          {digitalProducts.map((product) => (
            <Card key={product.name} className="overflow-hidden bg-card p-3">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-white flex items-center justify-center p-2">
                    <Image
                    src={product.image}
                    alt={product.name}
                    width={80}
                    height={80}
                    className="object-contain"
                    />
                </div>
                <p className="font-semibold text-foreground">{product.name}</p>
                <Button asChild className="w-full">
                  <Link href={product.link}>
                    Buy Now
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

    
