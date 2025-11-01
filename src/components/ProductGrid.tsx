'use client';

import { Product } from '@/lib/data';
import ProductCard from './ProductCard';
import { PlaceholderImage } from '@/lib/types';

interface ProductGridProps {
  title: string;
  products: Product[];
  imagesMap: Record<string, PlaceholderImage>;
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({ title, products, onProductClick, imagesMap }: ProductGridProps) {
    if (products.length === 0) {
        return null;
    }

  return (
    <div>
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-3 gap-3">
        {products.map((product) => {
           const imageUrl = imagesMap[product.image]?.imageUrl || null;
           return (
            <ProductCard
                key={product.id}
                product={product}
                imageUrl={imageUrl}
                onClick={onProductClick}
            />
           )
        })}
      </div>
    </div>
  );
}

    