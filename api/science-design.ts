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
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'prompt is required' });
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
            content: `You are an AI Academic Research Scientist. Generate a comprehensive scientific research insight report in valid JSON format.

Output ONLY valid JSON matching this exact structure:
{
  "research_topic": "The research topic name",
  "explanation": "A detailed academic explanation of the topic (150-250 words)",
  "principles": [
    {
      "title": "Principle Name",
      "detail": "Description of this governing principle"
    }
  ],
  "applications": [
    {
      "title": "Application Title",
      "detail": "How this is applied in practice"
    }
  ],
  "limitations": "Boundary conditions and limitations of this concept",
  "misconceptions": "Common misconceptions students have about this topic",
  "related_fields": ["Related Field 1", "Related Field 2", "Related Field 3"],
  "next_direction": "Suggested next topics or research directions"
}`
          },
          { role: 'user', content: `Generate a comprehensive scientific research insight about: "${prompt}"` }
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
    console.error('Science design error:', error.message);
    res.status(500).json({ error: error.message });
  }
}