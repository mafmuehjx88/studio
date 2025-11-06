
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicyPage() {
    const router = useRouter();
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ကိုယ်ရေးကိုယ်တာအချက်အလက်ဆိုင်ရာ မူဝါဒ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Effective date: [Date]
          </p>
          <p>
            AT Game HUB ("us", "we", or "our") operates the AT Game HUB mobile application (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>

          <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-foreground">1. Information Collection and Use</h3>
            <p>We collect several different types of information for various purposes to provide and improve our Service to you. The types of data collected include:</p>
            <ul className="list-disc pl-6 space-y-1">
                <li><span className="font-semibold">Personal Data:</span> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This includes your email address and a username you create.</li>
                <li><span className="font-semibold">Usage Data:</span> We may also collect information on how the Service is accessed and used. This may include information such as your device's Internet Protocol address (e.g. IP address), browser type, and the pages of our Service that you visit.</li>
            </ul>
          </div>
          
          <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-foreground">2. Use of Data</h3>
            <p>AT Game HUB uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and maintain our Service</li>
              <li>To manage your account and process your transactions</li>
              <li>To notify you about changes to our Service</li>
              <li>To provide customer support</li>
              <li>To monitor the usage of our Service to prevent fraud or abuse</li>
            </ul>
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-foreground">3. Data Storage and Security</h3>
            <p>Your information, including Personal Data, is stored securely on Google Firebase services. We use commercially acceptable means to protect your Personal Data, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-foreground">4. Service Providers</h3>
            <p>We may employ third-party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, or to perform Service-related services. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
          </div>

           <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-foreground">5. Changes to This Privacy Policy</h3>
            <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
          </div>

          <div className="space-y-2 pt-4">
            <h3 className="font-semibold text-foreground">Contact Us</h3>
            <p>If you have any questions about this Privacy Policy, please contact us.</p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
