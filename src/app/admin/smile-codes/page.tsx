
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  onSnapshot,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { smileCoinProducts } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Trash2 } from 'lucide-react';
import type { SmileCode } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminSmileCodesPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const [productId, setProductId] = useState('');
  const [codeValue, setCodeValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [codes, setCodes] = useState<SmileCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
        setLoading(false)
        return;
    };

    const q = query(collection(db, 'smileCodes'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const codesData = snapshot.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as SmileCode)
      );
      // Sort by createdAt descending
      codesData.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
      });
      setCodes(codesData);
      setLoading(false);
    }, (err) => {
        console.error(err);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleAddCode = async () => {
    if (!productId || !codeValue.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please select a product and enter a code.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);
    try {
      const product = smileCoinProducts.find((p) => p.id === productId);
      if (!product) throw new Error('Product not found');
      
      await addDoc(collection(db, 'smileCodes'), {
        code: codeValue.trim(),
        productId: product.id,
        productName: product.name,
        price: product.price,
        isUsed: false,
        usedBy: null,
        usedAt: null,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Success!',
        description: `Code for ${product.name} has been added.`,
      });
      setCodeValue('');
      setProductId('');
    } catch (error) {
      console.error('Error adding code:', error);
      toast({
        title: 'Error',
        description: 'Could not add the code.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCode = async (codeId: string) => {
      if (!window.confirm("Are you sure you want to delete this code? This cannot be undone.")) {
          return;
      }
      try {
          await deleteDoc(doc(db, 'smileCodes', codeId));
          toast({ title: "Code deleted successfully."});
      } catch (error) {
          console.error("Error deleting code: ", error);
          toast({ title: "Error", description: "Could not delete code.", variant: "destructive"});
      }
  }
  
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Add New Smile Code</CardTitle>
          <CardDescription>
            Add a new redeemable code for a Smile Coin product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select
            value={productId}
            onValueChange={setProductId}
            disabled={isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a Smile Coin Product" />
            </SelectTrigger>
            <SelectContent>
              {smileCoinProducts.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} ({product.price} Coins)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={codeValue}
            onChange={(e) => setCodeValue(e.target.value)}
            placeholder="Enter the code value"
            disabled={isSubmitting}
          />
          <Button onClick={handleAddCode} disabled={isSubmitting || !productId || !codeValue}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Code
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Codes</CardTitle>
          <CardDescription>List of all available and used codes.</CardDescription>
        </CardHeader>
        <CardContent className="h-96 overflow-y-auto">
            {loading ? <Loader2 className="mx-auto animate-spin" /> : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {codes.map(code => (
                            <TableRow key={code.id}>
                                <TableCell className="text-xs">
                                  <p className="font-medium">{code.productName}</p>
                                  <p className="text-muted-foreground">{code.price} Coins</p>
                                </TableCell>
                                <TableCell className="font-mono text-xs">{code.code}</TableCell>
                                <TableCell>
                                    <Badge variant={code.isUsed ? "secondary" : "default"}>
                                        {code.isUsed ? 'Used' : 'Available'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    {!code.isUsed && (
                                        <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500" onClick={() => handleDeleteCode(code.id!)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
