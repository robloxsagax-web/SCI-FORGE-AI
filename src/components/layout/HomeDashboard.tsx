import { useState, useEffect, useRef, useCallback } from "react";
import { 
  MessageSquare, BookOpen, HelpCircle, Database, Activity, Network, 
  GraduationCap, FolderArchive, Sparkles, ChevronRight, Clock, 
  FileText, BrainCircuit, ArrowRight, Target, TrendingUp, BookMarked, 
  FlaskConical, Zap, Activity as ActivityIcon, Flame, Check, Upload,
  PanelLeft, Clock3, DoorOpen, ArrowUp, Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { ModuleType, ChatMessage } from "../../types";
import { updateTelemetryOnAction, getTelemetry } from "../../lib/telemetry";

interface HomeDashboardProps {
  onRoute: (module: ModuleType) => void;
  onStartChat: (initialMessage?: string) => void;
  chatMessages: ChatMessage[];
  onViewConversations: () => void;
  onTransferToWorkspace: (workspace: ModuleType, data?: any) => void;
}

interface WorkspaceCard {
  id: ModuleType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverColor: string;
}

const WORKSPACE_CARDS: WorkspaceCard[] = [
  {
    id: "chat",
    title: "Core Intelligence Console",
    description: "Collaborate with your adaptive STEM mentor",
    icon: MessageSquare,
    color: "#FF7A00",
    hoverColor: "hover:border-[#FF7A00]"
  },
  {
    id: "scribble",
    title: "Scribble Analysis Lab",
    description: "Detailed reasoning and error correction",
    icon: BrainCircuit,
    color: "#22C55E",
    hoverColor: "hover:border-[#22C55E]"
  },
  {
    id: "scientist",
    title: "Quantum Research Engine",
    description: "Deep academic investigations",
    icon: Database,
    color: "#22C55E",
    hoverColor: "hover:border-[#22C55E]"
  },
  {
    id: "notes",
    title: "Notes Generator",
    description: "Revision notes and exam prep",
    icon: BookOpen,
    color: "#FFB547",
    hoverColor: "hover:border-[#FFB547]"
  },
  {
    id: "quiz",
    title: "Quiz Generator",
    description: "Custom quizzes with difficulty levels",
    icon: HelpCircle,
    color: "#FFB547",
    hoverColor: "hover:border-[#FFB547]"
  },
  {
    id: "dependencymap",
    title: "Concept Dependency Map",
    description: "Visualize concept relationships",
    icon: Network,
    color: "#FFB547",
    hoverColor: "hover:border-[#FFB547]"
  },
  {
    id: "progress",
    title: "Academic Propulsion",
    description: "Personalized study roadmaps",
    icon: GraduationCap,
    color: "#FF7A00",
    hoverColor: "hover:border-[#FF7A00]"
  },
  {
    id: "portfolio",
    title: "Research Portfolio",
    description: "All your artifacts in one place",
    icon: FolderArchive,
    color: "#A1A1AA",
    hoverColor: "hover:border-[#A1A1AA]"
  },
];

const SUGGESTIONS = [
  { text: "Teach me Photosynthesis", icon: "🌿" },
  { text: "Create a quiz on Physics", icon: "⚡" },
  { text: "Generate study notes", icon: "📝" },
  { text: "Explain Newton's Laws", icon: "🔬" },
];

export function HomeDashboard({ onRoute, onStartChat, chatMessages, onViewConversations, onTransferToWorkspace }: HomeDashboardProps) {
  const [telemetry, setTelemetry] = useState(getTelemetry());
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem("sciforge_streak") || "0", 10);
  });
  const [showStreakBurst, setShowStreakBurst] = useState(false);
  const [clipboardText, setClipboardText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const saved = localStorage.getItem("sciforge_recent_sessions");
    if (saved) {
      try {
        setRecentSessions(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading sessions:", e);
      }
    }
    
    const interval = setInterval(() => {
      setTelemetry(getTelemetry());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle scroll for back-to-top button visibility
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      // Show button when scrolled more than 300px
      setShowBackToTop(scrollTop > 300);
    }
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  // Handle suggestion click - fill input and route to chat
  const handleSuggestionClick = useCallback((text: string) => {
    setChatInput(text);
    onStartChat(text);
    onRoute("chat");
    inputRef.current?.focus();
  }, [onStartChat, onRoute]);

  // Handle send message - route to chat with input
  const handleSendMessage = useCallback(() => {
    if (chatInput.trim()) {
      onStartChat(chatInput.trim());
      onRoute("chat");
    }
  }, [chatInput, onStartChat, onRoute]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle streak check-in with particle burst
  const handleStreakCheckIn = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("sciforge_streak", newStreak.toString());
    setShowStreakBurst(true);
    updateTelemetryOnAction("streak_checkin");
    setTimeout(() => setShowStreakBurst(false), 1000);
  };

  // Handle recent chat click - resume conversation
  const handleRecentChatClick = useCallback((session: any) => {
    const moduleMap: Record<string, ModuleType> = {
      'chat': 'chat', 'notes': 'notes', 'quiz': 'quiz',
      'scribble': 'scribble', 'scientist': 'scientist',
      'simulation': 'simulation', 'dependencymap': 'dependencymap'
    };
    const targetModule = moduleMap[session.type] || 'chat';
    
    // Restore conversation state and route
    if (session.state) {
      // Store the session state to be picked up by the target workspace
      localStorage.setItem("sciforge_restored_session", JSON.stringify({
        module: targetModule,
        state: session.state,
        title: session.title
      }));
    }
    onRoute(targetModule);
  }, [onRoute]);

  // Handle clipboard paste - auto-route to scribble or notes
  const handleClipboardPaste = useCallback((text: string) => {
    setClipboardText(text);
    if (text.length > 100) {
      // Long text - route to notes generator
      onTransferToWorkspace("notes", { preloadedTopic: text.substring(0, 200) });
      onRoute("notes");
    } else {
      // Short text - route to scribble analysis
      onTransferToWorkspace("scribble", { rawText: text });
      onRoute("scribble");
    }
  }, [onTransferToWorkspace, onRoute]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleClipboardPaste(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const stats = [
    { label: "Questions Solved", value: telemetry.quizCorrectAnswers || 0, icon: Target, color: "#FF7A00" },
    { label: "Notes Generated", value: telemetry.notesGeneratedCount || 0, icon: BookMarked, color: "#FFB547" },
    { label: "Quizzes Completed", value: telemetry.quizzesCompletedCount || 0, icon: HelpCircle, color: "#22C55E" },
    { label: "Research Projects", value: telemetry.researchInvestigationsCount || 0, icon: FlaskConical, color: "#A1A1AA" },
  ];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays}d ago`;
  };

  return (
    <div className="flex-1 flex flex-col relative bg-[#050505]">
      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        {/* Main Content Container */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-2 tracking-tight">
            {getGreeting()} 👋
          </h1>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg text-[#A1A1AA]">Welcome back to</span>
            <span className="text-lg font-semibold bg-gradient-to-r from-[#FF7A00] to-[#FFB547] bg-clip-text text-transparent">
              SciForge AI
            </span>
          </div>
          <p className="text-sm text-[#71717A] max-w-xl">
            Your Intelligent STEM workbench for learning, research, problem solving, and academic growth.
          </p>
        </motion.div>

        {/* Live Activity Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 sm:mb-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
              className="bg-[#111111] border border-white/5 rounded-2xl p-4 sm:p-5 hover:border-white/10 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300" style={{ color: stat.color }} />
                </div>
              </div>
              <motion.div 
                className="text-2xl sm:text-3xl font-heading font-bold text-white mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-[10px] sm:text-xs text-[#71717A] font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Mentor Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#111111] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-6 relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-48 sm:h-64 bg-gradient-to-br from-[#FF7A00]/5 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10">
            {/* Mentor Header */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#FFB547] flex items-center justify-center shadow-lg shadow-[#FF7A00]/20">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-[#111111]" />
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <h2 className="text-lg sm:text-xl font-heading font-semibold text-white">SciForge Adaptive Mentor</h2>
                  <span className="text-[10px] sm:text-xs text-[#22C55E] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
                    Mentor Online
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#71717A]">Your AI-powered STEM companion</p>
              </div>
            </div>

            {/* Clean Input Area - Send Button Outside */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div 
                className={cn(
                  "flex-1 bg-[#1a1a1a] rounded-full px-4 sm:px-6 py-3 sm:py-4 border transition-all duration-300",
                  isInputFocused 
                    ? "border-[#FF7A00]/50 shadow-[0_0_20px_rgba(255,122,0,0.15)]" 
                    : "border-white/5 hover:border-white/10"
                )}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="w-full bg-transparent text-white text-sm sm:text-base placeholder:text-[#71717A] outline-none"
                />
              </div>

              {/* Send Button - Outside, Sharp Circular */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                  chatInput.trim() 
                    ? "bg-[#FF7A00] hover:bg-[#FF8C1A] shadow-lg shadow-[#FF7A00]/30 text-white" 
                    : "bg-white/5 text-[#71717A] cursor-not-allowed"
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>

            {/* Quick Action Suggestion Pills */}
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
              {SUGGESTIONS.map((suggestion, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#FF7A00]/30 rounded-full text-xs text-[#A1A1AA] hover:text-white transition-all duration-200"
                >
                  <span>{suggestion.icon}</span>
                  <span>{suggestion.text}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout for Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* System Status & Streak Tracker Column */}
          <div className="space-y-6">
            
            {/* System Latency Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-[#111111] border border-white/5 rounded-2xl p-5"
            >
              <h3 className="text-sm font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF7A00]" />
                System Status
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-[#71717A] mb-1">Model</p>
                  <p className="text-sm font-mono text-white">Llama 3.3</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#71717A] mb-1">Latency</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                    <span className="text-sm font-mono text-white">42ms</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#71717A] mb-1">Tokens/s</p>
                  <p className="text-sm font-mono text-white">85 t/s</p>
                </div>
              </div>
            </motion.div>

            {/* Academic Streak Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#111111] border border-white/5 rounded-2xl p-5 relative overflow-hidden"
            >
              <h3 className="text-sm font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#FF7A00]" />
                Learning Streak
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FFB547]/10 flex items-center justify-center">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <div>
                    <motion.p 
                      className="text-2xl font-heading font-bold text-white"
                      key={streak}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {streak} Day{streak !== 1 ? 's' : ''}
                    </motion.p>
                    <p className="text-xs text-[#71717A]">Keep it going!</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStreakCheckIn}
                  className="relative px-4 py-2 bg-[#FF7A00]/10 hover:bg-[#FF7A00]/20 border border-[#FF7A00]/30 rounded-xl text-sm text-[#FF7A00] font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Check In
                  
                  {/* Particle Burst Animation */}
                  <AnimatePresence>
                    {showStreakBurst && (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 1, scale: 0 }}
                            animate={{ 
                              opacity: 0, 
                              scale: 1,
                              x: Math.cos(i * 45 * Math.PI / 180) * 40,
                              y: Math.sin(i * 45 * Math.PI / 180) * 40
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-2 h-2 rounded-full bg-[#FF7A00]" />
                          </motion.div>
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Quick-Scan Clipboard Dropper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-[#111111] border border-white/5 rounded-2xl p-5"
          >
            <h3 className="text-sm font-heading font-semibold text-white mb-4 flex items-center gap-2">
              <Upload className="w-4 h-4 text-[#FFB547]" />
              Quick-Scan Input Lab
            </h3>
            
            <motion.div
              animate={{ borderColor: isDragOver ? "#FF7A00" : "rgba(255,255,255,0.05)" }}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 text-center transition-colors duration-300 min-h-[120px] flex flex-col items-center justify-center gap-3",
                isDragOver ? "bg-[#FF7A00]/5" : "bg-[#1a1a1a]/50"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const text = e.dataTransfer.getData("text/plain");
                if (text) handleClipboardPaste(text);
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFB547]/10 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-[#FFB547]" />
              </div>
              
              {clipboardText ? (
                <div className="w-full text-left">
                  <p className="text-xs text-[#71717A] mb-1">Pasted content ({clipboardText.length} chars)</p>
                  <p className="text-sm text-white/80 line-clamp-2">{clipboardText.substring(0, 100)}...</p>
                </div>
              ) : (
                <p className="text-sm text-[#71717A]">
                  Drop text here or{" "}
                  <button 
                    onClick={handlePaste}
                    className="text-[#FF7A00] hover:underline"
                  >
                    paste from clipboard
                  </button>
                </p>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Recent Conversations */}
        {recentSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-semibold text-white">Recent Conversations</h3>
              <button 
                onClick={onViewConversations}
                className="text-xs text-[#FF7A00] hover:text-[#FFB547] transition-colors duration-200"
              >
                View all
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
              {recentSessions.slice(0, 4).map((session, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  transition={{ delay: 0.4 + idx * 0.05, duration: 0.2 }}
                  onClick={() => handleRecentChatClick(session)}
                  className="group flex-shrink-0 flex items-center gap-3 p-3 bg-[#111111] hover:bg-[#1a1a1a] border border-white/5 hover:border-[#FF7A00]/30 rounded-xl transition-all duration-200"
                >
                  <motion.div 
                    className="w-8 h-8 rounded-lg bg-[#FF7A00]/10 flex items-center justify-center"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MessageSquare className="w-4 h-4 text-[#FF7A00]" />
                  </motion.div>
                  <div className="text-left min-w-0">
                    <p className="text-sm text-white font-medium truncate max-w-[120px]">{session.title}</p>
                    <p className="text-[10px] text-[#71717A]">{formatTimeAgo(session.timestamp)}</p>
                  </div>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-[#71717A] group-hover:text-[#FF7A00] transition-colors shrink-0" />
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Workspace Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-sm font-heading font-semibold text-white mb-4">Workspace Hub</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {WORKSPACE_CARDS.map((card, idx) => (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, delay: 0.5 + idx * 0.05 }}
                onClick={() => onRoute(card.id)}
                className={cn(
                  "group relative bg-[#111111] border border-white/5 rounded-2xl p-5 text-left overflow-hidden transition-all duration-300",
                  card.hoverColor
                )}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${card.color}08 0%, transparent 50%)` 
                  }} 
                />
                
                <div className="relative z-10">
                  <motion.div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${card.color}15` }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <card.icon className="w-5 h-5 transition-transform duration-300" style={{ color: card.color }} />
                  </motion.div>
                  
                  <h4 className="text-sm font-semibold text-white mb-1.5 group-hover:text-white transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-[#71717A] leading-relaxed">
                    {card.description}
                  </p>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-4 right-4"
                >
                  <ChevronRight className="w-4 h-4" style={{ color: card.color }} />
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0"
                  style={{ color: card.color }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Bottom Spacing */}
        <div className="h-8" />
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#FF7A00] text-white flex items-center justify-center shadow-lg shadow-[#FF7A00]/30 z-50 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}