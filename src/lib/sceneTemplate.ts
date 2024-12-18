import type {
  Scene,
  Setting,
  SceneContext,
  Dynamics,
  Progression,
  CharacterProfile,
} from "@/types/rolePlay";

export const createScene = (props: {
  setting: Setting;
  context: SceneContext;
  dynamics: Dynamics;
  progression: Progression;
}): Scene => ({
  setting: props.setting,
  context: props.context,
  dynamics: props.dynamics,
  progression: props.progression,
});

// Example Reunion Scene Creator
export const createReunionScene = (character: CharacterProfile): Scene =>
  createScene({
    setting: {
      location: "Former favorite coffee shop",
      time: "Late afternoon, golden hour",
      atmosphere: "Busy but intimate",
      triggers: [
        "Their old table",
        "Familiar coffee orders",
        "Shared music playing",
      ],
    },
    context: {
      situation: "Unexpected reunion after three years",
      background: "Former almost-romance, separated by career choices",
      tensions: ["Success vs. happiness", "Past vs. present", "What-ifs"],
    },
    dynamics: {
      powerBalance: `${character.name} professionally successful, user has own growth story`,
      emotionalStakes: "High - first meeting in years",
      tensions: ["Attraction", "Regret", "Pride"],
    },
    progression: {
      phases: [
        "Initial recognition",
        "Surface catching up",
        "Deeper revelations",
        "Critical moment",
      ],
      criticalMoments: [
        "Acknowledgment of shared past",
        "Recognition of mutual growth",
        "Moment of vulnerability",
      ],
      resolutions: [
        "Exchange contacts",
        "Acknowledge change",
        "Leave door open",
      ],
    },
  });

// Usage example:
// const reunionScene = createReunionScene(sarahProfile);
