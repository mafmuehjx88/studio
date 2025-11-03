
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { staticImages } from '@/lib/data';

export default function HowToUsePage() {
  const router = useRouter();
  const guideImage = staticImages['how-to-use-guide'];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">အသုံးပြုနည်း</h1>
      </div>

      <Card>
        <CardContent className="p-4">
          {guideImage ? (
            <Image
              src={guideImage.imageUrl}
              alt={guideImage.description}
              width={1200}
              height={1600}
              className="w-full rounded-md object-contain"
            />
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
