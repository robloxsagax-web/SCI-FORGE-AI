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
    const { topic } = req.body;

    if (!topic || !topic.trim()) {
      return res.status(400).json({ error: 'Topic is required' });
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
            content: `You are an AI Academic Curriculum Designer. Generate a strict, highly detailed, real-world educational study blueprint and strategy in valid JSON format.

Output ONLY valid JSON matching this exact structure:
{
  "topic": "The generated topic name",
  "difficulty_progression": [
    "Phase progression comment 1",
    "Phase progression comment 2",
    "Phase progression comment 3"
  ],
  "time_allocations": [
    { "phase": "Phase title", "hours": NumberOfHours, "focus": "Phase focus/goals description" }
  ],
  "structural_plan": [
    {
      "stage": "Stage Name",
      "time_est": "Day range / Hour volume estimate",
      "details": "Thorough description of core learning processes",
      "milestone": "Measurable exit criteria"
    }
  ],
  "revision_cycles": [
    "Cycle item 1 - description",
    "Cycle item 2 - description"
  ],
  "weak_area_reinforcement": "Specific pedagogical strategy to detect, isolate, and remediate conceptual mistakes."
}`
          },
          { role: 'user', content: `Generate a detailed study strategy and plan for: "${topic}"` }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(JSON.parse(data.choices?.[0]?.message?.content));
  } catch (error: any) {
    console.error('Study plan error:', error.message);
    res.status(500).json({ error: error.message });
  }
}