
'use client';

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { PlaceholderImage } from '@/lib/types';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

type ImagesMap = Record<string, PlaceholderImage>;

interface ImageEditorProps {
  initialImages: ImagesMap;
}

export default function ImageEditor({ initialImages }: ImageEditorProps) {
  const { isAdmin, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [images, setImages] = useState<ImagesMap>(initialImages);
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (id: string, value: string) => {
    setImages((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { description: `Image for ${id}`, imageUrl: '' }),
        imageUrl: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const docRef = doc(db, 'settings', 'placeholderImages');
    try {
      await setDoc(docRef, { images: images }, { merge: true });
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
  
  if (authLoading) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="space-y-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                </div>
            </CardContent>
        </Card>
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

  return (
    <>
      <Card>
          <CardHeader>
              <CardTitle>Image URLs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.keys(images).length === 0 ? (
                <p className='text-muted-foreground text-center p-4'>No images found or an error occurred.</p>
            ) : Object.keys(images).sort().map((id) => (
                <div key={id} className="space-y-2">
                <Label htmlFor={id} className="text-sm font-medium capitalize">
                    {images[id].description || id.replace(/[-_]/g, ' ')}
                </Label>
                <div className="flex items-center gap-4">
                    <Image
                        src={images[id].imageUrl}
                        alt={images[id].description}
                        width={64}
                        height={64}
                        className="h-16 w-16 rounded-md object-cover bg-muted"
                        onError={(e) => e.currentTarget.src = 'https://placehold.co/64x64/eee/aaa?text=?'}
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

      <Button onClick={handleSaveChanges} disabled={isSaving || Object.keys(images).length === 0} className="w-full">
        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Update Images
      </Button>
    </>
  );
}
