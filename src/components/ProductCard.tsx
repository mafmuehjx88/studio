'use client';

import type { Product } from '@/lib/types';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const is2xProduct = product.category === '2x';

  return (
    <Card
      className="group flex aspect-square cursor-pointer flex-col overflow-hidden rounded-lg border-gray-700 bg-gray-800/50 text-white transition-all duration-300 hover:bg-gray-700/60"
      onClick={() => onClick(product)}
    >
      <CardContent className="relative flex flex-1 flex-col justify-between p-2">
         <Badge className="absolute right-0 top-0 z-10 m-1 rounded-sm border-none bg-green-500 px-1.5 py-0.5 text-[10px] text-white">
            မစောင့်ရပါ
        </Badge>
        {is2xProduct && (
             <Badge className="absolute right-0 top-8 z-10 m-1 -rotate-15 transform rounded-sm border-none bg-red-600 px-1.5 py-0.5 text-[10px] text-white">
                First Recharge
            </Badge>
        )}
        <div className="flex flex-1 items-center justify-center">
            <div className="relative aspect-square w-3/4">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className={cn("object-contain transition-transform group-hover:scale-110", product.id === 'twilight-pass' ? 'rounded-full' : '')}
                />
            </div>
        </div>
        <div className="text-center">
            <p className="whitespace-normal text-xs font-semibold">{product.name}</p>
            <p className="mt-1 text-xs font-semibold text-yellow-400">{product.price.toLocaleString()} Ks</p>
        </div>
      </CardContent>
    </Card>
  );
}
