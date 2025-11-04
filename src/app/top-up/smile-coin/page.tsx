
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Loader2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { generateOrderId } from '@/lib/utils';
import { sendTopUpTelegramNotification } from '@/lib/actions';

const paymentAccounts = [
  {
    name: 'Pyae Sone Hein',
    phone: '09769181524',
    type: 'KBZ Pay',
    logo: 'https://i.ibb.co/sv95LBKN/11f074fe04271ca1f562331d873344f8-1.jpg',
  },
  {
    name: 'Than Htay',
    phone: '09769181524',
    type: 'Wave Pay',
    logo: 'https://i.ibb.co/7tdxdMP0/new355-ab76bb0483ac7c445251c650cc7c1227-1.jpg',
  },
];

const attentionText = `သတိပြုရန်- ငွေလွဲပြီးတာနဲ့ 20min အတွင်းပြေစာတင်ရန်/ပြေစာတစ်ခုကို နှစ်ခါမတင်ရန်/ပြေစာအတု နဲ့Scam မလုပ်ရပါဘူး။ အထက်ပါအချက်များကိုချိုးဖောက်ပါက ရာသက်ပန် Banပါမယ်။ငွေပြန်မအမ်းပါ။`;


export default function SmileCoinTopUpPage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [amount, setAmount] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null); // This will hold the base64 string
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
        setScreenshotPreview(reader.result as string); // Store base64 string
      };
      reader.readAsDataURL(file);
    }
  };
  
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
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
    let submissionSuccess = false;

    try {
      const photoBase64 = await fileToBase64(screenshot);
      const requestId = generateOrderId();
      
      const caption = `
💰 New SMILE COIN Top-Up Request!
#${requestId}
👤 User: ${userProfile.username}
💵 Amount: ${amount} MMK
🕒 Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' })}
      `;
      
      await sendTopUpTelegramNotification({ caption, photoBase64 });

      toast({
        title: 'Request Submitted!',
        description: 'Your Smile Coin top-up request has been sent. Please wait for confirmation.',
      });
      
      submissionSuccess = true;

    } catch (error) {
      console.error('Error submitting top-up request:', error);
      toast({
        title: 'တောင်းဆိုမှု မအောင်မြင်ပါ',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
        if (submissionSuccess) {
            router.push('/smile-coin');
        }
        setIsSubmitting(false);
    }
  };

  const isFormComplete = amount && screenshot;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Smile Coin ငွေဖြည့်မည်</h1>
        <Button variant="secondary" size="sm" asChild>
          <a href="/orders?type=smile-coin">မှတ်တမ်း</a>
        </Button>
      </div>

      <div className="space-y-3">
        {paymentAccounts.map((account) => (
          <div
            key={account.phone + account.type}
            className="rounded-lg border border-border bg-card p-3 shadow-md"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Image
                  src={account.logo}
                  alt={account.type}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold">{account.phone}</p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 bg-muted px-3"
                    onClick={() => handleCopy(account.phone)}
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{account.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-red-500/50 bg-destructive/10 p-3">
          <div className="flex justify-between items-start">
             <div className="flex items-start gap-3">
                <div className="w-16 flex-shrink-0 text-center text-sm font-bold text-red-400">
                    သတိပြုရန်
                </div>
                <p className="flex-1 text-xs text-muted-foreground">
                    {attentionText}
                </p>
             </div>
             <Button size="sm" variant="ghost" className="h-8 bg-muted px-3" onClick={() => handleCopy(attentionText)}>
                Copy
             </Button>
          </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="bg-card"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="screenshot">Payment Screenshot (ငွေလွှဲ Id ပါတဲ့ပုံ)</Label>
          <div
            className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-green-500/50 bg-green-500/10 text-green-400 transition-colors hover:bg-green-500/20"
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
                width={120}
                height={120}
                className="h-full w-auto object-contain p-2"
              />
            ) : (
              <div className="text-center">
                <Upload className="mx-auto h-10 w-10" />
                <p className="mt-2 text-sm font-semibold">ငွေလွှဲပုံထည့်ရန်နှိပ်ပါ</p>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-lg font-bold"
          disabled={!isFormComplete || isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            'ငွေဖြည့်ခြင်း အတည်ပြုမည်'
          )}
        </Button>
      </form>
    </div>
  );
}
