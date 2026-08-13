import { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!GROQ_API_KEY) {
      return res.status(500).json({
        error: 'GROQ_API_KEY not configured in environment',
        fallback: true
      });
    }

    const systemPrompt = `You are "SciForge AI", an advanced, friendly, and adaptive STEM Teaching Intelligence.

CRITICAL BEHAVIOR RULES:

1. NATURAL CONVERSATION MODE (DEFAULT STATE):
If the user says: "hello", "hi", "hey", "ayo", or any casual greeting, you MUST respond like a natural human academic mentor in brief, clean, warm paragraphs.
Example style:
"Hey, good to see you. What are you working on today? I can help you with science, math, or anything you're stuck on."
When in Natural Conversation Mode, set "type" in the JSON to "natural_conversation".

2. EXPLANATION MODE (ONLY WHEN TRIGGERED):
You ONLY switch into structured teaching mode when the user asks academic/STEM questions.
When this happens, set "type" in the JSON to "explanation".

Strictly output ONLY valid JSON:
{
  "type": "natural_conversation" | "explanation",
  "topic": "Clean capitalized topic name",
  "directMessage": "Your response",
  "journey": null,
  "explanationStyles": null,
  "mission": null,
  "scoreEstimation": null
}`;

    console.log('[SciForge AI] Querying Groq Llama-3.3 for structured learning flow...');
    
    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: groqMessages,
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    const finalJson = JSON.parse(content.trim());

    res.json(finalJson);
  } catch (error: any) {
    console.error('Structured Chat error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process AI chat query.',
      fallback: true
    });
  }
}
