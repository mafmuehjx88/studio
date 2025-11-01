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
import { products as staticProducts, games as staticGames } from '@/lib/data';

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
        if (docSnap.exists() && docSnap.data().images) {
          setImages(docSnap.data().images);
        } else {
          // Document or images field doesn't exist, create it from static data
          console.log("No image data found in Firestore. Initializing from static data.");
          const initialImages: ImagesMap = {};
          
          // From products
          staticProducts.forEach(product => {
            if (!initialImages[product.image]) {
              initialImages[product.image] = {
                imageUrl: `https://picsum.photos/seed/${product.image}/200/200`,
                description: `Image for ${product.name}`,
                imageHint: product.category,
              };
            }
          });
          
          // From games
          staticGames.forEach(game => {
              if (!initialImages[game.image]) {
                initialImages[game.image] = {
                    imageUrl: `https://picsum.photos/seed/${game.image}/600/300`,
                    description: `Banner for ${game.name}`,
                    imageHint: `game ${game.name}`
                }
              }
          });
          
          // Add other common images
          const commonImages = ['logo', 'banner', 'default-avatar'];
          commonImages.forEach(imgKey => {
               if (!initialImages[imgKey]) {
                initialImages[imgKey] = {
                    imageUrl: `https://picsum.photos/seed/${imgKey}/400/400`,
                    description: `${imgKey.replace('-', ' ')} image`,
                    imageHint: imgKey
                }
              }
          });


          setImages(initialImages);
          // Save this initial structure to Firestore so it's there for next time
          await setDoc(docRef, { images: initialImages }, { merge: true });
          toast({
            title: "Initialized Image Data",
            description: "Created initial image settings in Firestore.",
          });
        }
      } catch (err) {
        console.error("Error fetching/initializing image data:", err);
        setError("Failed to fetch or initialize image data from Firestore.");
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
        ...(prev[id] || { description: `Image for ${id}`, imageUrl: '' }), // a fallback
        imageUrl: value,
      },
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
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
            {Object.keys(images).length === 0 ? (
                <p className='text-muted-foreground text-center p-4'>No images to manage. The image list is being generated.</p>
            ) : Object.keys(images).sort().map((id) => (
                <div key={id} className="space-y-2">
                <Label htmlFor={id} className="text-sm font-medium capitalize">
                    {id.replace(/[-_]/g, ' ')} <span className="text-xs text-muted-foreground">({images[id].description})</span>
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
    </div>
  );
}
