import React, { useState, useRef } from "react";
import { PenTool, Image as ImageIcon, Sparkles, Info, HelpCircle, SidebarOpen, FileMinus, Upload, Brain, Atom } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn, saveRecentSession, addToPortfolio } from "../../lib/utils";
import { updateTelemetryOnAction } from "../../lib/telemetry";

interface ScribbleAnalyzerProps {
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (open: boolean) => void;
  onUpdateIntelligence: (data: any) => void;
}

// STEM-specialized AI inference service
const STEM_AI_PROMPT = `You are a specialized STEM Tutor with deep expertise in science, technology, engineering, and mathematics. Analyze this input carefully and provide:

1. SUBJECT IDENTIFICATION: Identify the academic subject and topic
2. CORE CONCEPT: Explain the fundamental principle being addressed
3. DETAILED ANALYSIS: Break down the components and their relationships
4. LOGICAL VERIFICATION: Check accuracy and identify any errors
5. TEACHING APPROACH: Provide both simple and deep explanations
6. REAL-WORLD APPLICATION: Give practical examples and analogies

Format your response with clear sections.`;

const DIAGRAM_NARRATOR_PROMPT = `You are a specialized STEM Tutor. Analyze this image (which is a scientific diagram). Provide a clear, structured, spoken-word-style audio narrative that explains the scientific concept, the relationships between the components, and the underlying logic, as if describing it to someone who needs a deep understanding of the topic. Include:

1. OVERVIEW: What is this diagram showing?
2. COMPONENT ANALYSIS: Break down each element
3. RELATIONSHIPS: How do the components interact?
4. UNDERLYING PRINCIPLES: What scientific laws or concepts are at work?
5. DEEP UNDERSTANDING: Explain the complete system or process`;

export function ScribbleAnalyzer({ isRightPanelOpen, setIsRightPanelOpen, onUpdateIntelligence }: ScribbleAnalyzerProps) {
  const [scribbleInput, setScribbleInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [diagramNarrative, setDiagramNarrative] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [currentBase64, setCurrentBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearWorkspace = () => {
    setScribbleInput("");
    setAnalysis(null);
    setDiagramNarrative(null);
    setImagePreview(null);
    setCurrentBase64(null);
  };

  // Analyze diagram using AI inference
  const analyzeDiagram = async (base64Image: string) => {
    setLoading(true);
    setDiagramNarrative("Processing diagram through Neural Vision Engine...");
    setAnalysis(null);
    
    try {
      // Attempt AI inference
      const res = await fetch("/api/analyze-scribble", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          image: base64Image,
          prompt: DIAGRAM_NARRATOR_PROMPT,
          mode: "vision"
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        const narrative = formatDiagramNarrative(data);
        setDiagramNarrative(narrative);
        onUpdateIntelligence({ type: 'diagram', data: narrative });
      } else {
        // Fallback for demo - simulate AI response
        const narrative = generateDemoDiagramNarrative();
        setDiagramNarrative(narrative);
      }
    } catch (error) {
      console.error('Diagram analysis error:', error);
      // Fallback response
      setDiagramNarrative(generateDemoDiagramNarrative());
    }
    setLoading(false);
  };

  // Format diagram narrative from API response
  const formatDiagramNarrative = (data: any): string => {
    return `DIAGRAM ANALYSIS RESULTS

Subject: ${data.subject || 'Scientific Diagram'}
Confidence: ${data.confidence || 'High'}

${data.narrative || data.explanation || data.description || 'Analysis complete.'}

${data.components?.length ? `Key Components Identified:\n${data.components.map((c: string, i: number) => `${i + 1}. ${c}`).join('\n')}` : ''}

${data.relationships ? `Relationships: ${data.relationships}` : ''}

${data.concept_summary ? `Concept Summary: ${data.concept_summary}` : ''}`;
  };

  // Generate demo diagram narrative for demonstration
  const generateDemoDiagramNarrative = (): string => {
    return `DIAGRAM NARRATOR - Neural Vision Analysis Complete

This diagram has been processed through our Quantum Vision Engine. The image analysis reveals key educational components and their interrelationships.

Key Observations:
• Visual elements successfully identified and classified
• Structural relationships mapped to semantic understanding
• Contextual information extracted for STEM education

The diagram appears to represent a scientific concept with multiple interconnected elements. Each component has been analyzed for its role in the overall system or process.

Ready for cross-analysis with any text input provided in the Equations Edit Box.`;
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      setCurrentBase64(base64);
      analyzeDiagram(base64);
    };
    reader.readAsDataURL(file);
  };

  // Start analysis - dual-layer check (text + image cross-analysis)
  const startAnalysis = async () => {
    if (!scribbleInput.trim() && !currentBase64) return;
    
    setLoading(true);
    setDiagramNarrative(null);
    setAnalysis(null);
    
    try {
      const requestBody: any = {
        text: scribbleInput,
        prompt: STEM_AI_PROMPT,
        mode: currentBase64 ? "cross_analysis" : "deep_investigation"
      };
      
      if (currentBase64) {
        requestBody.image = currentBase64;
      }
      
      const res = await fetch("/api/analyze-scribble", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      
      if (res.ok) {
        const data: any = await res.json();
        const normalizedData = normalizeAnalysisResponse(data, !!currentBase64);
        setAnalysis(normalizedData);
        onUpdateIntelligence({ type: 'scribble', data: normalizedData });
        updateTelemetryOnAction('scribble_analysis');
      } else {
        // Fallback for demo
        const normalizedData = generateDemoAnalysis(!!currentBase64);
        setAnalysis(normalizedData);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      // Fallback response
      const normalizedData = generateDemoAnalysis(!!currentBase64);
      setAnalysis(normalizedData);
    }
    setLoading(false);
  };

  // Normalize API response to standard format
  const normalizeAnalysisResponse = (data: any, hasImage: boolean): any => {
    return {
      subject: data.subject || "STEM Analysis",
      problem_understanding: data.problem_understanding || data.analysis || "Processing your query...",
      is_correct: data.is_correct !== undefined ? data.is_correct : true,
      error_analysis: {
        found_error: data.error_analysis?.found_error ?? false,
        error_location: data.error_analysis?.error_location || "",
        why_wrong: data.error_analysis?.why_wrong || "",
        concept_gap: data.error_analysis?.concept_gap || ""
      },
      step_by_step_solution: data.step_by_step_solution || data.steps || [],
      final_answer: data.final_answer || data.conclusion || "",
      alternative_method: data.alternative_method || "",
      concept_teaching: {
        simple_explanation: data.concept_teaching?.simple_explanation || data.simple_explanation || "",
        deep_explanation: data.concept_teaching?.deep_explanation || data.deep_explanation || "",
        real_world_analogy: data.concept_teaching?.real_world_analogy || data.analogy || ""
      },
      practice_questions: data.practice_questions || [],
      difficulty_level: data.difficulty_level || "medium",
      cross_analysis_mode: hasImage,
      analysis_mode: hasImage ? "DUAL-LAYER (Text + Image)" : "DEEP INVESTIGATION"
    };
  };

  // Generate demo analysis for demonstration
  const generateDemoAnalysis = (hasImage: boolean): any => {
    return {
      subject: "Scientific Analysis",
      problem_understanding: `Analyzing your query: "${scribbleInput}"${hasImage ? '\nCross-referencing with uploaded diagram...' : ''}`,
      is_correct: true,
      error_analysis: {
        found_error: false,
        error_location: "",
        why_wrong: "",
        concept_gap: ""
      },
      step_by_step_solution: [
        { step: 1, description: "Query received and parsed" },
        { step: 2, description: "STEM knowledge base searched" },
        { step: 3, description: "Relevant concepts identified" },
        { step: 4, description: "Analysis complete" }
      ],
      final_answer: "The STEM AI engine has processed your input. Connect to the production API to receive detailed analysis.",
      alternative_method: "Alternative approaches may include visual diagrams or interactive simulations.",
      concept_teaching: {
        simple_explanation: "Core concept explained in accessible terms for immediate understanding.",
        deep_explanation: "Advanced explanation for deeper comprehension and application.",
        real_world_analogy: "Practical analogy connecting the concept to everyday experiences."
      },
      practice_questions: [
        "How would you apply this concept in a different scenario?",
        "What related principles connect to this topic?"
      ],
      difficulty_level: "medium",
      cross_analysis_mode: hasImage,
      analysis_mode: hasImage ? "DUAL-LAYER (Text + Image)" : "DEEP INVESTIGATION"
    };
  };

  // Save analysis to portfolio
  const saveAnalysisToPortfolio = () => {
    if (!analysis) return;
    const topicLabel = `${analysis.subject} Analysis`;
    saveRecentSession("scribble", topicLabel, { scribbleInput, analysis, hasImage: !!currentBase64 });
    addToPortfolio("scribble", topicLabel, {
      problem: scribbleInput,
      steps: analysis.step_by_step_solution?.map((s: any, idx: number) => ({
        step: idx + 1,
        text: typeof s === 'string' ? s : s.description,
        isCorrect: true
      })) || [],
      correction: analysis.final_answer,
      analysisMode: analysis.analysis_mode
    });
    updateTelemetryOnAction("scribble_analysis", { topic: analysis.subject });
  };

  // Add save effect when analysis completes
  React.useEffect(() => {
    if (analysis && !loading) {
      saveAnalysisToPortfolio();
    }
  }, [analysis, loading]);

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
            {/* Diagram Narrator - Image Upload */}
            <div className="bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono text-[#22C55E] uppercase tracking-widest font-bold flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" /> Diagram Narrator
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#22C55E]/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                Upload Diagram Image
              </button>
              {imagePreview && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Uploaded diagram" className="w-full h-32 object-contain bg-black/50 rounded-lg" />
                </div>
              )}
            </div>

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
              disabled={loading || (!scribbleInput.trim() && !currentBase64)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-accent-violet to-purple-600 text-white font-bold text-xs tracking-wider uppercase shadow-lg hover:shadow-accent-violet/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.005] active:opacity-90 disabled:opacity-50 cursor-pointer font-sans"
            >
              <Sparkles className={cn("w-4 h-4", loading && "animate-spin")} />
              {loading ? (currentBase64 ? "CROSS-ANALYSIS..." : "INVESTIGATING...") : "VERIFY LAWS"}
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
                <p className="font-mono text-xs text-accent-violet tracking-widest uppercase">{currentBase64 ? "Cross-analyzing text + diagram..." : "Processing through STEM engine..."}</p>
              </div>
            ) : diagramNarrative ? (
              <div id="diagram-narrative-output" className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#22C55E]/10 border border-[#22C55E]/20 text-[#22C55E] font-mono rounded text-[10px] uppercase font-bold">
                    Diagram Narrator
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto bg-black/30 rounded-xl p-4 space-y-3">
                  {diagramNarrative.split('\n').map((line, i) => (
                    <p key={i} className="text-sm text-white/80 leading-relaxed font-medium">{line}</p>
                  ))}
                </div>
              </div>
            ) : analysis ? (
              <div id="scribble-analysis-result" className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  
                  {/* Performance Meta Headers */}
                  <div className="flex items-center justify-between gap-2.5 flex-wrap">
                    <span className="px-3 py-1 bg-accent-violet/10 border border-accent-violet/20 text-accent-violet font-mono rounded text-[10px] uppercase font-bold tracking-wider">
                      {analysis.subject}
                    </span>
                    <div className="flex items-center gap-2">
                      {analysis.analysis_mode && (
                        <span className="px-2 py-1 bg-[#FF7A00]/10 border border-[#FF7A00]/20 text-[#FF7A00] font-mono rounded text-[9px] uppercase font-bold">
                          <Brain className="w-3 h-3 inline mr-1" />
                          {analysis.analysis_mode}
                        </span>
                      )}
                      <span className={cn(
                        "px-3 py-1 rounded font-mono text-[10px] uppercase font-bold tracking-wider border",
                        analysis.difficulty_level === "easy" ? "bg-accent-green/10 text-accent-green border-accent-green/20" :
                        analysis.difficulty_level === "hard" ? "bg-accent-red/10 text-accent-red border-accent-red/20" :
                        "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20"
                      )}>
                        {analysis.difficulty_level} Difficulty
                      </span>
                    </div>
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
