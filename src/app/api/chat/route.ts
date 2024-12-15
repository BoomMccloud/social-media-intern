// src/app/api/chat/route.ts
import { ChatService, ModelConfig } from '@/utils/vertexai';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

const keyFilename = path.join(process.cwd(), 'secrets', 'speak-to-me.json');

const modelConfig: ModelConfig = {
  endpointId: process.env.ENDPOINT_ID!,
  deployedModelId: process.env.DEPLOYED_MODEL_ID!
};

const chatService = new ChatService(
  process.env.GOOGLE_PROJECT_ID!,
  process.env.VERTEX_LOCATION!,
  modelConfig,
  keyFilename
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content } = body;

    // Validate content
    if (typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: 'Invalid request body. "content" must be a non-empty string.' },
        { status: 400 }
      );
    }

    // Add system instruction to the content
    const fullPrompt = "Always answer in rhymes.\n\nUser: " + content;
    
    const response = await chatService.generateResponse(fullPrompt);
    
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}