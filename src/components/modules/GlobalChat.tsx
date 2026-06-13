import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Sparkles, Send, Bot, Play, GraduationCap, Atom, 
  CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Award, Target, 
  HelpCircle, BookOpen, Lightbulb, Check, X, ShieldAlert, BadgeCheck,
  FileText, BrainCircuit, FlaskConical, Pencil
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, ModuleType, LearningJourney, ExplanationStyles } from "../../types";
import { saveRecentSession } from "../../lib/utils";
import { cn } from "../../lib/utils";

// Premium Neural Nexus Logo - SciForge Core System
const NeuralNexusLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nexusGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFB547" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="nexusGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFB547" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.5" />
      </linearGradient>
      <filter id="nexusGlow">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="nodeGlow">
        <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Outer orbital rings */}
    <ellipse cx="18" cy="18" rx="15" ry="6" stroke="url(#nexusGrad1)" strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(-30 18 18)" />
    <ellipse cx="18" cy="18" rx="15" ry="6" stroke="url(#nexusGrad2)" strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(30 18 18)" />
    <ellipse cx="18" cy="18" rx="15" ry="6" stroke="#FF7A00" strokeWidth="0.5" strokeOpacity="0.3" />
    {/* Neural nodes */}
    <circle cx="18" cy="10" r="2.5" fill="#FF7A00" filter="url(#nodeGlow)" />
    <circle cx="24" cy="15" r="2" fill="#FFB547" filter="url(#nodeGlow)" />
    <circle cx="22" cy="22" r="2" fill="#FF7A00" filter="url(#nodeGlow)" />
    <circle cx="14" cy="22" r="2" fill="#FFB547" filter="url(#nodeGlow)" />
    <circle cx="12" cy="15" r="2" fill="#FF7A00" filter="url(#nodeGlow)" />
    <circle cx="18" cy="18" r="3" fill="#FF7A00" filter="url(#nexusGlow)" />
    {/* Connection lines */}
    <path d="M18 10L24 15M24 15L22 22M22 22L14 22M14 22L12 15M12 15L18 10" stroke="#FF7A00" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
    <path d="M18 10L18 18M24 15L18 18M22 22L18 18M14 22L18 18M12 15L18 18" stroke="#FFB547" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
    {/* Orbital electrons */}
    <circle cx="28" cy="12" r="1" fill="#FF7A00" opacity="0.7" />
    <circle cx="10" cy="26" r="1" fill="#FFB547" opacity="0.7" />
    <circle cx="8" cy="10" r="0.8" fill="#FF7A00" opacity="0.5" />
  </svg>
);

// Feature card component
const FeatureCard = ({ icon: Icon, label, color, onClick }: { icon: any; label: string; color: string; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.03, y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "p-4 rounded-xl bg-white/5 border border-white/5 text-left transition-all duration-300 cursor-pointer group relative overflow-hidden"
    )}
    style={{
      '--hover-border-color': color,
    } as React.CSSProperties}
  >
    <div 
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      style={{ background: `radial-gradient(circle at center, ${color}10 0%, transparent 70%)` }}
    />
    <div 
      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110"
      style={{ backgroundColor: `${color}20`, borderColor: `${color}40` }}
    >
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <span className="text-xs font-bold text-white/70 group-hover:text-white transition-colors duration-200">{label}</span>
    <div 
      className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-all duration-300"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
    />
  </motion.button>
);

interface GlobalChatProps {
  onRoute: (target: ModuleType) => void;
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onSetStatusMessage?: (msg: string | null) => void;
  showWorkspaceUINav?: boolean;
  onToggleWorkspaceUINav?: (show: boolean) => void;
  pendingMessage?: string | null;
  onPendingMessageConsumed?: () => void;
}

const SCIENTIFIC_SUGGESTIONS = [
  { text: "I want to learn about Photosynthesis", route: "chat", icon: BookOpen },
  { text: "Teach me Newton's Laws of Motion", route: "chat", icon: Play },
  { text: "I don't understand Enzyme Denaturation", route: "chat", icon: Atom },
];

import { getTelemetry, updateTelemetryOnAction } from "../../lib/telemetry";

export function GlobalChat({ 
  onRoute, 
  messages, 
  onAddMessage, 
  onSetStatusMessage,
  showWorkspaceUINav = false,
  onToggleWorkspaceUINav,
  pendingMessage,
  onPendingMessageConsumed
}: GlobalChatProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Handle pending message from homepage
  useEffect(() => {
    if (pendingMessage) {
      // Small delay to ensure component is mounted and ready
      const timer = setTimeout(() => {
        handleSend(pendingMessage);
        onPendingMessageConsumed?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pendingMessage]);

  // Read and poll from central scientific telemetry
  const [telemetry, setTelemetry] = useState(getTelemetry());

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(getTelemetry());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const understandingScore = telemetry.understandingScore;
  const strengths = telemetry.strengths.length > 0 ? telemetry.strengths : ["Inquiry and question formulation"];
  const weaknesses = telemetry.weaknesses.length > 0 ? telemetry.weaknesses : ["General baseline constraints"];
  const improvementPath = telemetry.adaptiveMentorPathway;

  // Gamified Mission states
  const [activeMission, setActiveMission] = useState<any>(null);
  const [missionQuests, setMissionQuests] = useState<boolean[]>([false, false, false]);
  const [activeMissionQuizAnswer, setActiveMissionQuizAnswer] = useState<string | null>(null);
  const [missionQuizCorrect, setMissionQuizCorrect] = useState<boolean | null>(null);
  const [showWorkspaceLauncher, setShowWorkspaceLauncher] = useState(false);

  // Workspace launcher items
  const workspaceItems = [
    { id: "notes", label: "Scientific Documentation Lab", icon: "📝", color: "#FFB547" },
    { id: "quiz", label: "Mastery Assessment Engine", icon: "❓", color: "#FFB547" },
    { id: "scribble", label: "Scribble Analysis Lab", icon: "✍️", color: "#22C55E" },
    { id: "scientist", label: "Quantum Research Engine", icon: "🔬", color: "#22C55E" },
    { id: "dependencymap", label: "Concept Dependency Map", icon: "🗺️", color: "#FF7A00" },
    { id: "progress", label: "Academic Propulsion", icon: "🚀", color: "#FF7A00" },
    { id: "portfolio", label: "Research Portfolio", icon: "📚", color: "#A1A1AA" },
  ];

  const updateUnderstandingScore = (modifier: number) => {
    // Direct telemetry modification to preserve dynamic backpropagation scaling
    if (modifier > 0) {
      updateTelemetryOnAction("quiz_answer", { topic: "Mission Milestone Check", isCorrect: true });
    } else {
      updateTelemetryOnAction("quiz_answer", { topic: "Mission Milestone Check", isCorrect: false });
    }
    setTelemetry(getTelemetry());
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const lastAiMsg = [...messages].reverse().find(m => m.sender === "ai");
  const isNaturalMode = !lastAiMsg || lastAiMsg.type === "natural_conversation";

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    onAddMessage(userMsg);
    setInput("");
    setLoading(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      }));
      chatHistory.push({ role: "user", content: textToSend });

      console.log("[Chat] Sending request to /api/chat with", chatHistory.length, "messages");

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });

      console.log("[Chat] Received response status:", response.status);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      console.log("[Chat] API Response:", JSON.stringify(data, null, 2));
      
      // Validate response schema
      if (!data || typeof data !== 'object') {
        throw new Error("Invalid response format from server");
      }
      
      // Note: Understanding Score is NOT updated from chat messages
      // Scores only increase from real workspace actions (notes, quizzes, etc.)

      // Activate Gamified Mission Mode if requested or present
      if (data.mission) {
        setActiveMission(data.mission);
        setMissionQuests([false, false, false]);
        setMissionQuizCorrect(null);
        setActiveMissionQuizAnswer(null);
      }

      // Setup dynamic intelligence objects
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: data.directMessage || data.content || "Sorry, I couldn't generate a response right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: (data.type === "natural_conversation" || data.type === "greeting") ? "natural_conversation" : "explanation",
        menuBlock: data.menuBlock || "",
        topic: data.topic || "",
        journey: data.journey || null,
        explanationStyles: data.explanationStyles || null,
        mission: data.mission || null,
        scoreEstimation: data.scoreEstimation || null
      };

      onAddMessage(aiMsg);
      saveRecentSession("chat", `Interactive Inquiry: STEM Chat`, [...messages, userMsg, aiMsg]);

      // Workspace route triggers if appropriate
      let targetRoute: ModuleType | null = null;
      const lowerInput = textToSend.toLowerCase();
      if (lowerInput.includes("task") || lowerInput.includes("study") || lowerInput.includes("goal") || lowerInput.includes("plan") || lowerInput.includes("project")) {
        targetRoute = "simulation";
      } else if (lowerInput.includes("grade") || lowerInput.includes("scribble") || lowerInput.includes("solve") || lowerInput.includes("worksheet")) {
        targetRoute = "scribble";
      } else if (lowerInput.includes("research") || lowerInput.includes("scientist") || lowerInput.includes("lab report")) {
        targetRoute = "scientist";
      }

      if (targetRoute) {
        const destinationName = 
          targetRoute === "simulation" ? "PROJECTMATE AI WORKSPACE" :
          targetRoute === "scribble" ? "SCRIBBLE ANALYSIS LAB" :
          targetRoute === "scientist" ? "QUANTUM RESEARCH ENGINE" : targetRoute.toUpperCase();

        if (onSetStatusMessage) {
          onSetStatusMessage(`Core Router triggered: opening ${destinationName} workspace...`);
          setTimeout(() => onSetStatusMessage(null), 3000);
        }
        setTimeout(() => {
          onRoute(targetRoute as ModuleType);
        }, 1200);
      }

    } catch (err) {
      console.error("[Chat] Error:", err);
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "Sorry, I couldn't generate a response right now. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      onAddMessage(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const completeQuest = (index: number) => {
    const updated = [...missionQuests];
    updated[index] = !updated[index];
    setMissionQuests(updated);
    
    // Add points for ticking quests
    if (updated[index]) {
      updateUnderstandingScore(6);
    } else {
      updateUnderstandingScore(-6);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-primary-bg p-6 overflow-hidden relative" id="sciforge-chat-workbench">
      {/* Background neon elements */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[350px] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top action bar when workspace UI is collapsed */}
      {!showWorkspaceUINav && (
        <div className="flex justify-between items-center mb-6 shrink-0 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan shadow-[0_0_8px_rgba(0,229,255,0.8)] animate-pulse" />
            <h1 className="text-sm font-heading font-semibold tracking-wider text-white select-none uppercase">SciForge AI Workspace</h1>
          </div>
          <button 
            onClick={() => setShowWorkspaceLauncher(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF7A00]/10 hover:bg-[#FF7A00]/25 border border-[#FF7A00]/25 hover:border-[#FF7A00]/50 text-[11px] font-mono font-bold text-[#FF7A00] rounded-xl transition-all cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5" /> EXPLORE ACADEMIC WORKSPACES
          </button>
        </div>
      )}

      {/* Clean Activity Header - Real Data Only */}
      {messages.length > 0 && (
        <div className="mb-6 shrink-0 bg-secondary-bg/30 p-4 rounded-2xl border border-white/5">
          <div className="flex items-center gap-6 overflow-x-auto">
            <button 
              onClick={() => setShowWorkspaceLauncher(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF7A00]/10 border border-[#FF7A00]/20 hover:bg-[#FF7A00]/20 text-[#FF7A00] text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Browse Workspaces
            </button>
            <div className="h-6 w-px bg-white/10" />
            <span className="text-[10px] text-white/40 font-mono uppercase">Recent:</span>
            <div className="flex gap-2">
              {telemetry.notesGeneratedCount > 0 && (
                <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/60 font-mono">
                  📝 {telemetry.notesGeneratedCount} Notes
                </span>
              )}
              {telemetry.quizzesCompletedCount > 0 && (
                <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/60 font-mono">
                  ❓ {telemetry.quizzesCompletedCount} Quizzes
                </span>
              )}
              {telemetry.researchInvestigationsCount > 0 && (
                <span className="px-2 py-1 rounded bg-white/5 text-[10px] text-white/60 font-mono">
                  🔬 {telemetry.researchInvestigationsCount} Research
                </span>
              )}
              {telemetry.notesGeneratedCount === 0 && telemetry.quizzesCompletedCount === 0 && telemetry.researchInvestigationsCount === 0 && (
                <span className="text-[10px] text-white/30 font-mono">Start learning to see your activity</span>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6">
        
        {/* Messages / Tutor Workspace */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
                {/* Central Hub Logo with Pulse Animation */}
                <motion.div 
                  className="w-24 h-24 rounded-full bg-[#1a0f00] border-2 border-[#FF7A00]/30 flex items-center justify-center mb-6 relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  animate={{ 
                    boxShadow: [
                      "0 0 20px rgba(255,122,0,0.2)",
                      "0 0 40px rgba(255,122,0,0.4)",
                      "0 0 20px rgba(255,122,0,0.2)"
                    ]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                >
                  <NeuralNexusLogo className="w-16 h-16" />
                  {/* Glowing ring effect */}
                  <div className="absolute inset-0 rounded-full border border-[#FF7A00]/20 animate-ping" />
                </motion.div>
                <h2 className="text-xl font-heading font-bold text-white mb-2">Let's Learn Together</h2>
                <p className="text-sm text-white/50 mb-8 max-w-md">
                  Ask me anything about science, math, or technology. I can also help you create notes, quizzes, and research projects.
                </p>
                
                {/* Quick action buttons - Premium Feature Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                  <FeatureCard 
                    icon={FileText} 
                    label="Notes" 
                    color="#FFB547" 
                    onClick={() => onRoute("notes")} 
                  />
                  <FeatureCard 
                    icon={Target} 
                    label="Quizzes" 
                    color="#FF7A00" 
                    onClick={() => onRoute("quiz")} 
                  />
                  <FeatureCard 
                    icon={FlaskConical} 
                    label="Research" 
                    color="#22C55E" 
                    onClick={() => onRoute("scientist")} 
                  />
                  <FeatureCard 
                    icon={Pencil} 
                    label="Scribble" 
                    color="#8B5CF6" 
                    onClick={() => onRoute("scribble")} 
                  />
                </div>

                {/* Example prompts - Instantly Clickable */}
                <div className="mt-8 space-y-2 w-full">
                  <p className="text-[10px] text-white/30 uppercase font-mono tracking-wider">Quick Start:</p>
                  {[
                    "Explain photosynthesis",
                    "What is Newton's first law?",
                    "Quiz me on DNA",
                    "Make notes on thermodynamics"
                  ].map((prompt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.02, x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setInput(prompt);
                        setTimeout(() => {
                          const sendBtn = document.querySelector('[data-send-btn]') as HTMLButtonElement;
                          if (sendBtn && !sendBtn.disabled) {
                            handleSend(prompt);
                          }
                        }, 50);
                      }}
                      className="w-full p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-[#FF7A00]/30 text-left text-xs text-white/50 hover:text-white/70 transition-all font-mono flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-3 h-3 text-[#FF7A00]/0 group-hover:text-[#FF7A00] transition-all" />
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex gap-3.5 max-w-4xl ${msg.sender === "user" ? "ml-auto" : "mr-auto w-full"}`}>
                    
                    {msg.sender !== "user" && (
                      <div className="w-9 h-9 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center text-accent-cyan shrink-0 font-mono text-sm shadow">
                        SF
                      </div>
                    )}

                    <div className={`flex-1 ${msg.sender === "user" ? "max-w-xl ml-auto" : "w-full"}`}>
                      {msg.sender === "user" ? (
                        <div className="p-4 rounded-xl text-sm leading-relaxed bg-accent-violet/15 text-white border border-accent-violet/20 rounded-tr-none ml-auto text-right w-fit">
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          <span className="text-[9px] text-white/30 font-mono block mt-1.5">{msg.timestamp}</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Main chat bubble with raw markdown content */}
                          <div className="p-5 rounded-2xl bg-secondary-bg/10 border border-white/5 rounded-tl-none relative shadow-sm">
                            <div className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap font-sans">{msg.text}</div>
                            <span className="absolute bottom-1 right-2 text-[8px] text-white/20 font-mono">{msg.timestamp}</span>
                          </div>

                          {/* Render Structured Guided Learning blocks if present */}
                          {msg.journey && (
                            <AIChatResponseItem 
                              journey={msg.journey} 
                              explanationStyles={msg.explanationStyles}
                              onUpdateScore={updateUnderstandingScore}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex gap-4 max-w-xl mr-auto">
                    <div className="w-9 h-9 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan animate-spin shrink-0">
                      <Atom className="w-4 h-4" />
                    </div>
                    <div className="p-4 rounded-xl text-xs italic text-white/50 bg-secondary-bg/20 border border-white/5 rounded-tl-none font-mono">
                      Compiling customized STEM learning journey steps...
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
            )}
          </div>

          {/* Form input */}
          <div className="shrink-0 border-t border-glass-border pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="flex gap-3"
            >
              <div className="flex-1 relative bg-secondary-bg/40 rounded-xl h-12 flex items-center px-4 border border-white/5 focus-within:border-accent-cyan/40 focus-within:ring-1 focus-within:ring-accent-cyan/10 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question, request a topic, or say 'teach me Kepler's laws'..."
                  className="bg-transparent border-none outline-none flex-1 text-xs font-sans placeholder:text-white/30 text-white pr-4"
                  disabled={loading}
                />
                <button
                  type="submit"
                  data-send-btn
                  disabled={loading || !input.trim()}
                  className="w-8 h-8 rounded-full bg-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/30 flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Mission Mode Sidebar */}
        <AnimatePresence>
          {activeMission && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full lg:w-80 shrink-0 bg-secondary-bg/25 border border-white/5 rounded-3xl p-5 flex flex-col gap-5 overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <Play className="w-5 h-5 text-accent-cyan shrink-0" />
                  <div>
                    <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-accent-cyan">Active Mission</h2>
                    <p className="text-[9px] text-white/40 uppercase">Gamified Learning System</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveMission(null)}
                  className="p-1 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors cursor-pointer text-[10px] font-mono uppercase"
                >
                  Close
                </button>
              </div>

              {/* Mission header */}
              <div className="space-y-1 bg-accent-cyan/5 p-3 rounded-xl border border-accent-cyan/10">
                <div className="text-[8px] font-mono uppercase tracking-wider text-accent-cyan bg-accent-cyan/10 px-1.5 py-0.5 rounded w-fit font-bold">
                  DIFFICULTY: {activeMission.difficulty || "Medium"}
                </div>
                <h3 className="text-sm font-bold text-white leading-snug">{activeMission.title}</h3>
                <p className="text-[11px] text-white/70 leading-normal">{activeMission.objective}</p>
              </div>

              {/* Mission quest list */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-mono uppercase text-white/30 tracking-wider">Quest Log Checkpoints</h4>
                <div className="space-y-2">
                  {(activeMission.steps || []).map((step: string, i: number) => (
                    <div 
                      key={i} 
                      onClick={() => completeQuest(i)}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                        missionQuests[i] 
                          ? "bg-accent-green/10 border-accent-green/25 text-white/90" 
                          : "bg-white/5 border-transparent text-white/70 hover:border-white/10"
                      }`}
                    >
                      <button className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        missionQuests[i] ? "bg-accent-green border-accent-green text-black" : "border-white/20"
                      }`}>
                        {missionQuests[i] && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>
                      <span className="text-[11px] leading-tight select-none">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

               {/* Simulation suggestion link */}
              {activeMission.simulationSuggestion && (
                <div className="p-3 rounded-xl border border-white/5 bg-accent-violet/5 space-y-1.5">
                  <div className="text-[9px] font-mono uppercase tracking-wider text-accent-cyan font-bold flex items-center gap-1">
                    <Atom className="w-3.5 h-3.5" /> Study Target Calibration
                  </div>
                  <p className="text-[10px] text-white/60 leading-normal">{activeMission.simulationSuggestion}</p>
                  <button
                    onClick={() => onRoute("simulation")}
                    className="w-full mt-1.5 py-1.5 px-3 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/20 text-accent-cyan rounded-lg text-[10px] font-mono tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-1"
                  >
                    Configure Study Goals <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Master Check Quiz */}
              {activeMission.quizzes && activeMission.quizzes[0] && (
                <div className="space-y-2 border-t border-white/5 pt-4">
                  <h4 className="text-[10px] font-mono uppercase text-white/30 tracking-wider">Final Achievement Verification</h4>
                  <div className="bg-black/35 p-3 rounded-xl border border-white/5 space-y-3">
                    <div className="text-[11px] text-white/90 leading-normal">{activeMission.quizzes[0].question}</div>
                    <div className="space-y-1">
                      {activeMission.quizzes[0].options.map((opt: string) => (
                        <button
                          key={opt}
                          onClick={() => {
                            if (missionQuizCorrect !== null) return;
                            setActiveMissionQuizAnswer(opt);
                            const isCorrect = opt === activeMission.quizzes[0].answer;
                            setMissionQuizCorrect(isCorrect);
                            if (isCorrect) {
                              updateUnderstandingScore(15);
                            } else {
                              updateUnderstandingScore(-8);
                            }
                          }}
                          className={`w-full text-left p-2 rounded-lg text-[11px] transition-all cursor-pointer border ${
                            activeMissionQuizAnswer === opt
                              ? missionQuizCorrect
                                ? "bg-accent-green/10 border-accent-green text-accent-green font-semibold"
                                : "bg-accent-red/10 border-accent-red text-accent-red"
                              : "bg-white/5 border-transparent hover:bg-white/10 text-white/80"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {missionQuizCorrect !== null && (
                      <div className="text-[10px] bg-white/5 p-2 rounded-lg">
                        {missionQuizCorrect ? (
                          <div className="text-accent-green font-bold flex items-center gap-1 mb-1">
                            <BadgeCheck className="w-3.5 h-3.5" /> Mission Accomplished! +15 Pts
                          </div>
                        ) : (
                          <div className="text-accent-red font-bold flex items-center gap-1 mb-1">
                            <X className="w-3.5 h-3.5" /> Diagnostic Check Required
                          </div>
                        )}
                        <p className="text-white/60 leading-normal mt-0.5">
                          {activeMission.quizzes[0].explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace Launcher Modal */}
        <AnimatePresence>
          {showWorkspaceLauncher && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setShowWorkspaceLauncher(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#111111] border border-white/10 rounded-3xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-heading font-bold text-white flex items-center gap-2">
                    🍊 SCI-FORGE ACADEMIC WORKSPACES
                  </h2>
                  <button
                    onClick={() => setShowWorkspaceLauncher(false)}
                    className="p-2 hover:bg-white/5 rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {workspaceItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onRoute(item.id as ModuleType);
                        setShowWorkspaceLauncher(false);
                      }}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all text-left group"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-white group-hover:text-[#FF7A00] transition-colors">{item.label}</h3>
                        <div 
                          className="w-6 h-1 rounded-full mt-1.5" 
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#FF7A00] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

interface AIChatResponseItemProps {
  journey: LearningJourney;
  explanationStyles?: ExplanationStyles;
  onUpdateScore: (mod: number) => void;
}

function AIChatResponseItem({ journey, explanationStyles, onUpdateScore }: AIChatResponseItemProps) {
  const [activeTab, setActiveTab] = useState<"diagnose" | "foundation" | "deep" | "application" | "task" | "validation" | "next">("foundation");
  const [currentStyle, setCurrentStyle] = useState<"standard" | "simple" | "analogy" | "exam" | "visual">("standard");

  // Assessment task states
  const [userTaskAnswer, setUserTaskAnswer] = useState("");
  const [taskChecked, setTaskChecked] = useState(false);

  // Concept check quiz states
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);

  const getActiveTabContent = () => {
    switch (activeTab) {
      case "diagnose":
        return {
          title: "Concept Diagnosis & Prerequisites",
          text: journey.diagnosis,
          icon: ShieldAlert
        };
      case "foundation":
        return {
          title: "Core Concept Foundation",
          text: journey.foundation,
          icon: BookOpen
        };
      case "deep":
        return {
          title: "Deep Scholarly Analysis",
          text: journey.deep,
          icon: Atom
        };
      case "application":
        return {
          title: "Everyday & Industrial Applications",
          text: journey.application,
          icon: Target
        };
      case "task":
        return {
          title: "Active Learning Task",
          text: journey.task.challenge,
          icon: Lightbulb
        };
      case "validation":
        return {
          title: "Validation Check Quiz",
          text: journey.validation.question,
          icon: GraduationCap
        };
      case "next":
        return {
          title: "Adaptive Next Milestone Advice",
          text: journey.nextStep,
          icon: ArrowRight
        };
    }
  };

  const getStyleContent = () => {
    if (currentStyle === "standard" || !explanationStyles) return null;
    return explanationStyles[currentStyle as keyof ExplanationStyles];
  };

  const tabContent = getActiveTabContent();
  const styledOverride = getStyleContent();

  const handleTextTtsSync = (textToPlay: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(textToPlay);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      synth.speak(utterance);
    }
  };

  return (
    <div className="bg-secondary-bg/25 border border-white/5 rounded-2xl p-5 space-y-5 shadow-sm">
      {/* 7 Stage Horizontal Timeline indicator path */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 border-b border-white/5 select-none scrollbar-thin">
        {[
          { key: "diagnose", label: "🩺 Diagnosis" },
          { key: "foundation", label: "🧱 Foundation" },
          { key: "deep", label: "🧠 Deep Dive" },
          { key: "application", label: "🌍 Applications" },
          { key: "task", label: "⚡ Active Task" },
          { key: "validation", label: "🎯 Concept Quiz" },
          { key: "next", label: "🚀 Next Steps" }
        ].map((tab, i) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any);
              setCurrentStyle("standard");
            }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono transition-all shrink-0 cursor-pointer border ${
              activeTab === tab.key
                ? "bg-accent-cyan/15 hover:bg-accent-cyan/20 text-accent-cyan border-accent-cyan/30 font-bold"
                : "bg-white/5 text-white/50 border-transparent hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* "Explain it differently" mode transformation row */}
      {explanationStyles && (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 bg-black/20 p-3 rounded-xl border border-white/5">
          <div className="text-[10px] font-mono text-accent-cyan/80 font-bold flex items-center gap-1 shrink-0 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 animate-spin-slow" /> EXPLAIN IT DIFFERENTLY:
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {[
              { style: "standard", label: "Standard Mode" },
              { style: "simple", label: "🧱 Simpler" },
              { style: "analogy", label: "💡 Use Analogy" },
              { style: "exam", label: "📝 Exam-Focused" },
              { style: "visual", label: "👁️ Visual Thinking" }
            ].map((btn) => (
              <button
                key={btn.style}
                onClick={() => {
                  setCurrentStyle(btn.style as any);
                  onUpdateScore(2); // small score bonus for active exploration!
                }}
                className={`py-1 px-2.5 rounded-md text-[10px] font-mono transition-all cursor-pointer ${
                  currentStyle === btn.style
                    ? "bg-accent-violet text-white font-bold shadow-[0_0_8px_rgba(168,85,247,0.3)]"
                    : "bg-white/5 hover:bg-white/10 text-white/60"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Displaying main content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + "_" + currentStyle}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="space-y-4 font-sans"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-accent-cyan/10 border border-accent-cyan/20 rounded-lg text-accent-cyan">
              <tabContent.icon className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-semibold text-white">{tabContent.title}</h4>
          </div>

          <div className="text-xs text-white/85 leading-relaxed space-y-2 whitespace-pre-wrap">
            {styledOverride ? (
              <div className="border-l-2 border-accent-violet pl-3 text-white/90 italic">
                {styledOverride}
              </div>
            ) : (
              <p>{tabContent.text}</p>
            )}
          </div>

          {/* Special UI element: Active task grading block */}
          {activeTab === "task" && (
            <div className="bg-black/25 p-4 rounded-xl border border-white/5 space-y-3.5">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-accent-cyan" /> Submit Analytical Outline
              </div>
              <textarea
                value={userTaskAnswer}
                onChange={(e) => setUserTaskAnswer(e.target.value)}
                placeholder="Formulate your response check calculations, or write your scientific observation..."
                className="w-full bg-secondary-bg/50 border border-white/5 rounded-lg p-2.5 text-xs text-white placeholder:text-white/20 h-18 outline-none focus:border-accent-cyan/40"
              />
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-white/30 font-mono italic">
                  Answers are graded on scientific consistency metrics.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (!userTaskAnswer.trim()) return;
                    setTaskChecked(true);
                    onUpdateScore(8); // progress booster!
                  }}
                  disabled={!userTaskAnswer.trim()}
                  className="px-4 py-1.5 bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/20 text-accent-cyan font-mono text-[10px] rounded-lg tracking-wider uppercase transition-all cursor-pointer disabled:opacity-40"
                >
                  Confirm Outline Check
                </button>
              </div>

              {taskChecked && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/5 p-3 rounded-lg space-y-2 text-xs border-l-2 border-accent-cyan"
                >
                  <div className="text-accent-cyan font-bold font-mono text-[10px] uppercase">Instruction Answer Guidelines:</div>
                  <p className="text-white/80 italic leading-normal">
                    "{journey.task.solutionGuideline}"
                  </p>
                  <div className="text-[10px] text-white/30 italic">
                    Compare your submission with our model path. If they align, treat this milestone as fully completed! +8 Mastery points saved.
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Special UI element: Validation check quiz block */}
          {activeTab === "validation" && (
            <div className="bg-black/25 p-4 rounded-xl border border-white/5 space-y-3">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-accent-cyan" /> Click Correct Response Options
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(journey.validation.options || []).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      if (quizChecked) return;
                      setSelectedQuizOption(opt);
                      const isCorrect = opt === journey.validation.correctAnswer;
                      setQuizCorrect(isCorrect);
                      setQuizChecked(true);
                      if (isCorrect) {
                        onUpdateScore(12); // quiz validation booster
                      } else {
                        onUpdateScore(-6); // mini deductive penalty
                      }
                    }}
                    className={`text-left p-3 rounded-xl text-xs transition-all cursor-pointer border ${
                      selectedQuizOption === opt
                        ? quizCorrect
                          ? "bg-accent-green/10 border-accent-green text-accent-green font-semibold"
                          : "bg-accent-red/10 border-accent-red text-accent-red"
                        : "bg-white/5 border-transparent hover:bg-white/10 text-white/80"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {quizChecked && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/5 p-3.5 rounded-xl text-xs border border-white/5 space-y-1"
                >
                  {quizCorrect ? (
                    <div className="text-accent-green font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Perfect Accuracy! +12 Mastery Points Saved
                    </div>
                  ) : (
                    <div className="text-accent-red font-bold flex items-center gap-1">
                      <X className="w-4 h-4" /> Assessment Recommendation
                    </div>
                  )}
                  <p className="text-white/70 leading-normal mt-1">
                    {journey.validation.explanation}
                  </p>
                </motion.div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
