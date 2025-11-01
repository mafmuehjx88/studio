'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ImageData = {
  imageUrl: string;
  description: string;
  imageHint?: string;
};

type ImagesMap = Record<string, ImageData>;

export default function ImageManagementPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [images, setImages] = useState<ImagesMap>({});
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const docRef = doc(db, 'settings', 'placeholderImages');

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    const fetchImages = async () => {
      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setImages(docSnap.data().images || {});
        } else {
          setError("'placeholderImages' document does not exist in 'settings' collection.");
        }
      } catch (err) {
        console.error("Error fetching image data:", err);
        setError("Failed to fetch image data from Firestore.");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [isAdmin, authLoading]);

  const handleInputChange = (id: string, value: string) => {
    setImages((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        imageUrl: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await setDoc(docRef, { images: images });
      toast({
        title: 'Success!',
        description: 'Image URLs have been updated successfully.',
      });
    } catch (err) {
      console.error("Error saving image data:", err);
      toast({
        title: 'Error Saving',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (authLoading || loading) {
    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Image Management</h1>
            <Card>
                <CardContent className="p-4">
                    <div className="space-y-6">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
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
  
  if (error) {
     return (
         <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
        </Alert>
     )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Image Management</h1>
        <p className="text-muted-foreground">
          Update the image URLs used across the application.
        </p>
      </div>
      
      <Card>
          <CardHeader>
              <CardTitle>Image URLs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.keys(images).sort().map((id) => (
                <div key={id} className="space-y-2">
                <Label htmlFor={id} className="text-sm font-medium">
                    {id} <span className="text-xs text-muted-foreground">({images[id].description})</span>
                </Label>
                <div className="flex items-center gap-4">
                    <Image
                        src={images[id].imageUrl}
                        alt={images[id].description}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-md object-cover bg-muted"
                        onError={(e) => e.currentTarget.src = 'https://placehold.co/64x64/222/fff?text=?'}
                    />
                    <Input
                        id={id}
                        type="url"
                        value={images[id].imageUrl}
                        onChange={(e) => handleInputChange(id, e.target.value)}
                        className="flex-1"
                        placeholder="https://example.com/image.png"
                    />
                </div>
                </div>
            ))}
          </CardContent>
      </Card>

      <Button onClick={handleSaveChanges} disabled={isSaving} className="w-full">
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Images
      </Button>
    </div>
  );
}
