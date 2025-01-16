import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LLMConfig } from "@/types/chat";

export async function GET(request: NextRequest) {
  try {
    const configId = request.nextUrl.pathname.split("/").pop();

    if (!configId || configId === "route") {
      // Check for missing or invalid ID
      return new NextResponse("Config ID is missing or invalid", {
        status: 400,
      });
    }

    const llmsPath = path.join(process.cwd(), "config", "llms.json");
    const llmsData = await fs.readFile(llmsPath, "utf-8");
    const llmConfigs: LLMConfig[] = JSON.parse(llmsData);

    const config = llmConfigs.find((config) => config.configId === configId);

    if (!config) {
      return new NextResponse("LLM configuration not found", { status: 404 });
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error processing LLM config request:", error);
    return new NextResponse("Failed to retrieve LLM configuration", {
      status: 500,
    });
  }
}
