"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ModelCard {
  configId: string;
  name: string;
  description: string;
  isActive: boolean;
  profilePicture: string;
  avatar: string;
}

export default function Home() {
  const [models, setModels] = useState<ModelCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    console.log('Component mounted');

    async function fetchModels() {
      console.log('Fetching models...');
      try {
        const response = await fetch('/api/model?type=page');
        console.log('API Response:', response);

        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        const data = await response.json();
        console.log('Fetched data:', data);

        setModels(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load models');
      } finally {
        setLoading(false);
      }
    }

    fetchModels();
  }, []);

  const handleModelClick = (configId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (status === "authenticated") {
      // If user is logged in, go directly to chat
      router.push(`/chat?configId=${configId}`);
    } else {
      // If user is not logged in, redirect to login with callback
      const callbackUrl = `/chat?configId=${configId}`;
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  };

  console.log('Current state:', { loading, error, modelCount: models.length });

  if (loading) {
    console.log('Rendering loading state');
    return (
      <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading available models...</div>
      </div>
    );
  }

  if (error) {
    console.log('Rendering error state:', error);
    return (
      <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  console.log('Rendering models:', models);

  return (
    <div className="p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="grid grid-cols-[repeat(auto-fit,_minmax(300px,300px))] row-start-2 gap-4 justify-center">
        {models.map((model) => {
          console.log('Model profile picture path:', {
            name: model.name,
            profilePicture: model.profilePicture
          });
          
          return (
            <div
              className="border rounded-md overflow-hidden hover:scale-110 transition-all bg-white cursor-pointer"
              key={model.configId}
              onClick={handleModelClick(model.configId)}
            >
              <div className="relative">
                <img
                  alt={`${model.name} profile`}
                  src={model.profilePicture}
                  className="w-full h-[200px] object-contain"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{model.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{model.description}</p>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}