import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-cols-[repeat(auto-fit,_minmax(200px,300px))] row-start-2 gap-4 justify-center">
        {Array.from({ length: 10 }).map((temp) => (
          <div className="border rounded-md overflow-hidden hover:scale-110 transition-all">
            <Link href="/chat">
              <img
                alt="example"
                src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
              />
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}
