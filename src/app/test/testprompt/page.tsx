"use client";

import React, { useState, useEffect } from "react";
import { Card, Select, Space, Tabs, Typography, Alert, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { generatePrompt } from "@/lib/generatePrompt";
import { Character } from "@/types/character";
import { Instructions } from "@/types/instructions"; // Import Instructions interface

const { TabPane } = Tabs;

const PromptViewer = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [instructions, setInstructions] = useState<Instructions[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>("");
  const [selectedInstruction, setSelectedInstruction] = useState<string>("");
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatRawString = (text: string) => {
    return text
      .replace(/\n/g, "\\n")
      .replace(/\t/g, "\\t")
      .replace(/\r/g, "\\r");
  };

  // Load configuration files
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const [charactersRes, instructionsRes] = await Promise.all([
          fetch("/api/config/internal?file=characters"),
          fetch("/api/config/internal?file=instructions"),
        ]);

        if (!charactersRes.ok || !instructionsRes.ok) {
          throw new Error("Failed to fetch configuration");
        }

        const charactersData: Character[] = await charactersRes.json();
        const instructionsData: Instructions[] = await instructionsRes.json();

        setCharacters(charactersData);
        setInstructions(instructionsData);

        // Set default selections
        if (charactersData.length > 0) {
          setSelectedCharacter(charactersData[0].id);
        }
        if (instructionsData.length > 0) {
          setSelectedInstruction(instructionsData[0].id);
        }

        setLoading(false);
      } catch (error) {
        console.error("Config loading error:", error);
        setError("Failed to load configuration files");
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  // Generate prompt when selections change
  useEffect(() => {
    if (
      selectedCharacter &&
      selectedInstruction &&
      characters.length &&
      instructions.length
    ) {
      try {
        const prompt = generatePrompt(selectedCharacter, characters);
        setGeneratedPrompt(prompt);
      } catch (error) {
        console.error("Prompt generation error:", error);
        setError("Failed to generate prompt");
      }
    }
  }, [selectedCharacter, selectedInstruction, characters, instructions]);

  // Styles for dark theme
  const darkThemeStyles = {
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    minHeight: "100vh",
  };

  const darkCardStyles = {
    backgroundColor: "#242424",
    color: "#ffffff",
    border: "1px solid #333",
  };

  const darkPreStyles = {
    whiteSpace: "pre-wrap" as const,
    backgroundColor: "#2a2a2a",
    color: "#ffffff",
    padding: "16px",
    borderRadius: "4px",
    maxHeight: "500px",
    overflow: "auto",
  };

  if (loading) {
    return (
      <div
        style={{
          ...darkThemeStyles,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin
          indicator={
            <LoadingOutlined style={{ fontSize: 24, color: "#ffffff" }} spin />
          }
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...darkThemeStyles, padding: "24px" }}>
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div style={darkThemeStyles}>
      <div style={{ padding: "24px" }}>
        <Card
          title={
            <span style={{ color: "#ffffff" }}>Prompt Generation Viewer</span>
          }
          style={{ ...darkCardStyles, marginBottom: "24px" }}
          headStyle={{
            backgroundColor: "#242424",
            borderBottom: "1px solid #333",
          }}
          bodyStyle={{ backgroundColor: "#242424" }}
        >
          <Space direction="vertical" style={{ width: "100%" }} size="large">
            <div style={{ display: "flex", gap: "16px" }}>
              <div style={{ flex: 1 }}>
                <Typography.Text strong style={{ color: "#ffffff" }}>
                  Character
                </Typography.Text>
                <Select
                  style={{ width: "100%", marginTop: "8px" }}
                  value={selectedCharacter}
                  onChange={setSelectedCharacter}
                  options={characters.map((char) => ({
                    label: char.name,
                    value: char.id,
                  }))}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Typography.Text strong style={{ color: "#ffffff" }}>
                  Instruction Set
                </Typography.Text>
                <Select
                  style={{ width: "100%", marginTop: "8px" }}
                  value={selectedInstruction}
                  onChange={setSelectedInstruction}
                  options={instructions.map((inst) => ({
                    label: inst.id,
                    value: inst.id,
                  }))}
                />
              </div>
            </div>
          </Space>
        </Card>

        <Card
          title={<span style={{ color: "#ffffff" }}>Generated Prompt</span>}
          style={darkCardStyles}
          headStyle={{
            backgroundColor: "#242424",
            borderBottom: "1px solid #333",
          }}
          bodyStyle={{ backgroundColor: "#242424" }}
        >
          <Tabs defaultActiveKey="formatted" style={{ color: "#ffffff" }}>
            <TabPane tab="Formatted" key="formatted">
              <pre style={darkPreStyles}>{generatedPrompt}</pre>
            </TabPane>
            <TabPane tab="Unformatted" key="unformatted">
              <div
                style={{
                  ...darkPreStyles,
                  fontFamily: "monospace",
                  whiteSpace: "normal",
                  wordBreak: "break-all",
                }}
              >
                {formatRawString(generatedPrompt)}
              </div>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default PromptViewer;
