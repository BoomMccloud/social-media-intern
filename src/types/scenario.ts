export interface ScenarioCharacter {
  age: string[];
  gender: string[];
}

export interface Scenario {
  source: ScenarioCharacter[];
  target: ScenarioCharacter[];
  relationship: string[];
  setting: string[];
  scenario_description: string;
  popularity_score: number;
}

export interface ScenarioData {
  scenarios: Scenario[];
} 