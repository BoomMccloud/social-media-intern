import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ModelConfig } from "@/types/chat";

// Define types for our model data

interface UiModelData {
  configId: string;
  name: string;
  description: string;
  isActive: boolean;
  profilePicture: string;
  avatar: string;
}

interface ChatModelData {
  configId: string;
  name: string;
  systemPrompt: string;
  isActive: boolean;
  modelId: string;
  avatar: string;
}

export async function GET(req: Request) {
  try {
    // Get the type parameter from the URL
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    // Read the models file
    const modelsPath = path.join(
      process.cwd(),
      "config",
      "current-models.json"
    );
    const modelsData = await fs.readFile(modelsPath, "utf-8");
    const models: ModelConfig[] = JSON.parse(modelsData);

    // Transform data based on the request type
    if (type === "page") {
      // For the main page, return minimal data needed for cards
      const pageData: UiModelData[] = models.map((model) => ({
        configId: model.configId,
        name: model.name,
        description: model.description,
        isActive: model.isActive,
        profilePicture: model.profilePicture,
        avatar: model.avatar,
      }));

      return NextResponse.json(pageData);
    } else if (type === "chat") {
      // For the chat page, return data needed for the chat interface
      const chatData: ChatModelData[] = models.map((model) => ({
        configId: model.configId,
        name: model.name,
        description: model.description,
        systemPrompt: model.systemPrompt,
        isActive: model.isActive,
        modelId: model.modelId,
        avatar: model.avatar,
      }));

      // If configId is provided, return only that model
      const configId = searchParams.get("configId");
      if (configId) {
        const selectedModel = chatData.find(
          (model) => model.configId === configId
        );
        if (!selectedModel) {
          return NextResponse.json(
            { error: "Model not found" },
            { status: 404 }
          );
        }
        return NextResponse.json(selectedModel);
      }

      return NextResponse.json(chatData);
    }

    return NextResponse.json(
      { error: 'Invalid type parameter. Use "page" or "chat".' },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing model request:", error);
    return NextResponse.json(
      {
        error: "Failed to process model request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
