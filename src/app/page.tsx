"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ModelCard {
  configId: string;
  name: string;
  description: string;
  isActive: boolean;
}

export default function Home() {
  const [models, setModels] = useState<ModelCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch('/api/model?type=page');
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        const data = await response.json();
        setModels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load models');
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  if (loading) {
    return (
      <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading available models...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-cols-[repeat(auto-fit,_minmax(200px,300px))] row-start-2 gap-4 justify-center">
        {models.map((model) => (
          <div
            className="border rounded-md overflow-hidden hover:scale-110 transition-all bg-white"
            key={model.configId}
          >
            <Link href={`/chat?configId=${model.configId}`}>
              <div className="relative">
                <img
                  alt={`${model.name} avatar`}
                  src="/api/placeholder/400/200"
                  className="w-full h-auto"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{model.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{model.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </main>
    </div>
  );
}