import { NextResponse } from 'next/server';
import { loadScenarios } from '@/lib/scenario-service';

export async function GET() {
  try {
    const scenarios = await loadScenarios();
    return NextResponse.json(scenarios);
  } catch (error) {
    console.error('Error loading scenarios:', error);
    return NextResponse.json(
      { error: 'Failed to load scenarios' },
      { status: 500 }
    );
  }
} 