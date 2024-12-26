"use client";
// import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { ModelData } from "@/app/api/model/route";
// import AppHeader from '@/components/Header';
import AppFooter from '@/components/Footer';
import HeroCarousel from '@/components/HeroCarousel';

const tags = ["man", "woman", "other"];

export default function Home() {
  const [models, setModels] = useState<ModelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
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
    <div className="min-h-screen flex flex-col bg-[#0f0f10]">
      {/* <AppHeader /> */}
      
      {/* Hero Section */}
      <section className="w-full">
        <HeroCarousel />
      </section>

      {/* Models Section */}
      <section className="flex-grow container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#F8BBD0] mb-4">Explore Our Models</h2>
          <p className="text-gray-400 mb-6">
            Discover AI companions tailored to your unique needs and preferences. Engage in conversations about any topic of your desire.
          </p>
          
          {/* Filters */}
          <div className="flex gap-2 items-center p-4 bg-[#0a0a0a] rounded-lg">
            <div className="text-gray-300">
              <FilterOutlined className="mr-1" />
              Filters:
            </div>
            {tags.map((tag) => (
              <Button
                key={tag}
                color="primary"
                variant={selectedTags.includes(tag) ? "solid" : "outlined"}
                onClick={() => {
                  setSelectedTags((prevSelectedTags: string[]) => {
                    if (prevSelectedTags.includes(tag)) {
                      return prevSelectedTags.filter((t) => t !== tag);
                    } else {
                      return [...prevSelectedTags, tag];
                    }
                  });
                }}
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Model Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {models
            .filter((model) => {
              if (selectedTags.length === 0) return true;
              return (
                model.tags && model.tags.some((tag) => selectedTags.includes(tag))
              );
            })
            .map((model) => (
              <div
                key={model.configId}
                className="bg-[#0a0a0a] rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg"
                onClick={handleModelClick(model.configId)}
              >
                <div className="relative">
                  <img
                    alt={`${model.name} profile`}
                    src={model.profilePicture}
                    className="w-full aspect-[3/4] object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-[#F8BBD0] mb-2">
                      {model.name}
                    </h3>
                    <p className="text-gray-400 line-clamp-2">
                      {model.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
