import { useState, useEffect } from "react";
import { Network, Activity, Beaker, Atom, ScrollText, CheckCircle2, ShieldAlert, SidebarOpen, Compass, AlertCircle, Sparkles, BookOpen } from "lucide-react";
import { cn, saveRecentSession, addToPortfolio } from "../../lib/utils";
import { updateTelemetryOnAction } from "../../lib/telemetry";

interface AIScientistProps {
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (open: boolean) => void;
  onUpdateIntelligence: (data: any) => void;
}

export function AIScientist({ isRightPanelOpen, setIsRightPanelOpen, onUpdateIntelligence }: AIScientistProps) {
  const [topicInput, setTopicInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSpeechBlock, setActiveSpeechBlock] = useState<string | null>(null);
  const [insight, setInsight] = useState<any | null>(null);

  // Auto-load preloaded topic from Concept Dependency Map
  useEffect(() => {
    const preloaded = localStorage.getItem("sciforge_preloaded_topic");
    if (preloaded) {
      setTopicInput(preloaded);
      generateResearchInsight(preloaded);
      localStorage.removeItem("sciforge_preloaded_topic");
    }
  }, []);

  const generateResearchInsight = async (topicOverride?: string) => {
    const targetTopic = topicOverride || topicInput;
    if (!targetTopic.trim()) return;
    setLoading(true);
    setInsight(null);
    try {
      const resp = await fetch("/api/science-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: targetTopic })
      });
      if (resp.ok) {
        const data = await resp.json();
        const normalizedData = {
          research_topic: data.research_topic || targetTopic,
          explanation: data.explanation || "Detailed academic explanation content missing.",
          principles: data.principles || [],
          applications: data.applications || [],
          limitations: data.limitations || "No specific boundary limitations recorded.",
          misconceptions: data.misconceptions || "No key textbook misconceptions recorded.",
          related_fields: data.related_fields || [],
          next_direction: data.next_direction || "No subsequent research pathway specified."
        };
        setInsight(normalizedData);
        saveRecentSession("scientist", "Research Insight: " + normalizedData.research_topic, normalizedData);
        
        // Fully automated saving to unified portfolio
        addToPortfolio("scientist", normalizedData.research_topic, normalizedData);

        // Send customized learning metadata points to right analytics board
        onUpdateIntelligence({
          explain: `Academic Research Insight centered on: ${normalizedData.research_topic}.`,
          steps: `1. Study explanation thesis\n2. Evaluate governing principles\n3. Leverage applications and related fields.`,
          theory: normalizedData.explanation?.substring(0, 200) + "...",
          hint: "Evaluate boundary limits to see physical constraints.",
          conceptAnalysis: normalizedData.next_direction,
          commonPitfall: normalizedData.misconceptions,
          formulaConcept: normalizedData.principles?.map((p: any) => p.title).join(", ") || ""
        });

        updateTelemetryOnAction("research_investigation", { topic: normalizedData.research_topic });

        pendo.track("research_insight_generated", {
          research_topic: normalizedData.research_topic,
          principles_count: (normalizedData.principles || []).length,
          applications_count: (normalizedData.applications || []).length,
          has_limitations: !!normalizedData.limitations && normalizedData.limitations !== "No specific boundary limitations recorded.",
          has_misconceptions: !!normalizedData.misconceptions && normalizedData.misconceptions !== "No key textbook misconceptions recorded.",
          related_fields_count: (normalizedData.related_fields || []).length
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeech = (text: string, id: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      if (activeSpeechBlock === id) {
        synth.cancel();
        setActiveSpeechBlock(null);
      } else {
        synth.cancel();
        setActiveSpeechBlock(id);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        utterance.onend = () => setActiveSpeechBlock(null);
        synth.speak(utterance);
      }
    }
  };

  const wordCount = insight?.explanation?.split(/\s+/).length || 0;

  return (
    <div id="ai-scientist-module" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col h-full bg-primary-bg p-4 sm:p-6 overflow-hidden relative select-none">
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-green/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 shrink-0 border-b border-glass-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-green/10 rounded-xl text-accent-green border border-accent-green/10">
            <Atom className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-semibold text-white tracking-tight">RESEARCH INSIGHT GENERATOR</h1>
            <p className="text-xs text-white/40 font-mono">Centralized academic reasoning engine for high-quality peer-reviewed deep dives</p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 max-w-sm md:max-w-md w-full shrink-0">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter a scientific research question"
            className="flex-1 bg-black/40 text-xs px-3.5 py-2.5 rounded-lg text-white border border-white/5 outline-none font-mono focus:border-accent-green/30 transition-all font-semibold"
          />
          <button
            onClick={() => generateResearchInsight()}
            disabled={loading || !topicInput.trim()}
            className="px-4 py-2.5 bg-accent-green/20 hover:bg-accent-green/30 border border-accent-green/30 text-accent-green text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            {loading ? "GENERATING..." : "GENERATE INSIGHT"}
          </button>

          {!isRightPanelOpen && (
            <button
              onClick={() => setIsRightPanelOpen(true)}
              className="px-3 py-2.5 bg-accent-green/15 hover:bg-accent-green/25 text-accent-green border border-accent-green/20 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shrink-0 cursor-pointer"
            >
              <SidebarOpen className="w-3.5 h-3.5" /> INTEL CORE
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 glass-panel rounded-3xl bg-black/50 p-8">
          <div className="w-12 h-12 rounded-full border-2 border-t-accent-green border-r-transparent animate-spin mb-2" />
          <p className="font-mono text-xs text-accent-green tracking-wider uppercase animate-pulse">Running Deep Scientific Analysis & Orchestrating Thesis...</p>
          <p className="text-[10px] text-white/30 max-w-xs font-mono font-medium">Synthesizing detailed physical mechanisms, interdisciplinary fields, and core limitations.</p>
        </div>
      ) : !insight ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 glass-panel rounded-3xl bg-black/30 p-8 max-w-lg mx-auto my-12 shrink-0">
          <div className="w-16 h-16 rounded-full bg-[#FF7A00]/5 border border-[#FF7A00]/10 flex items-center justify-center text-[#FF7A00] mb-2">
            <Atom className="w-8 h-8 animate-spin-slow" />
          </div>
          <h3 className="text-sm font-heading font-semibold text-[#FF7A00] uppercase tracking-widest">RESEARCH INSIGHT IDLE</h3>
          <p className="text-[10px] text-white/50 font-mono leading-relaxed">
            Enter a research topic to generate deep academic insights.
          </p>
          <div className="w-full relative">
            <textarea
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              placeholder="Enter your research topic here..."
              className="w-full bg-black/40 text-xs pl-4 pr-4 pt-3 pb-12 rounded-xl border border-white/10 text-white outline-none font-mono focus:border-[#FF7A00]/50 transition-all resize-none"
              rows={3}
            />
            <button
              onClick={() => generateResearchInsight()}
              disabled={loading || !topicInput.trim()}
              className="absolute bottom-2 right-2 px-4 py-1.5 bg-[#FF7A00]/20 hover:bg-[#FF7A00]/35 border border-[#FF7A00]/35 text-[#FF7A00] text-[10px] font-bold font-mono rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              GENERATE
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden text-xs">
          
          {/* Main central column: Explanation sheet */}
          <div className="flex-1 lg:flex-[3] flex flex-col min-h-0 overflow-y-auto space-y-5 pr-1 pb-4">
            
            {/* Meta status Card */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/25 relative overflow-hidden shrink-0">
              <span className="text-[9px] font-mono text-accent-green uppercase tracking-widest font-bold mb-1 block">Active Thesis Topic</span>
              <h2 className="text-base font-bold text-white uppercase font-mono">{insight.research_topic}</h2>
              <div className="flex items-center gap-3.5 mt-2.5 text-[9.5px] text-white/40 font-mono">
                <span>Verified Academic Paper Format</span>
                <span>•</span>
                <span className="text-accent-green font-bold">Scope Check: {wordCount} Words</span>
              </div>
            </div>

            {/* Comprehensive Explanation Box */}
            <div className="glass-panel p-6 rounded-2xl border border-white/5 bg-secondary-bg/15 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                  <ScrollText className="w-3.5 h-3.5 text-accent-green" /> Detailed Academic reasoning & Thesis
                </span>
                <button
                  onClick={() => handleSpeech(insight.explanation, "explanation")}
                  className={cn(
                    "px-2.5 py-0.5 rounded text-[9px] font-mono border transition-all cursor-pointer font-bold",
                    activeSpeechBlock === "explanation" ? "bg-accent-green/20 text-accent-green border-accent-green/30" : "bg-white/5 text-white/40 border-white/5 hover:text-white"
                  )}
                >
                  {activeSpeechBlock === "explanation" ? "MUTING TTS..." : "READ OUT LOUD"}
                </button>
              </div>

              <div className="text-white/80 leading-relaxed font-sans font-medium whitespace-pre-line text-xs">
                {insight.explanation}
              </div>
            </div>

            {/* Key Governing Principles */}
            {insight.principles && insight.principles.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-extrabold block">Governing Concepts & Core Principles</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {insight.principles.map((pr: any, idx: number) => (
                    <div key={idx} className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-1">
                      <h4 className="font-mono text-xs font-bold text-accent-green uppercase flex items-center gap-1.5">
                        <span className="w-4 h-4 rounded-full bg-accent-green/10 text-accent-green text-[9px] flex items-center justify-center font-bold">0{idx+1}</span>
                        {pr.title}
                      </h4>
                      <p className="text-[10.5px] text-white/60 leading-normal font-sans font-medium pt-1">{pr.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Industrial/Ecological Applications */}
            {insight.applications && insight.applications.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-extrabold block">Industrial, Clinical, or Ecological Translation</span>
                <div className="space-y-2.5">
                  {insight.applications.map((app: any, idx: number) => (
                    <div key={idx} className="p-4 bg-accent-green/[0.01] border border-accent-green/15 rounded-2xl flex gap-3">
                      <Beaker className="w-5 h-5 text-accent-green mt-0.5 shrink-0" />
                      <div className="space-y-1 leading-normal font-sans">
                        <strong className="text-white font-semibold text-xs block">{app.title}</strong>
                        <p className="text-white/60 text-[11px] font-medium">{app.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Side column: Constraints, Misconceptions, and Next suggestions */}
          <div className="w-full lg:w-80 flex flex-col space-y-4 shrink-0 min-h-0 overflow-y-auto">
            
            {/* Edge constraints & limitations */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/20 space-y-3">
              <span className="text-[9px] font-mono text-accent-red uppercase font-bold tracking-widest block flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Edge Boundary Constraints
              </span>
              <p className="text-white/60 leading-relaxed font-sans text-[11px] font-medium">
                {insight.limitations}
              </p>
            </div>

            {/* Concept Misconceptions */}
            <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/20 space-y-3">
              <span className="text-[9px] font-mono text-accent-cyan uppercase font-bold tracking-widest block flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" /> Cognitive Misconceptions
              </span>
              <p className="text-white/60 leading-relaxed font-sans text-[11px] font-medium italic">
                &ldquo;{insight.misconceptions}&rdquo;
              </p>
            </div>

            {/* Interdisciplinary Related fields */}
            {insight.related_fields && insight.related_fields.length > 0 && (
              <div className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/20 space-y-3">
                <span className="text-[9px] font-mono text-white/40 uppercase font-bold tracking-widest block">Interdisciplinary Fields</span>
                <div className="flex flex-col gap-2">
                  {insight.related_fields.map((f: string, i: number) => (
                    <div key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 text-[10.5px] font-mono text-white/70 rounded-lg">
                      ✦ {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestion next research directions */}
            <div className="glass-panel p-5 rounded-2xl border border-accent-green/10 bg-accent-green/[0.01] space-y-3">
              <span className="text-[9px] font-mono text-accent-green uppercase font-bold tracking-widest block flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Next Strategic direction
              </span>
              <p className="text-white/70 leading-relaxed font-sans text-[11px] font-semibold">
                {insight.next_direction}
              </p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
