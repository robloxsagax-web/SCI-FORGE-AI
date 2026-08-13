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
    const { minutes, activities } = req.body;
    const minutesVal = minutes || 45;

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
            content: `You are an AI Cognitive Science Analyst. Generate a scientific and academic session breakdown analyzing a student's completed focused study interval in valid JSON format.

Output ONLY valid JSON matching this exact structure:
{
  "session_duration": "${minutesVal} Minutes",
  "cognitive_efficiency": 85-98 (number representing estimated efficiency),
  "executive_summary": "1-2 sentence high-level synthesis of what was completed and its neurological impact.",
  "scientific_analysis": "Detailed 150-250 word scientific analysis of the cognitive focus phase. Reference neurologically sound concepts like alpha/beta band transition, neocortical memory consolidation, or hippocampal encoding.",
  "actions_completed": [
    "Academic action 1 based on actual user activity",
    "Academic action 2 based on actual user activity",
    "Academic action 3"
  ],
  "strategic_advice": "Next-step study advice to maintain homeostatic learning levels and boost long-term memory retention."
}`
          },
          { role: 'user', content: `Generate session analysis for a ${minutesVal} minute focus interval. Activities tracked: ${JSON.stringify(activities || [])}` }
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
    const minutesVal = req.body?.minutes || 45;
    // Fallback response
    res.status(200).json({
      session_duration: `${minutesVal} Minutes`,
      cognitive_efficiency: 92,
      executive_summary: `Completed a rigorous ${minutesVal}-minute focused study cycle, successfully committing active concept traces to hippocampal structures.`,
      scientific_analysis: `This ${minutesVal}-minute study segment represents an optimal metabolic efficiency block. In this phase, neuronal networks maintain sustained theta and high-alpha wave patterns that facilitate working memory consolidation and long-term potentiation. Synaptic pruning has been optimized during this rest period.`,
      actions_completed: req.body?.activities?.length > 0 
        ? req.body.activities.map((a: string) => `Executed systematic task review: ${a}`)
        : [
            "Conducted active recall sessions over active curriculum frameworks.",
            "Consolidated physical, mechanical, or biological equations with deep conceptual tracing."
          ],
      strategic_advice: "Engage in active recall or pass a targeted Quiz module within the next 20 minutes to solidify these synaptic connections before decay patterns commence."
    });
  }
}