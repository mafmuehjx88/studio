
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { products } from '@/lib/data';

const smileProducts = products.filter(p => p.gameId === 'smile-coin');


export default function SmileCoinPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 bg-white text-black p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Smile Code MM</h1>
        <h2 className="text-xl font-semibold mt-4">Products List</h2>
      </div>

      <div className="space-y-4">
        {smileProducts.map((product) => (
          <Card key={product.name} className="overflow-hidden bg-black text-white">
            <div className="relative">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={300}
                className="w-full object-contain"
              />
            </div>
            <div className="p-4">
              <Button asChild className="w-full bg-white text-blue-600 hover:bg-gray-200">
                <Link href={'#'}>
                  {product.name.toUpperCase()} <span className="ml-2">→</span>
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
