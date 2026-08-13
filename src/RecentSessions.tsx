import { useState, useEffect } from "react";
import { History, Play, Trash2, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RecentSession, ModuleType } from "../../types";

interface RecentSessionsProps {
  onResumeSession: (session: RecentSession) => void;
}

export function RecentSessions({ onResumeSession }: RecentSessionsProps) {
  const [sessions, setSessions] = useState<RecentSession[]>([]);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const saved = localStorage.getItem("sciforge_recent_sessions");
    if (saved) {
      try {
        setSessions(JSON.parse(saved));
      } catch (err) {
        console.error("Failed to parse sciforge_recent_sessions", err);
      }
    }
  };

  const handleDelete = (id: string, e: any) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    localStorage.setItem("sciforge_recent_sessions", JSON.stringify(updated));
  };

  const handleClearAll = () => {
    setSessions([]);
    localStorage.setItem("sciforge_recent_sessions", JSON.stringify([]));
  };

  const getWorkspaceLabel = (type: ModuleType) => {
    switch (type) {
      case "chat":
        return "Neural Academic Companion";
      case "simulation":
        return "Simulation Engine";
      case "scribble":
        return "Scribble Analysis Lab";
      case "scientist":
        return "Quantum Research Engine";
      case "quiz":
        return "Quiz Generator";
      case "notes":
        return "Notes Textbook Generator";
      default:
        return type.toUpperCase();
    }
  };

  const getBadgeClass = (type: ModuleType) => {
    switch (type) {
      case "chat":
        return "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20";
      case "simulation":
        return "bg-accent-green/15 text-accent-green border-accent-green/20";
      case "scribble":
        return "bg-accent-violet/15 text-accent-violet border-accent-violet/20";
      case "scientist":
        return "bg-accent-green/15 text-accent-green border-accent-green/20";
      case "quiz":
        return "bg-accent-violet/15 text-accent-violet border-accent-violet/20";
      case "notes":
        return "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/20";
      default:
        return "bg-white/10 text-white/70 border-white/10";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-primary-bg p-6 overflow-hidden relative">
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-accent-cyan/5 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 border-b border-glass-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent-cyan/10 rounded-xl text-accent-cyan border border-accent-cyan/20">
            <History className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-white tracking-tight">RECENT WORKBENCH SESSIONS</h1>
            <p className="text-xs text-white/40 font-mono">Real-time persistent telemetry memory of active workflows</p>
          </div>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-accent-red/10 hover:bg-accent-red/20 border border-accent-red/30 text-accent-red text-xs font-bold font-mono rounded-xl transition-all cursor-pointer"
          >
            DEACTIVATE ALL MEMORIES
          </button>
        )}
      </div>

      {/* Sessions Grid / List */}
      <div className="flex-1 overflow-y-auto pr-1">
        {sessions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4 py-16">
            <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-white/30 border border-white/5">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-widest">Memory banks unoccupied</h3>
            <p className="text-[11px] text-white/40 leading-relaxed font-sans">
              No recent workspaces have been active. Your learning telemetry and notes logs will accumulate here as you trigger experiments in other workspaces.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {sessions.map((sess) => (
                <motion.div
                  key={sess.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-accent-cyan/20 transition-all flex flex-col justify-between relative group hover:scale-[1.01]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[9px] font-mono font-bold px-2.5 py-1 rounded-full border ${getBadgeClass(sess.workspaceType)}`}>
                        {getWorkspaceLabel(sess.workspaceType)}
                      </span>
                      <span className="text-[9px] font-mono text-white/30">{sess.timestamp}</span>
                    </div>

                    <h2 className="text-sm font-bold text-white line-clamp-2 pr-6 leading-snug">
                      {sess.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-3 pt-5 border-t border-white/5 mt-5">
                    <button
                      onClick={() => onResumeSession(sess)}
                      className="flex-1 py-2 px-3 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 hover:border-accent-cyan text-accent-cyan font-bold font-mono text-[10px] uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Resume Session
                    </button>
                    <button
                      onClick={(e) => handleDelete(sess.id, e)}
                      className="p-2 bg-white/5 hover:bg-accent-red/15 border border-white/5 hover:border-accent-red/20 text-white/40 hover:text-accent-red rounded-xl transition-all cursor-pointer"
                      title="Decompile session"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
