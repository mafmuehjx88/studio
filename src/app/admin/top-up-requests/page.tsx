
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TopUpRequest } from '@/lib/types';
import TopUpRequestRow from '@/components/admin/TopUpRequestRow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function TopUpRequestsPage() {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState<TopUpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState<'Pending' | 'Approved' | 'Rejected'>('Pending');

  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const requestsCollectionRef = query(
      collection(db, 'topUpRequests'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      requestsCollectionRef,
      (snapshot) => {
        const requestsData = snapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as TopUpRequest)
        );
        setRequests(requestsData);
        setLoading(false);
      },
      (err) => {
        console.error("Failed to fetch top-up requests:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  const filteredRequests = useMemo(() => {
    let filtered = requests.filter(req => req.status === activeTab);

    if (searchTerm) {
      filtered = filtered.filter((req) =>
        req.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  }, [requests, searchTerm, activeTab]);

  const getTabCount = (status: 'Pending' | 'Approved' | 'Rejected') => {
    return requests.filter(req => req.status === status).length;
  }

  if (!isAdmin) {
    return (
        <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
            You do not have permission to view this page.
            </AlertDescription>
        </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Top-Up Requests</h1>
        <p className="text-muted-foreground">
          Review and approve or reject user top-up requests.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="Pending">
            Pending <Badge className="ml-2">{getTabCount('Pending')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Approved">
            Approved <Badge variant="secondary" className="ml-2">{getTabCount('Approved')}</Badge>
          </TabsTrigger>
          <TabsTrigger value="Rejected">
            Rejected <Badge variant="secondary" className="ml-2">{getTabCount('Rejected')}</Badge>
          </TabsTrigger>
        </TabsList>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <TabsContent value={activeTab} className="mt-4">
           {loading && (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
          )}

          {error && (
             <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load requests. Please try again later.
                </AlertDescription>
            </Alert>
          )}

          {!loading && !error && (
            <div className="space-y-4">
                {filteredRequests.length > 0 ? (
                    filteredRequests.map((req) => (
                        <TopUpRequestRow key={req.id} request={req} />
                    ))
                ) : (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">No {activeTab.toLowerCase()} requests found.</p>
                    </div>
                )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
