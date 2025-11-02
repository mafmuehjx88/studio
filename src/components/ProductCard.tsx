'use client';

import type { Product } from '@/lib/types';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const is2xProduct = product.category === '2x';
  const isPassProduct = product.category === 'pass';

  return (
    <Card
      className="group flex cursor-pointer flex-col overflow-hidden rounded-md border-white/20 bg-white text-white transition-all duration-300 hover:border-white/40 hover:bg-gray-100"
      onClick={() => onClick(product)}
    >
      <CardContent className="relative flex flex-1 flex-col justify-start p-2 text-left">
        {!is2xProduct && (
          <Badge className="absolute right-1 top-1 z-10 rounded-sm border-none bg-green-500 px-1.5 py-0.5 text-[10px] font-medium text-white">
            မစောင့်ရပါ
          </Badge>
        )}
        
        {product.image && (
             <Image
                src={product.image}
                alt={product.name}
                width={100}
                height={100}
                className={cn(
                  "w-full object-cover",
                  isPassProduct ? "rounded-full aspect-square" : "rounded-md"
                )}
              />
        )}
        
        <div className={cn("flex flex-1 flex-col gap-1", isPassProduct ? "pt-2" : "pt-2 justify-center items-center")}>
            <p className="text-xs font-semibold text-black">{product.name}</p>
            <p className="text-xs font-bold text-yellow-400">{product.price.toLocaleString()} Ks</p>
        </div>
      </CardContent>
    </Card>
  );
}
