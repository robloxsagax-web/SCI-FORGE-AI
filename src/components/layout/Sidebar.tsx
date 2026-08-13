import { Database, Activity, FilePenLine, GraduationCap, Settings, Hexagon, MessageSquare, HelpCircle, BookOpen, Network, FolderArchive, X } from "lucide-react";
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
  { id: "chat", label: "Core Intelligence Console", icon: MessageSquare, color: "text-accent-cyan" },
  { id: "notes", label: "Notes Generator", icon: BookOpen, color: "text-accent-cyan" },
  { id: "quiz", label: "Quiz Generator", icon: HelpCircle, color: "text-accent-violet" },
  { id: "scribble", label: "Scribble Analysis Lab", icon: FilePenLine, color: "text-accent-violet" },
  { id: "scientist", label: "Quantum Research Engine", icon: Database, color: "text-accent-green" },
  { id: "simulation", label: "ProjectMate AI", icon: Activity, color: "text-accent-cyan" },
  { id: "dependencymap", label: "Concept Dependency Map", icon: Network, color: "text-accent-green" },
  { id: "progress", label: "Academic Propulsion", icon: GraduationCap, color: "text-accent-cyan" },
  { id: "portfolio", label: "Research Portfolio", icon: FolderArchive, color: "text-white animate-pulse" },
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onCloseMobile}
        />
      )}

      <div className={cn(
        "w-68 border-r border-glass-border bg-secondary-bg/95 lg:bg-secondary-bg/80 flex flex-col h-full shrink-0 transition-transform duration-300 z-50 lg:z-auto lg:translate-x-0 lg:static fixed inset-y-0 left-0",
        isOpenOnMobile ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-glass-border shrink-0">
          <div className="flex items-center gap-3">
            <Hexagon className="w-6 h-6 text-accent-cyan dark:text-accent-cyan" fill="currentColor" fillOpacity={0.2} />
            <span className="font-heading font-bold tracking-tight text-lg text-white">SCI FORGE <span className="opacity-50 font-normal">AI</span></span>
          </div>
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          <div className="text-xs font-mono text-white/30 uppercase tracking-wider mb-2 px-2">Workspaces</div>
          {NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id as ModuleType)}
                className={cn(
                  "relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 glass-panel rounded-xl -z-10 bg-white/5"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <item.icon className={cn("w-5 h-5", isActive ? item.color : "text-current group-hover:text-white")} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-glass-border">
          <button
            onClick={() => handleItemClick("settings")}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative",
              activeModule === "settings" ? "text-white" : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            {activeModule === "settings" && (
              <motion.div
                layoutId="active-nav"
                className="absolute inset-0 glass-panel rounded-xl -z-10 bg-white/5"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </div>
    </>
  );
}
