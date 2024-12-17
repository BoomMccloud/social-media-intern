// src/lib/config.ts
import { promises as fs } from "fs";
import { CONFIG_FILE_PATH } from "./constants";
import { ModelConfig } from "@/types/chat";

export async function ensureConfigDirectory() {
  const configDir = path.dirname(CONFIG_FILE_PATH);
  try {
    await fs.access(configDir);
  } catch {
    await fs.mkdir(configDir, { recursive: true });
  }
}

export async function getModelConfigs(
  defaultModels: ModelConfig[]
): Promise<ModelConfig[]> {
  try {
    await ensureConfigDirectory();
    const data = await fs.readFile(CONFIG_FILE_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    await fs.writeFile(
      CONFIG_FILE_PATH,
      JSON.stringify(defaultModels, null, 2)
    );
    return defaultModels;
  }
}
