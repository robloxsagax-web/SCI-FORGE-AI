import { useState, useEffect } from "react";
import { 
  MessageSquare, BookOpen, HelpCircle, Database, Activity, Network, 
  GraduationCap, FolderArchive, Sparkles, ChevronRight, Clock, 
  FileText, BrainCircuit, Lightbulb, Target, TrendingUp, ArrowRight
} from "lucide-react";
import { motion } from "motion/react";
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
  gradient: string;
}

const WORKSPACE_CARDS: WorkspaceCard[] = [
  {
    id: "chat",
    title: "Core Intelligence Console",
    description: "Collaborate with your adaptive STEM mentor and explore concepts through guided discussion.",
    icon: MessageSquare,
    color: "#FF7A00",
    gradient: "from-[#FF7A00]/20 to-transparent"
  },
  {
    id: "scribble",
    title: "Scribble Analysis Lab",
    description: "Paste any question from any subject and receive detailed reasoning, correction, and explanations.",
    icon: BrainCircuit,
    color: "#22C55E",
    gradient: "from-[#22C55E]/20 to-transparent"
  },
  {
    id: "scientist",
    title: "Quantum Research Engine",
    description: "Generate structured academic investigations, scientific reports, and deep concept exploration.",
    icon: Database,
    color: "#22C55E",
    gradient: "from-[#22C55E]/20 to-transparent"
  },
  {
    id: "notes",
    title: "Notes Generator",
    description: "Create detailed revision notes, summaries, glossary lists, and exam preparation material.",
    icon: BookOpen,
    color: "#FFB547",
    gradient: "from-[#FFB547]/20 to-transparent"
  },
  {
    id: "quiz",
    title: "Quiz Generator",
    description: "Generate custom quizzes with selectable question counts and difficulty levels.",
    icon: HelpCircle,
    color: "#FFB547",
    gradient: "from-[#FFB547]/20 to-transparent"
  },
  {
    id: "dependencymap",
    title: "Concept Dependency Map",
    description: "Visualize relationships between concepts generated from your own prompts.",
    icon: Network,
    color: "#FFB547",
    gradient: "from-[#FFB547]/20 to-transparent"
  },
  {
    id: "progress",
    title: "Academic Propulsion",
    description: "Generate personalized study plans, revision pathways, and learning roadmaps.",
    icon: GraduationCap,
    color: "#FF7A00",
    gradient: "from-[#FF7A00]/20 to-transparent"
  },
  {
    id: "portfolio",
    title: "Research Portfolio",
    description: "View all generated notes, quizzes, research reports, and study artifacts in one place.",
    icon: FolderArchive,
    color: "#A1A1AA",
    gradient: "from-white/10 to-transparent"
  },
];

export function HomeDashboard({ onRoute, onStartChat, chatMessages, onViewConversations }: HomeDashboardProps) {
  const [telemetry, setTelemetry] = useState(getTelemetry());
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  
  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    // Load recent sessions from localStorage
    const saved = localStorage.getItem("sciforge_recent_sessions");
    if (saved) {
      try {
        setRecentSessions(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading sessions:", e);
      }
    }
    
    // Poll telemetry
    const interval = setInterval(() => {
      setTelemetry(getTelemetry());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { label: "Questions Solved", value: telemetry.questionsAnswered, icon: Target, color: "#FF7A00" },
    { label: "Notes Generated", value: telemetry.notesGenerated, icon: FileText, color: "#FFB547" },
    { label: "Quizzes Completed", value: telemetry.quizzesCompleted, icon: HelpCircle, color: "#22C55E" },
    { label: "Research Projects", value: telemetry.researchProjects, icon: TrendingUp, color: "#A1A1AA" },
  ];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#050505]">
      {/* Welcome Section */}
      <div className="px-8 pt-10 pb-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-heading font-bold text-white mb-1">
              {getGreeting()} 👋
            </h1>
            <p className="text-[#A1A1AA] text-base">
              Welcome back to <span className="text-[#FF7A00] font-semibold">SciForge AI</span>
            </p>
            <p className="text-[#71717A] text-sm mt-1">
              Your intelligent STEM workbench for learning, research, problem solving, and academic growth.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#111111] border border-white/8 rounded-2xl p-5 hover:border-[#FF7A00]/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                </div>
                <div className="text-2xl font-heading font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#71717A]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Assistant Section */}
      <div className="px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-br from-[#111111] to-[#1a1a1a] border border-white/8 rounded-3xl p-8 relative overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF7A00]/5 rounded-full blur-3xl" />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF7A00] to-[#FFB547] flex items-center justify-center">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-heading font-bold text-white">SciForge Adaptive Mentor</h2>
                    <p className="text-[#A1A1AA] text-sm">Need help with a topic?</p>
                  </div>
                </div>
              </div>
              
              <p className="text-[#71717A] mb-6 max-w-xl">
                Ask a question, request notes, generate quizzes, or start a research investigation. 
                Your AI-powered STEM companion is ready to assist.
              </p>
              
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={onStartChat}
                  className="flex items-center gap-2 px-6 py-3 bg-[#FF7A00] hover:bg-[#FF8C1A] text-white font-semibold rounded-xl transition-all duration-200 group"
                >
                  <MessageSquare className="w-5 h-5" />
                  Start Conversation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                
                {chatMessages.length > 0 && (
                  <button
                    onClick={onViewConversations}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-xl transition-all duration-200"
                  >
                    <Clock className="w-5 h-5" />
                    View Conversations
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Recent Conversations */}
      {recentSessions.length > 0 && (
        <div className="px-8 pb-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="text-lg font-heading font-semibold text-white mb-4">Recent Conversations</h3>
              <div className="space-y-2">
                {recentSessions.slice(0, 4).map((session, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const moduleMap: Record<string, ModuleType> = {
                        'chat': 'chat',
                        'notes': 'notes',
                        'quiz': 'quiz',
                        'scribble': 'scribble',
                        'scientist': 'scientist',
                        'simulation': 'simulation',
                        'dependencymap': 'dependencymap'
                      };
                      onRoute(moduleMap[session.type] || 'chat');
                    }}
                    className="w-full flex items-center justify-between p-4 bg-[#111111] hover:bg-[#1a1a1a] border border-white/5 rounded-xl transition-all duration-200 group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF7A00]/10 flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-[#FF7A00]" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{session.title}</p>
                        <p className="text-[#71717A] text-sm">{formatTimeAgo(session.timestamp)}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#71717A] group-hover:text-[#FF7A00] transition-colors" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Workspace Hub */}
      <div className="px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3 className="text-lg font-heading font-semibold text-white mb-6">Workspace Hub</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {WORKSPACE_CARDS.map((card, idx) => (
                <motion.button
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + idx * 0.05 }}
                  onClick={() => onRoute(card.id)}
                  className="group relative bg-[#111111] border border-white/8 rounded-2xl p-5 text-left overflow-hidden transition-all duration-300 hover:border-white/15 hover:shadow-lg hover:shadow-black/20"
                >
                  {/* Gradient overlay on hover */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br",
                    card.gradient
                  )} />
                  
                  <div className="relative z-10">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: `${card.color}15` }}
                    >
                      <card.icon className="w-6 h-6" style={{ color: card.color }} />
                    </div>
                    
                    <h4 className="text-white font-semibold mb-2 group-hover:text-[#FF7A00] transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-[#71717A] text-sm leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                  
                  {/* Arrow indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <ChevronRight className="w-5 h-5 text-[#FF7A00]" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}