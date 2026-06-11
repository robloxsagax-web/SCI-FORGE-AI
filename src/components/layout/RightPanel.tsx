import { useState, ReactNode } from "react";
import { Brain, Sparkles, AlertCircle, CheckCircle2, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { LearningMode, ModuleType } from "../../types";

export interface CustomIntelligenceData {
  explain?: string;
  steps?: string;
  theory?: string;
  hint?: string;
  conceptAnalysis?: string;
  commonPitfall?: string;
  formulaConcept?: string;
}

interface RightPanelProps {
  learningMode: LearningMode;
  onChangeLearningMode: (mode: LearningMode) => void;
  mockContent?: ReactNode;
  activeModule: ModuleType;
  onClose?: () => void;
  customIntelligence?: CustomIntelligenceData | null;
}

const TABS = ["Explain", "Steps", "Theory", "Hint"];

export function RightPanel({ 
  learningMode, 
  onChangeLearningMode, 
  mockContent,
  activeModule,
  onClose,
  customIntelligence
}: RightPanelProps) {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  // Determine Sidebar niche header name
  const getNicheHeader = () => {
    switch (activeModule) {
      case "simulation":
        return "PHYSICS REASONING CORE";
      case "scribble":
        return "REASONING FORENSIC ENGINE";
      case "scientist":
        return "QUANTUM SCIENCE CORE";
      case "dependencymap":
        return "REASONING CORRELATION LEDGER";
      default:
        return "AI Intelligence Node";
    }
  };

  // Safe fallback resolver for the active tab content
  const getTabContent = () => {
    if (customIntelligence) {
      const modeSuffix = ` (${learningMode})`;
      switch (activeTab) {
        case "Explain":
          return (customIntelligence.explain || "") + (learningMode !== "beginner" ? ` [Calibrated for ${learningMode} scope]` : "");
        case "Steps":
          return customIntelligence.steps || "Step-by-step breakdown computing parameters now active.";
        case "Theory":
          return customIntelligence.theory || "Theoretical formula framework loaded in active workspace.";
        case "Hint":
          return customIntelligence.hint || "Hint: Focus on primary variables and verify step integrations to master complex topics.";
        default:
          return "";
      }
    }

    // Default static fallbacks
    if (activeTab === "Explain") {
      if (learningMode === "beginner") return "Let's break this down simply. We start with core definitions, explore the baseline rules, and look at how changing one variable affects the total outcome.";
      if (learningMode === "analogy") return "Think of this like building a puzzle. We lay out the border pieces (axioms) first, before filling in the complex connections.";
      return "The analytical formulations governing this topic explore foundational system balances, mapping parameters to state changes using structured calculus or logic.";
    }
    if (activeTab === "Steps") {
      return "1. Identify the core academic inquiry. 2. Chart the critical equations or mathematical variables. 3. Integrate findings step-by-step to reach verified solutions.";
    }
    if (activeTab === "Theory") {
      return "The underlying theoretical structures govern how these physical or mathematical states interact across different boundaries and system constraints.";
    }
    return "Try updating your active study targets, notes, or research queries to view dynamic real-time reasoning here.";
  };

  const currentTabContent = getTabContent();

  const conceptAnalysisText = customIntelligence?.conceptAnalysis || (
    learningMode === "beginner" ? "Let's break this down simply. When an object drops, gravity pulls it down. The heavier or higher it is, the faster it will go." :
    learningMode === "analogy" ? "Think of this like riding a bicycle down a hill. The steeper the hill (gravity), the faster you accelerate without pedaling." :
    "The kinematic equations governing this motion derive from Newton's second law, F=ma. We integrate acceleration to find velocity."
  );

  const commonPitfallText = customIntelligence?.commonPitfall || "Remember that mass does not affect acceleration in a vacuum.";
  const formulaConceptText = customIntelligence?.formulaConcept || "d = vi*t + 0.5*a*t²";

  return (
    <div className="w-full sm:max-w-xs lg:w-80 lg:relative fixed inset-y-0 right-0 z-50 border-l border-glass-border bg-secondary-bg/95 lg:bg-secondary-bg/50 backdrop-blur-xl flex flex-col h-full shrink-0 shadow-2xl lg:shadow-none transition-all">
      {/* Header & Modes */}
      <div className="p-4 border-b border-glass-border shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-accent-cyan">
            <Brain className="w-5 h-5 text-accent-violet animate-pulse" />
            <h2 className="font-heading font-medium tracking-tight text-sm text-white">{getNicheHeader()}</h2>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              title="Close Panel"
              className="p-1 hover:bg-white/10 rounded-full transition-all text-white/50 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        <div className="flex bg-black/40 rounded-lg p-1 relative">
          {(["beginner", "analogy", "advanced"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onChangeLearningMode(mode)}
              className={cn(
                "flex-1 relative py-1.5 text-xs font-medium capitalize rounded-md transition-colors z-10",
                learningMode === mode ? "text-white" : "text-white/40 hover:text-white/80"
              )}
            >
              {learningMode === mode && (
                <motion.div
                  layoutId="active-mode"
                  className="absolute inset-0 bg-white/10 rounded-md -z-10 shadow-sm"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-glass-border">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-3 text-[10px] uppercase tracking-wider font-mono transition-colors",
              activeTab === tab ? "text-accent-cyan border-b-2 border-accent-cyan" : "text-white/30 hover:text-white/60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + learningMode + (customIntelligence ? "custom" : "fallback")}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {!customIntelligence ? (
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                <Brain className="w-12 h-12 text-white/10 animate-pulse" style={{ color: "var(--color-accent-violet)" }} />
                <h3 className="text-xs font-mono font-bold text-white/50 uppercase tracking-widest">INTELLIGENCE CORE IDLE</h3>
                <p className="text-[11px] text-white/40 leading-relaxed font-sans mt-1">
                  Activate focus tracker or compile dynamic research inquiry to stream active reasoning, guidelines, and core theories here.
                </p>
              </div>
            ) : mockContent ? (
              mockContent
            ) : (
              <>
                {/* Active Tab Explanatory Text */}
                <div className="glass-panel p-4 rounded-xl space-y-2 bg-black/20 border border-white/5">
                  <div className="text-[10px] font-mono text-accent-cyan/80 uppercase tracking-wider">{activeTab} Framework</div>
                  <p className="text-xs text-balance leading-relaxed text-white/90">
                    {currentTabContent}
                  </p>
                </div>

                {/* Concept Analysis Block */}
                <div className="glass-panel p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-accent-cyan mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Concept Analysis</span>
                  </div>
                  <p className="text-xs text-balance leading-relaxed text-white/80">
                    {conceptAnalysisText}
                  </p>
                </div>

                {/* Common Pitfall Block */}
                <div className="glass-panel p-4 rounded-xl border border-accent-red/20 space-y-2 relative overflow-hidden bg-accent-red/5">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent-red"></div>
                  <div className="flex items-center gap-2 text-accent-red mb-1">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Common Pitfall</span>
                  </div>
                  <p className="text-xs text-white/70">
                    {commonPitfallText}
                  </p>
                </div>
                
                {/* Formula Concept Block */}
                <div className="glass-panel p-4 rounded-xl border border-accent-green/20 space-y-2 relative overflow-hidden bg-accent-green/5">
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent-green"></div>
                  <div className="flex items-center gap-2 text-accent-green mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Formula Concept</span>
                  </div>
                  <div className="font-mono text-xs bg-black/60 p-2.5 rounded text-accent-green border border-accent-green/15">
                     {formulaConceptText}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
