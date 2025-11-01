
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronRight, Shield, Bell, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const settingsOptions = [
  {
    icon: Lock,
    title: 'Change Password',
    description: 'Update your account password.',
    action: () => {},
    disabled: true,
  },
  {
    icon: Bell,
    title: 'Notification Preferences',
    description: 'Manage how you receive notifications.',
    action: () => {},
    disabled: true,
  },
    {
    icon: Shield,
    title: 'Privacy Policy',
    description: 'Read our privacy policy.',
    action: () => {},
    disabled: true,
  },
];

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [user, loading, router]);


    if (loading || !user) {
        return null; // Or a loading spinner
    }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {settingsOptions.map((option) => (
              <Button
                key={option.title}
                variant="ghost"
                className="flex h-auto w-full items-center justify-between p-4 text-left"
                onClick={option.action}
                disabled={option.disabled}
              >
                <div className="flex items-center gap-4">
                  <option.icon className="h-6 w-6 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground">{option.title}</span>
                    <span className="text-sm text-muted-foreground">{option.description}</span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
