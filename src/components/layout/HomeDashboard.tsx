import { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, BookOpen, HelpCircle, Database, Activity, Network, 
  GraduationCap, FolderArchive, Sparkles, ChevronRight, Clock, 
  FileText, BrainCircuit, ArrowRight, Mic, Paperclip, LogOut,
  Target, TrendingUp, BookMarked, FlaskConical
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { ModuleType, ChatMessage } from "../../types";
import { updateTelemetryOnAction, getTelemetry } from "../../lib/telemetry";

interface HomeDashboardProps {
  onRoute: (module: ModuleType) => void;
  onStartChat: () => void;
  chatMessages: ChatMessage[];
  onViewConversations: () => void;
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

export function HomeDashboard({ onRoute, onStartChat, chatMessages, onViewConversations }: HomeDashboardProps) {
  const [telemetry, setTelemetry] = useState(getTelemetry());
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      onStartChat();
      // The chat will handle the input via global state
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
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
    <div className="flex-1 overflow-y-auto bg-[#050505]">
      {/* Main Content Container */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-4xl font-heading font-bold text-white mb-2 tracking-tight">
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
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
              className="bg-[#111111] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
              </div>
              <motion.div 
                className="text-3xl font-heading font-bold text-white mb-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-xs text-[#71717A] font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Mentor Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#111111] border border-white/5 rounded-3xl p-8 mb-6 relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-64 bg-gradient-to-br from-[#FF7A00]/5 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10">
            {/* Mentor Header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#FFB547] flex items-center justify-center shadow-lg shadow-[#FF7A00]/20">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-[#111111]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-heading font-semibold text-white">SciForge Adaptive Mentor</h2>
                  <span className="text-xs text-[#22C55E] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
                    Mentor Online
                  </span>
                </div>
                <p className="text-sm text-[#71717A]">Your AI-powered STEM companion</p>
              </div>
            </div>

            {/* Search Input Area */}
            <div className="relative">
              <div 
                className={cn(
                  "flex items-center gap-3 bg-[#1a1a1a] rounded-full px-6 py-4 border transition-all duration-300",
                  isInputFocused 
                    ? "border-[#FF7A00]/50 shadow-lg shadow-[#FF7A00]/10" 
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
                  placeholder="Ask a question, request notes, generate quizzes, or say 'teach me Kepler's laws'..."
                  className="flex-1 bg-transparent text-white placeholder:text-[#71717A] text-sm outline-none"
                />
                
                {/* Microphone & Attachment Icons */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-white/5 rounded-full text-[#71717A] hover:text-[#A1A1AA] transition-colors"
                    title="Voice input"
                  >
                    <Mic className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-white/5 rounded-full text-[#71717A] hover:text-[#A1A1AA] transition-colors"
                    title="Attach or scan"
                  >
                    <Paperclip className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Send Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className={cn(
                  "absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                  chatInput.trim() 
                    ? "bg-gradient-to-br from-[#FF7A00] to-[#FF8C1A] shadow-lg shadow-[#FF7A00]/30 text-white" 
                    : "bg-white/5 text-[#71717A] cursor-not-allowed"
                )}
              >
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              {["Teach me Photosynthesis", "Create a quiz on Physics", "Generate study notes"].map((suggestion, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => setChatInput(suggestion)}
                  whileHover={{ scale: 1.02 }}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs text-[#A1A1AA] hover:text-white transition-all duration-200"
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Recent Conversations */}
        {recentSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-semibold text-white">Recent Conversations</h3>
              <button 
                onClick={onViewConversations}
                className="text-xs text-[#FF7A00] hover:text-[#FFB547] transition-colors"
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
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  onClick={() => {
                    const moduleMap: Record<string, ModuleType> = {
                      'chat': 'chat', 'notes': 'notes', 'quiz': 'quiz',
                      'scribble': 'scribble', 'scientist': 'scientist',
                      'simulation': 'simulation', 'dependencymap': 'dependencymap'
                    };
                    onRoute(moduleMap[session.type] || 'chat');
                  }}
                  className="group flex-shrink-0 flex items-center gap-3 p-3 bg-[#111111] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/10 rounded-xl transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#FF7A00]/10 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[#FF7A00]" />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-sm text-white font-medium truncate max-w-[120px]">{session.title}</p>
                    <p className="text-[10px] text-[#71717A]">{formatTimeAgo(session.timestamp)}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Workspace Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-sm font-heading font-semibold text-white mb-4">Workspace Hub</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {WORKSPACE_CARDS.map((card, idx) => (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + idx * 0.05 }}
                onClick={() => onRoute(card.id)}
                className={cn(
                  "group relative bg-[#111111] border border-white/5 rounded-2xl p-5 text-left overflow-hidden transition-all duration-300",
                  card.hoverColor
                )}
              >
                {/* Hover Glow Effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${card.color}08 0%, transparent 50%)` 
                  }} 
                />
                
                <div className="relative z-10">
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${card.color}15` }}
                  >
                    <card.icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  
                  <h4 className="text-sm font-semibold text-white mb-1.5 group-hover:text-white transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-[#71717A] leading-relaxed">
                    {card.description}
                  </p>
                </div>
                
                {/* Arrow Indicator */}
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  className="absolute top-4 right-4"
                >
                  <ChevronRight className="w-4 h-4" style={{ color: card.color }} />
                </motion.div>
                
                {/* Active Border Line on Hover */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: card.color }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Bottom Spacing */}
        <div className="h-8" />
      </div>
    </div>
  );
}