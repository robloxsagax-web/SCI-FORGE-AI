import { Database, Activity, FilePenLine, GraduationCap, Settings, Hexagon, MessageSquare, HelpCircle, BookOpen, Network, FolderArchive, X, Sparkles } from "lucide-react";
import { cn } from "../../lib/utils";
import { ModuleType } from "../../types";
import { motion } from "motion/react";

interface SidebarProps {
  activeModule: ModuleType;
  onChangeModule: (m: ModuleType) => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Sparkles, color: "text-[#FF7A00]" },
  { id: "chat", label: "Core Intelligence Console", icon: MessageSquare, color: "text-[#FF7A00]" },
  { id: "notes", label: "Notes Generator", icon: BookOpen, color: "text-[#FFB547]" },
  { id: "quiz", label: "Quiz Generator", icon: HelpCircle, color: "text-[#FFB547]" },
  { id: "scribble", label: "Scribble Analysis Lab", icon: FilePenLine, color: "text-[#22C55E]" },
  { id: "scientist", label: "Quantum Research Engine", icon: Database, color: "text-[#22C55E]" },
  { id: "simulation", label: "ProjectMate AI", icon: Activity, color: "text-[#FF7A00]" },
  { id: "dependencymap", label: "Concept Dependency Map", icon: Network, color: "text-[#FFB547]" },
  { id: "progress", label: "Academic Propulsion", icon: GraduationCap, color: "text-[#FF7A00]" },
  { id: "portfolio", label: "Research Portfolio", icon: FolderArchive, color: "text-[#A1A1AA]" },
] as const;

export function Sidebar({ activeModule, onChangeModule, isOpenOnMobile, onCloseMobile }: SidebarProps) {
  const handleItemClick = (m: ModuleType) => {
    onChangeModule(m);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenOnMobile && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onCloseMobile}
        />
      )}

      <div className={cn(
        "w-64 border-r border-white/8 bg-[#111111] flex flex-col h-full shrink-0 transition-all duration-300 z-50 lg:z-auto lg:translate-x-0 lg:static fixed inset-y-0 left-0",
        isOpenOnMobile ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF7A00] to-[#FFB547] flex items-center justify-center">
              <Hexagon className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <div>
              <span className="font-heading font-bold text-base text-white tracking-tight">SCI FORGE</span>
              <span className="font-heading font-normal text-base text-[#A1A1AA] ml-1">AI</span>
            </div>
          </div>
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg text-[#71717A] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id as ModuleType)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                    isActive 
                      ? "bg-[#FF7A00]/10 text-white" 
                      : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <>
                      <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF7A00] rounded-r-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                      <div className="absolute inset-0 rounded-xl border border-[#FF7A00]/20" />
                    </>
                  )}
                  <item.icon className={cn("w-5 h-5 shrink-0", isActive ? item.color : "text-current group-hover:text-white")} />
                  <span className={cn(isActive ? "text-white font-medium" : "")}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings at Bottom */}
        <div className="p-3 border-t border-white/8">
          <button
            onClick={() => handleItemClick("settings")}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
              activeModule === "settings" 
                ? "bg-[#FF7A00]/10 text-white" 
                : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
            )}
          >
            {activeModule === "settings" && (
              <motion.div
                layoutId="active-nav-indicator-settings"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF7A00] rounded-r-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Settings className="w-5 h-5 shrink-0" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </>
  );
}
