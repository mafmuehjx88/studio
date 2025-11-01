import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { games } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Marquee } from "@/components/ui/marquee";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

async function getMarqueeText() {
  try {
    const marqueeDoc = await getDoc(doc(db, "settings", "marquee"));
    if (marqueeDoc.exists()) {
      return marqueeDoc.data().text;
    }
  } catch (error) {
    console.error("Error fetching marquee text:", error);
  }
  return "Welcome to AT Game HUB! Your trusted partner for game top-ups.";
}

export default async function Home() {
  const bannerImage = PlaceHolderImages.find((img) => img.id === "banner");
  const marqueeText = await getMarqueeText();

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-none">
        {bannerImage && (
          <Image
            src={bannerImage.imageUrl}
            alt={bannerImage.description}
            width={1200}
            height={400}
            className="aspect-[3/1] w-full object-cover"
            data-ai-hint={bannerImage.imageHint}
            priority
          />
        )}
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Button asChild size="sm">
          <Link href="/top-up">ငွေဖြည့်မည်</Link>
        </Button>
        <Button asChild variant="secondary" size="sm">
          <Link href="/orders">အော်ဒါများ</Link>
        </Button>
      </div>

      <Card className="bg-secondary">
        <Marquee>
          <span className="px-4 text-xs font-medium text-primary">
            {marqueeText}
          </span>
        </Marquee>
      </Card>

      <div>
        <h2 className="mb-4 text-2xl font-bold">Games</h2>
        <div className="grid grid-cols-3 gap-4">
          {games.map((game) => {
            const gameImage = PlaceHolderImages.find(
              (img) => img.id === game.image
            );
            return (
              <Link href={`/games/${game.id}`} key={game.id}>
                <Card className="overflow-hidden transition-transform hover:scale-105">
                  <CardContent className="p-0">
                    {gameImage && (
                      <Image
                        src={gameImage.imageUrl}
                        alt={game.name}
                        width={400}
                        height={500}
                        className="aspect-[4/5] object-cover"
                        data-ai-hint={gameImage.imageHint}
                      />
                    )}
                    <div className="bg-card/50 p-2 text-center">
                      <p className="truncate text-xs font-semibold">
                        {game.name}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
