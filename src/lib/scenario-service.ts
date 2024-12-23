import { ScenarioData } from '@/types/scenario';
import fs from 'fs';
import path from 'path';

export async function loadScenarios(): Promise<ScenarioData> {
  const scenarioPath = path.join(process.cwd(), 'scenario.json');
  const scenarioData = await fs.promises.readFile(scenarioPath, 'utf-8');
  return JSON.parse(scenarioData);
} 