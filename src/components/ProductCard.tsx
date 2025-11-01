'use client';

import type { Product } from '@/lib/types';
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
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-white/20 bg-card text-white transition-all duration-300 hover:border-white/40 hover:bg-card/80"
      onClick={() => onClick(product)}
    >
      <CardContent className="relative flex flex-1 flex-col justify-center p-2 text-center">
        <Badge className="absolute right-1 top-1 z-10 rounded-sm border-none bg-green-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
          မစောင့်ရပါ
        </Badge>
        {is2xProduct && (
          <Badge className="absolute left-1/2 top-8 z-10 -translate-x-1/2 transform whitespace-nowrap rounded-sm border-none bg-red-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
            First Recharge
          </Badge>
        )}
        <div className="flex flex-1 flex-col items-center justify-center gap-1 pt-8">
            <p className="text-xs font-semibold">{product.name}</p>
            <p className="text-xs font-bold text-yellow-400">{product.price.toLocaleString()} Ks</p>
        </div>
      </CardContent>
    </Card>
  );
}
