'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import {
  addDoc,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Copy, Loader2, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const paymentAccounts = [
  {
    name: 'Pyae Sone Hein',
    phone: '09769181524',
    type: 'KBZ Pay',
    logo: 'https://i.ibb.co/wJ3zDk1/kpay.jpg',
  },
  {
    name: 'Aent Phone Khant',
    phone: '09961034354',
    type: 'KBZ Pay',
    logo: 'https://i.ibb.co/wJ3zDk1/kpay.jpg',
  },
  {
    name: 'Than Htay',
    phone: '09769181524',
    type: 'Wave Pay',
    logo: 'https://i.ibb.co/7tdxdMP0/new355-ab76bb0483ac7c445251c650cc7c1227-1.jpg',
  },
  {
    name: 'Eant Phone Khant',
    phone: '09961034354',
    type: 'Wave Pay',
    logo: 'https://i.ibb.co/7tdxdMP0/new355-ab76bb0483ac7c445251c650cc7c1227-1.jpg',
  },
];

export default function TopUpPage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: `${text} has been copied.`,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userProfile || !screenshot || !amount) {
      toast({
        title: 'Information Missing',
        description: 'Please fill in the amount and upload a screenshot.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    const TELEGRAM_BOT_TOKEN = '7896614937:AAGixVOYkaS7wjDkD4TQJpKlFc2O_GdAENI';
    const TELEGRAM_CHAT_ID = '-1003118744576';
    const order_id = Math.random().toString(36).substring(2, 8).toUpperCase();
    const current_time = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Yangon',
    });

    const caption = `
💰 New Top-Up Request!
#${order_id}
👤 User: ${userProfile.username}
💵 Amount: ${amount} MMK
🕒 Time: ${current_time}
    `;

    const formData = new FormData();
    formData.append('chat_id', TELEGRAM_CHAT_ID);
    formData.append('photo', screenshot);
    formData.append('caption', caption);

    try {
      // 1. Send to Telegram
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Telegram API error');
      }

      // 2. Add to Firestore
      await addDoc(collection(db, `users/${user.uid}/orders`), {
        id: order_id,
        userId: user.uid,
        username: userProfile.username,
        type: 'Top-up',
        itemName: 'Wallet Top-up',
        price: parseFloat(amount),
        status: 'Pending',
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Request Submitted!',
        description:
          'Your top-up request has been sent. Please wait for confirmation.',
      });
      
      router.push('/');

    } catch (error) {
      console.error('Error submitting top-up request:', error);
      toast({
        title: 'တောင်းဆိုမှု မအောင်မြင်ပါ',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete = amount && screenshot;

  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-bold">ငွေဖြည့်မည်</h1>

      <div className="grid grid-cols-2 gap-4">
        {paymentAccounts.map((account) => (
          <Card key={account.phone + account.type} className="p-3">
            <CardContent className="flex flex-col items-center gap-2 p-0 text-center">
              <Image
                src={account.logo}
                alt={account.type}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className='flex flex-col items-center'>
                 <p className="text-xs text-muted-foreground">{account.name}</p>
                 <p className="text-sm font-semibold">{account.phone}</p>
                 <p className="text-xs font-bold text-primary">{account.type}</p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(account.phone)}
                className="w-full gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
       <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>သတိပြုရန်</AlertTitle>
            <AlertDescription>
                ငွေလွှဲနည်း ဆိုတဲ့ဟာကို နှိပ်ပြီးတော့ စာကိုအရင်ဖတ်ပေးပါဗျ။ ငွေဖြည့် စည်းမျဉ်းအနေနဲ့ငွေလွဲပြီးတာနဲ့ 20min အတွင်းပြေစာတင်ရန်/ပြေစာတစ်ခုကို နှစ်ခါမတင်ရန်/ပြေစာအတု နဲ့Scam မလုပ်ရပါဘူး။ အထက်ပါအချက်များကိုချိုးဖောက်ပါက ရာသက်ပန် Banပါမယ်။ငွေပြန်မအမ်းပါ။
            </AlertDescription>
        </Alert>

        <Alert variant="destructive">
           <AlertTriangle className="h-4 w-4" />
           <AlertTitle>အထူးသတိပေးချက်</AlertTitle>
            <AlertDescription>
            ဒီမှာ ငွေလွှဲနံပါတ်ကိုသေချာကြည့်ပြီးမှ ငွေလွဲပေးပါ။ ပမာဏက 5000ဆိုရင် လွဲတဲ့အခါ 5000အတိအကျလွဲပေးပါ။ သတိပေးချက်-ပြေစာအတုလုပ်ခြင်း/ ငွေလွဲပြီး 20minကြာမှပြေစာပြပါက Auto Ban!!
           </AlertDescription>
       </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
         <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={userProfile?.username || ''}
              readOnly
              disabled
            />
             <p className="text-xs text-muted-foreground">ကျေးဇူးပြု၍ သင်၏ Username အမှန်ဖြစ်ကြောင်း စစ်ဆေးပါ။</p>
          </div>

        <div className="space-y-2">
          <Label htmlFor="amount">ငွေပမာဏ (MMK)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="လွှဲပြောင်းလိုက်သော ငွေပမာဏကိုထည့်ပါ"
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="screenshot">Payment Screenshot (ငွေလွှဲ Id ပါတဲ့ပုံ)</Label>
          <div
            className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed bg-muted/50 transition-colors hover:bg-muted"
            onClick={() => fileInputRef.current?.click()}
          >
            <Input
              ref={fileInputRef}
              id="screenshot"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
              className="hidden"
              disabled={isSubmitting}
            />
            {screenshotPreview ? (
              <Image
                src={screenshotPreview}
                alt="Screenshot Preview"
                width={100}
                height={100}
                className="h-full w-auto object-contain p-2"
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <UploadCloud className="mx-auto h-8 w-8" />
                <p className="mt-2 text-sm">ငွေလွှဲပုံထည့်ရန်နှိပ်ပါ</p>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!isFormComplete || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            'ငွေဖြည့်ခြင်း အတည်ပြုမည်'
          )}
        </Button>
      </form>
    </div>
  );
}
