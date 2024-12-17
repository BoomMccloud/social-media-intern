// src/app/api/chat/route.ts
import { ChatService } from "@/utils/vertexai";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

const keyFilename = path.join(process.cwd(), "secrets", "speak-to-me.json");

const defaultParameters = {
  max_new_tokens: 64,
  temperature: 1.0,
  top_p: 0.9,
  top_k: 10,
};

const chatService = new ChatService(
  process.env.GOOGLE_PROJECT_ID!,
  process.env.VERTEX_LOCATION!,
  process.env.ENDPOINT_ID!,
  keyFilename
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { system, user } = body;

    if (typeof system !== "string" || !system.trim()) {
      return NextResponse.json(
        { error: 'Invalid request body. "system" must be a non-empty string.' },
        { status: 400 }
      );
    }

    if (typeof user !== "string" || !user.trim()) {
      return NextResponse.json(
        { error: 'Invalid request body. "user" must be a non-empty string.' },
        { status: 400 }
      );
    }

    try {
      const response = await chatService.generateResponse(
        { system, user },
        defaultParameters
      );
      return NextResponse.json({ response });
    } catch (error: any) {
      console.error("Prediction error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Request error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
