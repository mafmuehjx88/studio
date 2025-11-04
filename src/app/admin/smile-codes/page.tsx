
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { smileCodes as allSmileCodes, smileCoinProducts } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { AlertCircle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function AdminSmileCodesPage() {
  const { isAdmin } = useAuth();
  const [codes, setCodes] = useState<SmileCode[]>([]);

  useEffect(() => {
    if (!isAdmin) {
        return;
    };
    // Data is now loaded directly from the imported file, not from Firestore.
    // This sorting logic is kept to maintain consistent order.
    const sortedCodes = [...allSmileCodes].sort((a, b) => {
        // A simple sort by product name then code
        if (a.productName < b.productName) return -1;
        if (a.productName > b.productName) return 1;
        if (a.code < b.code) return -1;
        if (a.code > b.code) return 1;
        return 0;
    });
    setCodes(sortedCodes);
  }, [isAdmin]);

  
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
        <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Developer Note</AlertTitle>
            <AlertDescription>
                Smile Coin codes are now managed directly in the <strong>src/lib/data.ts</strong> file. To add, edit, or remove codes, please modify the `smileCodes` array in that file.
            </AlertDescription>
        </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Existing Smile Codes</CardTitle>
          <CardDescription>
            List of all available codes, managed in the source code.
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
            {codes.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No codes found in src/lib/data.ts</p>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Status</TableHead>
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
