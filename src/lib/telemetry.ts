import { ModuleType } from "../types";

export interface TopicMastery {
  name: string;
  score: number;
  attempts: number;
  validated: boolean;
}

export interface TelemetryState {
  focusScore: number; // 0 to 100
  streakDays: number; // 0+
  labHours: number; // 0+ representing total hours (e.g. cumulative compute hours)
  understandingScore: number; // 0 to 100
  
  // Real behavioral trackers
  notesGeneratedCount: number;
  quizzesCompletedCount: number;
  quizCorrectAnswers: number;
  quizTotalAnswers: number;
  scribbleAnalysisCount: number;
  scribbleStruggledCount: number;
  simulationsExecutedCount: number;
  researchInvestigationsCount: number;
  totalSessionDurationSeconds: number;
  
  // New behavioral trackers for global ecosystem sync
  explorerExperiencesCount: number;
  dependencyMapViewsCount: number;
  
  streakTimestamps: string[]; // ISO Date Strings
  topicMasteries: TopicMastery[];
  strengths: string[];
  weaknesses: string[];
  adaptiveMentorPathway: string;
}

// Computed stats for dashboard
export interface DashboardStats {
  questionsAnswered: number;
  notesGenerated: number;
  quizzesCompleted: number;
  researchProjects: number;
  scribbleAnalyzed: number;
  simulationsRun: number;
  streakDays: number;
  focusScore: number;
}

const DEFAULT_TELEMETRY: TelemetryState = {
  focusScore: 0,
  streakDays: 0,
  labHours: 0,
  understandingScore: 0,
  notesGeneratedCount: 0,
  quizzesCompletedCount: 0,
  quizCorrectAnswers: 0,
  quizTotalAnswers: 0,
  scribbleAnalysisCount: 0,
  scribbleStruggledCount: 0,
  simulationsExecutedCount: 0,
  researchInvestigationsCount: 0,
  totalSessionDurationSeconds: 0,
  explorerExperiencesCount: 0,
  dependencyMapViewsCount: 0,
  streakTimestamps: [],
  topicMasteries: [],
  strengths: [],
  weaknesses: [],
  adaptiveMentorPathway: "Awaiting Activity"
};

export function getTelemetry(): TelemetryState {
  if (typeof window === "undefined") return DEFAULT_TELEMETRY;
  const saved = localStorage.getItem("sciforge_global_telemetry_v2");
  if (!saved) {
    localStorage.setItem("sciforge_global_telemetry_v2", JSON.stringify(DEFAULT_TELEMETRY));
    return DEFAULT_TELEMETRY;
  }
  try {
    return JSON.parse(saved);
  } catch (err) {
    return DEFAULT_TELEMETRY;
  }
}

export function getDashboardStats(): DashboardStats {
  const t = getTelemetry();
  return {
    questionsAnswered: t.quizCorrectAnswers,
    notesGenerated: t.notesGeneratedCount,
    quizzesCompleted: t.quizzesCompletedCount,
    researchProjects: t.researchInvestigationsCount,
    scribbleAnalyzed: t.scribbleAnalysisCount,
    simulationsRun: t.simulationsExecutedCount,
    streakDays: t.streakDays,
    focusScore: t.focusScore
  };
}

// Get full user stats for intelligence layer
export function getUserStats(): {
  questionsAsked: number;
  topicsLearned: number;
  notesGenerated: number;
  quizzesCompleted: number;
  researchSessions: number;
  studyHours: number;
  streakDays: number;
  recentTopics: string[];
  quizScores: number[];
  topicsMastered: string[];
  weakTopics: string[];
  insights: string[];
} {
  const t = getTelemetry();
  
  // Calculate derived stats
  const topicsLearned = t.topicMasteries.filter(m => m.attempts > 0).length;
  const quizScores = t.topicMasteries
    .filter(m => m.score > 0)
    .map(m => m.score);
  const avgQuizScore = quizScores.length > 0 
    ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length 
    : 0;
  
  // Identify mastered topics (score >= 80%)
  const topicsMastered = t.topicMasteries
    .filter(m => m.score >= 80)
    .map(m => m.name);
  
  // Identify weak topics (score < 60% after multiple attempts)
  const weakTopics = t.topicMasteries
    .filter(m => m.attempts >= 2 && m.score < 60)
    .map(m => m.name);
  
  // Generate insights
  const insights: string[] = [];
  
  if (topicsMastered.length > 0) {
    insights.push(`Your strongest area is ${topicsMastered[0]}.`);
  }
  if (weakTopics.length > 0) {
    insights.push(`Focus on improving: ${weakTopics.join(", ")}.`);
  }
  if (t.streakDays > 3) {
    insights.push(`${t.streakDays}-day learning streak! Keep it up!`);
  }
  if (avgQuizScore > 0) {
    insights.push(`Average quiz score: ${avgQuizScore.toFixed(0)}%`);
  }
  
  return {
    questionsAsked: t.quizTotalAnswers,
    topicsLearned,
    notesGenerated: t.notesGeneratedCount,
    quizzesCompleted: t.quizzesCompletedCount,
    researchSessions: t.researchInvestigationsCount,
    studyHours: Math.round(t.totalSessionDurationSeconds / 3600),
    streakDays: t.streakDays,
    recentTopics: t.topicMasteries.slice(-5).map(m => m.name),
    quizScores,
    topicsMastered,
    weakTopics,
    insights
  };
}

export function saveTelemetry(telemetry: TelemetryState) {
  if (typeof window === "undefined") return;
  localStorage.setItem("sciforge_global_telemetry_v2", JSON.stringify(telemetry));
}

export function resetTelemetry() {
  if (typeof window === "undefined") return;
  localStorage.setItem("sciforge_global_telemetry_v2", JSON.stringify(DEFAULT_TELEMETRY));
}

export function updateTelemetryOnAction(
  action: 
    | "generate_notes" 
    | "complete_quiz" 
    | "quiz_answer" 
    | "scribble_analysis" 
    | "scribble_struggled" 
    | "execute_simulation" 
    | "research_investigation" 
    | "explore_experience"
    | "view_dependency_node"
    | "timer_run_seconds",
  payload?: any
): TelemetryState {
  const telemetry = getTelemetry();

  // Validate streak day continuity
  const todayStr = new Date().toISOString().split("T")[0];
  if (!telemetry.streakTimestamps.includes(todayStr)) {
    telemetry.streakTimestamps.push(todayStr);
    
    // Check consecutive streak check
    let currentStreak = 1;
    const sortedDates = [...telemetry.streakTimestamps].sort();
    for (let i = sortedDates.length - 1; i > 0; i--) {
      const d1 = new Date(sortedDates[i]);
      const d2 = new Date(sortedDates[i - 1]);
      const diffTime = Math.abs(d1.getTime() - d2.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        break;
      }
    }
    telemetry.streakDays = currentStreak;
  }

  // Handle specific action updates
  switch (action) {
    case "generate_notes":
      telemetry.notesGeneratedCount += 1;
      if (payload?.topic) {
        upsertTopicMastery(telemetry, payload.topic, 50, false);
      }
      break;
    case "complete_quiz":
      telemetry.quizzesCompletedCount += 1;
      break;
    case "quiz_answer":
      telemetry.quizTotalAnswers += 1;
      if (payload?.isCorrect) {
        telemetry.quizCorrectAnswers += 1;
      }
      if (payload?.topic) {
        const topicScore = payload.isCorrect ? 100 : 0;
        upsertTopicMastery(telemetry, payload.topic, topicScore, payload.isCorrect);
      }
      break;
    case "scribble_analysis":
      telemetry.scribbleAnalysisCount += 1;
      if (payload?.topic) {
        upsertTopicMastery(telemetry, payload.topic, 70, false);
      }
      break;
    case "scribble_struggled":
      telemetry.scribbleStruggledCount += 1;
      break;
    case "execute_simulation":
      telemetry.simulationsExecutedCount += 1;
      if (payload?.topic) {
        upsertTopicMastery(telemetry, payload.topic, 80, true);
      }
      break;
    case "research_investigation":
      telemetry.researchInvestigationsCount += 1;
      if (payload?.topic) {
        upsertTopicMastery(telemetry, payload.topic, 90, true);
      }
      break;
    case "explore_experience":
      telemetry.explorerExperiencesCount += 1;
      if (payload?.topic) {
        upsertTopicMastery(telemetry, payload.topic, 65, false);
      }
      break;
    case "view_dependency_node":
      telemetry.dependencyMapViewsCount += 1;
      if (payload?.topic) {
        upsertTopicMastery(telemetry, payload.topic, 45, false);
      }
      break;
    case "timer_run_seconds":
      if (typeof payload === "number") {
        telemetry.totalSessionDurationSeconds += payload;
        // 1 Core run hour is 3600 seconds. Represent fractional hours on labHours
        // We round to 2 decimals
        telemetry.labHours = parseFloat((telemetry.totalSessionDurationSeconds / 3600).toFixed(4));
      }
      break;
  }

  // Dynamic Workspace Focus Score calculation:
  // Derived from user action density and session persistence
  const totalBehaviorPoints = 
    telemetry.notesGeneratedCount * 10 + 
    telemetry.researchInvestigationsCount * 25 + 
    telemetry.simulationsExecutedCount * 15 + 
    telemetry.scribbleAnalysisCount * 12 +
    telemetry.quizTotalAnswers * 8 +
    telemetry.explorerExperiencesCount * 10 +
    telemetry.dependencyMapViewsCount * 8;
  
  telemetry.focusScore = Math.min(100, Math.round(Math.min(100, totalBehaviorPoints) * 0.7 + Math.min(30, telemetry.streakDays * 5)));

  // Recalculate intelligence matrices recursively
  rebuildIntelligenceMatrix(telemetry);

  saveTelemetry(telemetry);
  return telemetry;
}

function upsertTopicMastery(telemetry: TelemetryState, topicName: string, addScore: number, solved: boolean) {
  const existing = telemetry.topicMasteries.find(
    (t) => t.name.toLowerCase() === topicName.toLowerCase()
  );

  if (existing) {
    existing.attempts += 1;
    // Weighted moving average score
    existing.score = Math.round((existing.score * 2 + addScore) / 3);
    if (solved || existing.score >= 90) {
      existing.validated = true;
    }
  } else {
    telemetry.topicMasteries.push({
      name: topicName,
      score: addScore,
      attempts: 1,
      validated: solved
    });
  }
}

function rebuildIntelligenceMatrix(telemetry: TelemetryState) {
  const totalInteractions = 
    telemetry.notesGeneratedCount + 
    telemetry.quizzesCompletedCount + 
    telemetry.quizTotalAnswers + 
    telemetry.scribbleAnalysisCount + 
    telemetry.simulationsExecutedCount + 
    telemetry.researchInvestigationsCount +
    telemetry.explorerExperiencesCount +
    telemetry.dependencyMapViewsCount;

  // Let's protect zero state and insufficient data check
  if (totalInteractions === 0) {
    telemetry.understandingScore = 0;
    telemetry.focusScore = 0;
    telemetry.strengths = [];
    telemetry.weaknesses = [];
    telemetry.adaptiveMentorPathway = "No learning data available yet. Begin using SciForge AI to generate your learning profile.";
    return;
  }

  if (totalInteractions < 3) {
    telemetry.understandingScore = 0;
    // Keep focus score at minimal calculated level or 0
    telemetry.strengths = [];
    telemetry.weaknesses = [];
    telemetry.adaptiveMentorPathway = "Begin using SciForge AI to generate your learning profile. Insufficient learning data (requires at least 3 interactions).";
    return;
  }

  // Core Dynamic Score Calculation
  // 1. Quiz Accuracy (30% weight)
  const quizAccuracy = telemetry.quizTotalAnswers > 0 
    ? (telemetry.quizCorrectAnswers / telemetry.quizTotalAnswers) * 100 
    : 0;
  
  // 2. Error Recovery Rate (20% weight)
  // Struggles vs recoveries
  const errorRate = telemetry.scribbleStruggledCount > 0 
    ? (telemetry.scribbleStruggledCount / (telemetry.scribbleAnalysisCount || 1)) 
    : 0;
  const errorRecoveryRate = Math.max(0, 100 - (errorRate * 100));

  // 3. Concept Completion (20% weight)
  // Notes generated & research investigations count relative to a base standard
  const conceptCompletion = Math.min(100, (telemetry.notesGeneratedCount * 20 + telemetry.researchInvestigationsCount * 30));

  // 4. Application / Simulation Activity (15% weight)
  const simulationActivity = Math.min(100, telemetry.simulationsExecutedCount * 25);

  // 5. Study consistency / stream days (15% weight)
  const streakActivity = Math.min(100, telemetry.streakDays * 20);

  // Weighted total sum
  const calculatedScore = Math.round(
    (quizAccuracy * 0.30) + 
    (errorRecoveryRate * 0.20) + 
    (conceptCompletion * 0.20) + 
    (simulationActivity * 0.15) + 
    (streakActivity * 0.15)
  );

  telemetry.understandingScore = Math.max(5, Math.min(100, calculatedScore));

  // Build Strengths and Weakness arrays dynamically
  const nextStrengths: string[] = [];
  const nextWeaknesses: string[] = [];

  if (telemetry.researchInvestigationsCount >= 1) {
    nextStrengths.push("Deep Academic Investigation");
  }
  if (telemetry.simulationsExecutedCount >= 1) {
    nextStrengths.push("Applied Physical Simulation");
  }
  if (quizAccuracy > 75) {
    nextStrengths.push("Precision Theoretical Reasoning");
  }
  if (telemetry.notesGeneratedCount >= 2) {
    nextStrengths.push("Synthetic Concept Capture");
  }

  // If we have none but we bypassed the baseline
  if (nextStrengths.length === 0) {
    nextStrengths.push("Concept Initiation Active");
  }

  if (telemetry.quizTotalAnswers > 0 && quizAccuracy < 70) {
    nextWeaknesses.push("Friction-Point Concept Recall");
  }
  if (telemetry.scribbleStruggledCount > 0) {
    nextWeaknesses.push("Analytical Derivation Consistency");
  }
  if (telemetry.simulationsExecutedCount === 0) {
    nextWeaknesses.push("Interactive Mechanics Application");
  }
  if (telemetry.notesGeneratedCount === 0) {
    nextWeaknesses.push("Prerequisite Knowledge Scaffold");
  }

  if (nextWeaknesses.length === 0) {
    nextWeaknesses.push("No immediate risk zones identified");
  }

  telemetry.strengths = nextStrengths;
  telemetry.weaknesses = nextWeaknesses;

  // Build Adaptive Mentor Pathway
  if (quizAccuracy < 60 && telemetry.quizTotalAnswers > 0) {
    telemetry.adaptiveMentorPathway = "Focus on review pipelines: regenerate core notes and use simples analogies to patch basic mechanics vocabulary.";
  } else if (telemetry.simulationsExecutedCount === 0) {
    telemetry.adaptiveMentorPathway = "Launch Simulation presets to translate theoretical formulas into active graphical layouts.";
  } else if (telemetry.researchInvestigationsCount === 0) {
    telemetry.adaptiveMentorPathway = "Utilize AI Scientist to run deep research queries on active topics and compile lab reports.";
  } else {
    telemetry.adaptiveMentorPathway = "Continuous system progress steady! Practice with high difficulty quizzes and complex workbook sheets.";
  }
}
