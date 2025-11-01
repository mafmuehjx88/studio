'use client';

import { Product } from '@/lib/data';
import ProductCard from './ProductCard';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  title: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  gridCols?: string;
  titleNumber?: number;
}

export default function ProductGrid({ title, products, onProductClick, gridCols = 'grid-cols-2', titleNumber }: ProductGridProps) {
    if (products.length === 0) {
        return null;
    }

  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        {titleNumber && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold">
                {titleNumber}
            </span>
        )}
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      <div className={cn("grid gap-4", gridCols)}>
        {products.map((product) => (
            <ProductCard
                key={product.id}
                product={product}
                onClick={onProductClick}
            />
           )
        )}
      </div>
    </div>
  );
}
