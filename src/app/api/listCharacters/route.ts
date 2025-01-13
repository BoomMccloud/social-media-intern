// app/api/listCharacters/route.ts

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Character } from "@/types/character";
import { CharacterListResponse } from "@/types/character-list";

export async function GET(req: Request) {
  try {
    // Read the characters file
    const charactersPath = path.join(
      process.cwd(),
      "config",
      "characters.json"
    );
    const charactersData = await fs.readFile(charactersPath, "utf-8");
    const characters: Character[] = JSON.parse(charactersData);

    // Transform the data to only include required fields
    const simplifiedCharacters: CharacterListResponse[] = characters.map(
      (character) => ({
        id: character.id,
        name: character.name,
        profilePicture: character.profilePicture,
        displayDescription: character.displayDescription,
        tags: character.tags,
      })
    );

    return NextResponse.json(simplifiedCharacters);
  } catch (error) {
    console.error("Error processing character list request:", error);
    return NextResponse.json(
      {
        error: "Failed to retrieve character list",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
