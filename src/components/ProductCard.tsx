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
      className="group flex cursor-pointer flex-col overflow-hidden transition-all duration-300 bg-gray-800/50 border-gray-700 rounded-lg text-white hover:bg-gray-700/60"
      onClick={() => onClick(product)}
    >
      <CardContent className="relative flex flex-1 flex-col p-2">
         <Badge className="absolute top-0 right-0 m-1 bg-green-600 text-white text-[10px] px-1.5 py-0.5 z-10 border-none rounded-sm">
            မစောင့်ရပါ
        </Badge>
        {is2xProduct && (
             <Badge className="absolute top-8 right-0 m-1 bg-red-600 text-white text-[10px] px-1.5 py-0.5 z-10 border-none rounded-sm transform -rotate-15">
                First Recharge
            </Badge>
        )}
        <div className="relative aspect-square w-full mb-2 flex items-center justify-center">
            <Image
                src={product.image}
                alt={product.name}
                width={80}
                height={80}
                className={cn("object-contain transition-transform group-hover:scale-110", product.id === 'twilight-pass' ? 'rounded-full' : '')}
            />
        </div>
        <div className="flex-1 flex flex-col justify-center text-center">
            <p className="whitespace-normal text-sm font-semibold">{product.name}</p>
            <p className="text-xs font-semibold text-yellow-400 mt-1">{product.price.toLocaleString()} Ks</p>
        </div>
      </CardContent>
    </Card>
  );
}
