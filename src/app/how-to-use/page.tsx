
'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { staticImages } from '@/lib/data';

const guideSteps = [
  {
    image: staticImages['how-to-use-guide-1'],
    alt: 'How to use guide step 1',
    description: 'အသစ်ဖွင့်မယ်ဆို Register now နိပ်ပြီ  Username / Email / Password ထည့်ပြီ အကောင့်သစ်ဖွင့်နိုင်ပါတယ် အကောင့်ဖွင့်ပြီသာရှိပါက Email နဲ့ Password ထည့်ပြီ ပြန်ဝင်နိုင်ပါတယ်',
  },
  {
    image: staticImages['how-to-use-guide-2'],
    alt: 'How to use guide step 2',
    description: '2. ငွေဖြည့်ရန် ကိုနှိပ်ပြီး KBZ Pay, Wave Pay တို့မှ ကြိုက်နှစ်သက်ရာဖြင့် ငွေဖြည့်ပါ။',
  },
  {
    image: staticImages['how-to-use-guide-3'],
    alt: 'How to use guide step 3',
    description: '3. မိမိဖြည့်ထားသောငွေ Wallet ထဲသို့ရောက်ရှိပါက ကြိုက်နှစ်သက်ရာ Game Item များကို ဝယ်ယူနိုင်ပါပြီ။',
  }
];

export default function HowToUsePage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">အသုံးပြုနည်း</h1>
      </div>

      <div className="space-y-8">
        {guideSteps.map((step, index) => (
          <Card key={index}>
            <CardContent className="space-y-4 p-4">
              {step.image ? (
                <Image
                  src={step.image.imageUrl}
                  alt={step.alt}
                  width={900}
                  height={1600}
                  className="w-full rounded-md object-contain"
                />
              ) : null}
              <p className="text-center font-semibold text-foreground">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
