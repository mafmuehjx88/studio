
'use client';

import { WifiOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

export default function OfflineIndicator({ isOnline }: OfflineIndicatorProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-background/95 backdrop-blur-sm transition-opacity duration-300',
        isOnline ? 'pointer-events-none opacity-0' : 'opacity-100'
      )}
    >
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground">Connecting...</h2>
        <p className="text-muted-foreground">Please check your internet connection.</p>
      </div>
    </div>
  );
}
