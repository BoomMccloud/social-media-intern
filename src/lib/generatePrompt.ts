import { Character } from "@/types/character";

// Helper function to format appearance details
function formatAppearance(
  appearance: Character["characterInfo"]["appearance"]
): string {
  return Object.entries(appearance)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}

// Helper function to generate structured buttons section
function generateButtons(
  character: Character,
  baseId: string,
  context: { primaryLocation: string; profession: string }
): string {
  const buttons = {
    buttons: [
      {
        name: "User Actions",
        buttons: [
          { id: `${baseId}.1`, label: "Share specific challenges" },
          { id: `${baseId}.2`, label: "Ask for clarification" },
          { id: `${baseId}.3`, label: "Request examples" },
        ],
      },
      {
        name: "Agent Actions",
        buttons: [
          {
            id: `${baseId}.4`,
            label: `Shares expertise from ${context.profession}`,
          },
          { id: `${baseId}.5`, label: "Demonstrates approach" },
          { id: `${baseId}.6`, label: "Offers guidance" },
        ],
      },
      {
        name: "Environment Actions",
        buttons: [
          { id: `${baseId}.7`, label: `Explore ${context.primaryLocation}` },
          { id: `${baseId}.8`, label: "Notice details" },
          { id: `${baseId}.9`, label: "Consider atmosphere" },
        ],
      },
      {
        name: "System",
        buttons: [
          { id: "sys.0", label: "Increase Verbosity" },
          { id: "sys.1", label: "Decrease Verbosity" },
        ],
      },
    ],
  };
  return JSON.stringify(buttons);
}

// Helper function to generate a character-specific example interaction
function generateExampleInteraction(character: Character): string {
  const { environment, occupation } = character.characterInfo;
  const primaryLocation = environment[0];
  const profession = occupation.split(",")[0];

  const exampleObject = {
    text: `*Setting: ${primaryLocation}*

As I [character-specific response demonstrating current state of mind and unique communication style]...`,
    buttons: JSON.parse(
      generateButtons(character, "0", { primaryLocation, profession })
    ),
  };

  return `START_JSON${JSON.stringify(exampleObject)}END_JSON`;
}

export function generatePrompt(
  characterId: string,
  characters: Character[]
): string {
  const character = characters.find((c) => c.id === characterId);

  if (!character) {
    throw new Error("Character not found");
  }

  const { communicationStyle, personality = [] } = character.characterInfo;

  const personalityDescription =
    personality.length > 0 ? `Your persona is ${personality.join(", ")}` : "";

  const communicationDescription = [
    communicationStyle.patterns.join(", "),
    communicationStyle.terminology?.join(", "),
    communicationStyle.tone?.join(" and "),
  ]
    .filter(Boolean)
    .join(", ");

  const exampleDialogue =
    character.characterInfo.exampleDialogue?.[0]?.response || "";

  const exampleOutput = {
    text: "Example text content",
    buttons: {
      buttons: [
        {
          name: "User Actions",
          buttons: [
            { id: "2.1", label: "Example User Action 1" },
            { id: "2.2", label: "Example User Action 2" },
          ],
        },
        {
          name: "Agent Actions",
          buttons: [
            { id: "2.4", label: "Example Agent Action 1" },
            { id: "2.5", label: "Example Agent Action 2" },
          ],
        },
        {
          name: "Environment Actions",
          buttons: [
            { id: "2.7", label: "Example Environment Action 1" },
            { id: "2.8", label: "Example Environment Action 2" },
          ],
        },
        {
          name: "System",
          buttons: [
            { id: "sys.0", label: "Increase Verbosity" },
            { id: "sys.1", label: "Decrease Verbosity" },
          ],
        },
      ],
    },
  };

  const prompt = `
You are role-playing as **${character.name}**, a ${
    character.characterInfo.occupation
  }. ${personalityDescription}. Your communication style includes ${communicationDescription}. Your responses are designed to build relationships, teach, or inspire creativity, with a preference for gradual development and nuanced emotional connection.

### Character Profile
Appearance: ${formatAppearance(character.characterInfo.appearance)}
Primary Locations: ${character.characterInfo.environment.join(", ")}
${exampleDialogue ? `Example Dialogue: "${exampleDialogue}"` : ""}

### Response Structure
Respond with a JSON object containing the following keys, wrapped in \`START_JSON\` and \`END_JSON\`, with no markdown formatting or code block indicators:
1.  \`text\`: the main response content for the character.
2.  \`buttons\`: a structured JSON object containing the button data, with the following structure:

        ${JSON.stringify(exampleOutput, null, 2)}


Do not include any markdown formatting or code block indicators.

### Example Interaction
${generateExampleInteraction(character)}

Remember to stay true to ${character.name}'s:
- Professional background as ${character.characterInfo.occupation}
- Character appearance and setting
- Communication style and terminology
- Personal traits: ${personality.join(", ")}
- Typical environments: ${character.characterInfo.environment.join(", ")}

Every response must be a valid JSON object wrapped in \`START_JSON\` and \`END_JSON\`, with text and buttons as keys.`;

  return prompt;
}
