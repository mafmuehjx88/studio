'use client';

import { Product } from '@/lib/data';
import ProductCard from './ProductCard';

interface ProductGridProps {
  title: string;
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function ProductGrid({ title, products, onProductClick }: ProductGridProps) {
    if (products.length === 0) {
        return null;
    }

  return (
    <div>
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-3 gap-3">
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
