import Link from 'next/link';
import WalletBalance from './WalletBalance';

export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-lg">
      <Link href="/" className="text-xl font-bold text-primary">
        AT Game HUB
      </Link>
      <WalletBalance />
    </header>
  );
}
