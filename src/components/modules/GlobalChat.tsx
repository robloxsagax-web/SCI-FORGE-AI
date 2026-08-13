import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, Sparkles, Send, Bot, Play, GraduationCap, Atom, 
  CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Award, Target, 
  HelpCircle, BookOpen, Lightbulb, Check, X, ShieldAlert, BadgeCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ChatMessage, ModuleType, LearningJourney, ExplanationStyles } from "../../types";
import { saveRecentSession } from "../../lib/utils";

interface GlobalChatProps {
  onRoute: (target: ModuleType) => void;
  messages: ChatMessage[];
  onAddMessage: (msg: ChatMessage) => void;
  onSetStatusMessage?: (msg: string | null) => void;
  showWorkspaceUINav?: boolean;
  onToggleWorkspaceUINav?: (show: boolean) => void;
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
  onToggleWorkspaceUINav
}: GlobalChatProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: chatHistory })
      });

      if (!response.ok) throw new Error("Could not deliver chat update to workstation backend.");

      const data = await response.json();
      
      // Record inquiry in the central telemetry to evolve academic intelligence recursively
      if (data.topic) {
        updateTelemetryOnAction("quiz_answer", { topic: data.topic, isCorrect: true });
      }

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
        text: data.directMessage || data.text || "I have compiled your adaptive STEM tutor module below.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: data.type || "learning_journey",
        topic: data.topic || "STEM Mechanics",
        journey: data.journey,
        explanationStyles: data.explanationStyles,
        mission: data.mission,
        scoreEstimation: data.scoreEstimation
      };

      onAddMessage(aiMsg);
      saveRecentSession("chat", `Interactive Inquiry: ${aiMsg.topic}`, [...messages, userMsg, aiMsg]);

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
      console.error(err);
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        sender: "ai",
        text: "Localized telemetry collision on neural processors. Let me reboot my active tutor state.",
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
            onClick={() => onToggleWorkspaceUINav?.(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-cyan/10 hover:bg-accent-cyan/25 border border-accent-cyan/25 hover:border-accent-cyan/50 text-[11px] font-mono font-bold text-accent-cyan rounded-xl transition-all cursor-pointer"
          >
            <GraduationCap className="w-3.5 h-3.5" /> EXPLORE ACADEMIC WORKSPACES
          </button>
        </div>
      )}

      {/* Real-time Learning Dashboard header area */}
      {!isNaturalMode && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 shrink-0 bg-secondary-bg/30 p-5 rounded-2xl border border-white/5 shadow-md">
          {/* Circle metric */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-white/5 fill-none" strokeWidth="4" />
                <circle 
                  cx="32" 
                  cy="32" 
                  r="28" 
                  className="stroke-accent-cyan fill-none transition-all duration-1000" 
                  strokeWidth="4" 
                  strokeDasharray={175} 
                  strokeDashoffset={175 - (175 * understandingScore) / 100} 
                />
              </svg>
              <div className="absolute font-mono text-base font-bold text-white">{understandingScore}</div>
            </div>
            <div className="space-y-0.5">
              <div className="text-xs font-mono text-accent-cyan font-bold tracking-wider flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> UNDERSTANDING SCORE
              </div>
              <p className="text-[10px] text-white/50">Adaptive competence based on questions & actions</p>
            </div>
          </div>

          {/* Strengths and Weaknesses */}
          <div className="flex flex-col justify-center border-t lg:border-t-0 lg:border-x border-white/5 px-2 lg:px-4 py-2 lg:py-0 gap-1">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-white/80">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent-green" /> 
              <span className="text-[10px] text-white/40 uppercase font-mono mr-1">Strengths:</span>
              <span className="truncate">{strengths[0] || "Active Questioning"}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-white/80">
              <AlertCircle className="w-3.5 h-3.5 text-accent-violet" /> 
              <span className="text-[10px] text-white/40 uppercase font-mono mr-1">Focus Zone:</span>
              <span className="truncate">{weaknesses[0] || "Advanced Formulation"}</span>
            </div>
          </div>

          {/* Adaptive pathway */}
          <div className="flex flex-col justify-center space-y-1">
            <div className="text-[10px] font-mono tracking-wider text-accent-green font-bold uppercase flex items-center gap-1">
              <Target className="w-3.5 h-3.5" /> ADAPTIVE MENTOR PATHWAY
            </div>
            <p className="text-[11px] text-white/70 leading-normal line-clamp-2 italic">
              "{improvementPath}"
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6">
        
        {/* Messages / Tutor Workspace */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-xl mx-auto py-12 space-y-8">
                <div className="w-16 h-16 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 flex items-center justify-center text-accent-cyan animate-pulse">
                  <Bot className="w-8 h-8" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
                    Select a workspace to begin
                  </p>
                </div>
                
                {/* Beautiful clean cards for selecting workspaces */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <button 
                    onClick={() => {
                      onToggleWorkspaceUINav?.(true);
                      onRoute("chat");
                    }}
                    className="p-5 rounded-2xl bg-secondary-bg/25 border border-white/5 hover:border-accent-cyan/35 text-left transition-all hover:translate-y-[-2px] cursor-pointer"
                  >
                    <h3 className="text-xs font-mono font-bold text-accent-cyan uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Bot className="w-4 h-4" /> Core Intelligence
                    </h3>
                    <p className="text-[11px] text-white/40 leading-snug">
                      Collaborate on science topics, solve calculations, and access the adaptive STEM mentor.
                    </p>
                  </button>

                  <button 
                    onClick={() => {
                      onToggleWorkspaceUINav?.(true);
                      onRoute("scribble");
                    }}
                    className="p-5 rounded-2xl bg-secondary-bg/25 border border-white/5 hover:border-accent-violet/35 text-left transition-all hover:translate-y-[-2px] cursor-pointer"
                  >
                    <h3 className="text-xs font-mono font-bold text-accent-violet uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4" /> Scribble Lab
                    </h3>
                    <p className="text-[11px] text-white/40 leading-snug">
                      Validate equations, logic derivations, and isolate math and physical errors.
                    </p>
                  </button>

                  <button 
                    onClick={() => {
                      onToggleWorkspaceUINav?.(true);
                      onRoute("scientist");
                    }}
                    className="p-5 rounded-2xl bg-secondary-bg/25 border border-white/5 hover:border-accent-green/35 text-left transition-all hover:translate-y-[-2px] cursor-pointer"
                  >
                    <h3 className="text-xs font-mono font-bold text-accent-green uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Atom className="w-4 h-4" /> Quantum Engine
                    </h3>
                    <p className="text-[11px] text-white/40 leading-snug">
                      Produce detailed peer thesis papers, physical formulas, and deep scientific inquiries.
                    </p>
                  </button>

                  <button 
                    onClick={() => {
                      onToggleWorkspaceUINav?.(true);
                      onRoute("notes");
                    }}
                    className="p-5 rounded-2xl bg-secondary-bg/25 border border-white/5 hover:border-accent-cyan/35 text-left transition-all hover:translate-y-[-2px] cursor-pointer"
                  >
                    <h3 className="text-xs font-mono font-bold text-accent-cyan uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> Notes Compiler
                    </h3>
                    <p className="text-[11px] text-white/40 leading-snug">
                      Compile summaries, key vocabulary indexes, and interactive physical study guides.
                    </p>
                  </button>
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
                          {/* Main introductory bubble */}
                          <div className="p-5 rounded-2xl bg-secondary-bg/10 border border-white/5 rounded-tl-none relative shadow-sm">
                            {msg.type !== "natural_conversation" && (
                              <h3 className="text-xs font-mono text-accent-cyan uppercase tracking-widest mb-2 font-bold flex items-center gap-1">
                                <Bot className="w-3.5 h-3.5" /> SCI-FORGE ADAPTIVE INSTRUCTOR
                              </h3>
                            )}
                            <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                            
                            {msg.topic && (
                              <div className="mt-3 inline-flex items-center gap-1.5 bg-accent-cyan/10 text-accent-cyan text-[10px] font-mono px-2.5 py-1 rounded-full border border-accent-cyan/25 font-bold uppercase">
                                <Atom className="w-3 h-3" /> Core: {msg.topic}
                              </div>
                            )}

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
