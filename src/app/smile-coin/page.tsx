
'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { smileCoinRegions } from '@/lib/data';

export default function SmileCoinPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 bg-white text-black p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Smile Code MM</h1>
        <h2 className="text-xl font-semibold mt-4">Products List</h2>
      </div>

      <div className="space-y-4">
        {smileCoinRegions.map((region) => (
          <Card key={region.id} className="overflow-hidden bg-black text-white">
            <div className="relative">
              <Image
                src={region.image}
                alt={region.name}
                width={600}
                height={300}
                className="w-full object-contain"
              />
            </div>
            <div className="p-4">
              <Button asChild className="w-full bg-white text-blue-600 hover:bg-gray-200">
                <Link href={`/smile-coin/${region.id}`}>
                  {region.name.toUpperCase()} <span className="ml-2">→</span>
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
