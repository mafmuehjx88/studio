'use client';

import { Product } from '@/lib/data';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const isSpecial = product.category === '2x';

  return (
    <Card
      className="group flex cursor-pointer flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={() => onClick(product)}
    >
      <CardContent className="flex flex-1 flex-col p-0">
        <div className="relative aspect-square w-full flex-shrink-0">
            <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
            />
            {isSpecial && (
                <Badge className="absolute left-1 top-1 bg-green-500 text-white">First Recharge</Badge>
            )}
        </div>
        <div className="flex min-h-[56px] flex-col justify-center p-2 text-center">
            <p className="whitespace-normal text-xs font-bold">{product.name}</p>
            <p className="text-xs font-bold text-primary">{product.price.toLocaleString()} Ks</p>
        </div>
      </CardContent>
    </Card>
  );
}
