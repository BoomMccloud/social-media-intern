// Response framework interfaces
// interface ActionButton {
//   id: string;
//   label: string;
//   reference?: string;
// }

interface SystemAction {
  command: "increase_verbosity" | "decrease_verbosity";
  label: string;
  description: string;
}

export interface Instructions {
  id: string;
  requirements: string[];
  structure: {
    exposition: {
      requirements: string[];
    };
    buttons: {
      categories: {
        user: {
          maxCount: number;
          description: string;
        };
        agent: {
          maxCount: number;
          description: string;
        };
        environment: {
          maxCount: number;
          description: string;
        };
      };
      format: {
        requirements: string[];
        example: string;
      };
    };
    systemActions: SystemAction[];
  };
  toneGuidelines: string[];
}
