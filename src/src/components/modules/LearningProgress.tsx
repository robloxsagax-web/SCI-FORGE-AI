import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Target, 
  Zap, 
  Clock, 
  Sparkles, 
  BookOpen, 
  Brain, 
  TrendingUp, 
  ChevronRight, 
  RefreshCw,
  FileText,
  BookmarkCheck,
  CheckCircle,
  Clock3
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn, addToPortfolio } from "../../lib/utils";

interface LearningProgressProps {
  isCoreRunning: boolean;
  setIsCoreRunning: (val: boolean) => void;
  coreTime: number;
  setCoreTime: (val: number) => void;
}

interface TimeAllocation {
  phase: string;
  hours: number;
  focus: string;
}

interface StructuralStage {
  stage: string;
  time_est: string;
  details: string;
  milestone: string;
}

interface StudyPlanData {
  topic: string;
  difficulty_progression: string[];
  time_allocations: TimeAllocation[];
  structural_plan: StructuralStage[];
  revision_cycles: string[];
  weak_area_reinforcement: string;
}

export function LearningProgress({ 
  isCoreRunning, 
  setIsCoreRunning, 
  coreTime, 
  setCoreTime 
}: LearningProgressProps) {
  const [topicInput, setTopicInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [studyPlan, setStudyPlan] = useState<StudyPlanData | null>(null);
  
  // Real metrics states
  const [metrics, setMetrics] = useState({
    topicsStudied: 0,
    quizzesCompleted: 0,
    notesGenerated: 0,
    problemsSolved: 0,
    conceptMastery: 0
  });

  // Load real metrics based on portfolio and local storage
  const loadRealMetrics = () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("sciforge_research_portfolio");
      let topicsStudiedCount = 0;
      let quizzesCompletedCount = 0;
      let notesGeneratedCount = 0;
      let problemsSolvedCount = 0;
      let totalScore = 0;
      let scoredQuizzesCount = 0;

      if (saved) {
        const portfolio = JSON.parse(saved);
        portfolio.forEach((item: any) => {
          if (item.type === "scientist") {
            topicsStudiedCount++;
          } else if (item.type === "quiz") {
            quizzesCompletedCount++;
            if (item.data && typeof item.data.percentage === "number") {
              totalScore += item.data.percentage;
              scoredQuizzesCount++;
            }
          } else if (item.type === "note") {
            notesGeneratedCount++;
          } else if (item.type === "scribble") {
            problemsSolvedCount++;
          } else if (item.type === "studyplan") {
            topicsStudiedCount++;
          }
        });
      }

      // Calculate a realistic mastery level which is strictly 0 if no actions taken
      let masteryLevel = 0;
      if (scoredQuizzesCount > 0) {
        masteryLevel = Math.round(totalScore / scoredQuizzesCount);
      } else if (topicsStudiedCount > 0 || notesGeneratedCount > 0 || problemsSolvedCount > 0) {
        // Fallback progress if other works are done
        const totalActions = topicsStudiedCount + notesGeneratedCount + problemsSolvedCount;
        masteryLevel = Math.min(95, totalActions * 10);
      }

      setMetrics({
        topicsStudied: topicsStudiedCount,
        quizzesCompleted: quizzesCompletedCount,
        notesGenerated: notesGeneratedCount,
        problemsSolved: problemsSolvedCount,
        conceptMastery: masteryLevel
      });
    } catch (err) {
      console.error("Failed to compile real telemetry metrics index:", err);
    }
  };

  useEffect(() => {
    loadRealMetrics();
    // Poll updates to reflect user action changes instantly
    const interval = setInterval(loadRealMetrics, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleGeneratePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topicInput.trim()) return;

    setLoading(true);
    setStudyPlan(null);

    try {
      const res = await fetch("/api/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicInput })
      });

      if (res.ok) {
        const data = await res.json();
        setStudyPlan(data);
        
        // Save plan to portfolio automatically
        addToPortfolio("studyplan", `Study Strategy: ${data.topic}`, data);
        loadRealMetrics();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}h ${m}m ${s}s`;
    }
    if (m > 0) {
      return `${m}m ${s}s`;
    }
    return `${s}s`;
  };

  const handlePurgeMetrics = () => {
    if (confirm("Reset study timer and purge all local metrics? This action is permanent.")) {
      localStorage.removeItem("sciforge_research_portfolio");
      localStorage.removeItem("sciforge_recent_sessions");
      setCoreTime(0);
      setIsCoreRunning(false);
      setStudyPlan(null);
      setTopicInput("");
      loadRealMetrics();
    }
  };

  return (
    <div id="academic-propulsion-module" className="flex-1 flex flex-col h-full bg-primary-bg p-6 overflow-hidden relative select-none">
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header section with Study Timer Trigger */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-5 shrink-0 pb-4 border-b border-glass-border">
        <div>
          <h1 className="text-xl font-heading font-semibold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-accent-cyan" />
            ACADEMIC PROPULSION CONTROL CENTER
          </h1>
          <p className="text-xs text-white/40 font-mono">Dynamic curriculum strategy compilers & high-fidelity performance telemetry</p>
        </div>

        {/* Real-time focus timer interface */}
        <div className="flex items-center gap-2 bg-black/40 p-2.5 rounded-xl border border-white/5 self-start xl:self-auto shrink-0 max-w-sm w-full sm:w-auto">
          <div className="flex flex-col pr-3 border-r border-white/10 text-left">
            <span className="text-[8px] font-mono font-bold text-white/40 uppercase tracking-widest leading-none">Focus study session</span>
            <span className="text-xs font-mono font-bold text-white/90 pt-1 flex items-center gap-1">
              <Clock3 className="w-3.5 h-3.5 text-accent-cyan shrink-0" />
              {formatTime(coreTime)}
            </span>
          </div>
          <button
            onClick={() => setIsCoreRunning(!isCoreRunning)}
            className={cn(
              "px-3.5 py-1.5 rounded-lg text-[9px] font-mono font-extrabold uppercase transition-all tracking-wider cursor-pointer",
              isCoreRunning 
                ? "bg-accent-red/10 border border-accent-red/20 text-accent-red hover:bg-accent-red/20 animate-pulse" 
                : "bg-accent-cyan/15 border border-accent-cyan/25 text-accent-cyan hover:bg-accent-cyan/25"
            )}
          >
            {isCoreRunning ? "SUSPEND TIMER" : "ACTIVATE TIMER"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
        
        {/* Left Column: Input and Dynamic Study plan */}
        <div className="flex-1 lg:flex-[3] flex flex-col min-h-0 overflow-y-auto pr-1 pb-4">
          
          {/* Topic search / formulation panel */}
          <form onSubmit={handleGeneratePlan} className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/25 mb-4 shrink-0 relative overflow-hidden">
            <h3 className="text-xs font-mono font-bold text-white/60 uppercase tracking-widest mb-2.5">
              Formulate New Custom Learning Strategy
            </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter study goals (e.g. Thermodynamics exam in 7 days, Algebra fundamentals)..."
                className="flex-1 bg-black/45 text-xs px-3.5 py-2.5 border border-white/5 outline-none rounded-xl text-white font-mono focus:border-accent-cyan/30 transition-all font-semibold"
              />
              <button
                type="submit"
                disabled={loading || !topicInput.trim()}
                className="px-5 py-2.5 bg-accent-cyan/20 hover:bg-accent-cyan/30 border border-accent-cyan/30 text-accent-cyan text-xs font-bold font-mono rounded-xl transition-all cursor-pointer disabled:opacity-40 flex items-center justify-center gap-1.5 shrink-0"
              >
                <Sparkles className={cn("w-4 h-4", loading && "animate-spin")} />
                {loading ? "COMPILING..." : "COMPILE PLAN"}
              </button>
            </div>
          </form>

          {/* Core study plan renderer/empty state */}
          <div className="flex-1 flex flex-col min-h-0">
            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 p-8 glass-panel rounded-3xl bg-black/50">
                <div className="w-12 h-12 rounded-full border-2 border-t-accent-cyan border-r-transparent animate-spin mb-1" />
                <p className="font-mono text-xs text-accent-cyan tracking-wider uppercase animate-pulse">Assembling Academic curriculum parameters...</p>
                <p className="text-[10px] text-white/30 max-w-xs font-mono font-medium">Drafting dynamic milestones, revision frameworks, and weak-area training systems.</p>
              </div>
            ) : !studyPlan ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 glass-panel rounded-3xl bg-black/30 p-8 max-w-sm mx-auto my-12 shrink-0">
                <div className="w-16 h-16 rounded-full bg-accent-cyan/5 border border-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-2">
                  <Brain className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="text-xs font-mono font-bold text-white/70 uppercase tracking-widest">Strategy Workspace Idle</h3>
                <p className="text-[11px] text-white/40 leading-relaxed font-sans max-w-xs">
                  Enter a topic or study goal above to formulate an interactive study propulsion curriculum structure.
                </p>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in duration-200">
                
                {/* Propulsion Header Card */}
                <div className="glass-panel p-5 rounded-2xl border border-accent-cyan/15 bg-accent-cyan/[0.01] relative overflow-hidden shrink-0">
                  <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-accent-cyan font-bold tracking-widest uppercase bg-accent-cyan/10 rounded-bl-xl border-l border-b border-accent-cyan/15">
                    Propulsion Ready
                  </div>
                  <span className="text-[9px] font-mono text-accent-cyan uppercase tracking-widest font-bold block mb-1">active schedule plan</span>
                  <h2 className="text-base font-bold text-white uppercase font-mono max-w-lg">{studyPlan.topic}</h2>
                </div>

                {/* Grid layout inside learning schema */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Difficulty level progression list */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/25">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-extrabold block mb-3 border-b border-white/5 pb-1.5 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-accent-cyan" /> Difficulty Level Progression
                    </span>
                    <div className="space-y-2">
                      {studyPlan.difficulty_progression.map((item, idx) => (
                        <div key={idx} className="p-3 bg-black/30 rounded-xl border border-white/5 flex gap-2.5">
                          <span className="text-[11px] font-mono font-bold text-accent-cyan bg-accent-cyan/5 border border-accent-cyan/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-[11px] text-white/80 leading-relaxed font-sans font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Revision Intervals */}
                  <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/25">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-extrabold block mb-3 border-b border-white/5 pb-1.5 flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-accent-green animate-spin-slow" /> Revision Interval Cycles
                    </span>
                    <div className="space-y-2">
                      {studyPlan.revision_cycles.map((cycle, idx) => (
                        <div key={idx} className="p-3 bg-accent-green/[0.01] rounded-xl border border-accent-green/10 flex gap-2.5">
                          <span className="text-[11px] font-mono font-bold text-accent-green bg-accent-green/5 border border-accent-green/10 w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                            R
                          </span>
                          <span className="text-[11px] text-white/80 leading-relaxed font-sans font-semibold">{cycle}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Time Allocation Grid Table */}
                <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/15 space-y-3">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-extrabold block">Time Allocation Per Phase</span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-sans text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-white/30 text-[10px] font-mono uppercase">
                          <th className="py-2 font-bold">Strategy Phase focus</th>
                          <th className="py-2 text-right font-bold w-24">Allocation</th>
                          <th className="py-2 pl-4 font-bold">Goal Core Focus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-[11px] text-white/80">
                        {studyPlan.time_allocations.map((alloc, idx) => (
                          <tr key={idx}>
                            <td className="py-3 font-semibold font-mono text-accent-cyan flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                              {alloc.phase}
                            </td>
                            <td className="py-3 text-right font-bold font-mono text-white/90">
                              {alloc.hours} Hours
                            </td>
                            <td className="py-3 pl-4 text-white/50 leading-relaxed">
                              {alloc.focus}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Structured milestones sequential cards */}
                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-extrabold block">Structured Study Plan Modules & Milestones</span>
                  <div className="space-y-3">
                    {studyPlan.structural_plan.map((stage, idx) => (
                      <div key={idx} className="glass-panel p-4.5 rounded-2xl border border-white/5 bg-secondary-bg/10 flex flex-col md:flex-row gap-4 justify-between items-start">
                        <div className="space-y-1.5 text-left max-w-xl">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-accent-cyan px-2 py-0.5 bg-accent-cyan/10 border border-accent-cyan/15 rounded font-bold uppercase">
                              {stage.time_est}
                            </span>
                            <h4 className="text-xs font-semibold text-white font-mono uppercase">{stage.stage}</h4>
                          </div>
                          <p className="text-[11px] text-white/50 leading-relaxed font-sans font-medium">
                            {stage.details}
                          </p>
                        </div>
                        
                        {/* Milestone checklist box */}
                        <div className="w-full md:w-64 p-3 bg-white/[0.02] border border-white/5 rounded-xl space-y-1 text-left shrink-0">
                          <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest font-extrabold flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-accent-green" /> Exit Milestone
                          </span>
                          <p className="text-[10px] text-white/80 leading-normal font-sans font-semibold">
                            {stage.milestone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common pitfalls / weak area reinforcement */}
                <div className="glass-panel p-5 rounded-2xl border border-accent-red/15 bg-accent-red/[0.01] space-y-2">
                  <span className="text-[10px] font-mono text-accent-red uppercase tracking-widest font-extrabold block">Weak-Area Pedagogical Reinforcement Strategy</span>
                  <p className="text-[11.5px] text-white/85 leading-relaxed font-sans font-medium">
                    {studyPlan.weak_area_reinforcement}
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>

        {/* Right Column: Real-Time Telemetry Metrics only */}
        <div className="w-full lg:w-80 flex flex-col space-y-4 shrink-0 min-h-0 overflow-y-auto">
          
          {/* Diagnostic registry card */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/25 space-y-3 shrink-0">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-extrabold block">Real Telemetry Registry</span>
            
            <div className="space-y-2.5">
              
              {/* Concept mastery coefficient */}
              <div className="bg-black/40 p-3 rounded-xl border border-accent-cyan/20 space-y-2">
                <div className="flex items-center justify-between font-mono text-[9px]">
                  <span className="text-white/40 uppercase">Concept Mastery Level</span>
                  <span className="text-accent-cyan font-bold">{metrics.conceptMastery}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-cyan transition-all duration-500" 
                    style={{ width: `${metrics.conceptMastery}%` }}
                  />
                </div>
              </div>

              {/* Topics Studied count */}
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                <span className="text-[10.5px] font-sans font-semibold text-white/50 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-accent-cyan shrink-0" /> Topics Studied
                </span>
                <span className="font-mono text-xs text-white font-bold">{metrics.topicsStudied}</span>
              </div>

              {/* Quizzes Completed */}
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                <span className="text-[10.5px] font-sans font-semibold text-white/50 flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4 text-accent-green shrink-0" /> Quizzes Completed
                </span>
                <span className="font-mono text-xs text-white font-bold">{metrics.quizzesCompleted}</span>
              </div>

              {/* Notes Generated */}
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                <span className="text-[10.5px] font-sans font-semibold text-white/50 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-accent-violet shrink-0" /> Notes Generated
                </span>
                <span className="font-mono text-xs text-white font-bold">{metrics.notesGenerated}</span>
              </div>

              {/* Problems Solved */}
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                <span className="text-[10.5px] font-sans font-semibold text-white/50 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-accent-cyan shrink-0" /> Scribbles Analyzed
                </span>
                <span className="font-mono text-xs text-white font-bold">{metrics.problemsSolved}</span>
              </div>

              {/* Study Time Logged */}
              <div className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                <span className="text-[10.5px] font-sans font-semibold text-white/50 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-white/40 shrink-0" /> Study Time Logged
                </span>
                <span className="font-mono text-xs text-white font-bold">{formatTime(coreTime)}</span>
              </div>

            </div>
          </div>

          {/* Purge Profile and settings block */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/10 text-left space-y-2.5 mt-auto">
            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-extrabold block">Profile calibration controls</span>
            <p className="text-[10.5px] text-white/40 leading-relaxed font-sans select-none">
              Clearing telemetry profiles deletes local notes matrices, quiz results indices, and restores metrics to absolute zero values.
            </p>
            <button
              onClick={handlePurgeMetrics}
              className="w-full py-2 border border-accent-red/20 bg-accent-red/10 hover:bg-accent-red/20 text-accent-red hover:text-accent-red/90 text-[10px] font-mono tracking-widest font-bold uppercase rounded-xl transition-all cursor-pointer"
            >
              PURGE TELEMETRY DATA
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
