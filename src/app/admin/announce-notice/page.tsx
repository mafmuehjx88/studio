
"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { serverTimestamp, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function AdminAnnounceNoticePage() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [announcementSaving, setAnnouncementSaving] = useState(false);

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
     <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-2xl font-bold">Announce Notice</h1>
      </div>
        <Card>
            <CardHeader>
                <CardTitle>Create Announcement</CardTitle>
                <CardDescription>
                    Post a new announcement that will appear for all users.
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

