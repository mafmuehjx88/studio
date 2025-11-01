'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { AdminPaymentAccount } from '@/lib/types';
import Image from 'next/image';
import { sendTopUpTelegramNotification } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function TopUpPage() {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [paymentAccounts, setPaymentAccounts] = useState<AdminPaymentAccount[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(
    null
  );
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  useEffect(() => {
    const q = collection(db, 'settings/payments/accounts');
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const accountsData = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as AdminPaymentAccount)
        );
        setPaymentAccounts(accountsData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching payment accounts:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

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
    if (
      !user ||
      !userProfile ||
      !screenshot ||
      !amount ||
      !transactionId ||
      !selectedPaymentMethod
    ) {
      toast({
        title: 'Information Missing',
        description: 'Please fill in all fields and upload a screenshot.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload screenshot to Firebase Storage
      const screenshotRef = ref(
        storage,
        `topup-screenshots/${user.uid}/${Date.now()}_${screenshot.name}`
      );
      const uploadResult = await uploadBytes(screenshotRef, screenshot);
      const screenshotUrl = await getDownloadURL(uploadResult.ref);

      // 2. Create top-up request in Firestore
      const topUpRequestData = {
        userId: user.uid,
        username: userProfile.username,
        amount: parseFloat(amount),
        screenshotUrl,
        status: 'Pending' as const,
        createdAt: serverTimestamp(),
        paymentMethod: selectedPaymentMethod,
        transactionId,
      };
      await addDoc(collection(db, 'topUpRequests'), topUpRequestData);

      // 3. Send Telegram Notification
      const caption = `
New Top-Up Request!
----------------------
Username: \`${userProfile.username}\`
Amount: *${parseFloat(amount).toLocaleString()} Ks*
Method: *${selectedPaymentMethod}*
Transaction ID: \`${transactionId}\`
----------------------
Time: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Yangon' })}
`;
      await sendTopUpTelegramNotification({ caption, photoUrl: screenshotUrl });

      toast({
        title: 'Request Submitted!',
        description:
          'Your top-up request has been sent for approval. Please wait for confirmation.',
      });

      router.push('/wallet');
    } catch (error) {
      console.error('Error submitting top-up request:', error);
      toast({
        title: 'Submission Failed',
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-center text-3xl font-bold">ငွေဖြည့်ရန်</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-center text-3xl font-bold">ငွေဖြည့်ရန်</h1>
      <Card>
        <CardHeader>
          <CardTitle>၁။ ငွေလွှဲရန် Account များ</CardTitle>
          <CardDescription>
            အောက်ပါ Account များထဲမှ အဆင်ပြေရာသို့ ငွေလွှဲပါ။ (မနက် ၉ မှ ည ၁၀
            နာရီအတွင်း)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paymentAccounts.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {paymentAccounts.map((account) => (
                <AccordionItem value={account.id} key={account.id}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      {account.logo && (
                        <Image
                          src={account.logo}
                          alt={account.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-md object-contain"
                        />
                      )}
                      <span>{account.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 rounded-md border bg-muted p-4">
                      <p>
                        <strong>Account Name:</strong> {account.accountName}
                      </p>
                      <p>
                        <strong>Account Number:</strong> {account.accountNumber}
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No payment accounts available at the moment.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>၂။ ငွေဖြည့် فورمဖြည့်ရန်</CardTitle>
          <CardDescription>
            ငွေလွှဲပြီးပါက အောက်ပါအချက်အလက်များကို မှန်ကန်စွာဖြည့်ပါ။
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="payment-method">ငွေလွှဲခဲ့သော Account</Label>
              <Select
                value={selectedPaymentMethod}
                onValueChange={setSelectedPaymentMethod}
                required
              >
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentAccounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.name}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">ငွေပမာဏ (ကျပ်)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 10000"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transaction-id">ငွေလွှဲ ID</Label>
              <Input
                id="transaction-id"
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Last 6 digits of transaction ID"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="screenshot">ငွေလွှဲပြေစာ Screenshot</Label>
              <Input
                id="screenshot"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="file:text-foreground"
              />
            </div>

            {screenshotPreview && (
              <div className="relative mt-4 w-full max-w-xs overflow-hidden rounded-md border">
                <Image
                  src={screenshotPreview}
                  alt="Screenshot Preview"
                  width={400}
                  height={400}
                  className="h-auto w-full object-contain"
                />
              </div>
            )}
            
            <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>သတိပြုရန်</AlertTitle>
                <AlertDescription>
                    သင်၏ငွေဖြည့်တောင်းဆိုမှုကို Admin မှစစ်ဆေးပြီး <span className='font-bold'>၅ မိနစ်မှ မိနစ် ၃၀</span> အတွင်း အတည်ပြုပေးပါမည်။
                </AlertDescription>
            </Alert>


            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Submit Request'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
