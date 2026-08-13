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
    const { concept } = req.body;

    if (!concept) {
      return res.status(400).json({ error: 'concept is required' });
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
            content: `You are an AI Academic Curriculum Designer. Generate a concept dependency map for educational purposes in valid JSON format.

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
      "related": ["Related concept 1", "Related concept 2"],
      "recommendedNotes": "Recommended topic name for notes generator",
      "recommendedQuizzes": "Recommended topic name for quiz generator",
      "recommendedResearch": "Recommended topic name for research generator",
      "recommendedExplorer": "Recommended study topic",
      "recommendedExplorerId": "unique-id-for-explorer"
    }
  ]
}

Generate 5-8 interconnected nodes that build upon each other, from foundational concepts to advanced topics.`
          },
          { role: 'user', content: `Generate a concept dependency map for: "${concept}"` }
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
    console.error('Dependency map error:', error.message);
    res.status(500).json({ error: error.message });
  }
}