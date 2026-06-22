/**
 * SciForge AI - Groq API Executa Tool
 * Uses Groq's Llama 3.3 70B model for high-speed AI inference
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface ChatToolInput {
  prompt: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatToolOutput {
  response: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Strip markdown bold formatting from response
 */
function stripMarkdownBoldFormatting(text: string): string {
  return text.replace(/\*\*/g, '');
}

/**
 * Chat Executa Tool - Main entry point for Anna App
 */
export async function chatTool(input: ChatToolInput): Promise<ChatToolOutput> {
  const {
    prompt,
    systemPrompt = "You are SciForge AI, a world-class STEM tutor. Help students understand concepts deeply. Use analogies and step-by-step reasoning. Do not use bold markdown (**) in your responses.",
    model = "llama-3.3-70b-versatile",
    temperature = 0.7,
    maxTokens = 2048
  } = input;

  const apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY;

  if (!apiKey) {
    // Return demo response if no API key
    return {
      response: stripMarkdownBoldFormatting(generateDemoResponse(prompt)),
      model: "demo"
    };
  }

  try {
    const messages: Array<{ role: string; content: string }> = [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ];

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      response: stripMarkdownBoldFormatting(data.choices?.[0]?.message?.content || "I apologize, but I couldn't generate a response."),
      model: data.model || model,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      } : undefined
    };
  } catch (error) {
    console.error("Groq API error:", error);
    return {
      response: "I apologize, but I encountered an error processing your request. Please try again.",
      model: "error"
    };
  }
}

/**
 * Quiz Generation Executa Tool
 */
export interface QuizToolInput {
  topic: string;
  count?: number;
  difficulty?: "easy" | "medium" | "hard";
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizToolOutput {
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export async function quizTool(input: QuizToolInput): Promise<QuizToolOutput> {
  const { topic, count = 4, difficulty = "medium" } = input;

  const quizPrompt = `Generate exactly ${count} high-quality multiple choice quiz questions about "${topic}" with ${difficulty} difficulty.

Output ONLY valid JSON matching this exact structure:
{
  "topic": "The quiz topic name",
  "difficulty": "easy" | "medium" | "hard",
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this answer is correct"
    }
  ]
}`;

  const result = await chatTool({
    prompt: quizPrompt,
    systemPrompt: "You are an AI quiz compiler. Generate valid JSON only, no markdown formatting.",
    temperature: 0.3,
    maxTokens: 3000
  });

  try {
    return JSON.parse(result.response);
  } catch {
    return {
      topic,
      difficulty,
      questions: []
    };
  }
}

/**
 * Notes Generation Executa Tool
 */
export interface NotesToolInput {
  topic: string;
}

export interface NotesToolOutput {
  topic: string;
  overview: string;
  fullLectureNotes: string;
  conceptBreakdown: Array<{
    concept: string;
    detailedExplanation: string;
    example: string;
  }>;
  keyDefinitions: Array<{
    term: string;
    definition: string;
  }>;
  formulaSheet: Array<{
    formula: string;
    description: string;
  }>;
  realWorldApplications: Array<{
    application: string;
    explanation: string;
  }>;
  revisionSummary: string;
}

export async function notesTool(input: NotesToolInput): Promise<NotesToolOutput> {
  const { topic } = input;

  const notesPrompt = `Generate comprehensive lecture notes for "${topic}" in valid JSON format.

Output ONLY valid JSON matching this exact structure:
{
  "topic": "The topic name",
  "overview": "A brief 2-3 sentence overview of the subject",
  "fullLectureNotes": "Detailed lecture notes as a single formatted text block",
  "conceptBreakdown": [
    {
      "concept": "Concept Name",
      "detailedExplanation": "In-depth explanation of this concept",
      "example": "A clear example illustrating this concept"
    }
  ],
  "keyDefinitions": [
    {
      "term": "Key Term",
      "definition": "Clear definition"
    }
  ],
  "formulaSheet": [
    {
      "formula": "The formula in LaTeX or plain text",
      "description": "What this formula represents"
    }
  ],
  "realWorldApplications": [
    {
      "application": "Application name",
      "explanation": "How this concept applies in real life"
    }
  ],
  "revisionSummary": "A memorable summary for quick review"
}`;

  const result = await chatTool({
    prompt: notesPrompt,
    systemPrompt: "You are an AI Academic Notes Compiler. Generate valid JSON only, no markdown formatting.",
    temperature: 0.3,
    maxTokens: 4000
  });

  try {
    return JSON.parse(result.response);
  } catch {
    return {
      topic,
      overview: '',
      fullLectureNotes: '',
      conceptBreakdown: [],
      keyDefinitions: [],
      formulaSheet: [],
      realWorldApplications: [],
      revisionSummary: ''
    };
  }
}

/**
 * Scribble Analysis Executa Tool
 */
export interface ScribbleToolInput {
  problem: string;
}

export interface ScribbleToolOutput {
  subject: string;
  problem_understanding: string;
  is_correct: boolean;
  error_analysis: {
    found_error: boolean;
    error_location: string;
    why_wrong: string;
    concept_gap: string;
  };
  step_by_step_solution: string[];
  final_answer: string;
  concept_teaching: {
    simple_explanation: string;
    deep_explanation: string;
    real_world_analogy: string;
  };
  practice_questions: string[];
  difficulty_level: string;
}

export async function scribbleTool(input: ScribbleToolInput): Promise<ScribbleToolOutput> {
  const { problem } = input;

  const analysisPrompt = `Analyze this equation or problem and provide a comprehensive analysis in valid JSON format.

Input: "${problem}"

Output ONLY valid JSON matching this exact structure:
{
  "subject": "The subject area (e.g., Algebra, Physics, Calculus)",
  "problem_understanding": "Your understanding of what the problem is asking",
  "is_correct": true or false based on your analysis,
  "error_analysis": {
    "found_error": true or false,
    "error_location": "Where the error occurs (if any)",
    "why_wrong": "Explanation of why it's wrong (if applicable)",
    "concept_gap": "The underlying concept gap causing the error"
  },
  "step_by_step_solution": ["Step 1", "Step 2", "Step 3..."],
  "final_answer": "The final answer or result",
  "concept_teaching": {
    "simple_explanation": "Simple explanation for beginners",
    "deep_explanation": "Detailed theoretical explanation",
    "real_world_analogy": "A relatable everyday analogy"
  },
  "practice_questions": ["Similar question 1", "Similar question 2"],
  "difficulty_level": "easy" | "medium" | "hard"
}`;

  const result = await chatTool({
    prompt: analysisPrompt,
    systemPrompt: "You are an AI Mathematical Problem Analyzer. Generate valid JSON only, no markdown formatting.",
    temperature: 0.2,
    maxTokens: 3000
  });

  try {
    return JSON.parse(result.response);
  } catch {
    return {
      subject: 'Analysis',
      problem_understanding: 'Unable to analyze the given problem.',
      is_correct: true,
      error_analysis: { found_error: false, error_location: '', why_wrong: '', concept_gap: '' },
      step_by_step_solution: [],
      final_answer: '',
      concept_teaching: { simple_explanation: '', deep_explanation: '', real_world_analogy: '' },
      practice_questions: [],
      difficulty_level: 'medium'
    };
  }
}

/**
 * Dependency Map Generation Executa Tool
 */
export interface DependencyMapToolInput {
  concept: string;
}

export interface DependencyMapToolOutput {
  subject: string;
  description: string;
  rootNode: string;
  nodes: Array<{
    id: string;
    name: string;
    summary: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    prerequisites: string[];
    related: string[];
  }>;
}

export async function dependencyMapTool(input: DependencyMapToolInput): Promise<DependencyMapToolOutput> {
  const { concept } = input;

  const mapPrompt = `Generate a concept dependency map for "${concept}" in valid JSON format.

Output ONLY valid JSON matching this exact structure:
{
  "subject": "The main subject/topic name",
  "description": "Brief description of what this dependency map covers",
  "rootNode": "The root/foundational concept name",
  "nodes": [
    {
      "id": "node-1",
      "name": "Concept Name",
      "summary": "Brief summary of what this concept covers",
      "difficulty": "Beginner" | "Intermediate" | "Advanced",
      "prerequisites": ["Prerequisite concept 1", "Prerequisite concept 2"],
      "related": ["Related concept 1", "Related concept 2"]
    }
  ]
}

Generate 5-8 interconnected nodes that build upon each other.`;

  const result = await chatTool({
    prompt: mapPrompt,
    systemPrompt: "You are an AI Academic Curriculum Designer. Generate valid JSON only, no markdown formatting.",
    temperature: 0.3,
    maxTokens: 3000
  });

  try {
    return JSON.parse(result.response);
  } catch {
    return {
      subject: concept,
      description: '',
      rootNode: concept,
      nodes: []
    };
  }
}

/**
 * Demo response generator
 */
function generateDemoResponse(prompt: string): string {
  return `SciForge AI - Demo Response

Thank you for your question: "${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}"

This is a demo response since no Groq API key is configured. In the full Anna App version, this would connect to Groq's Llama 3.3 70B model for intelligent responses.

To enable full functionality:
1. Get a Groq API key from https://console.groq.com
2. Set VITE_GROQ_API_KEY in your environment variables

Features available:
- Core Intelligence Console (chat/mentor)
- Scribble Analysis Lab (problem solving)
- Quiz Generator
- Notes Generator
- Concept Dependency Map
- Quantum Research Engine

The AI would provide detailed explanations with:
- Step-by-step reasoning
- Real-world analogies
- Visual examples
- Practice problems

Configure your API key to unlock the full experience!`;
}