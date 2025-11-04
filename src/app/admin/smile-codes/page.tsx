
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
  // orderBy, // Removed to prevent index errors
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

  const [newCode, setNewCode] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [codes, setCodes] = useState<SmileCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
        setLoading(false)
        return;
    };

    // Query without ordering to prevent missing index errors
    const q = query(collection(db, 'smileCodes'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const codesData = snapshot.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as SmileCode)
      );
      
      // Sort on the client side
      codesData.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          // @ts-ignore
          return b.createdAt.toMillis() - a.createdAt.toMillis();
        }
        return 0;
      });

      setCodes(codesData);
      setLoading(false);
    }, (err) => {
        console.error(err);
        toast({ title: "Error fetching codes", description: err.message, variant: "destructive" });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin, toast]);


  const handleAddCode = async () => {
    if (!newCode || !selectedProductId) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive"});
      return;
    }

    const selectedProduct = smileCoinProducts.find(p => p.id === selectedProductId);
    if (!selectedProduct) {
        toast({ title: "Invalid Product", description: "Selected product could not be found.", variant: "destructive"});
        return;
    }

    setIsAdding(true);
    try {
      await addDoc(collection(db, 'smileCodes'), {
        code: newCode,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        price: selectedProduct.price,
        isUsed: false,
        usedBy: null,
        usedAt: null,
        createdAt: serverTimestamp(),
      });
      toast({ title: 'Code added successfully' });
      setNewCode('');
      setSelectedProductId('');
    } catch (error) {
      console.error('Error adding code: ', error);
      toast({ title: "Error", description: "Could not add the code.", variant: "destructive"});
    } finally {
      setIsAdding(false);
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
            Manually add a new redeemable code to the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter new code"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            disabled={isAdding}
          />
          <Select
            value={selectedProductId}
            onValueChange={setSelectedProductId}
            disabled={isAdding}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {smileCoinProducts.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name} ({p.price} Coins)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddCode} disabled={isAdding || !newCode || !selectedProductId}>
            {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
