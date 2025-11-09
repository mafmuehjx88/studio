
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { staticImages } from '@/lib/data';
import Image from 'next/image';
import { X } from 'lucide-react';

const POPUP_SEEN_KEY = 'welcomePopupSeen';

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // This effect runs only on the client-side
    const hasSeenPopup = sessionStorage.getItem(POPUP_SEEN_KEY);
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(POPUP_SEEN_KEY, 'true');
    setIsOpen(false);
  };
  
  const characterImage = staticImages['popup-character'];
  const logoImage = staticImages['popup-logo'];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[340px] w-[90vw] bg-white text-black p-0 rounded-lg overflow-hidden">
        <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/10 hover:bg-black/20 transition-colors z-10"
        >
            <X className="h-5 w-5 text-gray-700" />
            <span className="sr-only">Close</span>
        </button>
        <div className="p-6 space-y-4 text-center">
            <h2 className="text-xl font-bold text-gray-800">
                ZenithHarrai Shop က ကြိုဆိုပါတယ်ဗျ..
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
                ငွေဖြည့်ထားရင် ကြိုက်တဲ့အချိန်ဝယ်လို့ရတာမလို့ ကြိုတင်ငွေဖြည့်ထားခြင်းဖြင့် အဆင်ပြေကြပါစေ.. သုံးနည်းမသိပါက - App အသုံးနည်း ဆိုတဲ့စာရဲ့ အပေါ်က နှစ်ခုကို နှိပ်ကြည့်ပေးပါဗျ။
            </p>
            <div className="text-sm text-gray-700 space-y-2 font-medium">
                <p>
                    ငွေဖြည့်တဲ့အခါ မနက် <span className="font-bold text-red-600">9</span>နာရီက ည <span className="font-bold text-red-600">10</span> နာရီအတွင်းထည့်ပါက
                    <br/>
                    Account ထဲကို <span className="font-bold text-red-600">3min</span> ကနေ <span className="font-bold text-red-600">15min</span>အတွင်းရောက်လာမှာဖြစ်ပါတယ်
                </p>
                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t-2 border-red-500" />
                    </div>
                </div>
                 <p className="pt-2">
                    ကြိုတင်ငွေဖြည့်သွင်းထားပါက <span className="font-bold text-red-600">24</span>နာရီ
                    <br/>
                    ကိုယ့်ကြိုက်တဲ့အချိန် ဝယ်ယူနိုင်ပါပဲ ဖြစ်ပါတယ်ဗျ
                </p>
            </div>
             <p className="font-bold text-lg text-red-600">
                အခုဝယ် အခုရမစောင့်ရပါဘူး
            </p>

            <div className="relative h-48 mt-4">
                {characterImage && (
                    <Image
                        src={characterImage.imageUrl}
                        alt={characterImage.description}
                        layout="fill"
                        objectFit="contain"
                        className="z-0"
                    />
                )}
                 {logoImage && (
                    <div className="absolute bottom-4 left-4 z-10">
                        <Image
                            src={logoImage.imageUrl}
                            alt={logoImage.description}
                            width={100}
                            height={50}
                            objectFit="contain"
                        />
                    </div>
                )}
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
