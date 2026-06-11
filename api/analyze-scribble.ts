import { VercelRequest, VercelResponse } from '@vercel/node';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { rawText } = req.body;

    if (!rawText) {
      return res.status(400).json({ error: 'rawText is required' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `You are an AI Mathematical Problem Analyzer. Analyze the given equation or problem and provide a comprehensive analysis in valid JSON format.

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
  "alternative_method": "An alternative way to solve this problem (if applicable)",
  "concept_teaching": {
    "simple_explanation": "Simple explanation for beginners",
    "deep_explanation": "Detailed theoretical explanation",
    "real_world_analogy": "A relatable everyday analogy"
  },
  "practice_questions": ["Similar question 1", "Similar question 2"],
  "difficulty_level": "easy" | "medium" | "hard"
}`
          },
          { role: 'user', content: `Analyze this problem/equation: "${rawText}"` }
        ],
        temperature: 0.2
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(JSON.parse(data.choices?.[0]?.message?.content));
  } catch (error: any) {
    console.error('Scribble analysis error:', error.message);
    res.status(500).json({ error: error.message });
  }
}