
import { smileCoinRegions, smileCoinProducts } from '@/lib/data';
import type { Product } from '@/lib/types';
import SmileCoinClientPage from '@/components/smile-coin/SmileCoinClientPage';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return smileCoinRegions.map((region) => ({
    country: region.id,
  }));
}

interface SmileCoinItemsPageProps {
  params: {
    country: string;
  }
}

export default function SmileCoinItemsPage({ params }: SmileCoinItemsPageProps) {
  const { country } = params;

  const region = smileCoinRegions.find((r) => r.id === country);
  const products: Product[] = smileCoinProducts.filter((p) => p.country === country);

  if (!region) {
    notFound();
  }

  return <SmileCoinClientPage region={region} products={products} />;
}
