
'use client';

import Image from 'next/image';
import { staticImages } from '@/lib/data';
import { Loader2 } from 'lucide-react';

export default function LoadingScreen() {
  const logo = staticImages['logo'];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d2a4c]">
      <div className="relative w-24 h-24">
        {logo && (
          <Image
            src={logo.imageUrl}
            alt={logo.description}
            width={96}
            height={96}
            className="rounded-full"
            data-ai-hint={logo.imageHint}
            priority
          />
        )}
      </div>
      <Loader2 className="w-8 h-8 mt-6 animate-spin text-primary" />
      <p className="mt-4 text-lg font-semibold text-primary">Loading...</p>
    </div>
  );
}
