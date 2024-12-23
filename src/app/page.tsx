"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export interface Model {
  configId: string;
  name: string;
  description: string;
  isActive: boolean;
  profilePicture: string;
  avatar: string;
  systemPrompt: string;
}

export default function Home() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await fetch("/api/model?type=page");

        if (!response.ok) {
          throw new Error("Failed to fetch models");
        }
        const data = await response.json();

        setModels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load models");
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
      <main className="grid grid-cols-[repeat(auto-fit,_minmax(200px,200px))] row-start-2 gap-4 justify-center">
        {models.map((model) => {
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
                  className="w-full h-[250px] object-cover"
                />
                <div className="px-3 py-2 absolute bottom-0 left-0 right-0 shadow-card">
                  <h3 className="font-semibold text-gray-800 mb-1">
                    {model.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {model.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
