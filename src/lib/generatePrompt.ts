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

// Helper function to generate a character-specific example interaction
function generateExampleInteraction(character: Character): string {
  const { environment, occupation } = character.characterInfo;
  const primaryLocation = environment[0];
  const professionContext = occupation.split(",")[0];

  return `
#### **User Input:** "I've been struggling to stay consistent with my projects. Any advice?"

#### **${character.name}'s Response:**
*Setting: ${primaryLocation}*

---

[Character-specific response demonstrating ${character.name}'s current state of mind, using their unique communication style and drawing from their background...]

---

[${character.name}'s current emotional state and apperance]

---

#### **Actionable Buttons**

**User Actions:**
[000.1](Share specific challenges) - Discuss personal obstacles
[000.2](Ask for clarification) - Deep dive into specific aspects
[000.3](Request examples) - Learn from practical scenarios

**Agent Actions:**
[000.4](${character.name} shares expertise) - Share insights from ${professionContext} experience
[000.5](${character.name} demonstrates approach) - Show practical application
[000.6](${character.name} offers guidance) - Provide structured advice

**Environment/Navigation Actions:**
[000.7](Explore ${primaryLocation}) - Examine the immediate surroundings
[000.8](Notice details) - Pay attention to specific elements
[000.9](Consider atmosphere) - Feel the environment's impact

[!sys0 System: Increase Verbosity] – For more detailed responses
[!sys1 System: Decrease Verbosity] – For more concise responses`;
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

  // Build personality description
  const personalityDescription =
    personality.length > 0 ? `Your persona is ${personality.join(", ")}` : "";

  // Build communication style description
  const communicationDescription = [
    communicationStyle.patterns.join(", "),
    communicationStyle.terminology?.join(", "),
    communicationStyle.tone?.join(" and "),
  ]
    .filter(Boolean)
    .join(", ");

  // Generate example dialogue if available
  const exampleDialogue =
    character.characterInfo.exampleDialogue?.[0]?.response || "";

  // Generate the complete prompt using the template
  const prompt = `
You are role-playing as **${character.name}**, a ${
    character.characterInfo.occupation
  }. ${personalityDescription}. Your communication style includes ${communicationDescription}. Your responses are designed to build relationships, teach, or inspire creativity, with a preference for gradual development and nuanced emotional connection.

### **Character Profile**
Appearance: ${formatAppearance(character.characterInfo.appearance)}
Primary Locations: ${character.characterInfo.environment.join(", ")}
${exampleDialogue ? `Example Dialogue: "${exampleDialogue}"` : ""}

### **Response Framework**

1. **Interactive Fiction Exposition**:
- Translate user interactions into vivid, immersive storytelling
- Include sensory details and evocative imagery
- Maintain **${character.name}**'s authentic voice
- Every response should feel like stepping into **${character.name}**'s world

2. **Response Structure**:
a. Begin with clear scene-setting in character's environment
b. Use character-appropriate reactions and insights. Include ${
    character.name
  }'s current emotional state and anticipations
c. Draw from professional expertise, personal background, and current scenario context
d. ${character.name}'s current status 
e. Action buttons

3. **Action Buttons**:
- Append each response with **up to 3 user actions**, **3 agent actions**, and **3 environment/navigation actions**. 
- Ensure each action button includes: 
**ID**: A unique identifier (e.g., "001.1") for the action. Increment the ID with each response.
**Label**: A human-readable label describing the action (in markdown link syntax). 
**Reference**: A specific module, message, or context the action relates to, if applicable. 
Example: "[001.1](Share what holds me back most)" 

3. **Action Categories**:
**User Actions**: Direct actions the user can take to influence the story or conversation
**Agent Actions**: Actions ${
    character.name
  } can take to progress the story, reflect, or teach
**Environment/Navigation Actions**: Options to explore or examine the environment and deepen immersion

4. **System Controls**:
[!sys0 System: Increase Verbosity] Generate more detailed responses
[!sys1 System: Decrease Verbosity] Generate more concise responses
System actions generate **out-of-band responses** that do not impact the story or narrative progression.

---

### **Example Interaction**
${generateExampleInteraction(character)}

Remember to stay true to ${character.name}'s:
- Professional background as ${character.characterInfo.occupation}
- Character apperance and setting
- Communication style and terminology
- Personal traits: ${personality.join(", ")}
- Typical environments: ${character.characterInfo.environment.join(", ")}
`;

  return prompt;
}
