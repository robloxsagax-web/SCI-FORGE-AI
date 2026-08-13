import { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { RightPanel } from "./components/layout/RightPanel";
import { HomeDashboard } from "./components/layout/HomeDashboard";
import { LoginPage, AuthLoadingScreen } from "./components/layout/LoginPage";
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
import { Settings as SettingsIcon, Sparkles, Menu } from "lucide-react";
import { updateTelemetryOnAction } from "./lib/telemetry";
import { cn } from "./lib/utils";

export default function App() {
  // All state definitions - MUST be before any conditionals (React Rules of Hooks)
  const [activeModule, setActiveModule] = useState<ModuleType>("home");
  const [showWorkspaceUINav, setShowWorkspaceUINav] = useState(false);
  const [learningMode, setLearningMode] = useState<LearningMode>("beginner");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [isCoreRunning, setIsCoreRunning] = useState(false);
  const [coreTime, setCoreTime] = useState(0);

  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [simIntel, setSimIntel] = useState<any>(null);
  const [scribbleIntel, setScribbleIntel] = useState<any>(null);
  const [scientistIntel, setScientistIntel] = useState<any>(null);
  const [dependIntel, setDependIntel] = useState<any>(null);

  const [dyslexiaMode, setDyslexiaMode] = useState(true); // Default ON
  const [highContrast, setHighContrast] = useState(true); // Default ON
  const [tts, setTts] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [customCursor, setCustomCursor] = useState(true); // Default ON
  const [hapticResponses, setHapticResponses] = useState(true); // Default ON
  const [autonomousMemory, setAutonomousMemory] = useState(true); // Default ON

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [pendingChatMessage, setPendingChatMessage] = useState<string | null>(null);
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  // Auth state with strict guards
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem("sciforge_auth") === "true" && 
           localStorage.getItem("sciforge_user") !== null;
  });
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem("sciforge_user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });

  // Strict auth check on mount - no bypass allowed
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedAuth = localStorage.getItem("sciforge_auth");
        const storedUser = localStorage.getItem("sciforge_user");
        
        if (storedAuth === "true" && storedUser) {
          const user = JSON.parse(storedUser);
          setUserData(user);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      }
    };
    
    checkAuth();
  }, []);

  // Strict route guard handlers
  const handleLogin = (user?: { name: string; email: string }) => {
    if (user) {
      localStorage.setItem("sciforge_user", JSON.stringify(user));
      setUserData(user);
    }
    localStorage.setItem("sciforge_auth", "true");
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("sciforge_auth");
    localStorage.removeItem("sciforge_user");
    setIsAuthenticated(false);
    setUserData(null);
  };

  // Early returns AFTER all hooks are called
  if (!isAuthenticated) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    );
  }

  // Main app continues here...

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

  useEffect(() => {
    const stored = localStorage.getItem("sciforge_accessibility");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDyslexiaMode(parsed.dyslexiaFont ?? true);
        setHighContrast(parsed.highContrast ?? true);
        setTts(parsed.tts ?? false);
        setIsLightMode(parsed.isLightMode ?? false);
        setCustomCursor(parsed.customCursor ?? true);
        setHapticResponses(parsed.hapticResponses ?? true);
        setAutonomousMemory(parsed.autonomousMemory ?? true);
      } catch (err) {
        console.error(err);
      }
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

  const saveAccessibility = (
    updatedDyslexia: boolean, 
    updatedContrast: boolean, 
    updatedTts: boolean, 
    updatedLight: boolean, 
    updatedCursor?: boolean,
    updatedHaptic?: boolean,
    updatedAutonomous?: boolean
  ) => {
    setDyslexiaMode(updatedDyslexia);
    setHighContrast(updatedContrast);
    setTts(updatedTts);
    setIsLightMode(updatedLight);
    if (updatedCursor !== undefined) {
      setCustomCursor(updatedCursor);
    }
    if (updatedHaptic !== undefined) {
      setHapticResponses(updatedHaptic);
    }
    if (updatedAutonomous !== undefined) {
      setAutonomousMemory(updatedAutonomous);
    }
    localStorage.setItem("sciforge_accessibility", JSON.stringify({
      dyslexiaFont: updatedDyslexia,
      highContrast: updatedContrast,
      tts: updatedTts,
      isLightMode: updatedLight,
      customCursor: updatedCursor ?? customCursor,
      hapticResponses: updatedHaptic ?? hapticResponses,
      autonomousMemory: updatedAutonomous ?? autonomousMemory
    }));
  };

  useEffect(() => {
    if (dyslexiaMode) {
      document.body.classList.add("dyslexia-mode");
    } else {
      document.body.classList.remove("dyslexia-mode");
    }
  }, [dyslexiaMode]);

  useEffect(() => {
    if (highContrast) {
      document.body.classList.add("high-contrast-mode");
    } else {
      document.body.classList.remove("high-contrast-mode");
    }
  }, [highContrast]);

  // Apply haptic feedback class
  useEffect(() => {
    if (hapticResponses) {
      document.body.classList.add("haptic-enabled");
    } else {
      document.body.classList.remove("haptic-enabled");
    }
  }, [hapticResponses]);

  // Apply autonomous memory class
  useEffect(() => {
    if (autonomousMemory) {
      document.body.classList.add("autonomous-memory-enabled");
    } else {
      document.body.classList.remove("autonomous-memory-enabled");
    }
  }, [autonomousMemory]);

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
                  onClick={() => saveAccessibility(dyslexiaMode, highContrast, tts, isLightMode, !customCursor, hapticResponses, autonomousMemory)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${customCursor ? "bg-[#FF7A00]" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${customCursor ? "left-7" : "left-1"}`} />
                </button>
              </div>
              {/* Haptic Interaction Responses */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">Haptic Interaction Responses</span>
                  <span className="text-xs text-[#71717A] block">Micro-vibrations and spring physics sounds on clicks.</span>
                </div>
                <button 
                  onClick={() => saveAccessibility(dyslexiaMode, highContrast, tts, isLightMode, customCursor, !hapticResponses, autonomousMemory)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${hapticResponses ? "bg-[#FF7A00]" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${hapticResponses ? "left-7" : "left-1"}`} />
                </button>
              </div>
              {/* Autonomous Background Memory */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">Autonomous Background Memory</span>
                  <span className="text-xs text-[#71717A] block">Proactive concept linkage during mentor idle intervals.</span>
                </div>
                <button 
                  onClick={() => saveAccessibility(dyslexiaMode, highContrast, tts, isLightMode, customCursor, hapticResponses, !autonomousMemory)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${autonomousMemory ? "bg-[#FF7A00]" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${autonomousMemory ? "left-7" : "left-1"}`} />
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

  return (
    <div className={`flex h-screen w-full bg-[#050505] text-white relative ${isLightMode ? "light-mode" : ""} ${highContrast ? "contrast-125 saturate-150" : ""}`}>
      
      {systemAlert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-[#FF7A00]/10 border border-[#FF7A00]/40 backdrop-blur-md shadow-[0_0_20px_rgba(255,122,0,0.25)] flex items-center gap-2.5 text-xs font-mono font-bold text-[#FF7A00] z-50 animate-bounce">
          <Sparkles className="w-4 h-4 animate-spin-slow" /> {systemAlert}
        </div>
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
        {activeModule !== "home" && (
          <div className="px-5 py-2.5 bg-[#111111] border-b border-white/8 shrink-0 flex items-center justify-between gap-4">
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
