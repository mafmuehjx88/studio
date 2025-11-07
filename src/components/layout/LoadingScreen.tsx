
'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// Hardcode the logo URL to prevent hydration mismatch.
const logoUrl = "https://i.ibb.co/0RWt8y5F/file-00000000766072068c8048cd95f60c70.png";
const logoDescription = "AT Game HUB Logo";
const logoImageHint = "Z logo";

export default function LoadingScreen() {

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d2a4c] p-8 text-center">
      <div className="relative w-32 h-32 mb-8">
        <Image
          src={logoUrl}
          alt={logoDescription}
          width={128}
          height={128}
          className="rounded-full"
          data-ai-hint={logoImageHint}
          priority
        />
      </div>
      <div className='space-y-4'>
        <h1 className="text-2xl font-bold text-primary">"Welcome to AT Game HUB"</h1>
        <p className="text-lg text-muted-foreground">- AT Game HUB -</p>
      </div>
      <div className="absolute bottom-16 flex flex-col items-center gap-2">
         <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    </div>
  );
}
