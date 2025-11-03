

import { games as allGames, products as allProducts } from '@/lib/data';
import type { Game, Product } from '@/lib/types';
import GameClientPage from '@/components/game/GameClientPage';
import { notFound } from 'next/navigation';

// Let's create a temporary list of all possible "game" ids, including digital products
const allGameLikeItems = [
    ...allGames,
    // Add digital products here so Next.js knows to generate pages for them
    { id: 'telegram', name: 'Telegram', image: '', needsUserIdentifier: true, userIdentifierLabel: 'Phone Number or Username' },
    { id: 'tiktok', name: 'Tiktok', image: '', needsUserIdentifier: true, userIdentifierLabel: 'TikTok Profile Link' },
];


export async function generateStaticParams() {
  return allGameLikeItems.map((game) => ({
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
  const game: Game | undefined = allGameLikeItems.find((g) => g.id === gameId);
  const products: Product[] = allProducts.filter((p) => p.gameId === gameId);

  if (!game) {
    notFound();
  }

  // Pass the server-fetched data to the client component
  return <GameClientPage game={game} products={products} />;
}
