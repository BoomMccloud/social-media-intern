"use client";

import React, { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Avatar, Spin, Alert } from "antd";
import { CharacterListResponse } from "@/types/character-list";
import Image from "next/image";

const { Meta } = Card;
const { Title } = Typography;

const CharacterListPage: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch("/api/listCharacters");
        if (!response.ok) {
          throw new Error("Failed to fetch characters");
        }
        const data = await response.json();
        setCharacters(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading characters..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="p-8">
      <Title level={2} className="mb-8 text-center">
        Available Characters
      </Title>

      <Row gutter={[16, 16]} className="max-w-7xl mx-auto">
        {characters.map((character) => (
          <Col xs={24} sm={12} md={8} lg={6} key={character.id}>
            <Card
              hoverable
              className="h-full"
              cover={
                <div className="relative h-64 w-full">
                  <Image
                    src={character.profilePicture}
                    alt={`${character.name}'s profile`}
                    fill
                    style={{ objectFit: "cover" }}
                    className="rounded-t-lg"
                  />
                </div>
              }
            >
              <Meta
                title={character.name}
                description={character.displayDescription}
              />
              <div className="mt-4">
                {character.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-2 mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CharacterListPage;
