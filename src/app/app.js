/**
 * SciForge AI - Anna App
 * Converted from Next.js/TypeScript to Vanilla JS with Anna Host API
 * Uses Anna.llm.complete() instead of Groq API directly
 */

// ============================================================================
// SYSTEM PROMPTS
// ============================================================================

const SCI_FORGE_SYSTEM_PROMPT = `You are SciForge AI.

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

Act like an excellent human tutor rather than a form-filling API.

Do not use any bold markdown asterisks (**) anywhere in your response. All headers, labels, and text highlights must be rendered cleanly in plain text without markdown bold syntax.`;

const STEM_ANALYSIS_PROMPT = `You are a specialized STEM Tutor with deep expertise in science, technology, engineering, and mathematics. Analyze the user's input carefully and provide:

1. SUBJECT IDENTIFICATION: Identify the academic subject and topic
2. CORE CONCEPT: Explain the fundamental principle
3. DETAILED ANALYSIS: Break down components and relationships
4. LOGICAL VERIFICATION: Check accuracy and identify errors
5. TEACHING APPROACH: Provide both simple and deep explanations
6. REAL-WORLD APPLICATION: Give practical examples and analogies

Format your response with clear sections. Keep explanations 150-300 words.`;

const QUIZ_GENERATION_PROMPT = (count) => `You are an AI quiz compiler. Create exactly ${count} high-quality multiple choice quiz questions about the given topic.

Output ONLY valid JSON matching this exact structure:
{
  "topic": "The quiz topic name",
  "difficulty": "easy" | "medium" | "hard",
  "questions": [
    {
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Why this answer is correct"
    }
  ]
}`;

const NOTES_GENERATION_PROMPT = `You are an AI Academic Notes Compiler. Generate comprehensive STEM lecture notes in valid JSON format.

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
}`;

const DEPENDENCY_MAP_PROMPT = `You are an AI Academic Curriculum Designer. Generate a concept dependency map for educational purposes in valid JSON format.

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
      "related": ["Related concept 1", "Related concept 2"]
    }
  ]
}

Generate 5-8 interconnected nodes that build upon each other, from foundational concepts to advanced topics.`;

const SCRIBBLE_ANALYSIS_PROMPT = `You are an AI Mathematical Problem Analyzer. Analyze the given equation or problem and provide a comprehensive analysis in valid JSON format.

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
}`;

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

const state = {
  currentModule: 'home',
  chatMessages: [],
  quizData: null,
  notesData: null,
  dependencyMap: null,
  scribbleAnalysis: null,
  loading: false,
  settings: {
    dyslexiaFont: true,
    highContrast: false,
    lightMode: false,
    customCursor: true
  }
};

// ============================================================================
// ANNA API INTEGRATION
// ============================================================================

/**
 * Send chat message using Anna LLM API
 */
async function sendChatMessage(messages) {
  const fullMessages = [
    { role: 'system', content: SCI_FORGE_SYSTEM_PROMPT },
    ...messages
  ];
  
  try {
    const response = await Anna.llm.complete({
      messages: fullMessages,
      temperature: 0.7,
      maxTokens: 2000
    });
    return response.content;
  } catch (error) {
    console.error('Anna LLM error:', error);
    throw error;
  }
}

/**
 * Generate quiz using Anna LLM API
 */
async function generateQuiz(topic, count = 4) {
  const response = await Anna.llm.complete({
    messages: [
      { role: 'system', content: QUIZ_GENERATION_PROMPT(count) },
      { role: 'user', content: `Generate a ${count}-question quiz about: "${topic}"` }
    ],
    temperature: 0.3,
    maxTokens: 3000,
    responseFormat: 'json'
  });
  
  try {
    return JSON.parse(response.content);
  } catch {
    return { topic, difficulty: 'medium', questions: [] };
  }
}

/**
 * Generate notes using Anna LLM API
 */
async function generateNotes(topic) {
  const response = await Anna.llm.complete({
    messages: [
      { role: 'system', content: NOTES_GENERATION_PROMPT },
      { role: 'user', content: `Generate comprehensive lecture notes for: "${topic}"` }
    ],
    temperature: 0.3,
    maxTokens: 4000,
    responseFormat: 'json'
  });
  
  try {
    return JSON.parse(response.content);
  } catch {
    return { topic, overview: '', fullLectureNotes: '', conceptBreakdown: [], keyDefinitions: [], formulaSheet: [], realWorldApplications: [], revisionSummary: '' };
  }
}

/**
 * Generate dependency map using Anna LLM API
 */
async function generateDependencyMap(concept) {
  const response = await Anna.llm.complete({
    messages: [
      { role: 'system', content: DEPENDENCY_MAP_PROMPT },
      { role: 'user', content: `Generate a concept dependency map for: "${concept}"` }
    ],
    temperature: 0.3,
    maxTokens: 3000,
    responseFormat: 'json'
  });
  
  try {
    return JSON.parse(response.content);
  } catch {
    return { subject: concept, description: '', rootNode: concept, nodes: [] };
  }
}

/**
 * Analyze scribble using Anna LLM API
 */
async function analyzeScribble(rawText) {
  const response = await Anna.llm.complete({
    messages: [
      { role: 'system', content: SCRIBBLE_ANALYSIS_PROMPT },
      { role: 'user', content: `Analyze this problem/equation: "${rawText}"` }
    ],
    temperature: 0.2,
    maxTokens: 3000,
    responseFormat: 'json'
  });
  
  try {
    return JSON.parse(response.content);
  } catch {
    return {
      subject: 'Analysis',
      problem_understanding: response.content || 'Unable to analyze',
      is_correct: true,
      error_analysis: { found_error: false },
      step_by_step_solution: [],
      final_answer: '',
      concept_teaching: { simple_explanation: '', deep_explanation: '', real_world_analogy: '' },
      practice_questions: [],
      difficulty_level: 'medium'
    };
  }
}

/**
 * STEM Analysis using Anna LLM API
 */
async function analyzeSTEM(userQuery) {
  const response = await Anna.llm.complete({
    messages: [
      { role: 'system', content: STEM_ANALYSIS_PROMPT },
      { role: 'user', content: userQuery }
    ],
    temperature: 0.7,
    maxTokens: 1500
  });
  
  return response.content;
}

// ============================================================================
// UI RENDERING FUNCTIONS
// ============================================================================

function renderApp() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="app-container ${state.settings.lightMode ? 'light-mode' : ''}">
      ${renderSidebar()}
      <main class="main-content">
        ${renderHeader()}
        <div class="content-area">
          ${renderCurrentModule()}
        </div>
      </main>
      ${renderRightPanel()}
    </div>
    ${renderMobileNav()}
    ${renderLoadingOverlay()}
  `;
  attachEventListeners();
  applyAccessibilitySettings();
}

function renderSidebar() {
  const tools = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'chat', label: 'Core Intelligence Console', icon: '💬' },
    { id: 'scribble', label: 'Scribble Analysis Lab', icon: '✍️' },
    { id: 'notes', label: 'Scientific Documentation Lab', icon: '📝' },
    { id: 'quiz', label: 'Mastery Assessment Engine', icon: '❓' },
    { id: 'scientist', label: 'Quantum Research Engine', icon: '🔬' },
    { id: 'dependencymap', label: 'Concept Dependency Map', icon: '🗺️' },
    { id: 'progress', label: 'Academic Propulsion', icon: '📊' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];
  
  return `
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">⚡</div>
          <div class="logo-text">
            <span class="logo-title">SCI FORGE AI</span>
            <span class="logo-subtitle">STEM Workbench</span>
          </div>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${tools.map(tool => `
          <button class="nav-item ${state.currentModule === tool.id ? 'active' : ''}" data-module="${tool.id}">
            <span class="nav-icon">${tool.icon}</span>
            <span class="nav-label">${tool.label}</span>
          </button>
        `).join('')}
      </nav>
    </aside>
  `;
}

function renderHeader() {
  const moduleNames = {
    home: 'HOME DASHBOARD',
    chat: 'CORE INTELLIGENCE CONSOLE',
    scribble: 'SCRIBBLE ANALYSIS LAB',
    notes: 'SCIENTIFIC DOCUMENTATION LAB',
    quiz: 'MASTERY ASSESSMENT ENGINE',
    scientist: 'QUANTUM RESEARCH ENGINE',
    dependencymap: 'CONCEPT DEPENDENCY MAP',
    progress: 'ACADEMIC PROPULSION',
    settings: 'SETTINGS'
  };
  
  return `
    <header class="top-bar">
      <div class="top-bar-left">
        <div class="status-indicator">
          <span class="status-dot"></span>
          <span class="status-text">SCI FORGE AI</span>
        </div>
        <span class="module-name">${moduleNames[state.currentModule]}</span>
      </div>
      <div class="top-bar-right">
        <button class="settings-btn" data-module="settings">⚙️</button>
      </div>
    </header>
  `;
}

function renderCurrentModule() {
  switch (state.currentModule) {
    case 'home': return renderHomeDashboard();
    case 'chat': return renderCoreIntelligenceConsole();
    case 'scribble': return renderScribbleAnalysisLab();
    case 'notes': return renderNotesGenerator();
    case 'quiz': return renderQuizGenerator();
    case 'scientist': return renderQuantumResearchEngine();
    case 'dependencymap': return renderConceptDependencyMap();
    case 'progress': return renderLearningProgress();
    case 'settings': return renderSettings();
    default: return renderHomeDashboard();
  }
}

function renderHomeDashboard() {
  const tools = [
    { id: 'chat', label: 'Core Intelligence Console', icon: '💬', desc: 'AI-powered chat mentor' },
    { id: 'scribble', label: 'Scribble Analysis Lab', icon: '✍️', desc: 'Analyze equations and problems' },
    { id: 'quiz', label: 'Mastery Assessment Engine', icon: '❓', desc: 'Generate practice quizzes' },
    { id: 'notes', label: 'Scientific Documentation Lab', icon: '📝', desc: 'Create comprehensive notes' },
    { id: 'scientist', label: 'Quantum Research Engine', icon: '🔬', desc: 'Deep STEM analysis' },
    { id: 'dependencymap', label: 'Concept Dependency Map', icon: '🗺️', desc: 'Visualize learning paths' }
  ];
  
  return `
    <div class="home-dashboard">
      <div class="welcome-section">
        <h1>Welcome to <span class="gradient-text">SciForge AI</span></h1>
        <p>Your AI-powered STEM Workbench for interactive scientific exploration</p>
      </div>
      <div class="quick-actions">
        ${tools.map(tool => `
          <button class="quick-action-card" data-module="${tool.id}">
            <span class="card-icon">${tool.icon}</span>
            <span class="card-title">${tool.label}</span>
            <span style="font-size: 12px; color: var(--color-text-dim);">${tool.desc}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

function renderCoreIntelligenceConsole() {
  return `
    <div class="chat-module">
      <div class="chat-header">
        <h3>Core Intelligence Console</h3>
        <p class="module-description">Chat with your AI STEM tutor. Ask questions, get explanations, and explore concepts.</p>
      </div>
      <div class="chat-messages" id="chatMessages">
        ${state.chatMessages.map(msg => `
          <div class="message ${msg.role}">
            <div class="message-sender">${msg.role === 'user' ? 'You' : 'SciForge AI'}</div>
            <div class="message-content">${escapeHtml(msg.content)}</div>
          </div>
        `).join('')}
        ${state.chatMessages.length === 0 ? `
          <div style="text-align: center; padding: 40px; color: var(--color-text-dim);">
            <p>Start a conversation with your AI tutor!</p>
            <p style="font-size: 13px; margin-top: 8px;">Ask any STEM question or type a greeting.</p>
          </div>
        ` : ''}
      </div>
      <div class="chat-input-container">
        <input type="text" class="chat-input" id="chatInput" placeholder="Ask any STEM question..." ${state.loading ? 'disabled' : ''}>
        <button class="send-btn" id="sendBtn" ${state.loading ? 'disabled' : ''}>
          ${state.loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  `;
}

function renderScribbleAnalysisLab() {
  return `
    <div class="chat-module">
      <div class="chat-header">
        <h3>Scribble Analysis Lab</h3>
        <p class="module-description">Paste your equation or problem below for AI-powered analysis.</p>
      </div>
      <div style="background: var(--color-secondary-bg); border: 1px solid var(--color-glass-border); border-radius: 16px; padding: 24px; margin-bottom: 24px;">
        <textarea 
          id="scribbleInput" 
          class="chat-input" 
          style="width: 100%; min-height: 120px; resize: vertical;"
          placeholder="Enter your equation or problem here..."
          ${state.loading ? 'disabled' : ''}
        ></textarea>
        <button class="generate-btn" id="analyzeBtn" style="margin-top: 16px; width: 100%;" ${state.loading ? 'disabled' : ''}>
          ${state.loading ? 'Analyzing...' : 'Analyze Problem'}
        </button>
      </div>
      ${state.scribbleAnalysis ? renderScribbleResults() : ''}
    </div>
  `;
}

function renderScribbleResults() {
  const analysis = state.scribbleAnalysis;
  return `
    <div style="background: var(--color-secondary-bg); border: 1px solid var(--color-glass-border); border-radius: 16px; padding: 24px;">
      <h4 style="font-family: var(--font-heading); font-size: 18px; margin-bottom: 16px;">
        Analysis Results
      </h4>
      
      <div style="margin-bottom: 20px;">
        <strong style="color: var(--color-accent-orange);">Subject:</strong>
        <span>${escapeHtml(analysis.subject)}</span>
      </div>
      
      <div style="margin-bottom: 20px;">
        <strong style="color: var(--color-accent-orange);">Problem Understanding:</strong>
        <p style="margin-top: 8px; line-height: 1.6;">${escapeHtml(analysis.problem_understanding)}</p>
      </div>
      
      ${analysis.error_analysis?.found_error ? `
        <div style="margin-bottom: 20px; padding: 16px; background: rgba(239, 68, 68, 0.1); border-radius: 12px;">
          <strong style="color: var(--color-accent-red);">Error Found!</strong>
          <p style="margin-top: 8px;">${escapeHtml(analysis.error_analysis.why_wrong)}</p>
          <p style="margin-top: 8px; font-size: 13px; color: var(--color-text-dim);">
            <strong>Concept Gap:</strong> ${escapeHtml(analysis.error_analysis.concept_gap)}
          </p>
        </div>
      ` : `
        <div style="margin-bottom: 20px; padding: 16px; background: rgba(34, 197, 94, 0.1); border-radius: 12px;">
          <strong style="color: var(--color-accent-green);">No Errors Found</strong>
        </div>
      `}
      
      <div style="margin-bottom: 20px;">
        <strong style="color: var(--color-accent-orange);">Step-by-Step Solution:</strong>
        <ol style="margin-top: 12px; padding-left: 24px; line-height: 1.8;">
          ${analysis.step_by_step_solution.map(step => `<li>${escapeHtml(step)}</li>`).join('')}
        </ol>
      </div>
      
      <div style="margin-bottom: 20px;">
        <strong style="color: var(--color-accent-orange);">Final Answer:</strong>
        <p style="margin-top: 8px;">${escapeHtml(analysis.final_answer)}</p>
      </div>
      
      <div style="background: var(--color-tertiary-bg); border-radius: 12px; padding: 16px;">
        <strong style="color: var(--color-accent-amber);">Simple Explanation:</strong>
        <p style="margin-top: 8px; line-height: 1.6;">${escapeHtml(analysis.concept_teaching?.simple_explanation || '')}</p>
      </div>
    </div>
  `;
}

function renderNotesGenerator() {
  return `
    <div class="notes-module">
      <div class="notes-header">
        <h3>Scientific Documentation Lab</h3>
        <p class="module-description">Generate comprehensive lecture notes for any STEM topic.</p>
      </div>
      <div class="notes-form">
        <div class="form-group">
          <label for="notesTopic">Topic</label>
          <input type="text" id="notesTopic" placeholder="e.g., Newton's Laws of Motion, Photosynthesis..." ${state.loading ? 'disabled' : ''}>
        </div>
        <button class="generate-btn" id="generateNotesBtn" ${state.loading ? 'disabled' : ''}>
          ${state.loading ? 'Generating...' : 'Generate Notes'}
        </button>
      </div>
      ${state.notesData ? renderNotesResults() : ''}
    </div>
  `;
}

function renderNotesResults() {
  const notes = state.notesData;
  return `
    <div class="notes-output">
      <div class="notes-section">
        <h4>Overview</h4>
        <p>${escapeHtml(notes.overview)}</p>
      </div>
      <div class="notes-section">
        <h4>Full Lecture Notes</h4>
        <pre>${escapeHtml(notes.fullLectureNotes)}</pre>
      </div>
      ${notes.conceptBreakdown?.length > 0 ? `
        <div class="notes-section">
          <h4>Concept Breakdown</h4>
          ${notes.conceptBreakdown.map(c => `
            <div style="margin-bottom: 16px; padding: 12px; background: var(--color-tertiary-bg); border-radius: 8px;">
              <strong>${escapeHtml(c.concept)}</strong>
              <p style="margin-top: 8px; font-size: 14px;">${escapeHtml(c.detailedExplanation)}</p>
              <p style="margin-top: 8px; font-size: 13px; color: var(--color-text-dim);">
                <em>Example: ${escapeHtml(c.example)}</em>
              </p>
            </div>
          `).join('')}
        </div>
      ` : ''}
      ${notes.keyDefinitions?.length > 0 ? `
        <div class="notes-section">
          <h4>Key Definitions</h4>
          <dl style="line-height: 1.8;">
            ${notes.keyDefinitions.map(d => `
              <dt style="font-weight: 600; color: var(--color-accent-orange);">${escapeHtml(d.term)}</dt>
              <dd style="margin-bottom: 12px;">${escapeHtml(d.definition)}</dd>
            `).join('')}
          </dl>
        </div>
      ` : ''}
      ${notes.formulaSheet?.length > 0 ? `
        <div class="notes-section">
          <h4>Formula Sheet</h4>
          ${notes.formulaSheet.map(f => `
            <div style="margin-bottom: 12px;">
              <code style="background: var(--color-tertiary-bg); padding: 4px 8px; border-radius: 4px;">
                ${escapeHtml(f.formula)}
              </code>
              <span style="margin-left: 12px; font-size: 13px; color: var(--color-text-dim);">
                ${escapeHtml(f.description)}
              </span>
            </div>
          `).join('')}
        </div>
      ` : ''}
      <div class="notes-section">
        <h4>Revision Summary</h4>
        <p style="padding: 16px; background: rgba(255, 122, 0, 0.1); border-radius: 8px;">
          ${escapeHtml(notes.revisionSummary)}
        </p>
      </div>
    </div>
  `;
}

function renderQuizGenerator() {
  return `
    <div class="quiz-module">
      <div class="quiz-header">
        <h3>Mastery Assessment Engine</h3>
        <p class="module-description">Generate quizzes to test your knowledge on any topic.</p>
      </div>
      <div class="quiz-form">
        <div class="form-group">
          <label for="quizTopic">Topic</label>
          <input type="text" id="quizTopic" placeholder="e.g., Algebra, Physics..." ${state.loading ? 'disabled' : ''}>
        </div>
        <div class="form-group">
          <label for="quizCount">Number of Questions</label>
          <select id="quizCount" ${state.loading ? 'disabled' : ''}>
            <option value="3">3 Questions</option>
            <option value="5" selected>5 Questions</option>
            <option value="10">10 Questions</option>
          </select>
        </div>
        <button class="generate-btn" id="generateQuizBtn" ${state.loading ? 'disabled' : ''}>
          ${state.loading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </div>
      ${state.quizData ? renderQuizQuestions() : ''}
    </div>
  `;
}

function renderQuizQuestions() {
  if (!state.quizData?.questions?.length) {
    return `<p style="text-align: center; color: var(--color-text-dim);">No questions generated. Please try again.</p>`;
  }
  
  return `
    <div class="quiz-questions">
      ${state.quizData.questions.map((q, qIndex) => `
        <div class="quiz-question">
          <p class="question-text"><strong>Q${qIndex + 1}:</strong> ${escapeHtml(q.question)}</p>
          <div class="question-options">
            ${q.options.map((opt, optIndex) => `
              <button class="option-btn" data-question="${qIndex}" data-option="${optIndex}">
                ${String.fromCharCode(65 + optIndex)}. ${escapeHtml(opt)}
              </button>
            `).join('')}
          </div>
          <div class="feedback" id="feedback-${qIndex}" style="display: none;"></div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderQuantumResearchEngine() {
  return `
    <div class="chat-module" style="max-width: 100%;">
      <div class="chat-header">
        <h3>Quantum Research Engine</h3>
        <p class="module-description">Deep dive into any STEM concept with comprehensive analysis.</p>
      </div>
      <div style="background: var(--color-secondary-bg); border: 1px solid var(--color-glass-border); border-radius: 16px; padding: 24px;">
        <textarea 
          id="researchInput" 
          class="chat-input" 
          style="width: 100%; min-height: 150px; resize: vertical;"
          placeholder="Enter any STEM concept, equation, or question for deep analysis..."
          ${state.loading ? 'disabled' : ''}
        ></textarea>
        <button class="generate-btn" id="researchBtn" style="margin-top: 16px; width: 100%;" ${state.loading ? 'disabled' : ''}>
          ${state.loading ? 'Researching...' : 'Conduct Research'}
        </button>
        <div id="researchOutput" class="research-output" style="margin-top: 24px;"></div>
      </div>
    </div>
  `;
}

function renderConceptDependencyMap() {
  return `
    <div class="notes-module">
      <div class="notes-header">
        <h3>Concept Dependency Map</h3>
        <p class="module-description">Visualize the learning path and dependencies between concepts.</p>
      </div>
      <div class="notes-form">
        <div class="form-group">
          <label for="dependencyConcept">Concept</label>
          <input type="text" id="dependencyConcept" placeholder="e.g., Calculus, Machine Learning..." ${state.loading ? 'disabled' : ''}>
        </div>
        <button class="generate-btn" id="generateMapBtn" ${state.loading ? 'disabled' : ''}>
          ${state.loading ? 'Generating Map...' : 'Generate Dependency Map'}
        </button>
      </div>
      ${state.dependencyMap ? renderDependencyMapResults() : ''}
    </div>
  `;
}

function renderDependencyMapResults() {
  const map = state.dependencyMap;
  if (!map?.nodes?.length) {
    return `<p style="text-align: center; color: var(--color-text-dim);">No nodes generated. Please try again.</p>`;
  }
  
  return `
    <div style="background: var(--color-secondary-bg); border: 1px solid var(--color-glass-border); border-radius: 16px; padding: 24px;">
      <h4 style="font-family: var(--font-heading); font-size: 18px; margin-bottom: 8px;">
        ${escapeHtml(map.subject)}
      </h4>
      <p style="color: var(--color-text-dim); margin-bottom: 24px;">${escapeHtml(map.description)}</p>
      
      <div style="display: flex; flex-direction: column; gap: 16px;">
        ${map.nodes.map(node => `
          <div style="
            background: var(--color-tertiary-bg);
            border: 1px solid var(--color-glass-border);
            border-radius: 12px;
            padding: 16px;
            ${node.difficulty === 'Beginner' ? 'border-left: 3px solid var(--color-accent-green);' : ''}
            ${node.difficulty === 'Intermediate' ? 'border-left: 3px solid var(--color-accent-amber);' : ''}
            ${node.difficulty === 'Advanced' ? 'border-left: 3px solid var(--color-accent-orange);' : ''}
          ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <strong style="font-size: 16px;">${escapeHtml(node.name)}</strong>
              <span style="
                font-size: 11px;
                padding: 4px 8px;
                border-radius: 4px;
                background: var(--color-glass);
              ">${node.difficulty}</span>
            </div>
            <p style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 12px;">
              ${escapeHtml(node.summary)}
            </p>
            ${node.prerequisites?.length ? `
              <p style="font-size: 12px; color: var(--color-text-dim);">
                <strong>Prerequisites:</strong> ${node.prerequisites.map(p => escapeHtml(p)).join(', ')}
              </p>
            ` : ''}
            ${node.related?.length ? `
              <p style="font-size: 12px; color: var(--color-text-dim);">
                <strong>Related:</strong> ${node.related.map(r => escapeHtml(r)).join(', ')}
              </p>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderLearningProgress() {
  return `
    <div class="progress-module">
      <div class="progress-header">
        <h3>Academic Propulsion</h3>
        <p>Track your learning journey and achievements</p>
      </div>
      <div class="progress-cards">
        <div class="progress-card">
          <h4>Sessions Completed</h4>
          <div class="progress-stat">${state.chatMessages.length > 0 ? Math.ceil(state.chatMessages.length / 2) : 0}</div>
          <p>Chat sessions</p>
        </div>
        <div class="progress-card">
          <h4>Quizzes Taken</h4>
          <div class="progress-stat">${state.quizData ? state.quizData.questions?.length || 0 : 0}</div>
          <p>Questions reviewed</p>
        </div>
        <div class="progress-card">
          <h4>Notes Generated</h4>
          <div class="progress-stat">${state.notesData ? 1 : 0}</div>
          <p>Topics covered</p>
        </div>
        <div class="progress-card">
          <h4>Problems Analyzed</h4>
          <div class="progress-stat">${state.scribbleAnalysis ? 1 : 0}</div>
          <p>In Scribble Lab</p>
        </div>
      </div>
    </div>
  `;
}

function renderSettings() {
  return `
    <div class="settings-module">
      <h3>Settings</h3>
      <div class="settings-section">
        <h4>Accessibility</h4>
        <div class="setting-item">
          <label>
            <input type="checkbox" id="settingDyslexia" ${state.settings.dyslexiaFont ? 'checked' : ''}>
            <span>Dyslexia-Friendly Font</span>
          </label>
          <p class="setting-desc">Use an easier-to-read font style</p>
        </div>
        <div class="setting-item">
          <label>
            <input type="checkbox" id="settingHighContrast" ${state.settings.highContrast ? 'checked' : ''}>
            <span>High Contrast Mode</span>
          </label>
          <p class="setting-desc">Increase contrast for better visibility</p>
        </div>
        <div class="setting-item">
          <label>
            <input type="checkbox" id="settingLightMode" ${state.settings.lightMode ? 'checked' : ''}>
            <span>Light Mode</span>
          </label>
          <p class="setting-desc">Switch to light theme</p>
        </div>
        <div class="setting-item">
          <label>
            <input type="checkbox" id="settingCustomCursor" ${state.settings.customCursor ? 'checked' : ''}>
            <span>Custom Pen Cursor</span>
          </label>
          <p class="setting-desc">Use SciForge's signature pen cursor</p>
        </div>
      </div>
    </div>
  `;
}

function renderRightPanel() {
  if (state.currentModule === 'home' || state.currentModule === 'settings' || state.currentModule === 'progress') {
    return '';
  }
  
  return `
    <aside class="right-panel">
      <div class="panel-header">
        <h4>Learning Mode</h4>
      </div>
      <div class="learning-modes">
        <button class="mode-btn active">Beginner</button>
        <button class="mode-btn">Analogy</button>
        <button class="mode-btn">Advanced</button>
      </div>
    </aside>
  `;
}

function renderMobileNav() {
  const tools = [
    { id: 'home', icon: '🏠' },
    { id: 'chat', icon: '💬' },
    { id: 'quiz', icon: '❓' },
    { id: 'settings', icon: '⚙️' }
  ];
  
  return `
    <nav class="mobile-nav">
      ${tools.map(tool => `
        <button class="mobile-nav-item ${state.currentModule === tool.id ? 'active' : ''}" data-module="${tool.id}">
          ${tool.icon}
        </button>
      `).join('')}
    </nav>
  `;
}

function renderLoadingOverlay() {
  return `
    <div class="loading-overlay ${state.loading ? 'active' : ''}" id="loadingOverlay">
      <div class="loading-spinner"></div>
      <p>Processing your request...</p>
    </div>
  `;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function attachEventListeners() {
  // Navigation
  document.querySelectorAll('[data-module]').forEach(el => {
    el.addEventListener('click', () => {
      const module = el.dataset.module;
      if (module) {
        state.currentModule = module;
        renderApp();
      }
    });
  });
  
  // Chat input
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('sendBtn');
  if (chatInput && sendBtn) {
    sendBtn.addEventListener('click', handleSendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSendMessage();
    });
  }
  
  // Scribble analysis
  const analyzeBtn = document.getElementById('analyzeBtn');
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', handleScribbleAnalysis);
  }
  
  // Quiz generation
  const generateQuizBtn = document.getElementById('generateQuizBtn');
  if (generateQuizBtn) {
    generateQuizBtn.addEventListener('click', handleQuizGeneration);
  }
  
  // Notes generation
  const generateNotesBtn = document.getElementById('generateNotesBtn');
  if (generateNotesBtn) {
    generateNotesBtn.addEventListener('click', handleNotesGeneration);
  }
  
  // Dependency map
  const generateMapBtn = document.getElementById('generateMapBtn');
  if (generateMapBtn) {
    generateMapBtn.addEventListener('click', handleDependencyMap);
  }
  
  // Research
  const researchBtn = document.getElementById('researchBtn');
  if (researchBtn) {
    researchBtn.addEventListener('click', handleResearch);
  }
  
  // Settings
  ['settingDyslexia', 'settingHighContrast', 'settingLightMode', 'settingCustomCursor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        const setting = id.replace('setting', '').toLowerCase();
        state.settings[setting === 'settingdyslexia' ? 'dyslexiaFont' : 
                       setting === 'settinghighcontrast' ? 'highContrast' :
                       setting === 'settinglightmode' ? 'lightMode' : 'customCursor'] = e.target.checked;
        saveSettings();
        applyAccessibilitySettings();
        renderApp();
      });
    }
  });
  
  // Quiz option clicks
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => handleQuizAnswer(btn));
  });
}

async function handleSendMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  
  if (!message || state.loading) return;
  
  state.loading = true;
  renderApp();
  
  // Add user message
  state.chatMessages.push({ role: 'user', content: message });
  renderApp();
  
  try {
    const response = await sendChatMessage(state.chatMessages.map(m => ({
      role: m.role,
      content: m.content
    })));
    
    state.chatMessages.push({ role: 'assistant', content: response });
  } catch (error) {
    state.chatMessages.push({ 
      role: 'assistant', 
      content: 'I apologize, but I encountered an error processing your request. Please try again.' 
    });
  }
  
  state.loading = false;
  renderApp();
  
  // Scroll to bottom
  const messagesContainer = document.getElementById('chatMessages');
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

async function handleScribbleAnalysis() {
  const input = document.getElementById('scribbleInput');
  const text = input.value.trim();
  
  if (!text || state.loading) return;
  
  state.loading = true;
  renderApp();
  
  try {
    state.scribbleAnalysis = await analyzeScribble(text);
  } catch (error) {
    console.error('Scribble analysis error:', error);
    state.scribbleAnalysis = {
      subject: 'Analysis Error',
      problem_understanding: 'Unable to analyze. Please try again.',
      is_correct: true,
      step_by_step_solution: [],
      difficulty_level: 'medium'
    };
  }
  
  state.loading = false;
  renderApp();
}

async function handleQuizGeneration() {
  const topic = document.getElementById('quizTopic').value.trim();
  const count = parseInt(document.getElementById('quizCount').value, 10);
  
  if (!topic || state.loading) return;
  
  state.loading = true;
  state.quizData = null;
  renderApp();
  
  try {
    state.quizData = await generateQuiz(topic, count);
  } catch (error) {
    console.error('Quiz generation error:', error);
    state.quizData = { topic, difficulty: 'medium', questions: [] };
  }
  
  state.loading = false;
  renderApp();
}

async function handleNotesGeneration() {
  const topic = document.getElementById('notesTopic').value.trim();
  
  if (!topic || state.loading) return;
  
  state.loading = true;
  state.notesData = null;
  renderApp();
  
  try {
    state.notesData = await generateNotes(topic);
  } catch (error) {
    console.error('Notes generation error:', error);
    state.notesData = { topic, overview: 'Error generating notes. Please try again.' };
  }
  
  state.loading = false;
  renderApp();
}

async function handleDependencyMap() {
  const concept = document.getElementById('dependencyConcept').value.trim();
  
  if (!concept || state.loading) return;
  
  state.loading = true;
  state.dependencyMap = null;
  renderApp();
  
  try {
    state.dependencyMap = await generateDependencyMap(concept);
  } catch (error) {
    console.error('Dependency map error:', error);
    state.dependencyMap = { subject: concept, description: '', nodes: [] };
  }
  
  state.loading = false;
  renderApp();
}

async function handleResearch() {
  const input = document.getElementById('researchInput');
  const topic = input.value.trim();
  const output = document.getElementById('researchOutput');
  
  if (!topic || state.loading) return;
  
  state.loading = true;
  output.innerHTML = '<div class="loading">Researching...</div>';
  
  try {
    const result = await analyzeSTEM(topic);
    output.innerHTML = `<div class="research-result">${escapeHtml(result).replace(/\n/g, '<br>')}</div>`;
  } catch (error) {
    output.innerHTML = '<div class="error">Error conducting research. Please try again.</div>';
  }
  
  state.loading = false;
}

function handleQuizAnswer(btn) {
  const questionIndex = parseInt(btn.dataset.question, 10);
  const optionIndex = parseInt(btn.dataset.option, 10);
  
  const question = state.quizData.questions[questionIndex];
  const selectedOption = question.options[optionIndex];
  const isCorrect = selectedOption === question.correctAnswer;
  
  // Show feedback
  const feedbackEl = document.getElementById(`feedback-${questionIndex}`);
  if (feedbackEl) {
    feedbackEl.style.display = 'block';
    feedbackEl.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
    feedbackEl.innerHTML = isCorrect 
      ? `<span class="correct">✓ Correct! ${question.explanation}</span>`
      : `<span class="incorrect">✗ Incorrect. The correct answer is: ${question.correctAnswer}</span>`;
  }
  
  // Disable all options for this question
  document.querySelectorAll(`.option-btn[data-question="${questionIndex}"]`).forEach(b => {
    b.disabled = true;
  });
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function saveSettings() {
  localStorage.setItem('sciforge_accessibility', JSON.stringify(state.settings));
}

function loadSettings() {
  const stored = localStorage.getItem('sciforge_accessibility');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      state.settings = { ...state.settings, ...parsed };
    } catch (e) {
      console.error('Error loading settings:', e);
    }
  }
}

function applyAccessibilitySettings() {
  const body = document.body;
  
  if (state.settings.dyslexiaFont) {
    body.classList.add('dyslexia-mode');
  } else {
    body.classList.remove('dyslexia-mode');
  }
  
  if (state.settings.customCursor) {
    body.classList.add('custom-cursor-enabled');
  } else {
    body.classList.remove('custom-cursor-enabled');
  }
  
  if (state.settings.lightMode) {
    body.classList.add('light-mode');
  } else {
    body.classList.remove('light-mode');
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  renderApp();
  
  // Set window title using Anna API
  if (Anna && Anna.window) {
    Anna.window.setTitle('SciForge AI - STEM Workbench');
  }
});