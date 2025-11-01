"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { doc, setDoc, getDoc, serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function AdminContentPage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();

  const [marqueeText, setMarqueeText] = useState("");
  const [marqueeLoading, setMarqueeLoading] = useState(true);
  const [marqueeSaving, setMarqueeSaving] = useState(false);

  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementSaving, setAnnouncementSaving] = useState(false);

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

  const handlePostAnnouncement = async () => {
      if (!announcementTitle || !announcementContent) {
          toast({ title: "Missing Fields", description: "Please fill in both title and content.", variant: "destructive" });
          return;
      }
    setAnnouncementSaving(true);
    try {
      await addDoc(collection(db, "announcements"), {
        title: announcementTitle,
        content: announcementContent,
        createdAt: serverTimestamp(),
      });
      toast({ title: "Success", description: "Announcement posted." });
      setAnnouncementTitle("");
      setAnnouncementContent("");
    } catch (error) {
      console.error("Error posting announcement:", error);
      toast({ title: "Error", description: "Could not post announcement.", variant: "destructive" });
    } finally {
      setAnnouncementSaving(false);
    }
  };


  if (!isAdmin) {
    return null;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
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

        <Card>
            <CardHeader>
                <CardTitle>Create Announcement</CardTitle>
                <CardDescription>
                    Post a new announcement to all users.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="ann-title">Title</Label>
                    <Input
                        id="ann-title"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        placeholder="e.g., Maintenance Break"
                        disabled={announcementSaving}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="ann-content">Content</Label>
                    <Textarea
                        id="ann-content"
                        value={announcementContent}
                        onChange={(e) => setAnnouncementContent(e.target.value)}
                        placeholder="The app will be down for maintenance..."
                        disabled={announcementSaving}
                        rows={4}
                    />
                </div>
                 <Button onClick={handlePostAnnouncement} disabled={announcementSaving}>
                    {announcementSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Post Announcement
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
