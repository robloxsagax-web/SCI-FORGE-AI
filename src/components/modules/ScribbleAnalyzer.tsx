import React, { useState } from "react";
import { PenTool, Image as ImageIcon, Sparkles, Info, HelpCircle, SidebarOpen, FileMinus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn, saveRecentSession, addToPortfolio } from "../../lib/utils";
import { updateTelemetryOnAction } from "../../lib/telemetry";

interface ScribbleAnalyzerProps {
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (open: boolean) => void;
  onUpdateIntelligence: (data: any) => void;
}

export function ScribbleAnalyzer({ isRightPanelOpen, setIsRightPanelOpen, onUpdateIntelligence }: ScribbleAnalyzerProps) {
  const [scribbleInput, setScribbleInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);

  const clearWorkspace = () => {
    setScribbleInput("");
    setAnalysis(null);
  };

  const startAnalysis = async () => {
    if (!scribbleInput.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-scribble", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: scribbleInput })
      });
      if (res.ok) {
        const data: any = await res.json();
        
        // Normalize backend response keys
        const normalizedData = {
          subject: data.subject || "Academic Coursework",
          problem_understanding: data.problem_understanding || "Analyzing equations and algebraic balance.",
          is_correct: data.is_correct !== undefined ? data.is_correct : true,
          error_analysis: {
            found_error: data.error_analysis?.found_error !== undefined ? data.error_analysis.found_error : false,
            error_location: data.error_analysis?.error_location || "",
            why_wrong: data.error_analysis?.why_wrong || "",
            concept_gap: data.error_analysis?.concept_gap || ""
          },
          step_by_step_solution: data.step_by_step_solution || [],
          final_answer: data.final_answer || "",
          alternative_method: data.alternative_method || "",
          concept_teaching: {
            simple_explanation: data.concept_teaching?.simple_explanation || "",
            deep_explanation: data.concept_teaching?.deep_explanation || "",
            real_world_analogy: data.concept_teaching?.real_world_analogy || ""
          },
          practice_questions: data.practice_questions || [],
          difficulty_level: data.difficulty_level || "medium"
        };

        setAnalysis(normalizedData);

        // Save session structure
        const topicLabel = `${normalizedData.subject} Worksheet`;
        saveRecentSession("scribble", topicLabel, { scribbleInput, analysis: normalizedData });

        // Auto save to centralized Research Portfolio
        addToPortfolio("scribble", topicLabel, {
          problem: scribbleInput,
          steps: normalizedData.step_by_step_solution?.map((text: string, idx: number) => {
            const isWrongStep = !normalizedData.is_correct && normalizedData.error_analysis.error_location && text.includes(normalizedData.error_analysis.error_location);
            return {
              step: idx + 1,
              text: text,
              isCorrect: !isWrongStep,
              errorExplanation: isWrongStep ? (normalizedData.error_analysis.why_wrong || "Isolated mathematical error") : undefined
            };
          }) || [],
          correction: normalizedData.final_answer || "No corrective step needed."
        });

        // Map correct diagnostics directly into intelligence blocks
        onUpdateIntelligence({
          explain: `Scribble Analyzer processed ${normalizedData.subject}. Result is_correct: ${normalizedData.is_correct}.`,
          steps: normalizedData.step_by_step_solution?.join("\n") || "No steps parsed.",
          theory: normalizedData.concept_teaching.deep_explanation,
          hint: normalizedData.is_correct ? "Excellent work! Algebraic sequencing is verified correct." : `Diagnostic gap: ${normalizedData.error_analysis.concept_gap}`,
          conceptAnalysis: `Horizontal corrected derivation tracking: ${normalizedData.final_answer}`,
          commonPitfall: normalizedData.error_analysis.why_wrong || "None identified.",
          formulaConcept: normalizedData.final_answer
        });

        // Sync with central Mastery statistics
        updateTelemetryOnAction("scribble_analysis", { topic: normalizedData.subject });
        if (!normalizedData.is_correct) {
          updateTelemetryOnAction("scribble_struggled");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-primary-bg p-6 relative">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-violet/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Main Title Banner */}
      <div className="flex items-center justify-between mb-6 shrink-0 border-b border-glass-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-violet/10 rounded-xl text-accent-violet border border-accent-violet/10">
            <PenTool className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-semibold text-white tracking-tight">SCRIBBLE ANALYSIS LAB</h1>
            <p className="text-xs text-white/40">Algebraic, kinematic, and equation logic error isolator</p>
          </div>
        </div>

        {/* Floating Right Panel Trigger */}
        {!isRightPanelOpen && (
          <button
            onClick={() => setIsRightPanelOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-accent-violet/20 hover:bg-accent-violet/30 border border-accent-violet/20 rounded-xl text-[11px] font-semibold text-accent-violet tracking-wider cursor-pointer font-sans"
          >
            <SidebarOpen className="w-3.5 h-3.5" /> REASONING FORENSIC ENGINE
          </button>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        
        {/* Left Input Workspace Side */}
        <div className="flex-1 glass-panel rounded-3xl border flex flex-col overflow-hidden relative p-6 bg-secondary-bg/20 border-white/5">
          
          {/* Top workspace control utilities */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 border-b border-white/5 pb-3 shrink-0">
            <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5 font-bold">
              <ImageIcon className="w-3.5 h-3.5 text-accent-violet" /> Problem Lab Input Canvas
            </span>
            
            {scribbleInput.trim() && (
              <button 
                onClick={clearWorkspace}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold text-white/40 hover:text-white bg-white/5 border border-white/5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Clear current scribbled workspace"
              >
                <FileMinus className="w-3.5 h-3.5" /> Clear Workspace
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col space-y-4 min-h-0">
            {/* Always provide the text area edit field so students can manually calibrate OCR or input directly */}
            <div className="flex flex-col space-y-2 flex-1 min-h-0">
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest pl-1 font-bold">Equations Edit Box</span>
              <textarea
                value={scribbleInput}
                onChange={(e) => setScribbleInput(e.target.value)}
                className="w-full flex-1 bg-black/45 text-white font-mono rounded-2xl p-5 outline-none resize-none border border-white/5 focus:border-accent-violet/30 transition-all text-sm leading-relaxed"
                placeholder="Paste your equation, derivation, or problem here"
              />
            </div>
            
            <button
              onClick={startAnalysis}
              disabled={loading || !scribbleInput.trim()}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-violet to-purple-600 text-white font-bold text-xs tracking-wider uppercase shadow-lg hover:shadow-accent-violet/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.005] active:opacity-90 disabled:opacity-50 cursor-pointer font-sans"
            >
              <Sparkles className={cn("w-4 h-4", loading && "animate-spin")} />
              {loading ? "PARSING INDICES..." : "VERIFY LAWS"}
            </button>
          </div>
        </div>

        {/* Right Output Workspace Panel */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 glass-panel rounded-3xl border border-white/5 p-6 flex flex-col min-h-0 bg-secondary-bg/20">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                <Info className="w-3.5 h-3.5 text-accent-green" /> LOGICAL VERIFICATION CORE
              </span>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-10 h-10 rounded-full border-2 border-t-accent-violet border-r-transparent animate-spin" />
                <p className="font-mono text-xs text-accent-violet tracking-widest uppercase">Analyzing continuous spatial matrices...</p>
              </div>
            ) : analysis ? (
              <div id="scribble-analysis-result" className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  
                  {/* Performance Meta Headers */}
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="px-3 py-1 bg-accent-violet/10 border border-accent-violet/20 text-accent-violet font-mono rounded text-[10px] uppercase font-bold tracking-wider">
                      {analysis.subject}
                    </span>
                    <span className={cn(
                      "px-3 py-1 rounded font-mono text-[10px] uppercase font-bold tracking-wider border",
                      analysis.difficulty_level === "easy" ? "bg-accent-green/10 text-accent-green border-accent-green/20" :
                      analysis.difficulty_level === "hard" ? "bg-accent-red/10 text-accent-red border-accent-red/20" :
                      "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20"
                    )}>
                      {analysis.difficulty_level} Difficulty
                    </span>
                  </div>

                  {/* Problem Understanding Abstract */}
                  <div className="p-4 bg-black/30 rounded-xl border border-white/5 space-y-1">
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold block">Mental Objective Block</span>
                    <p className="text-xs text-white/80 leading-relaxed font-sans">{analysis.problem_understanding}</p>
                  </div>

                  {/* Correctness Status Badge */}
                  <div className={cn(
                    "p-5 rounded-2xl border relative overflow-hidden flex flex-col gap-1.5",
                    analysis.is_correct 
                      ? "bg-accent-green/[0.02] border-accent-green/20 text-accent-green" 
                      : "bg-accent-red/[0.02] border-accent-red/25 text-accent-red"
                  )}>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2.5 h-2.5 rounded-full animate-ping",
                        analysis.is_correct ? "bg-accent-green" : "bg-accent-red"
                      )} />
                      <span className="text-[11px] font-mono uppercase tracking-widest font-bold">
                        {analysis.is_correct ? "SUCCESS: VERIFIED DERIVATION CORRECT" : "WARNING: LOGICAL SLIP DETECTED"}
                      </span>
                    </div>

                    {!analysis.is_correct && analysis.error_analysis && (
                      <div className="mt-3 space-y-3 pt-3 border-t border-accent-red/10 text-white">
                        <div>
                          <span className="text-[9px] font-mono text-accent-red uppercase tracking-wider font-bold block">Error Source Position</span>
                          <span className="text-xs font-mono bg-black/40 border border-accent-red/10 text-white/90 px-2.5 py-1 rounded-md mt-1 block">
                            {analysis.error_analysis.error_location || "(System calibration location empty)"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-accent-red uppercase tracking-wider font-bold block">Faulty Step Rationale</span>
                          <p className="text-xs text-white/70 leading-relaxed font-sans mt-0.5">{analysis.error_analysis.why_wrong}</p>
                        </div>
                        <div>
                          <span className="text-[9px] font-mono text-accent-red uppercase tracking-wider font-bold block">Cognitive Conceptual Gap</span>
                          <p className="text-xs text-accent-red/90 leading-relaxed font-sans italic font-medium mt-0.5">💡 {analysis.error_analysis.concept_gap}</p>
                        </div>
                      </div>
                    )}

                    {analysis.is_correct && (
                      <p className="text-xs text-white/70 leading-relaxed font-sans mt-1">
                        Outstanding analytical reasoning, this formula execution is perfect! No logical glitches or algorithmic step gaps identified. Explore alternative insights below.
                      </p>
                    )}
                  </div>

                  {/* Step-by-Step educational breakdown */}
                  <div className="space-y-3">
                    <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold px-1">Procedural Pipeline Solution</div>
                    <div className="space-y-2">
                       {analysis.step_by_step_solution?.map((step: string, idx: number) => {
                        const isIncorrect = !analysis.is_correct && step.includes(analysis.error_analysis.error_location);
                        return (
                          <div 
                            key={idx} 
                            className={cn(
                              "p-4 rounded-xl border relative overflow-hidden transition-all bg-black/15",
                              isIncorrect ? "border-accent-red/35 bg-accent-red/[0.02]" : "border-white/5"
                            )}
                          >
                            <span className={cn(
                              "text-[9px] font-mono uppercase font-bold tracking-wider block mb-1",
                              isIncorrect ? "text-accent-red" : "text-white/40"
                            )}>
                              Step #{idx + 1} — {isIncorrect ? "SLIP POINT" : "VERIFIED LINE"}
                            </span>
                            <div className="text-xs font-mono text-white/90">{step}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Target Final Answer */}
                  {analysis.final_answer && (
                    <div className="p-5 bg-accent-green/[0.02] border border-accent-green/10 rounded-2xl relative overflow-hidden space-y-1">
                      <span className="text-[9px] font-mono text-accent-green uppercase tracking-widest font-bold block">Calibrated Target Solution</span>
                      <div className="text-base font-bold font-mono text-accent-green bg-black/45 p-3.5 rounded border border-accent-green/10">
                        {analysis.final_answer}
                      </div>
                    </div>
                  )}

                  {/* Alternative Solving Method */}
                  {analysis.alternative_method && (
                    <div className="p-5 bg-accent-cyan/[0.02] border border-accent-cyan/10 rounded-2xl relative overflow-hidden space-y-1.5 text-left">
                      <span className="text-[9px] font-mono text-accent-cyan uppercase tracking-widest font-bold block">Alternative Solving Method</span>
                      <p className="text-xs text-white/85 leading-relaxed font-sans">{analysis.alternative_method}</p>
                    </div>
                  )}

                  {/* Structured Core Academic Teaching Block */}
                  {analysis.concept_teaching && (
                    <div className="space-y-3.5 pt-2">
                      <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold px-1">Conceptual Classroom Instruction</div>
                      
                      <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/10 space-y-4">
                        {/* Simple */}
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-accent-violet uppercase tracking-wider font-bold block">Intuitive Fundamental Principle</span>
                          <p className="text-xs text-white/80 leading-relaxed font-sans">
                            {analysis.concept_teaching.simple_explanation}
                          </p>
                        </div>

                        {/* Deep */}
                        {analysis.concept_teaching.deep_explanation && (
                          <div className="space-y-1 pt-3 border-t border-white/5">
                            <span className="text-[9px] font-mono text-accent-violet uppercase tracking-wider font-bold block">Theoretical Deep Dive</span>
                            <p className="text-xs text-white/75 leading-relaxed font-sans">
                              {analysis.concept_teaching.deep_explanation}
                            </p>
                          </div>
                        )}

                        {/* Analogy */}
                        {analysis.concept_teaching.real_world_analogy && (
                          <div className="p-4 bg-accent-violet/[0.01] border border-accent-violet/10 rounded-xl space-y-1">
                            <span className="text-[9px] font-mono text-accent-violet uppercase tracking-wider font-bold block">Real-World Analogy</span>
                            <p className="text-xs text-white/60 font-sans italic leading-relaxed">
                              &ldquo;{analysis.concept_teaching.real_world_analogy}&rdquo;
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Similar Practice Questions Sheet */}
                  {analysis.practice_questions && analysis.practice_questions.length > 0 && (
                    <div className="space-y-2.5 pt-2">
                      <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold px-1">Challenge Practice Scenarios</div>
                      <div className="space-y-2 font-sans">
                        {analysis.practice_questions.map((q: string, qIdx: number) => (
                          <div 
                            key={qIdx} 
                            onClick={() => setScribbleInput(q)}
                            className="p-4 bg-accent-violet/[0.02] hover:bg-accent-violet/10 hover:border-accent-violet/30 border border-white/5 rounded-2xl cursor-pointer transition-all flex gap-3 group"
                          >
                            <span className="w-5 h-5 rounded bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-[10px] font-mono text-accent-violet font-bold shrink-0 mt-0.5">
                              0{qIdx + 1}
                            </span>
                            <div className="space-y-1">
                              <p className="text-xs text-white/85 leading-snug font-medium pr-2 group-hover:text-accent-violet transition-colors">{q}</p>
                              <span className="text-[8px] font-mono text-white/20 uppercase font-bold tracking-wider block">Click workspace item to import problem input</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
                <HelpCircle className="w-12 h-12 text-white/10" />
                <p className="text-xs text-white/50 leading-relaxed font-mono">
                  Nothing generated yet. Start by entering a topic.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
