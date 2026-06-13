// Unified Academic Intelligence Layer - SciForge AI
// Central orchestrator for all module services

import { saveRecentSession, addToPortfolio } from "./utils";
import { updateTelemetryOnAction, getUserStats } from "./telemetry";

// Module service interfaces
export interface ModuleResult {
  success: boolean;
  data?: any;
  type: string;
  topic?: string;
}

export interface MentorResponse {
  explanation: string;
  learningPath?: string[];
  suggestedActions: SuggestedAction[];
  contextTopic?: string;
  autoSave?: boolean;
}

export interface SuggestedAction {
  id: string;
  label: string;
  icon: string;
  module: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
}

// Current study context - persists across modules
let currentStudyTopic: string = "";
let studyContextHistory: string[] = [];

// Intent classification patterns
const INTENT_PATTERNS = {
  mentor: [
    /teach me/i, /explain/i, /how does/i, /why does/i, /what is/i, /what are/i,
    /tell me about/i, /describe/i, /understand/i, /learn/i, /help me/i,
    /can you/i, /could you/i, /show me/i, /walk me through/i
  ],
  notes: [
    /generate notes/i, /create notes/i, /take notes/i, /write notes/i,
    /summarize/i, /documentation/i, /lecture notes/i, /study notes/i
  ],
  quiz: [
    /quiz me/i, /test me/i, /generate quiz/i, /ask me/i, /practice/i,
    /exam/i, /question me/i, /check my knowledge/i
  ],
  research: [
    /research/i, /investigate/i, /find out/i, /explore/i, /study deeper/i,
    /scientific/i, /paper/i, /journal/i, /scholarly/i
  ],
  scribble: [
    /analyze/i, /check.*equation/i, /verify/i, /solve/i, /calculation/i,
    /math/i, /problem/i, /derivation/i, /formula/i
  ],
  dependencymap: [
    /roadmap/i, /prerequisite/i, /dependency/i, /concept map/i, /structure/i,
    /learning path/i, /build.*understanding/i
  ],
  propulsion: [
    /study plan/i, /schedule/i, /plan my study/i, /track.*progress/i,
    /learning goal/i, /milestone/i, /deadline/i
  ]
};

// Classify user intent
export function classifyIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  for (const [intent, patterns] of Object.entries(INTENT_PATTERNS)) {
    if (patterns.some(pattern => pattern.test(lowerMessage))) {
      return intent;
    }
  }
  
  // Default to mentor mode for general queries
  return "mentor";
}

// Set current study topic
export function setStudyTopic(topic: string): void {
  currentStudyTopic = topic;
  if (topic && !studyContextHistory.includes(topic)) {
    studyContextHistory.push(topic);
    // Keep only last 10 topics
    if (studyContextHistory.length > 10) {
      studyContextHistory = studyContextHistory.slice(-10);
    }
  }
}

// Get current study topic
export function getStudyTopic(): string {
  return currentStudyTopic;
}

// Get study context history
export function getStudyContextHistory(): string[] {
  return [...studyContextHistory];
}

// Generate workspace recommendations based on context
export function generateRecommendations(currentTopic: string, userStats: any): SuggestedAction[] {
  const recommendations: SuggestedAction[] = [];
  
  if (!currentTopic) return recommendations;
  
  // High priority - based on current topic
  recommendations.push({
    id: "notes-" + Date.now(),
    label: "Create Detailed Notes",
    icon: "📘",
    module: "notes",
    action: "generate",
    priority: "high"
  });
  
  recommendations.push({
    id: "quiz-" + Date.now(),
    label: "Test My Knowledge",
    icon: "🧠",
    module: "quiz",
    action: "generate",
    priority: "high"
  });
  
  // Medium priority - learning path
  recommendations.push({
    id: "roadmap-" + Date.now(),
    label: "View Concept Dependency Map",
    icon: "🗺",
    module: "dependencymap",
    action: "view",
    priority: "medium"
  });
  
  recommendations.push({
    id: "studyplan-" + Date.now(),
    label: "Build Study Plan",
    icon: "🚀",
    module: "progress",
    action: "generate",
    priority: "medium"
  });
  
  // Low priority - exploration
  recommendations.push({
    id: "research-" + Date.now(),
    label: "Research Advanced Applications",
    icon: "🔬",
    module: "scientist",
    action: "generate",
    priority: "low"
  });
  
  // Check user stats to adjust priorities
  if (userStats) {
    if (userStats.notesGenerated === 0) {
      recommendations[0].priority = "high";
    }
    if (userStats.quizzesCompleted < 3) {
      recommendations[1].priority = "high";
    }
  }
  
  return recommendations;
}

// Format learning path from topic analysis
export function formatLearningPath(topic: string, concepts: string[]): string[] {
  if (!concepts || concepts.length === 0) {
    // Generate basic learning path
    return [
      `Introduction to ${topic}`,
      `Core Principles of ${topic}`,
      `Applications of ${topic}`,
      `Advanced ${topic} Concepts`
    ];
  }
  return concepts;
}

// Auto-save artifact to Research Portfolio
export function autoSaveArtifact(module: string, topic: string, data: any): void {
  const timestamp = new Date().toISOString();
  
  try {
    addToPortfolio(module, topic, {
      ...data,
      savedAt: timestamp,
      autoSaved: true
    });
    
    updateTelemetryOnAction(`${module}_auto_saved`, { topic });
  } catch (error) {
    console.error("Auto-save failed:", error);
  }
}

// Generate insight based on user progress
export function generateInsight(userStats: any): string | null {
  if (!userStats) return null;
  
  const insights: string[] = [];
  
  // Topic-specific insights
  if (userStats.topicsLearned > 0) {
    const recentTopics = userStats.recentTopics || [];
    if (recentTopics.length > 0) {
      insights.push(`You've been studying ${recentTopics[0]}. Great focus!`);
    }
  }
  
  // Strength/weakness analysis
  if (userStats.quizScores && userStats.quizScores.length > 0) {
    const avgScore = userStats.quizScores.reduce((a: number, b: number) => a + b, 0) / userStats.quizScores.length;
    if (avgScore < 70) {
      insights.push("Consider reviewing earlier topics before moving forward.");
    } else if (avgScore > 90) {
      insights.push("Excellent performance! You're ready for advanced challenges.");
    }
  }
  
  // Learning streak
  if (userStats.streakDays && userStats.streakDays > 3) {
    insights.push(`${userStats.streakDays}-day learning streak! Keep it up!`);
  }
  
  return insights.length > 0 ? insights[0] : null;
}

// Build mentor response with all components
export function buildMentorResponse(
  explanation: string,
  topic: string,
  concepts: string[] = [],
  userStats: any = null
): MentorResponse {
  // Update current study context
  setStudyTopic(topic);
  
  // Build learning path
  const learningPath = formatLearningPath(topic, concepts);
  
  // Generate recommendations
  const suggestedActions = generateRecommendations(topic, userStats);
  
  return {
    explanation,
    learningPath,
    suggestedActions,
    contextTopic: topic,
    autoSave: true
  };
}

// Export all services for external use
export const IntelligenceServices = {
  classifyIntent,
  setStudyTopic,
  getStudyTopic,
  getStudyContextHistory,
  generateRecommendations,
  formatLearningPath,
  autoSaveArtifact,
  generateInsight,
  buildMentorResponse
};

export default IntelligenceServices;