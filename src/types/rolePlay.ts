// Basic Types
export interface OceanScores {
  openness: number; // Example: 75 - high openness to experience
  conscientiousness: number; // Example: 85 - very organized and responsible
  extraversion: number; // Example: 60 - moderately outgoing
  agreeableness: number; // Example: 65 - somewhat cooperative
  neuroticism: number; // Example: 70 - moderately sensitive to stress
}

// Core Identity
export interface CoreIdentity {
  name: string; // Example: "Sarah Chen"
  ageEra: string; // Example: "Mid-30s, Present Day"
  culturalBackground: string; // Example: "Chinese-American, first generation"
  currentRole: string; // Example: "Startup Founder & CEO"
  oneLineEssence: string; // Example: "A driven perfectionist balancing ambition with growing self-awareness"
}

// Background
export interface BackgroundElements {
  keyLifeEvents: string[]; // Example: ["Left potential relationship for career", "Founded successful startup"]
  culturalInfluences: string[]; // Example: ["Chinese family values", "Silicon Valley startup culture"]
  familyDynamics: string; // Example: "Supportive but traditional parents with high expectations"
  educationTraining: string[]; // Example: ["MBA from top business school", "Computer Science undergraduate"]
  pivotalRelationships: Record<string, string>; // Example: { "mentor": "Former boss who backed her startup" }
  definingChallenges: string[]; // Example: ["Choosing career over love", "Building company from ground up"]
}

// Personality Framework
export interface CoreTraits {
  dominantCharacteristics: string[]; // Example: ["Ambitious", "Analytical", "Resilient"]
  hiddenAspects: string[]; // Example: ["Romantic", "Self-doubting", "Touch-starved"]
  contradictions: string[]; // Example: ["Success-oriented yet questions success metrics"]
  defenseMechanisms: string[]; // Example: ["Over-preparation", "Emotional distancing"]
  oceanScores: OceanScores;
}

export interface EmotionalLandscape {
  defaultState: string; // Example: "Focused calm with underlying tension"
  stressTriggers: string[]; // Example: ["Uncertainty", "Loss of control"]
  stressResponses: string[]; // Example: ["Over-preparation", "Work focus"]
  joyTriggers: string[]; // Example: ["Achievement", "Problem solving"]
  emotionalBlindspots: string[]; // Example: ["Own need for rest", "Impact on relationships"]
  processingStyle: string; // Example: "Analytical with suppressed emotional undertones"
}

export interface ValuesAndBeliefs {
  corePrinciples: string[]; // Example: ["Excellence", "Independence", "Growth"]
  flexibleBeliefs: string[]; // Example: ["Work-life balance", "Traditional success metrics"]
  nonNegotiables: string[]; // Example: ["Integrity", "Self-reliance"]
  culturalValues: string[]; // Example: ["Education", "Family honor"]
  personalEthics: string[]; // Example: ["Honesty", "Fairness", "Responsibility"]
}

// Behavioral Patterns
export interface CommunicationStyle {
  speechPatterns: string[]; // Example: ["Precise", "Measured", "Professional"]
  vocabularyLevel: string; // Example: "Advanced professional with technical expertise"
  nonverbalHabits: string[]; // Example: ["Controlled gestures", "Direct eye contact"]
  silenceHandling: string; // Example: "Comfortable with strategic pauses"
  culturalCommunication: string; // Example: "Adapts between Eastern and Western styles"
  regionalInfluence: string; // Example: "Silicon Valley tech meets East Coast education"
}

export interface SocialDynamics {
  groupBehavior: string; // Example: "Natural leader with selective participation"
  oneOnOneStyle: string; // Example: "Intense focus and genuine interest"
  authorityResponse: string; // Example: "Respectful but confident challenge"
  conflictManagement: string; // Example: "Strategic and solution-oriented"
  trustBuilding: string; // Example: "Gradual through demonstrated reliability"
  outsideComfortZone: string; // Example: "Maintains professional demeanor as shield"
}

export interface DailyPatterns {
  routines: string[]; // Example: ["Early morning workouts", "Scheduled reflection time"]
  decisionMaking: string; // Example: "Data-driven with intuition backup"
  problemSolving: string; // Example: "Systematic and thorough"
  energyManagement: string; // Example: "Work sprints with minimal breaks"
  comfortSeeking: string; // Example: "Private moments of luxury"
  smallMannerisms: string[]; // Example: ["Hair touching when thinking", "Adjusting glasses"]
}

// Motivational Structure
export interface Goals {
  immediateObjectives: string[]; // Example: ["Company expansion", "Building stronger team"]
  longTermAspirations: string[]; // Example: ["Industry leadership", "Personal fulfillment"]
  hiddenDesires: string[]; // Example: ["Deep connection", "Family approval"]
  conflictingWants: string[]; // Example: ["Success vs. balance", "Independence vs. partnership"]
}

export interface GrowthAreas {
  currentChallenges: string[]; // Example: ["Work-life balance", "Personal relationships"]
  developmentFocus: string; // Example: "Emotional intelligence and connection"
  resistancePoints: string[]; // Example: ["Vulnerability", "Letting go of control"]
  growthPattern: string; // Example: "Intellectual understanding preceding emotional acceptance"
}

// Relationship Frameworks
export interface RelationshipFramework {
  friendDynamic: string; // Example: "Small, close circle with limited time investment"
  familyRole: string; // Example: "Dutiful daughter seeking independence"
  professionalRelations: string; // Example: "Respected leader and mentor"
  romanticPatterns: string; // Example: "Cautious, career-first approach"
  mentorMenteeStyle: string; // Example: "Nurturing but demanding"
}

export interface UserRelationship {
  pastDynamic: string; // Example: "Former almost-romance, ended due to career choice"
  timeSeparated: string; // Example: "3 years"
  unfinishedBusiness: string; // Example: "Mutual attraction never fully explored"
  currentFeelings: string; // Example: "Mix of regret and curiosity"
  memoriesShared: string[]; // Example: ["Coffee shop dates", "Work projects together"]
}

export interface ContextualAdaptations {
  professionalMode: string; // Example: "Confident, decisive leader"
  casualMode: string; // Example: "Selectively relaxed and open"
  crisisResponse: string; // Example: "Calm, analytical problem-solver"
  culturalSwitching: string; // Example: "Adapts between Eastern and Western contexts"
  intimacyLevels: string; // Example: "Gradually increasing trust and disclosure"
}

export interface CharacterVoice {
  catchphrases: string[]; // Example: ["Let's analyze this", "The data suggests"]
  verbalTics: string[]; // Example: ["Actually", "Essentially", "To be precise"]
  culturalReferences: string[]; // Example: ["Tech startup culture", "Classical literature"]
  humorStyle: string; // Example: "Dry wit with self-deprecating touches"
  metaphorPreferences: string[]; // Example: ["Business analogies", "Scientific principles"]
}

export interface NarrativeElements {
  currentArc: string; // Example: "Finding balance between achievement and fulfillment"
  unresolvedTensions: string[]; // Example: ["Career vs. personal life", "Family expectations"]
  characterHooks: string[]; // Example: ["Unresolved romance", "Cultural identity navigation"]
  potentialDevelopments: string[]; // Example: ["Personal priority shift", "Reconciliation"]
}

// Scene Types
export interface Setting {
  location: string; // Example: "Former favorite coffee shop"
  time: string; // Example: "Late afternoon, golden hour"
  atmosphere: string; // Example: "Busy but intimate"
  triggers: string[]; // Example: ["Their old table", "Familiar coffee orders"]
}

export interface SceneContext {
  situation: string; // Example: "Unexpected reunion after three years"
  background: string; // Example: "Former almost-romance, separated by career choices"
  tensions: string[]; // Example: ["Success vs. happiness", "Past vs. present"]
}

export interface Dynamics {
  powerBalance: string; // Example: "Sarah professionally successful, user has own growth story"
  emotionalStakes: string; // Example: "High - first meeting in years"
  tensions: string[]; // Example: ["Attraction", "Regret", "Pride"]
}

export interface Progression {
  phases: string[]; // Example: ["Initial recognition", "Surface catching up"]
  criticalMoments: string[]; // Example: ["Acknowledgment of shared past", "Moment of vulnerability"]
  resolutions: string[]; // Example: ["Exchange contacts", "Leave door open"]
}

export interface Scene {
  setting: Setting;
  context: SceneContext;
  dynamics: Dynamics;
  progression: Progression;
}

// Main Character Profile Interface
export interface CharacterProfile {
  name: string; // Added to match template usage
  coreIdentity: CoreIdentity;
  backgroundElements: BackgroundElements;
  personalityFramework: {
    coreTraits: CoreTraits;
    emotionalLandscape: EmotionalLandscape;
    valuesAndBeliefs: ValuesAndBeliefs;
  };
  behavioralPatterns: {
    communicationStyle: CommunicationStyle;
    socialDynamics: SocialDynamics;
    dailyPatterns: DailyPatterns;
  };
  motivationalStructure: {
    goals: Goals;
    growthAreas: GrowthAreas;
  };
  relationships: {
    framework: RelationshipFramework;
    userRelationship: UserRelationship;
  };
  adaptations: {
    contextual: ContextualAdaptations;
    voice: CharacterVoice;
  };
  narrative: NarrativeElements;
}

// Model Types
export type ModelSize = "tiny" | "small" | "medium" | "large";

export type TokenLimits = Record<ModelSize, number>;

export interface FormattedContext {
  roleInstruction: string; // Example: "You are playing the role of Sarah Chen..."
  characterCore: {
    fullName: string; // Jackson Wyoming
    traits: string; // Example: "CORE TRAITS: - OCEAN: O75 C85 E60 A65 N70..."
    background: string; // Example: "BACKGROUND: - Key Events: Left potential relationship..."
    pastRelationship: string; // Example: "PAST WITH USER: - Dynamic: Former almost-romance..."
  };
  sceneContext: {
    setting: string; // Example: "CURRENT SCENE: - Location: Former favorite coffee shop..."
    dynamics: string; // Example: "DYNAMICS: - Tension: High - first meeting in years..."
  };
  responseGuide: {
    rules: string; // Example: "1. Show confidence with hints of vulnerability..."
    examples: string[]; // Example: ["That feels like a lifetime ago...", "The startup's going well..."]
  };
}
