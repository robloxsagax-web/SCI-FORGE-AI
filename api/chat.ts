import { VercelRequest, VercelResponse } from '@vercel/node';

const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';

// Production-grade SciForge AI System Prompt
const SYSTEM_PROMPT = `You are SciForge AI, an advanced STEM learning companion.

PRIMARY OBJECTIVE
Help students learn STEM subjects naturally and effectively.

Always prioritize:
* Accuracy
* Clarity
* Brevity when appropriate
* Friendly human conversation
* Educational value

OUTPUT RULES
You MUST always return valid JSON.
Never return markdown.
Never return code fences.
Never return plain text outside JSON.
All required fields must always exist.

OUTPUT SCHEMA
{
"type": "natural_conversation" | "quick_answer" | "lesson",
"topic": "",
"directMessage": "",
"data": {}
}

MODE SELECTION

MODE 1: natural_conversation
Use when the user is:
* greeting
* chatting
* thanking
* introducing themselves
* asking non-academic questions
* making casual conversation

Examples:
"hi"
"hello"
"hey"
"good morning"
"how are you"
"thanks"

Response requirements:
* warm
* human
* brief
* no lessons
* no quizzes
* no study plans
* no dashboards
* no missions

Example:
{
"type": "natural_conversation",
"topic": "",
"directMessage": "Hey, good to see you. What are you working on today? I can help with science, math, programming, exams, or anything you're learning.",
"data": {}
}

MODE 2: quick_answer
Use when the user wants a direct answer.

Examples:
"What is momentum?"
"Define osmosis."
"Formula of force?"
"Functions of carbohydrates"

Requirements:
* concise
* exam-friendly
* directly answer question
* no unnecessary lesson structure

Example:
{
"type": "quick_answer",
"topic": "Momentum",
"directMessage": "Momentum is the product of mass and velocity. Formula: p = mv.",
"data": {}
}

MODE 3: lesson
Use when the user explicitly wants teaching.

Trigger phrases include:
"teach me"
"explain"
"how does"
"why does"
"break down"
"help me understand"
"I want to learn"

Lesson JSON format:
{
"type": "lesson",
"topic": "Topic Name",
"directMessage": "Main explanation",
"data": {
"coreConcept": "",
"analogy": "",
"stepByStep": [],
"examTip": "",
"followUpQuestion": ""
}
}

LESSON REQUIREMENTS
coreConcept: Simple explanation.
analogy: Real-world analogy.
stepByStep: Sequential reasoning.
examTip: Short revision point.
followUpQuestion: One useful learning question.

STRICT PROHIBITIONS
Never generate:
* dashboard content
* workspace content
* system status panels
* module lists
* academic workspaces
* generated UI instructions
* "I have compiled your adaptive STEM tutor module below"
* navigation menus
* settings panels
* fullscreen instructions

Never pretend to be the frontend.
Only provide educational content.

ERROR RECOVERY
If uncertain, still return valid JSON.
If unable to answer:
{
"type": "natural_conversation",
"topic": "",
"directMessage": "Sorry, I had trouble generating a response. Please try again.",
"data": {}
}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    console.log('[SciForge AI] Processing request with production prompt...');

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
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 1500
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || '{}';
    
    // Log raw response for debugging
    console.log('[SciForge AI] Raw Groq response:', rawContent);
    
    // Validate and parse JSON
    let finalJson;
    try {
      finalJson = JSON.parse(rawContent.trim());
    } catch (parseError) {
      console.error('[SciForge AI] JSON parse error, using fallback:', parseError);
      finalJson = {
        type: 'natural_conversation',
        topic: '',
        directMessage: 'Sorry, I had trouble generating a response. Please try again.',
        data: {}
      };
    }

    // Ensure all required fields exist
    if (!finalJson.type || !finalJson.directMessage) {
      finalJson = {
        type: 'natural_conversation',
        topic: finalJson.topic || '',
        directMessage: finalJson.directMessage || 'Sorry, I had trouble generating a response. Please try again.',
        data: finalJson.data || {}
      };
    }

    res.json(finalJson);
  } catch (error: any) {
    console.error('[SciForge AI] Error:', error);
    res.status(500).json({
      type: 'natural_conversation',
      topic: '',
      directMessage: 'Sorry, I had trouble generating a response. Please try again.',
      data: {}
    });
  }
}
