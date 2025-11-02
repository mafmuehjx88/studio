"use client";

import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MarqueeUI } from '@/components/ui/marquee';
import { Megaphone } from 'lucide-react';

const defaultMarqueeText = "Welcome to AT Game HUB! Your trusted partner for game top-ups.";

export default function MarqueeText() {
  const [marqueeText, setMarqueeText] = useState(defaultMarqueeText);

  useEffect(() => {
    const fetchMarquee = async () => {
      try {
        const marqueeDoc = await getDoc(doc(db, "settings", "marquee"));
        if (marqueeDoc.exists()) {
          setMarqueeText(marqueeDoc.data().text);
        }
      } catch (error) {
        console.error("Could not fetch marquee text, using default.", error);
        setMarqueeText(defaultMarqueeText);
      }
    };

    fetchMarquee();
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-card px-2 py-1">
      <Megaphone className="h-4 w-4 flex-shrink-0 text-primary" />
      <div className="flex-1 overflow-hidden">
        <MarqueeUI>
          <p className="px-4 text-xs font-medium text-primary">
            {marqueeText}
          </p>
        </MarqueeUI>
      </div>
    </div>
  );
}
