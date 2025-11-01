
import { getOrCreatePlaceholderImages } from '@/lib/actions';
import ImageEditor from './ImageEditor';
import { PlaceholderImage } from '@/lib/types';


export default async function ImageManagementPage() {
  
  const initialImages: Record<string, PlaceholderImage> = await getOrCreatePlaceholderImages();

  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold">Image Management</h1>
            <p className="text-muted-foreground">
            Update the image URLs used across the application. Changes are saved directly to Firestore.
            </p>
        </div>
        <ImageEditor initialImages={initialImages} />
    </div>
  );
}
