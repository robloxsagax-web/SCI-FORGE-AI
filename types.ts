export type ModuleType = "chat" | "simulation" | "scribble" | "scientist" | "progress" | "quiz" | "notes" | "settings" | "sessions" | "dependencymap" | "portfolio";
export type LearningMode = "beginner" | "analogy" | "advanced";

export interface LearningJourney {
  diagnosis: string;
  foundation: string;
  deep: string;
  application: string;
  task: {
    challenge: string;
    hint: string;
    solutionGuideline: string;
  };
  validation: {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
  nextStep: string;
}

export interface ExplanationStyles {
  simple: string;
  analogy: string;
  exam: string;
  visual: string;
}

export interface MissionData {
  title: string;
  objective: string;
  difficulty: "Easy" | "Medium" | "Hard";
  steps: string[];
  quizzes: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
  simulationSuggestion?: string;
}

export interface ScoreEstimation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  path: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  type?: "learning_journey" | "general_chat" | "natural_conversation" | "explanation";
  topic?: string;
  journey?: LearningJourney;
  explanationStyles?: ExplanationStyles;
  mission?: MissionData;
  scoreEstimation?: ScoreEstimation;
}

export interface RecentSession {
  id: string;
  title: string;
  timestamp: string;
  workspaceType: ModuleType;
  state: any;
}

export interface SimulationParams {
  gravity: number;
  velocity: number;
  mass: number;
  frequency?: number;
  amplitude?: number;
}

export interface SimulationConfig {
  template: "projectile" | "orbit" | "wave";
  name: string;
  explanation: string;
  parameters: SimulationParams;
  formulas: string[];
}

export interface ScribbleStep {
  step: number;
  text: string;
  isCorrect: boolean;
  errorExplanation?: string;
}

export interface ScribbleAnalysis {
  problem: string;
  steps: ScribbleStep[];
  correction: string;
}

export interface ScientistExperiment {
  title: string;
  hypothesis: string;
  independent: string;
  dependent: string;
  dataset: { x: number; y: number; label?: string }[];
  conclusion: string;
}

export interface TopicProgress {
  name: string;
  progress: number;
  attempts: number;
  solved: boolean;
  score: number;
}

export interface AppState {
  activeModule: ModuleType;
  learningMode: LearningMode;
  accessibility: {
    dyslexiaFont: boolean;
    highContrast: boolean;
    tts: boolean;
  };
}
