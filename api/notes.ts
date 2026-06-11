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

    if (!topic) {
      return res.status(400).json({ error: 'topic is required' });
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
            content: `You are an AI Academic Notes Compiler. Generate comprehensive STEM lecture notes in valid JSON format.

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
}`
          },
          { role: 'user', content: `Generate comprehensive lecture notes for: "${topic}"` }
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
    console.error('Notes generation error:', error.message);
    res.status(500).json({ error: error.message });
  }
}