
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminHomeNoticePage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [marqueeText, setMarqueeText] = useState("");
  const [marqueeLoading, setMarqueeLoading] = useState(true);
  const [marqueeSaving, setMarqueeSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchMarquee = async () => {
      setMarqueeLoading(true);
      const marqueeDoc = await getDoc(doc(db, "settings", "marquee"));
      if (marqueeDoc.exists()) {
        setMarqueeText(marqueeDoc.data().text);
      }
      setMarqueeLoading(false);
    };

    fetchMarquee();
  }, [isAdmin]);

  const handleSaveMarquee = async () => {
    setMarqueeSaving(true);
    try {
      await setDoc(doc(db, "settings", "marquee"), { text: marqueeText });
      toast({ title: "Success", description: "Marquee text updated." });
    } catch (error) {
      console.error("Error saving marquee text:", error);
      toast({ title: "Error", description: "Could not save marquee text.", variant: "destructive" });
    } finally {
      setMarqueeSaving(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Home Notice</h1>
      </div>
      <Card>
          <CardHeader>
              <CardTitle>Marquee Text</CardTitle>
              <CardDescription>
                  Update the scrolling text on the homepage.
              </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
              <div className="space-y-2">
                  <Label htmlFor="marquee-text">Text</Label>
                  <Input
                      id="marquee-text"
                      value={marqueeText}
                      onChange={(e) => setMarqueeText(e.target.value)}
                      placeholder="Welcome to our store..."
                      disabled={marqueeLoading || marqueeSaving}
                  />
              </div>
              <Button onClick={handleSaveMarquee} disabled={marqueeLoading || marqueeSaving}>
                  {marqueeSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Marquee
              </Button>
          </CardContent>
      </Card>
    </div>
  );
}
