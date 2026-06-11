import { Maximize } from "lucide-react";
import React from "react";
import { ModuleType } from "../../types";

interface TopBarProps {
  activeModule: ModuleType;
  onSearchSubmit?: (val: string) => void;
  isRunning?: boolean;
}

export function TopBar({ activeModule }: TopBarProps) {
  const getHeaderName = () => {
    switch (activeModule) {
      case "simulation": return "PROJECTMATE AI WORKSPACE";
      case "scribble": return "SCRIBBLE ANALYSIS LAB";
      case "scientist": return "QUANTUM RESEARCH ENGINE";
      case "quiz": return "EVALUATION QUIZ WORKSPACE";
      case "notes": return "SCIENTIFIC LECTURE NOTEBOOK";
      default: return "SCIFORGE AI MODULE";
    }
  };

  return (
    <div className="h-14 border-b border-glass-border bg-secondary-bg/50 backdrop-blur-md flex items-center px-6 justify-between shrink-0 relative z-30">
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-white/50 tracking-wider uppercase font-extrabold">
          {getHeaderName()}
        </span>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }} 
          className="p-1 px-2.5 rounded-lg hover:bg-white/5 border border-white/5 text-[10px] font-mono text-white/40 hover:text-white transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
            <Maximize className="w-3 h-3" /> FULLSCREEN
          </span>
        </button>
      </div>
    </div>
  );
}
