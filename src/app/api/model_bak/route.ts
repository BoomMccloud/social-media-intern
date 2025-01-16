import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { ModelConfig } from "@/types/chat";

// Define types for our model data
export interface ModelData {
  configId: string;
  name: string;
  systemPrompt: string;
  description: string;
  isActive: boolean;
  modelId: string;
  profilePicture: string;
  tags: string[];
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

      return NextResponse.json(models);
    } else if (type === "chat") {
      // If configId is provided, return only that model
      const configId = searchParams.get("configId");

      if (configId) {
        const selectedModel = models.find(
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
