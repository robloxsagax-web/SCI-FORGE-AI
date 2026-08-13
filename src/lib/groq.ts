// Groq Cloud API Integration - SciForge AI
// High-speed AI inference using Groq's Llama-3-Vision model

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string | { type: string; image_url?: { url: string }; text?: string }[];
}

export interface GroqRequest {
  model: string;
  messages: GroqMessage[];
  temperature?: number;
  max_tokens?: number;
}

/**
 * Text-processing middleware filter that strips markdown-style double asterisks
 * from AI response text to prevent unpolished bold formatting in user-facing chat.
 * @param text - Raw response text from Groq AI model
 * @returns Cleaned text with all ** markers removed
 */
function stripMarkdownBoldFormatting(text: string): string {
  // Remove all double-asterisk markdown bold markers
  return text.replace(/\*\*/g, '');
}

// Diagram Narrator System Prompt - Forced narrative format
export const DIAGRAM_NARRATOR_SYSTEM_PROMPT = `You are an expert STEM educator. The user has uploaded a scientific diagram. Perform a deep-dive analysis and provide a clear, structured, spoken-word-style audio narrative (200-300 words). Explain the scientific concept depicted, the relationships between the parts, and the logic of the system. Speak to the user as if you are a mentor guiding them through the diagram. Do not provide a status report; provide the actual explanation.`;

// Cross-Analysis Prompt - Combines diagram context with user query
export const CROSS_ANALYSIS_SYSTEM_PROMPT = `You are an expert STEM tutor conducting a cross-analysis. The user has uploaded a diagram AND asked a question. 

First, recall the diagram context provided. Then, answer the user's question by:
1. Referencing specific elements from the diagram
2. Building upon the diagram's concepts
3. Providing a unified, deeply contextualized explanation

Keep the explanation academic but accessible (150-250 words).`;

// STEM General Analysis Prompt
export const STEM_ANALYSIS_SYSTEM_PROMPT = `You are a specialized STEM Tutor with deep expertise in science, technology, engineering, and mathematics. Analyze the user's input carefully and provide:

1. SUBJECT IDENTIFICATION: Identify the academic subject and topic
2. CORE CONCEPT: Explain the fundamental principle
3. DETAILED ANALYSIS: Break down components and relationships
4. LOGICAL VERIFICATION: Check accuracy and identify errors
5. TEACHING APPROACH: Provide both simple and deep explanations
6. REAL-WORLD APPLICATION: Give practical examples and analogies

Format your response with clear sections. Keep explanations 150-300 words.`;

/**
 * Send image to Groq for vision analysis
 * @param base64Image - Base64 encoded image data (with or without data URL prefix)
 * @param systemPrompt - System prompt to use
 * @returns The AI-generated narrative response
 */
export async function analyzeImageWithGroq(
  base64Image: string,
  systemPrompt: string = DIAGRAM_NARRATOR_SYSTEM_PROMPT
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn("Groq API key not configured. Using demo response.");
    return generateDemoNarrative();
  }

  try {
    // Clean the base64 string if it has a data URL prefix
    const cleanBase64 = base64Image.includes(",") 
      ? base64Image.split(",")[1] 
      : base64Image;
    
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.2-11b-vision-preview", // Fast vision model
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${cleanBase64}`
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return stripMarkdownBoldFormatting(data.choices?.[0]?.message?.content || "Analysis complete.");
  } catch (error) {
    console.error("Groq API error:", error);
    return stripMarkdownBoldFormatting(generateDemoNarrative());
  }
}

/**
 * Send text to Groq for analysis
 * @param userQuery - The user's question or query
 * @param systemPrompt - System prompt to use
 * @returns The AI-generated analysis response
 */
export async function analyzeTextWithGroq(
  userQuery: string,
  systemPrompt: string = STEM_ANALYSIS_SYSTEM_PROMPT
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn("Groq API key not configured. Using demo response.");
    return generateDemoTextAnalysis(userQuery);
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-specdec", // Fast reasoning model
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userQuery
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return stripMarkdownBoldFormatting(data.choices?.[0]?.message?.content || "Analysis complete.");
  } catch (error) {
    console.error("Groq API error:", error);
    return stripMarkdownBoldFormatting(generateDemoTextAnalysis(userQuery));
  }
}

/**
 * Cross-analysis: combines diagram context with user query
 */
export async function crossAnalyzeWithGroq(
  userQuery: string,
  diagramContext: string,
  systemPrompt: string = CROSS_ANALYSIS_SYSTEM_PROMPT
): Promise<string> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn("Groq API key not configured. Using demo response.");
    return `Based on the diagram context: "${diagramContext.substring(0, 100)}..."\n\nRegarding your question about: "${userQuery}"\n\nThis concept relates to the diagram you uploaded. The key elements include...`;
  }

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-specdec",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: `DIAGRAM CONTEXT:\n${diagramContext}\n\nUSER QUESTION:\n${userQuery}`
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    return stripMarkdownBoldFormatting(data.choices?.[0]?.message?.content || "Cross-analysis complete.");
  } catch (error) {
    console.error("Groq cross-analysis error:", error);
    return stripMarkdownBoldFormatting(`Based on the uploaded diagram and your question about "${userQuery}": The diagram depicts key STEM concepts that relate to your query. Connecting these elements, we can see...`);
  }
}

// Demo responses for when API key is not configured
function generateDemoNarrative(): string {
  return `This scientific diagram presents a complex system with interconnected components. Let me guide you through the key elements.

The primary structure shows the fundamental relationship between core components. Notice how each element connects to form an integrated system.

Key observations:
• The central hub represents the main concept being illustrated
• Surrounding elements demonstrate supporting principles
• Arrows indicate flow or causation between components

The diagram appears to represent a scientific process or relationship. To provide a deeper understanding, this system likely follows established scientific principles where energy or information transfers between the labeled components.

When you type your question in the Equations Edit Box, I'll connect this visual context with your specific inquiry for a unified, contextualized explanation.

Would you like me to elaborate on any specific aspect of this diagram?`;
}

function generateDemoTextAnalysis(query: string): string {
  return `Subject Analysis: ${query.substring(0, 50)}${query.length > 50 ? '...' : ''}

Core Concept:
This topic relates to fundamental STEM principles. The question you've raised touches on important educational concepts that build upon each other.

Detailed Analysis:
Your query connects to broader academic themes. Let me break this down into key components:

1. Foundation - The basic principle underlying this topic
2. Application - How this concept applies in practice
3. Connections - How this relates to other STEM areas

This is an excellent question that demonstrates engagement with the material. Understanding this concept will help you build toward more advanced topics.

Continue exploring with more specific questions, or upload a diagram for visual guidance.`;
}