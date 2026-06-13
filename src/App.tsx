import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { RightPanel } from "./components/layout/RightPanel";
import { HomeDashboard } from "./components/layout/HomeDashboard";
import { LoginPage } from "./components/layout/LoginPage";
import { LoadingScreen } from "./components/layout/LoadingScreen";
import { ProjectMate } from "./components/modules/ProjectMate";
import { ScribbleAnalyzer } from "./components/modules/ScribbleAnalyzer";

import { AIScientist } from "./components/modules/AIScientist";
import { QuizGenerator } from "./components/modules/QuizGenerator";
import { NotesGenerator } from "./components/modules/NotesGenerator";
import { LearningProgress } from "./components/modules/LearningProgress";
import { GlobalChat } from "./components/modules/GlobalChat";
import { ConceptDependencyMap } from "./components/modules/ConceptDependencyMap";
import { ResearchPortfolio } from "./components/modules/ResearchPortfolio";
import { ModuleType, LearningMode, ChatMessage } from "./types";
import { Settings as SettingsIcon, Sparkles, Menu, X, Home, MessageSquare, PenTool, FileText, HelpCircle, Atom, Network, TrendingUp, FolderOpen, LogOut } from "lucide-react";
import { updateTelemetryOnAction } from "./lib/telemetry";
import { cn } from "./lib/utils";
import { getAuthState, signOut as authSignOut, getUser, User } from "./lib/auth";

type AppPage = 'login' | 'dashboard';

// Mobile Navigation Tool Items
const MOBILE_TOOLS = [
  { id: 'home' as ModuleType, label: 'Home', icon: Home, color: '#FF7A00' },
  { id: 'chat' as ModuleType, label: 'Core Intelligence Console', icon: MessageSquare, color: '#FF7A00' },
  { id: 'scribble' as ModuleType, label: 'Scribble Analysis Lab', icon: PenTool, color: '#22C55E' },
  { id: 'notes' as ModuleType, label: 'Notes Generator', icon: FileText, color: '#FFB547' },
  { id: 'quiz' as ModuleType, label: 'Quiz Generator', icon: HelpCircle, color: '#FFB547' },
  { id: 'scientist' as ModuleType, label: 'Quantum Research Engine', icon: Atom, color: '#22C55E' },
  { id: 'simulation' as ModuleType, label: 'ProjectMate AI', icon: Network, color: '#FF7A00' },
  { id: 'dependencymap' as ModuleType, label: 'Concept Dependency Map', icon: Network, color: '#FFB547' },
  { id: 'progress' as ModuleType, label: 'Academic Propulsion', icon: TrendingUp, color: '#FF7A00' },
  { id: 'portfolio' as ModuleType, label: 'Research Portfolio', icon: FolderOpen, color: '#A1A1AA' },
  { id: 'settings' as ModuleType, label: 'Settings', icon: SettingsIcon, color: '#A1A1AA' },
];

export default function App() {
  // Auth state - managed by localStorage
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<AppPage>('dashboard');

  const [activeModule, setActiveModule] = useState<ModuleType>("home");
  const [showWorkspaceUINav, setShowWorkspaceUINav] = useState(false);
  const [learningMode, setLearningMode] = useState<LearningMode>("beginner");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileShelfOpen, setIsMobileShelfOpen] = useState(false);

  // LocalStorage Auth - Check auth state on mount and listen for changes
  useEffect(() => {
    // Initial auth check
    const checkAuth = () => {
      const authState = getAuthState();
      const currentUser = getUser();
      setUser(currentUser);
      setIsAuthLoading(false);
      setCurrentPage(authState.isAuthenticated ? 'dashboard' : 'login');
    };

    // Check auth immediately
    checkAuth();

    // Listen for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      checkAuth();
    };
    window.addEventListener('storage', handleStorageChange);

    // Custom event listener for auth changes within same tab
    const handleAuthChange = () => {
      checkAuth();
    };
    window.addEventListener('authStateChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authStateChange', handleAuthChange);
    };
  }, []);

  // Handle sign out
  const handleSignOut = useCallback(() => {
    authSignOut();
    setUser(null);
    setActiveModule("home");
    setCurrentPage('login');
    // Dispatch event for multi-tab support
    window.dispatchEvent(new Event('authStateChange'));
  }, []);
  
  const [isCoreRunning, setIsCoreRunning] = useState(false);
  const [coreTime, setCoreTime] = useState(0);

  useEffect(() => {
    const savedRunning = localStorage.getItem("sciforge_core_running") === "true";
    setIsCoreRunning(savedRunning);
    const savedTime = parseInt(localStorage.getItem("sciforge_core_time") || "0", 10);
    setCoreTime(savedTime);
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isCoreRunning) {
      localStorage.setItem("sciforge_core_running", "true");
      interval = setInterval(() => {
        setCoreTime((prev) => {
          const next = prev + 1;
          localStorage.setItem("sciforge_core_time", next.toString());
          updateTelemetryOnAction("timer_run_seconds", 1);
          return next;
        });
      }, 1000);
    } else {
      localStorage.setItem("sciforge_core_running", "false");
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCoreRunning]);

  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [simIntel, setSimIntel] = useState<any>(null);
  const [scribbleIntel, setScribbleIntel] = useState<any>(null);
  const [scientistIntel, setScientistIntel] = useState<any>(null);
  const [dependIntel, setDependIntel] = useState<any>(null);

  const [dyslexiaMode, setDyslexiaMode] = useState(true); // Default ON
  const [highContrast, setHighContrast] = useState(false); // Default OFF
  const [tts, setTts] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [customCursor, setCustomCursor] = useState(true); // Default ON

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [pendingChatMessage, setPendingChatMessage] = useState<string | null>(null);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("sciforge_accessibility");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDyslexiaMode(parsed.dyslexiaFont ?? true); // Default ON
        setHighContrast(parsed.highContrast ?? false); // Default OFF
        setTts(parsed.tts || false);
        setIsLightMode(parsed.isLightMode || false);
        setCustomCursor(parsed.customCursor ?? true); // Default ON
      } catch (err) {
        // Set defaults on parse error
        setDyslexiaMode(true);
        setHighContrast(true);
        setCustomCursor(true);
      }
    } else {
      // Initialize with defaults on first load
      localStorage.setItem("sciforge_accessibility", JSON.stringify({
        dyslexiaFont: true,
        highContrast: true,
        tts: false,
        isLightMode: false,
        customCursor: true
      }));
    }
  }, []);

  // Apply custom cursor class to body
  useEffect(() => {
    if (customCursor) {
      document.body.classList.add("custom-cursor-enabled");
    } else {
      document.body.classList.remove("custom-cursor-enabled");
    }
  }, [customCursor]);

  const saveAccessibility = (updatedDyslexia: boolean, updatedContrast: boolean, updatedTts: boolean, updatedLight: boolean, updatedCursor?: boolean) => {
    setDyslexiaMode(updatedDyslexia);
    setHighContrast(updatedContrast);
    setTts(updatedTts);
    setIsLightMode(updatedLight);
    if (updatedCursor !== undefined) {
      setCustomCursor(updatedCursor);
    }
    localStorage.setItem("sciforge_accessibility", JSON.stringify({
      dyslexiaFont: updatedDyslexia,
      highContrast: updatedContrast,
      tts: updatedTts,
      isLightMode: updatedLight,
      customCursor: updatedCursor ?? customCursor
    }));
  };

  useEffect(() => {
    if (dyslexiaMode) {
      document.body.classList.add("dyslexia-mode");
    } else {
      document.body.classList.remove("dyslexia-mode");
    }
  }, [dyslexiaMode]);

  const handleGlobalSearchMessage = (userQuery: string) => {
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    setActiveModule("chat");
  };

  const handleStartChat = (initialMessage?: string) => {
    setActiveModule("chat");
    if (initialMessage) {
      setPendingChatMessage(initialMessage);
    }
  };

  // Check for restored session on module change to chat
  useEffect(() => {
    if (activeModule === "chat") {
      const restoredSession = localStorage.getItem("sciforge_restored_session");
      if (restoredSession) {
        try {
          const parsed = JSON.parse(restoredSession);
          if (parsed.module === "chat" && parsed.state) {
            setChatMessages(parsed.state);
          }
          localStorage.removeItem("sciforge_restored_session");
        } catch (err) {
          console.error("Error restoring session:", err);
        }
      }
    }
  }, [activeModule]);

  // Transfer data to specific workspace
  const handleTransferToWorkspace = (workspace: ModuleType, data?: any) => {
    // Store transfer data for workspace to consume
    if (data) {
      localStorage.setItem("sciforge_workspace_transfer", JSON.stringify({ workspace, ...data }));
      
      // If restoring a chat session, load the messages
      if (workspace === "chat" && data.restoredSession?.state) {
        setChatMessages(data.restoredSession.state);
      }
    }
  };

  const renderModule = () => {
    switch (activeModule) {
      case "home":
        return (
          <HomeDashboard 
            onRoute={setActiveModule}
            onStartChat={handleStartChat}
            chatMessages={chatMessages}
            onViewConversations={handleStartChat}
            onTransferToWorkspace={handleTransferToWorkspace}
          />
        );
      case "chat":
        return (
          <GlobalChat 
            onRoute={(target) => {
              setActiveModule(target);
              setShowWorkspaceUINav(true);
            }} 
            messages={chatMessages}
            onAddMessage={(msg) => setChatMessages(prev => [...prev, msg])}
            onSetStatusMessage={setSystemAlert}
            showWorkspaceUINav={showWorkspaceUINav}
            onToggleWorkspaceUINav={setShowWorkspaceUINav}
            pendingMessage={pendingChatMessage}
            onPendingMessageConsumed={() => setPendingChatMessage(null)}
          />
        );
      case "simulation":
        return (
          <ProjectMate 
            isRightPanelOpen={isRightPanelOpen} 
            setIsRightPanelOpen={setIsRightPanelOpen} 
            onUpdateIntelligence={setSimIntel} 
          />
        );
      case "scribble":
        return (
          <ScribbleAnalyzer 
            isRightPanelOpen={isRightPanelOpen} 
            setIsRightPanelOpen={setIsRightPanelOpen} 
            onUpdateIntelligence={setScribbleIntel} 
          />
        );
      case "scientist":
        return (
          <AIScientist 
            isRightPanelOpen={isRightPanelOpen} 
            setIsRightPanelOpen={setIsRightPanelOpen} 
            onUpdateIntelligence={setScientistIntel} 
          />
        );
      case "quiz":
        return <QuizGenerator />;
      case "dependencymap":
        return (
          <ConceptDependencyMap 
            onRoute={setActiveModule} 
            onUpdateIntelligence={setDependIntel} 
          />
        );
      case "notes":
        return <NotesGenerator />;
      case "portfolio":
        return <ResearchPortfolio />;
      case "progress":
        return (
          <LearningProgress 
            isCoreRunning={isCoreRunning}
            setIsCoreRunning={setIsCoreRunning}
            coreTime={coreTime}
            setCoreTime={setCoreTime}
          />
        );
      case "settings":
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto max-w-xl mx-auto space-y-8 relative">
            <SettingsIcon className="w-12 h-12 text-[#FF7A00] animate-spin-slow" />
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-heading font-semibold text-white">Platform Configuration</h2>
              <p className="text-sm text-[#71717A]">Customize your SciForge AI experience</p>
            </div>
            <div className="w-full space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">Dyslexia-Friendly Font</span>
                  <span className="text-xs text-[#71717A] block">OpenDyslexic font rendering for accessibility.</span>
                </div>
                <button 
                  onClick={() => saveAccessibility(!dyslexiaMode, highContrast, tts, isLightMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${dyslexiaMode ? "bg-[#FF7A00]" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${dyslexiaMode ? "left-7" : "left-1"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">High Contrast Highlights</span>
                  <span className="text-xs text-[#71717A] block">Intensifies saturation levels for color-blind learners.</span>
                </div>
                <button 
                  onClick={() => saveAccessibility(dyslexiaMode, !highContrast, tts, isLightMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${highContrast ? "bg-[#FF7A00]" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? "left-7" : "left-1"}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">SciForge Theme Selection</span>
                  <span className="text-xs text-[#71717A] block">Toggle between Space Dark and clean light layouts.</span>
                </div>
                <button 
                  onClick={() => saveAccessibility(dyslexiaMode, highContrast, tts, !isLightMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isLightMode ? "bg-[#FF7A00]" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isLightMode ? "left-7" : "left-1"}`} />
                </button>
              </div>
              {/* Custom Pen Cursor */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">Custom Pen Cursor</span>
                  <span className="text-xs text-[#71717A] block">Stylish pen cursor for interactive elements.</span>
                </div>
                <button 
                  onClick={() => saveAccessibility(dyslexiaMode, highContrast, tts, isLightMode, !customCursor)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${customCursor ? "bg-[#FF7A00]" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${customCursor ? "left-7" : "left-1"}`} />
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const showSidebar = activeModule !== "home" || showWorkspaceUINav || true;
  const showTopBar = activeModule !== "home" && activeModule !== "settings" && activeModule !== "progress" && activeModule !== "portfolio";
  const isHomePage = activeModule === "home";

  // Route Guard: Show loading screen while checking auth state
  if (isAuthLoading) {
    return <LoadingScreen message="Initializing Neural Nexus..." />;
  }

  // Route Guard: If not authenticated, show login page
  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className={`flex h-screen w-full bg-[#050505] text-white relative ${isLightMode ? "light-mode" : ""} ${highContrast ? "contrast-125 saturate-150" : ""} ${dyslexiaMode ? "font-dyslexic" : ""} ${customCursor ? "custom-pen-cursor" : ""}`}>
      
      {systemAlert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/40 backdrop-blur-md shadow-[0_0_20px_rgba(255,122,0,0.25)] flex items-center gap-2.5 text-xs font-mono font-bold text-[#FF7A00] z-50 animate-bounce">
          <Sparkles className="w-4 h-4 animate-spin-slow" /> {systemAlert}
        </div>
      )}

      {/* Mobile Navigation Shelf - Shows on tablet/mobile */}
      {isMobileShelfOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
            onClick={() => setIsMobileShelfOpen(false)}
          />
          
          {/* Shelf Drawer */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-0 left-0 right-0 bg-[#111111] border-b border-white/10 z-50 lg:hidden max-h-[70vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1a0f00] border border-[#FF7A00]/30 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" className="w-5 h-5" fill="none">
                    <circle cx="18" cy="18" r="3.5" fill="#FF7A00" />
                    <circle cx="18" cy="10" r="2.5" fill="#FF7A00" />
                    <circle cx="24" cy="15" r="2" fill="#FFB547" />
                    <circle cx="22" cy="22" r="2" fill="#FF7A00" />
                    <circle cx="14" cy="22" r="2" fill="#FFB547" />
                    <circle cx="12" cy="15" r="2" fill="#FF7A00" />
                  </svg>
                </div>
                <span className="font-heading font-bold text-white">SCI FORGE AI</span>
              </div>
              <button
                onClick={() => setIsMobileShelfOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Tools Grid */}
            <div className="p-4 space-y-1">
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono mb-3">Quick Access</p>
              {MOBILE_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeModule === tool.id;
                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveModule(tool.id);
                      setIsMobileShelfOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive 
                        ? "bg-[#FF7A00]/10 text-white border border-[#FF7A00]/30" 
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${tool.color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color: tool.color }} />
                    </div>
                    <span className="flex-1 text-left truncate">{tool.label}</span>
                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
                    )}
                  </button>
                );
              })}
            </div>
            
            {/* Sign Out Button */}
            <div className="p-4 border-t border-white/5">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <LogOut className="w-4 h-4 text-red-400" />
                </div>
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}

      {showSidebar && (
        <Sidebar 
          activeModule={activeModule} 
          onChangeModule={setActiveModule} 
          isOpenOnMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      <div className={cn(
        "flex flex-col min-w-0 h-full relative",
        isHomePage ? "overflow-hidden" : "flex-1"
      )}>
        {/* Mobile Shelf Trigger - Only visible on mobile/tablet */}
        <div className="lg:hidden px-4 py-2 bg-[#0a0a0a] border-b border-white/5 flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMobileShelfOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-mono text-white/50 truncate">
              {activeModule === "home" ? "Home Dashboard" :
              activeModule === "chat" ? "Core Intelligence Console" :
              activeModule === "simulation" ? "ProjectMate AI" :
              activeModule === "scribble" ? "Scribble Analysis Lab" :
              activeModule === "scientist" ? "Quantum Research Engine" :
              activeModule === "quiz" ? "Quiz Generator" :
              activeModule === "notes" ? "Notes Generator" :
              activeModule === "dependencymap" ? "Concept Dependency Map" :
              activeModule === "progress" ? "Academic Propulsion" :
              activeModule === "portfolio" ? "Research Portfolio" : "Settings"}
            </p>
          </div>
          {user && (
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FFB547] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        
        {activeModule !== "home" && (
          <div className="hidden lg:flex px-5 py-2.5 bg-[#111111] border-b border-white/8 shrink-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors shrink-0 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="space-y-0.5 min-w-0">
                <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#FF7A00] font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse shrink-0" />
                  SCI FORGE AI
                </h2>
                <p className="text-[9px] uppercase tracking-wider text-white/40 font-medium truncate">
                  {activeModule === "chat" ? "CORE INTELLIGENCE CONSOLE" :
                  activeModule === "simulation" ? "PROJECTMATE AI" :
                  activeModule === "scribble" ? "SCRIBBLE ANALYSIS LAB" :
                  activeModule === "scientist" ? "QUANTUM RESEARCH ENGINE" :
                  activeModule === "quiz" ? "QUIZ GENERATOR" :
                  activeModule === "notes" ? "NOTES GENERATOR" :
                  activeModule === "dependencymap" ? "CONCEPT DEPENDENCY MAP" :
                  activeModule === "progress" ? "ACADEMIC PROPULSION" :
                  activeModule === "portfolio" ? "RESEARCH PORTFOLIO" : "SETTINGS"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {isCoreRunning && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FF7A00]/15 border border-[#FF7A00]/30 text-[#FF7A00] font-mono text-[9px] font-bold rounded-lg animate-pulse tracking-widest uppercase shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-ping shrink-0" />
                  CORE: {Math.floor(coreTime / 3600).toString().padStart(2, "0")}:{Math.floor((coreTime % 3600) / 60).toString().padStart(2, "0")}:{(coreTime % 60).toString().padStart(2, "0")}
                </div>
              )}
              {/* User Profile Display */}
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-white/5 border border-white/10 rounded-lg shrink-0">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF7A00] to-[#FFB547] flex items-center justify-center text-white text-[10px] font-bold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[10px] font-semibold text-white leading-none">{user?.name || 'User'}</p>
                  <p className="text-[8px] text-white/40 font-mono mt-0.5">{user?.email || ''}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {showTopBar && (
          <TopBar activeModule={activeModule} onSearchSubmit={handleGlobalSearchMessage} />
        )}
        
        <main className="flex-1 overflow-hidden relative">
          {renderModule()}
        </main>
      </div>

      {(isRightPanelOpen && (activeModule === "simulation" || activeModule === "scribble" || activeModule === "scientist" || activeModule === "dependencymap")) && (
        <RightPanel 
          learningMode={learningMode} 
          onChangeLearningMode={setLearningMode} 
          activeModule={activeModule}
          onClose={() => setIsRightPanelOpen(false)}
          customIntelligence={
            activeModule === "simulation" ? simIntel :
            activeModule === "scribble" ? scribbleIntel :
            activeModule === "scientist" ? scientistIntel :
            activeModule === "dependencymap" ? dependIntel : null
          }
        />
      )}
    </div>
  );
}
