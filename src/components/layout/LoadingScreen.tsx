
'use client';

import Image from 'next/image';
import { Loader2 } from 'lucide-react';

// Hardcode the logo URL to prevent hydration mismatch.
const logoUrl = "https://i.ibb.co/0RWt8y5F/file-00000000766072068c8048cd95f60c70.png";
const logoDescription = "Logo image";
const logoImageHint = "Z logo";

export default function LoadingScreen() {

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0d2a4c]">
      <div className="relative w-24 h-24">
        <Image
          src={logoUrl}
          alt={logoDescription}
          width={96}
          height={96}
          className="rounded-full"
          data-ai-hint={logoImageHint}
          priority
        />
      </div>
      <Loader2 className="w-8 h-8 mt-6 animate-spin text-primary" />
      <p className="mt-4 text-lg font-semibold text-primary">Loading...</p>
    </div>
  );
}
