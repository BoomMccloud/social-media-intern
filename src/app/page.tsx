"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import { ModelData } from "@/app/api/model/route";

const tags = ["man", "woman"];

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
    <div className="p-2 sm:p-4 md:p-8 gap-16 font-[family-name:var(--font-geist-sans)]">
      <div className="flex gap-2 mb-4 items-center">
        <div>
          <FilterOutlined className="mr-1" />
          Filters:
        </div>
        {tags.map((tag) => {
          return (
            <Button
              key={tag}
              color="primary"
              variant={selectedTags.includes(tag) ? "solid" : "outlined"}
              onClick={() => {
                setSelectedTags((prevSelectedTags: string[]) => {
                  if (prevSelectedTags.includes(tag)) {
                    // Remove the tag if it's already selected
                    return prevSelectedTags.filter((t) => t !== tag);
                  } else {
                    // Add the tag if it's not selected
                    return [...prevSelectedTags, tag];
                  }
                });
              }}
            >
              {tag}
            </Button>
          );
        })}
      </div>
      <main className="grid grid-cols-[repeat(auto-fit,_minmax(150px,1fr))] md:grid-cols-[repeat(auto-fit,_minmax(200px,1fr))] row-start-2 gap-4 justify-center">
        {models
          .filter((model) => {
            if (selectedTags.length === 0) return true;
            return (
              model.tags && model.tags.some((tag) => selectedTags.includes(tag))
            );
          })
          .map((model) => {
            return (
              <div
                className="rounded-md overflow-hidden hover:scale-110 transition-all bg-white cursor-pointer"
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
                    <h3 className="font-semibold text-white mb-1">
                      {model.name}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">
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
