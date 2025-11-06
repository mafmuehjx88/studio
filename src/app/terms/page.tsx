
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TermsAndConditionsPage() {
    const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Terms & Conditions</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>စည်းမျဉ်းစည်းကမ်းများနှင့် အသုံးပြုမှုဆိုင်ရာ သဘောတူညီချက်များ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            ဤစည်းမျဉ်းစည်းကမ်းများသည် AT Game HUB ("ကျွန်ုပ်တို့") ၏ ဝန်ဆောင်မှုများကို အသုံးပြုခြင်းနှင့် သက်ဆိုင်ပါသည်။ ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုကို အသုံးမပြုမီ ဤအချက်အလက်များကို သေချာစွာဖတ်ရှုပါ။
          </p>

          <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-foreground">1. အကောင့်ဖွင့်ခြင်းနှင့် လုံခြုံရေး</h3>
            <p>
              ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုကို အသုံးပြုရန်အတွက် သင်သည် အကောင့်တစ်ခု မှတ်ပုံတင်ရန်လိုအပ်ပါသည်။ သင်၏ အကောင့်အချက်အလက်များ (အီးမေးလ်၊ စကားဝှက်) ၏ လျှို့ဝှက်လုံခြုံမှုကို ထိန်းသိမ်းရန်မှာ သင်၏တာဝန်ဖြစ်ပါသည်။
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-foreground">2. Wallet နှင့် ငွေပေးချေမှု</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <span className="font-semibold">ငွေဖြည့်ခြင်း (Top-Up):</span> Wallet အတွင်းသို့ ငွေဖြည့်သွင်းခြင်းကို <span className="font-bold text-primary">မနက် ၉:၀၀ နာရီမှ ည ၁၀:၀၀ နာရီ</span> အတွင်းသာ ပြုလုပ်နိုင်ပါသည်။ သတ်မှတ်ချိန်ပြင်ပတွင် ငွေဖြည့်ခြင်းများအတွက် ကျွန်ုပ်တို့တွင် တာဝန်မရှိပါ။
              </li>
              <li>
                <span className="font-semibold">ပစ္စည်းဝယ်ယူခြင်း:</span> သင်၏ Wallet ထဲတွင် ငွေလက်ကျန် ရှိနေသရွေ့၊ ဂိမ်းတွင်းပစ္စည်းများကို <span className="font-bold text-primary">တစ်နေ့ ၂၄ နာရီ၊ တစ်ပတ် ၇ ရက် (24/7)</span> ဝယ်ယူနိုင်ပါသည်။
              </li>
              <li>
                ငွေဖြည့်သွင်းပြီးသော ငွေများကို ပြန်လည်ထုတ်ယူခွင့် မပြုပါ။ ဝယ်ယူပြီးသော ပစ္စည်းများအတွက် ငွေပြန်အမ်းပေးမည် မဟုတ်ပါ။
              </li>
            </ul>
          </div>
          
          <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-foreground">3. အသုံးပြုသူ၏ တာဝန်များ</h3>
             <ul className="list-disc pl-6 space-y-2">
              <li>သင်၏ ဂိမ်း ID နှင့် Server ID (လိုအပ်ပါက) ကို မှန်ကန်စွာ ဖြည့်သွင်းရန်မှာ သင်၏ တာဝန်ဖြစ်ပါသည်။ မှားယွင်းစွာဖြည့်သွင်းမှုများကြောင့် ဖြစ်ပေါ်လာသော ဆုံးရှုံးမှုများအတွက် ကျွန်ုပ်တို့တွင် တာဝန်မရှိပါ။</li>
              <li>လိမ်လည်မှုများ၊ നിയമမဝင်သော လုပ်ဆောင်မှုများနှင့် ဝန်ဆောင်မှုကို အလွဲသုံးစားလုပ်ခြင်းများကို လုံးဝခွင့်မပြုပါ။</li>
            </ul>
          </div>

           <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-foreground">4. ဝန်ဆောင်မှု ရပ်ဆိုင်းခြင်း</h3>
            <p>
              အသုံးပြုသူတစ်ဦးမှ ဤစည်းမျဉ်းများကို ချိုးဖောက်ကြောင်းတွေ့ရှိပါက၊ ထိုသူ၏အကောင့်ကို ကြိုတင်အကြောင်းကြားခြင်းမရှိဘဲ ယာယီ သို့မဟုတ် အပြီးတိုင် ရပ်ဆိုင်းပိုင်ခွင့် ကျွန်ုပ်တို့တွင်ရှိသည်။
            </p>
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-foreground">5. စည်းမျဉ်းများ ပြောင်းလဲခြင်း</h3>
            <p>
              ကျွန်ုပ်တို့သည် ဤစည်းမျဉ်းစည်းကမ်းများကို အချိန်အခါအလိုက် ပြင်ဆင်ပြောင်းလဲပိုင်ခွင့်ရှိသည်။ အပြောင်းအလဲများကို ဤစာမျက်နှာတွင် ဖော်ပြသွားမည်ဖြစ်ပြီး၊ ဆက်လက်အသုံးပြုခြင်းဖြင့် အပြောင်းအလဲများကို သင်သဘောတူပြီးဖြစ်သည်ဟု မှတ်ယူပါမည်။
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
