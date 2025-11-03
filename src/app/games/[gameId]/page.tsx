
import { games as allGames, products as allProducts } from '@/lib/data';
import type { Game, Product } from '@/lib/types';
import GameClientPage from '@/components/game/GameClientPage';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return allGames.map((game) => ({
    gameId: game.id,
  }));
}

interface GameItemsPageProps {
  params: {
    gameId: string;
  }
}

// This is now a Server Component, 'use client' is removed.
export default function GameItemsPage({ params }: GameItemsPageProps) {
  const { gameId } = params;

  // Data fetching is done here on the server
  const game: Game | undefined = allGames.find((g) => g.id === gameId);
  const products: Product[] = allProducts.filter((p) => p.gameId === gameId);

  if (!game) {
    notFound();
  }

  // Pass the server-fetched data to the client component
  return <GameClientPage game={game} products={products} />;
}
