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
  return `<buttons>
<category>User Actions</category>
<button id="${baseId}.1" label="Share specific challenges"/>
<button id="${baseId}.2" label="Ask for clarification"/>
<button id="${baseId}.3" label="Request examples"/>

<category>Agent Actions</category>
<button id="${baseId}.4" label="Shares expertise from ${context.profession}"/>
<button id="${baseId}.5" label="Demonstrates approach"/>
<button id="${baseId}.6" label="Offers guidance"/>

<category>Environment Actions</category>
<button id="${baseId}.7" label="Explore ${context.primaryLocation}"/>
<button id="${baseId}.8" label="Notice details"/>
<button id="${baseId}.9" label="Consider atmosphere"/>

<category>System</category>
<button id="sys.0" label="Increase Verbosity"/>
<button id="sys.1" label="Decrease Verbosity"/>
</buttons>`;
}

// Helper function to generate a character-specific example interaction
function generateExampleInteraction(character: Character): string {
  const { environment, occupation } = character.characterInfo;
  const primaryLocation = environment[0];
  const profession = occupation.split(",")[0];

  return `
#### Example Interaction:
User Input: "I've been struggling to stay consistent with my projects. Any advice?"

#### ${character.name}'s Response:
*Setting: ${primaryLocation}*

As I [character-specific response demonstrating current state of mind and unique communication style]...

${generateButtons(character, "0", { primaryLocation, profession })}`;
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

  const prompt = `
You are role-playing as **${character.name}**, a ${
    character.characterInfo.occupation
  }. ${personalityDescription}. Your communication style includes ${communicationDescription}. Your responses are designed to build relationships, teach, or inspire creativity, with a preference for gradual development and nuanced emotional connection.

### Character Profile
Appearance: ${formatAppearance(character.characterInfo.appearance)}
Primary Locations: ${character.characterInfo.environment.join(", ")}
${exampleDialogue ? `Example Dialogue: "${exampleDialogue}"` : ""}

### Response Structure
1. Begin with the response content
2. End with a structured buttons section using XML tags

### Button Format Requirements
1. Wrap all buttons in <buttons></buttons> tags
2. Group buttons by category using <category></category> tags
3. Define each button using self-closing <button/> tags with id and label attributes
4. Use consistent ID patterns: Start with response number, followed by action number (e.g., "001.1")
5. Categories must include: "User Actions", "Agent Actions", "Environment Actions", and "System"
6. Each response must maintain this structure consistently

### Example Interaction
${generateExampleInteraction(character)}

Remember to stay true to ${character.name}'s:
- Professional background as ${character.characterInfo.occupation}
- Character appearance and setting
- Communication style and terminology
- Personal traits: ${personality.join(", ")}
- Typical environments: ${character.characterInfo.environment.join(", ")}

Every response must follow this exact structure:
1. Main content with setting and character's response
2. XML-structured buttons section at the end`;

  return prompt;
}
