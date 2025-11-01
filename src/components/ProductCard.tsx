'use client';

import { Product } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  // Using a generic placeholder for now
  const productImage = PlaceHolderImages.find(img => img.id === 'default-avatar');
  const isSpecial = product.category === '2x Diamonds';

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onClick={() => onClick(product)}
    >
      <CardContent className="relative p-0">
        {productImage && (
          <Image
            src={productImage.imageUrl}
            alt={product.name}
            width={200}
            height={200}
            className="aspect-square w-full object-cover"
          />
        )}
        {isSpecial && (
            <Badge className="absolute left-1 top-1 bg-green-500 text-white">First Recharge</Badge>
        )}
        <div className="p-2 text-center min-h-[56px] flex flex-col justify-center">
            <p className="text-xs font-bold whitespace-normal">{product.name}</p>
            <p className="text-xs font-bold text-primary">{product.price.toLocaleString()} Ks</p>
        </div>
      </CardContent>
    </Card>
  );
}
