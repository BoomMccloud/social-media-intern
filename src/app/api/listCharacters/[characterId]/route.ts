import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Character } from "@/types/character";

export async function GET(request: NextRequest) {
  // Use NextRequest
  try {
    const characterId = request.nextUrl.pathname.split("/").pop(); // Use nextUrl
    if (!characterId || characterId === "route") {
      // handle undefined
      return new NextResponse("Invalid characterId", { status: 400 }); // Better error response for invalid ID
    }

    const charactersPath = path.join(
      process.cwd(),
      "config",
      "characters.json"
    );
    const charactersData = await fs.readFile(charactersPath, "utf-8");
    const characters: Character[] = JSON.parse(charactersData);

    const character = characters.find((c) => c.id === characterId);

    if (!character) {
      return new NextResponse("Character not found", { status: 404 });
    }

    return NextResponse.json(character);
  } catch (error) {
    console.error("Error processing character request:", error);
    return new NextResponse("Failed to retrieve character", { status: 500 });
  }
}
