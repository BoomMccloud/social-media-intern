import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { DEFAULT_MODELS } from "@/config/default-models";
import { ModelConfig } from "@/types/chat";

const CONFIG_FILE_PATH = path.join(
  process.cwd(),
  "config",
  "current-models.json"
);

async function ensureConfigDirectory() {
  const configDir = path.join(process.cwd(), "config");
  try {
    await fs.access(configDir);
  } catch {
    await fs.mkdir(configDir, { recursive: true });
  }
}

// GET /api/config
export async function GET() {
  try {
    await ensureConfigDirectory();

    try {
      const data = await fs.readFile(CONFIG_FILE_PATH, "utf8");
      return NextResponse.json(JSON.parse(data));
    } catch (error) {
      // If file doesn't exist, return default configs
      await fs.writeFile(
        CONFIG_FILE_PATH,
        JSON.stringify(DEFAULT_MODELS, null, 2)
      );
      return NextResponse.json(DEFAULT_MODELS);
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load configurations" },
      { status: 500 }
    );
  }
}

// POST /api/config
export async function POST(request: Request) {
  try {
    const configs: ModelConfig[] = await request.json();
    await ensureConfigDirectory();
    await fs.writeFile(CONFIG_FILE_PATH, JSON.stringify(configs, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save configurations" },
      { status: 500 }
    );
  }
}
