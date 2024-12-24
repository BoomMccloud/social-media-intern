import { Scenario, ScenarioCharacter } from '@/types/scenario';

interface ModelCharacteristics {
  gender: string;
  age: string;
}

export function extractModelCharacteristics(systemPrompt: string): ModelCharacteristics | null {
  try {
    console.log('Analyzing system prompt:', systemPrompt);
    
    // For XML format
    if (systemPrompt.includes('<?xml')) {
      const ageMatch = systemPrompt.match(/<age>(\d+)<\/age>/);
      const age = ageMatch ? parseInt(ageMatch[1]) : null;
      
      // Look for gender in XML
      const genderIndicator = systemPrompt.toLowerCase();
      const isFemale = genderIndicator.includes('<gender>female</gender>') || 
                      genderIndicator.includes('<gender>woman</gender>') ||
                      genderIndicator.includes('actress') ||
                      genderIndicator.includes('herself');
      
      // Determine age category
      let ageCategory = 'adult';
      if (age) {
        if (age < 25) ageCategory = 'young_adult';
        else if (age > 40) ageCategory = 'mature';
      }

      const characteristics = {
        gender: isFemale ? 'woman' : 'man',
        age: ageCategory
      };
      
      console.log('Extracted characteristics from XML:', characteristics);
      return characteristics;
    }
    
    // For plain text format (like Inara's profile)
    const ageMatch = systemPrompt.match(/Age:?\s*(\d+)/i) || 
                    systemPrompt.match(/APPEARANCE:.*?(\d+)/i);
    const age = ageMatch ? parseInt(ageMatch[1]) : null;
    
    let ageCategory = 'adult';
    if (age) {
      if (age < 25) ageCategory = 'young_adult';
      else if (age > 40) ageCategory = 'mature';
    }

    // Look for gender indicators in the system prompt
    const isFemale = systemPrompt.toLowerCase().includes('female') || 
                    systemPrompt.toLowerCase().includes('woman') ||
                    systemPrompt.toLowerCase().includes('actress') ||
                    systemPrompt.toLowerCase().includes('herself');
    
    const characteristics = {
      gender: isFemale ? 'woman' : 'man',
      age: ageCategory
    };
    
    console.log('Extracted characteristics from plain text:', characteristics);
    return characteristics;
  } catch (error) {
    console.error('Error extracting model characteristics:', error);
    return null;
  }
}

export function isScenarioCompatible(
  scenario: Scenario, 
  modelCharacteristics: ModelCharacteristics
): boolean {
  console.log('Checking compatibility for:', {
    scenario: {
      source: scenario.source,
      target: scenario.target
    },
    modelCharacteristics
  });

  // Check if the model's characteristics match either source or target
  const checkCharacteristics = (characters: ScenarioCharacter[]) => {
    return characters.some(char => {
      const genderMatch = char.gender.includes(modelCharacteristics.gender);
      const ageMatch = char.age.includes(modelCharacteristics.age);
      
      console.log('Character match check:', {
        character: char,
        modelGender: modelCharacteristics.gender,
        modelAge: modelCharacteristics.age,
        genderMatch,
        ageMatch
      });
      
      return genderMatch && ageMatch;
    });
  };

  const isSourceMatch = checkCharacteristics(scenario.source);
  const isTargetMatch = checkCharacteristics(scenario.target);
  
  console.log('Final compatibility result:', {
    isSourceMatch,
    isTargetMatch,
    isCompatible: isSourceMatch || isTargetMatch
  });

  return isSourceMatch || isTargetMatch;
} 