"use client";
import Link from "next/link";

interface CardItem {
  id: string;
  imageUrl: string;
  altText: string;
  link: string;
}

export default function Home() {
  // Generate array of card items with unique IDs
  const cardItems: CardItem[] = Array.from({ length: 10 }, (_, index) => ({
    id: `card-${index}`,
    imageUrl: "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png",
    altText: `Image ${index + 1}`,
    link: "/chat"
  }));

  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-cols-[repeat(auto-fit,_minmax(200px,300px))] row-start-2 gap-4 justify-center">
        {cardItems.map((item) => (
          <div
            className="border rounded-md overflow-hidden hover:scale-110 transition-all"
            key={item.id}
          >
            <Link href={item.link}>
              <img
                alt={item.altText}
                src={item.imageUrl}
                className="w-full h-auto"
              />
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}