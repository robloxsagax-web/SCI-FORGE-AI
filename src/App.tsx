import { useState, useEffect } from "react";
import { Sidebar } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { RightPanel } from "./components/layout/RightPanel";
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
import { Settings as SettingsIcon, Volume2, ShieldAlert, Sparkles, CheckCircle2, Cpu, Menu } from "lucide-react";
import { updateTelemetryOnAction } from "./lib/telemetry";

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>("chat");
  const [showWorkspaceUINav, setShowWorkspaceUINav] = useState(false);
  const [learningMode, setLearningMode] = useState<LearningMode>("beginner");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Core Model Run Timer global states
  const [isCoreRunning, setIsCoreRunning] = useState(false);
  const [coreTime, setCoreTime] = useState(0);

  useEffect(() => {
    // Load from storage
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
          // Update actual dynamic hours telemetry
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

  // Right sidebar and dynamic AI intelligence data
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [simIntel, setSimIntel] = useState<any>(null);
  const [scribbleIntel, setScribbleIntel] = useState<any>(null);
  const [scientistIntel, setScientistIntel] = useState<any>(null);
  const [dependIntel, setDependIntel] = useState<any>(null);

  // Accessibility states
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [tts, setTts] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  // Auth structures
  const [userSession, setUserSession] = useState<{ name: string; email: string } | null>(null);

  // Global Chat state persistence
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // System routing notification banner
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  useEffect(() => {
    // Sync session
    const savedSession = localStorage.getItem("sciforge_google_session");
    if (savedSession) {
      try {
        setUserSession(JSON.parse(savedSession));
      } catch (err) {
        setUserSession({
          name: "Isaac Newton",
          email: "isaac.newton@cambridge.edu"
        });
      }
    } else {
      setUserSession({
        name: "Isaac Newton",
        email: "isaac.newton@cambridge.edu"
      });
    }
  }, []);

  useEffect(() => {
    // Sync accessibility configuration directly to local storage
    const stored = localStorage.getItem("sciforge_accessibility");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDyslexiaMode(parsed.dyslexiaFont || false);
        setHighContrast(parsed.highContrast || false);
        setTts(parsed.tts || false);
        setIsLightMode(parsed.isLightMode || false);
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const saveAccessibility = (updatedDyslexia: boolean, updatedContrast: boolean, updatedTts: boolean, updatedLight: boolean) => {
    setDyslexiaMode(updatedDyslexia);
    setHighContrast(updatedContrast);
    setTts(updatedTts);
    setIsLightMode(updatedLight);
    localStorage.setItem("sciforge_accessibility", JSON.stringify({
      dyslexiaFont: updatedDyslexia,
      highContrast: updatedContrast,
      tts: updatedTts,
      isLightMode: updatedLight
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
    // If user enters a query from active TopBar input search box, we pipe it directly into GlobalChat!
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: userQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    setActiveModule("chat");
  };

  const renderModule = () => {
    switch (activeModule) {
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
            <SettingsIcon className="w-12 h-12 text-accent-cyan animate-spin-slow" />
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-heading text-white font-bold">Workbench Settings & Profile</h2>
              <p className="text-xs text-white/40">Calibrate accessibility options, styling parameters, and account links</p>
            </div>
            
            {/* OAuth mock account info cards */}
            <div className="glass-panel p-6 rounded-2xl w-full border border-white/5 space-y-4">
              <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Verified Researcher Link</div>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-accent-cyan/20 bg-accent-cyan/10 flex items-center justify-center text-accent-cyan font-bold font-heading text-lg">
                    {userSession?.name?.substring(0, 2).toUpperCase() || "IN"}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-sm font-bold text-white">{userSession?.name}</div>
                    <div className="text-xs text-white/50">{userSession?.email}</div>
                  </div>
                </div>

                {userSession?.email === "robloxsagax@gmail.com" && (
                  <button
                    onClick={() => {
                      localStorage.removeItem("sciforge_google_session");
                      setUserSession({
                        name: "Isaac Newton",
                        email: "isaac.newton@cambridge.edu"
                      });
                      setSystemAlert("Google account session disconnected.");
                      setTimeout(() => setSystemAlert(null), 3000);
                    }}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 text-white/50 text-[10px] uppercase font-mono rounded cursor-pointer"
                  >
                    Disconnect
                  </button>
                )}
              </div>

              {userSession?.email !== "robloxsagax@gmail.com" && (
                <button
                  onClick={() => {
                    const linked = { name: "Roblox Saga", email: "robloxsagax@gmail.com" };
                    localStorage.setItem("sciforge_google_session", JSON.stringify(linked));
                    setUserSession(linked);
                    setSystemAlert("Synchronized Google Account & Restored Workstation Data!");
                    setTimeout(() => setSystemAlert(null), 3500);
                  }}
                  className="w-full mt-2 flex items-center justify-center gap-2.5 py-3 px-4 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan font-semibold rounded-xl text-xs transition-all cursor-pointer font-mono uppercase tracking-wider"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                  </svg>
                  Sign in with Google Account
                </button>
              )}
            </div>

            <div className="glass-panel p-8 rounded-2xl w-full space-y-6">
              <div className="text-[10px] font-mono text-white/30 tracking-widest uppercase">Visual Calibration Node</div>

              {/* Toggle Dyslexia */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">Dyslexia-Friendly Font</span>
                  <span className="text-xs text-white/40 block">Enhances tracking consistency for math reading.</span>
                </div>
                <button 
                  onClick={() => saveAccessibility(!dyslexiaMode, highContrast, tts, isLightMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${dyslexiaMode ? "bg-accent-cyan" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${dyslexiaMode ? "left-7" : "left-1"}`} />
                </button>
              </div>

              {/* Toggle Contrast */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">High Contrast Highlights</span>
                  <span className="text-xs text-white/40 block">Intensifies saturation levels for color-blind learners.</span>
                </div>
                <button 
                  onClick={() => saveAccessibility(dyslexiaMode, !highContrast, tts, isLightMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${highContrast ? "bg-accent-cyan" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${highContrast ? "left-7" : "left-1"}`} />
                </button>
              </div>

              {/* Toggle Text to speech */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">Adaptive Text-To-Speech (TTS)</span>
                  <span className="text-xs text-white/40 block">Automatically synthesized speech on AI formulas output.</span>
                </div>
                <button 
                  onClick={() => saveAccessibility(dyslexiaMode, highContrast, !tts, isLightMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${tts ? "bg-accent-cyan" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${tts ? "left-7" : "left-1"}`} />
                </button>
              </div>

              {/* Toggle Light Mode */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-sm font-bold text-white block">SciForge Theme Selection</span>
                  <span className="text-xs text-white/40 block">Toggle between Space Dark and clean light layouts.</span>
                </div>
                <button 
                  onClick={() => saveAccessibility(dyslexiaMode, highContrast, tts, !isLightMode)}
                  className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${isLightMode ? "bg-accent-cyan" : "bg-white/10"}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${isLightMode ? "left-7" : "left-1"}`} />
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex h-screen w-full bg-primary-bg text-white overflow-hidden relative ${isLightMode ? "light-mode" : ""} ${highContrast ? "contrast-125 saturate-150" : ""}`}>
      
      {/* Dynamic Workspace Transition System alerts */}
      {systemAlert && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-accent-cyan/10 border border-accent-cyan/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.25)] flex items-center gap-2.5 text-xs font-mono font-bold text-accent-cyan text-white z-50 animate-bounce">
          <Sparkles className="w-4 h-4 animate-spin-slow" /> {systemAlert}
        </div>
      )}

      {(activeModule !== "chat" || showWorkspaceUINav) && (
        <Sidebar 
          activeModule={activeModule} 
          onChangeModule={setActiveModule} 
          isOpenOnMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        {/* NEURAL SYSTEM ORCHESTRATOR HEADER */}
        {(activeModule !== "chat" || showWorkspaceUINav) && (
          <div className="px-5 py-2.5 bg-black/40 border-b border-glass-border shrink-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors shrink-0 cursor-pointer"
                title="Open Navigation Workspace Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="space-y-0.5 min-w-0">
                <h2 className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-accent-cyan)] font-bold flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse shrink-0" />
                  NEURAL SYSTEM ORCHESTRATOR
                </h2>
                <p className="text-[9px] uppercase tracking-wider text-white/40 font-medium truncate">
                  WORKSPACE ROUTER & ACTIVE INTELLIGENCE CORE
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {isCoreRunning && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan font-mono text-[9px] font-bold rounded-lg animate-pulse tracking-widest uppercase shrink-0">
                  <span className="w-2 h-2 rounded-full bg-accent-cyan animate-ping shrink-0" />
                  CORES ALLOCATED: {Math.floor(coreTime / 3600).toString().padStart(2, "0")}:{Math.floor((coreTime % 3600) / 60).toString().padStart(2, "0")}:{(coreTime % 60).toString().padStart(2, "0")}
                </div>
              )}
              <div className="text-[9px] font-mono text-white/30 bg-white/5 py-1.5 px-2.5 rounded-lg border border-white/5 uppercase shrink-0 truncate">
                Active Space: <span className="text-[9px] text-[var(--color-accent-cyan)] font-bold">{
                  activeModule === "chat" ? "CORE INTELLIGENCE CONSOLE" :
                  activeModule === "simulation" ? "PROJECTMATE AI WORKSPACE" :
                  activeModule === "scribble" ? "SCRIBBLE ANALYSIS LAB" :
                  activeModule === "scientist" ? "QUANTUM RESEARCH ENGINE" :
                  activeModule === "quiz" ? "QUIZ GENERATOR" :
                  activeModule === "notes" ? "NOTES GENERATOR" :
                  activeModule === "portfolio" ? "RESEARCH PORTFOLIO" :
                  activeModule === "progress" ? "ACADEMIC PROPULSION CONTROL CENTER" : "SETTINGS"
                }</span>
              </div>
            </div>
          </div>
        )}

        {(activeModule !== "chat" && activeModule !== "settings" && activeModule !== "progress" && activeModule !== "portfolio") && (
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
