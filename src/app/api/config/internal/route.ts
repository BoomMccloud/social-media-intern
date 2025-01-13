import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

async function ensureConfigDirectory() {
  const configDir = path.join(process.cwd(), "config");
  try {
    await fs.access(configDir);
  } catch {
    await fs.mkdir(configDir, { recursive: true });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get("file");

  if (!file) {
    return NextResponse.json(
      { error: "File parameter is required" },
      { status: 400 }
    );
  }

  try {
    await ensureConfigDirectory();
    const configPath = path.join(process.cwd(), "config", `${file}.json`);
    const data = await fs.readFile(configPath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Error loading config:", error);
    return NextResponse.json(
      { error: `Failed to load ${file} configuration` },
      { status: 500 }
    );
  }
}
