import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { LLMConfig } from "@/types/chat";

export async function GET() {
  try {
    const llmsPath = path.join(process.cwd(), "config", "llms.json");
    const llmsData = await fs.readFile(llmsPath, "utf-8");
    const llmConfigs: LLMConfig[] = JSON.parse(llmsData);

    return NextResponse.json(llmConfigs);
  } catch (error) {
    console.error("Error processing LLM configs list request:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve LLM configurations list",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
