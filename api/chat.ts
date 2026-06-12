import { VercelRequest, VercelResponse } from '@vercel/node';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

// Production-grade SciForge AI System Prompt
const SYSTEM_PROMPT = `You are SciForge AI.

You are a world-class teacher, scientist, engineer, researcher,
and mentor.

Your primary goal is helping students understand concepts deeply.

Adapt naturally to the user's intent:

- Greetings → friendly conversation.
- Simple questions → concise answers.
- Learning requests → detailed teaching.
- Complex topics → structured lessons.

Never respond with dashboard content,
workspace content,
navigation content,
or UI elements.

Always focus on helping the user learn.

When teaching:
- Start from fundamentals.
- Use analogies.
- Use step-by-step reasoning.
- Build intuition.
- Give memorable examples.
- Adjust depth based on the user's request.

Avoid dictionary-style definitions unless specifically requested.

Act like an excellent human tutor rather than a form-filling API.`;

// Response schema types
interface SciForgeResponse {
  type: 'natural_conversation' | 'quick_answer' | 'lesson' | 'teaching';
  topic?: string;
  directMessage: string;
  data?: {
    coreConcept?: string;
    analogy?: string;
    stepByStep?: string[];
    examTip?: string;
    followUpQuestion?: string;
  };
}

function createFallbackResponse(message: string): SciForgeResponse {
  return {
    type: 'natural_conversation',
    topic: '',
    directMessage: message,
    data: {}
  };
}

function validateAndEnhanceResponse(response: any): SciForgeResponse {
  // Ensure required fields exist
  const validated: SciForgeResponse = {
    type: response.type || 'natural_conversation',
    topic: response.topic || '',
    directMessage: response.directMessage || response.message || 'Sorry, I had trouble generating a response. Please try again.',
    data: response.data || {}
  };

  // Ensure data object has all expected fields for lessons
  if (validated.type === 'lesson' || validated.type === 'teaching') {
    validated.data = {
      coreConcept: validated.data?.coreConcept || '',
      analogy: validated.data?.analogy || '',
      stepByStep: validated.data?.stepByStep || [],
      examTip: validated.data?.examTip || '',
      followUpQuestion: validated.data?.followUpQuestion || ''
    };
  }

  return validated;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json(createFallbackResponse('Method not allowed'));
  }

  try {
    const { messages } = req.body;

    console.log('[SciForge AI] Processing request...');

    const groqMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
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
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '';
    
    // Log raw response for debugging
    console.log('[SciForge AI] Raw Groq response:', rawContent);

    // Try to parse as JSON first
    let finalJson: SciForgeResponse;
    try {
      const parsed = JSON.parse(rawContent.trim());
      finalJson = validateAndEnhanceResponse(parsed);
    } catch {
      // If not valid JSON, treat as direct text response (human tutor style)
      finalJson = createFallbackResponse(rawContent.trim() || 'Sorry, I had trouble generating a response. Please try again.');
    }

    res.json(finalJson);
  } catch (error: any) {
    console.error('[SciForge AI] Error:', error);
    res.status(500).json(createFallbackResponse('Sorry, I had trouble generating a response. Please try again.'));
  }
}
