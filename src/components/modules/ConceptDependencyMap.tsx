import React, { useState, useEffect } from "react";
import { 
  Search, 
  BookOpen, 
  Activity, 
  ArrowRight, 
  Sparkles, 
  Award, 
  HelpCircle, 
  Network, 
  ChevronRight, 
  Fingerprint, 
  FileText, 
  BrainCircuit, 
  Lightbulb,
  Workflow,
  Plus
} from "lucide-react";
import { cn } from "../../lib/utils";
import { updateTelemetryOnAction } from "../../lib/telemetry";

export interface ConceptNode {
  id: string;
  name: string;
  summary: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  prerequisites: string[];
  related: string[];
  recommendedNotes: string;
  recommendedQuizzes: string;
  recommendedResearch: string;
  recommendedExplorer: string;
  recommendedExplorerId: string;
}

export interface SubjectMap {
  subject: string;
  description: string;
  rootNode: string;
  nodes: ConceptNode[];
}

interface ConceptDependencyMapProps {
  onRoute: (module: string) => void;
  onUpdateIntelligence?: (data: any) => void;
}

export function ConceptDependencyMap({ onRoute, onUpdateIntelligence }: ConceptDependencyMapProps) {
  const [customMaps, setCustomMaps] = useState<SubjectMap[]>([]);
  const [activeSubject, setActiveSubject] = useState<SubjectMap | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [newConceptInput, setNewConceptInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [masteredNodes, setMasteredNodes] = useState<string[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      // Load custom generated maps
      const storedMaps = localStorage.getItem("sciforge_custom_dependency_maps");
      if (storedMaps) {
        const parsed = JSON.parse(storedMaps) as SubjectMap[];
        setCustomMaps(parsed);
        if (parsed.length > 0) {
          // If previous maps exist, establish active
          setActiveSubject(parsed[0]);
          if (parsed[0].nodes.length > 0) {
            setSelectedNodeId(parsed[0].nodes[0].id);
          }
        }
      }

      // Load mastered nodes
      const storedMastered = localStorage.getItem("sciforge_mastered_nodes");
      if (storedMastered) {
        setMasteredNodes(JSON.parse(storedMastered));
      } else {
        setMasteredNodes([]);
      }
    } catch (e) {
      console.warn("Local storage retrieval restricted:", e);
    }
  }, []);

  // Update telemetry and push active intelligence to sidebar trigger
  const activeNode = activeSubject?.nodes.find(n => n.id === selectedNodeId) || activeSubject?.nodes[0] || null;

  useEffect(() => {
    if (activeNode && activeSubject) {
      updateTelemetryOnAction("view_dependency_node", { topic: activeNode.name });
      
      // Push intelligence feeds
      if (onUpdateIntelligence) {
        onUpdateIntelligence({
          explain: activeNode.summary,
          steps: `Curriculum progression: ${activeSubject.subject} -> ${activeNode.name}`,
          theory: `Prerequisite blocks: ${activeNode.prerequisites.join(", ")}\nRelated segments: ${activeNode.related.join(", ")}`,
          hint: "Activate pipelines right hand side to cross-reference notes, quizes or research papers on active node.",
          conceptAnalysis: `Interconnected graph active: ${activeSubject.subject}`,
          commonPitfall: `Ensure to master background: "${activeNode.prerequisites[0] || "Foundational layers"}" before advancing.`,
          formulaConcept: `${activeNode.name} syllabus guidelines.`
        });
      }
    }
  }, [selectedNodeId, activeSubject]);

  const toggleMastery = (nodeId: string) => {
    if (!activeNode) return;
    const wasMastered = masteredNodes.includes(nodeId);
    let updated: string[];
    if (wasMastered) {
      updated = masteredNodes.filter(id => id !== nodeId);
    } else {
      updated = [...masteredNodes, nodeId];
      updateTelemetryOnAction("scribble_analysis", { topic: activeNode.name });
    }
    setMasteredNodes(updated);
    try {
      localStorage.setItem("sciforge_mastered_nodes", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
    pendo.track("concept_mastery_toggled", {
      node_name: activeNode.name,
      is_mastered: !wasMastered,
      node_difficulty: activeNode.difficulty,
      subject: activeSubject?.subject || ""
    });
  };

  const jumpToModule = (targetModule: string, topic: string, extraId?: string) => {
    if (!activeNode) return;
    localStorage.setItem("sciforge_preloaded_topic", topic);
    if (extraId) {
      localStorage.setItem("sciforge_preloaded_explorer_id", extraId);
    }
    updateTelemetryOnAction("view_dependency_node", { topic: activeNode.name });
    onRoute(targetModule);
  };

  const generateNewMap = async (concept: string) => {
    if (!concept.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/dependency-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ concept })
      });
      if (res.ok) {
        const data = (await res.json()) as SubjectMap;
        const updatedMaps = [data, ...customMaps.filter(m => m.subject.toLowerCase() !== data.subject.toLowerCase())];
        setCustomMaps(updatedMaps);
        localStorage.setItem("sciforge_custom_dependency_maps", JSON.stringify(updatedMaps));
        setActiveSubject(data);
        if (data.nodes.length > 0) {
          setSelectedNodeId(data.nodes[0].id);
        }
        setNewConceptInput("");
        pendo.track("dependency_map_generated", {
          subject: data.subject || "",
          node_count: (data.nodes || []).length,
          description: (data.description || "").substring(0, 200)
        });
      }
    } catch (err) {
      console.error("Map generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter keys based on search query
  const filteredMaps = customMaps.filter(m => 
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col h-full bg-primary-bg p-4 sm:p-6 relative select-none overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-accent-violet/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Primary Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 border-b border-glass-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-violet/10 rounded-xl text-accent-violet border border-accent-violet/10">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-semibold text-white tracking-tight">CONCEPT DEPENDENCY MAP</h1>
            <p className="text-xs text-white/40 font-mono">Knowledge structural graphs and topological educational routing pathways</p>
          </div>
        </div>

        {/* Dynamic Concept Plotter on Top */}
        <div className="flex items-center gap-2 max-w-sm md:max-w-md w-full shrink-0">
          <input
            type="text"
            value={newConceptInput}
            onChange={(e) => setNewConceptInput(e.target.value)}
            placeholder="Map a concept (e.g. Quantum Computing)..."
            className="flex-1 bg-black/40 text-xs px-3.5 py-2.5 rounded-lg text-white border border-white/5 outline-none font-mono focus:border-accent-violet/20 transition-all font-semibold"
          />
          <button
            onClick={() => generateNewMap(newConceptInput)}
            disabled={loading || !newConceptInput.trim()}
            className="px-4 py-2.5 bg-accent-violet/25 hover:bg-accent-violet/30 border border-accent-violet/30 text-accent-violet text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            {loading ? "MAPPING..." : "PLOT MAP"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 glass-panel rounded-3xl bg-black/50 p-8">
          <div className="w-12 h-12 rounded-full border-2 border-t-accent-violet border-r-transparent animate-spin mb-2" />
          <p className="font-mono text-xs text-accent-violet tracking-wider uppercase animate-pulse">Designing Symmetrical Curriculum Dependency Tree...</p>
          <p className="text-[10px] text-white/30 max-w-xs font-mono font-medium">Please wait while the AI compiles physical formulas and sequencing nodes for seamless learning pathways.</p>
        </div>
      ) : activeSubject && activeNode ? (
        /* Main interactive split pane */
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
          
          {/* Left Side: Topic select lists & searches */}
          <div className="w-full lg:w-[28%] flex flex-col gap-4 min-h-0 shrink-0">
            <div className="glass-panel p-4 rounded-2xl border border-white/5 bg-secondary-bg/25 flex flex-col gap-3">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center pr-2">
                  <Search className="w-4 h-4 text-white/30" />
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter mapped subjects..."
                  className="w-full bg-black/45 text-white pl-9 pr-3 py-2 rounded-xl border border-white/5 outline-none focus:border-accent-violet/30 text-xs font-sans transition-all"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 bg-black/15 p-2 rounded-2xl border border-white/5 min-h-0">
              {filteredMaps.length > 0 ? (
                filteredMaps.map(m => {
                  return (
                    <div
                      key={m.subject}
                      onClick={() => {
                        setActiveSubject(m);
                        if (m.nodes.length > 0) {
                          setSelectedNodeId(m.nodes[0].id);
                        }
                      }}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all relative overflow-hidden group",
                        activeSubject.subject === m.subject
                          ? "bg-accent-violet/[0.04] border-accent-violet/45 shadow-inner"
                          : "bg-secondary-bg/15 border-white/5 hover:bg-white/5"
                      )}
                    >
                      <div className="flex items-center justify-between text-[9px] font-mono text-white/30 mb-1">
                        <span className="uppercase tracking-widest font-extrabold group-hover:text-accent-violet transition-colors">STEM Curriculum</span>
                        <span>{m.nodes.length} Key Milestones</span>
                      </div>
                      <h3 className={cn(
                        "text-xs font-semibold tracking-tight",
                        activeSubject.subject === m.subject ? "text-accent-violet" : "text-white/80"
                      )}>{m.subject}</h3>
                      <p className="text-[10px] text-white/30 mt-1 line-clamp-2 leading-relaxed">{m.description}</p>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center text-white/30 space-y-2">
                  <HelpCircle className="w-8 h-8 opacity-20" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">No curricula found</span>
                </div>
              )}
            </div>
          </div>

          {/* Center Canvas Workspace: Renders interactive connected topological nodes */}
          <div className="flex-1 glass-panel rounded-3xl border border-white/5 overflow-hidden flex flex-col bg-secondary-bg/5 p-5 relative min-h-0">
            
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-5 shrink-0">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                <Workflow className="w-3.5 h-3.5 text-accent-violet" /> {activeSubject.subject} Dependency Path
              </span>
              <span className="text-[9px] font-mono text-accent-violet/70">
                CLICK NODES TO REVEAL FORENSIC DETAILS
              </span>
            </div>

            {/* Connected Tree Drawing Container */}
            <div className="flex-1 min-h-0 relative flex flex-col justify-center items-center p-4 overflow-y-auto">
              
              {/* Dynamic Symmetrical SVG Path arrows connector */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <svg className="w-full h-full">
                  {activeSubject.nodes.slice(0, -1).map((node, i) => {
                    const xGap = 100 / (activeSubject.nodes.length + 1);
                    const fromPerc = `${(i + 1) * xGap}%`;
                    const toPerc = `${(i + 2) * xGap}%`;
                    return (
                      <g key={i}>
                        <defs>
                          <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(124, 77, 255, 0.4)" />
                          </marker>
                        </defs>
                        <line
                          x1={fromPerc}
                          y1="50%"
                          x2={toPerc}
                          y2="50%"
                          stroke="rgba(124, 77, 255, 0.35)"
                          strokeWidth="2.5"
                          strokeDasharray="6 4"
                          markerEnd="url(#arrow)"
                          className="animate-pulse"
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Nodes Layout Grid mapped horizontally across sequential pipeline segments */}
              <div className="w-full flex flex-col sm:flex-row justify-around items-center gap-8 relative z-10 py-6">
                {activeSubject.nodes.map((node, idx) => {
                  const isSelected = node.id === selectedNodeId;
                  const isMastered = masteredNodes.includes(node.id);

                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className={cn(
                        "w-44 p-4 rounded-2xl border transition-all cursor-pointer flex flex-col items-center text-center space-y-2.5 relative group select-none hover:scale-[1.02]",
                        isSelected 
                          ? "bg-accent-violet/10 border-accent-violet/60 shadow-[0_0_20px_rgba(124,77,255,0.15)] scale-[1.01]" 
                          : "bg-black/55 border-white/5 hover:border-white/15"
                      )}
                    >
                      {/* Index count circle marker */}
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold border transition-colors",
                        isMastered 
                          ? "bg-accent-green/15 border-accent-green/35 text-accent-green" 
                          : isSelected 
                            ? "bg-accent-violet/20 border-accent-violet/40 text-accent-violet" 
                            : "bg-white/5 border-white/10 text-white/40"
                      )}>
                        {isMastered ? <Award className="w-3.5 h-3.5" /> : `0${idx + 1}`}
                      </div>

                      <div className="space-y-0.5">
                        <h4 className={cn(
                          "text-xs font-semibold tracking-tight transition-colors group-hover:text-accent-violet line-clamp-1",
                          isSelected ? "text-accent-violet" : "text-white/80"
                        )}>{node.name}</h4>
                        <span className="text-[8px] font-mono uppercase text-white/30 tracking-wider">
                          {node.difficulty}
                        </span>
                      </div>

                      {/* Status Badge overlay */}
                      <span className={cn(
                        "px-2 py-0.5 rounded font-mono text-[8px] uppercase tracking-wider font-extrabold",
                        isMastered 
                          ? "bg-accent-green/10 text-accent-green border border-accent-green/10" 
                          : "bg-white/5 text-white/30"
                      )}>
                        {isMastered ? "verified mastery" : "studying"}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Right Split Pane: Forensic Educational Pipeline details */}
          <div className="w-full lg:w-[32%] flex flex-col min-h-0 bg-secondary-bg/20 rounded-3xl border border-white/5 p-5 pr-4 overflow-y-auto space-y-5">
            
            <div className="border-b border-white/5 pb-3">
              <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block font-bold">Concept Diagnostic card</span>
              <h2 className="text-sm font-bold text-white mt-1 uppercase tracking-wider flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-accent-violet" /> {activeNode.name}
              </h2>
            </div>

            {/* Difficulty and Mastery interactive controllers */}
            <div className="flex items-center justify-between gap-3 bg-black/35 p-3 rounded-xl border border-white/5">
              <div className="space-y-0.5">
                <span className="text-[8px] font-mono text-white/35 uppercase block">Curriculum difficulty</span>
                <span className={cn(
                  "px-2 py-0.5 rounded font-mono text-[9px] uppercase font-bold border block text-center",
                  activeNode.difficulty === "Beginner" ? "bg-accent-green/10 text-accent-green border-accent-green/10" :
                  activeNode.difficulty === "Intermediate" ? "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/10" :
                  "bg-accent-red/10 text-accent-red border-accent-red/10"
                )}>{activeNode.difficulty}</span>
              </div>

              <button
                onClick={() => toggleMastery(activeNode.id)}
                className={cn(
                  "px-4 py-2 font-mono text-[9px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer border",
                  masteredNodes.includes(activeNode.id)
                    ? "bg-accent-green/15 text-accent-green border-accent-green/35 hover:bg-accent-green/20"
                    : "bg-accent-violet/10 text-accent-violet border-accent-violet/25 hover:bg-accent-violet/20"
                )}
              >
                {masteredNodes.includes(activeNode.id) ? "✓ Mastered" : "Mark as Mastered"}
              </button>
            </div>

            {/* Summary Abstract */}
            <div className="space-y-1.5 p-3.5 bg-white/[0.01] rounded-xl border border-white/5">
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold block flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-accent-violet" /> Core Summary
              </span>
              <p className="text-xs text-white/75 leading-relaxed font-sans">{activeNode.summary}</p>
            </div>

            {/* Prereqs & Related lists */}
            <div className="grid grid-cols-2 gap-3.5 text-[10px] font-mono leading-tight">
              <div className="space-y-1">
                <span className="text-[8px] text-white/30 uppercase font-bold tracking-wider">Prerequisites:</span>
                <div className="space-y-1">
                  {activeNode.prerequisites.map((req, i) => (
                    <div key={i} className="p-1 px-2 rounded bg-white/5 text-white/60 border border-white/5 truncate">{req}</div>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] text-white/30 uppercase font-bold tracking-wider">Related Areas:</span>
                <div className="space-y-1">
                  {activeNode.related.map((rel, i) => (
                    <div key={i} className="p-1 px-2 rounded bg-white/5 text-white/60 border border-white/5 truncate">{rel}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* Connected Action Pipelines */}
            <div className="space-y-2.5 pt-3 border-t border-white/5">
              <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold block">Ecosystem Learning Pipelines</span>
              
              <div className="space-y-2 font-sans text-xs">
                {/* Pipeline A: Scientific Documentation Lab */}
                <div 
                  onClick={() => jumpToModule("notes", activeNode.recommendedNotes)}
                  className="p-3 bg-white/[0.02] hover:bg-accent-violet/10 hover:border-accent-violet/30 border border-white/5 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-white/25 uppercase font-bold tracking-wider">Synthesizer Pipeline</span>
                    <p className="text-white/85 font-semibold group-hover:text-accent-violet transition-colors">Study Recommended Notes</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform group-hover:text-accent-violet" />
                </div>

                {/* Pipeline B: Mastery Assessment Engine */}
                <div 
                  onClick={() => jumpToModule("quiz", activeNode.recommendedQuizzes)}
                  className="p-3 bg-white/[0.02] hover:bg-accent-violet/10 hover:border-accent-violet/30 border border-white/5 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-white/25 uppercase font-bold tracking-wider">Assessment Pipeline</span>
                    <p className="text-white/85 font-semibold group-hover:text-accent-violet transition-colors">Complete Milestone Quiz</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform group-hover:text-accent-violet" />
                </div>

                {/* Pipeline C: Cognitive Synergy Hub */}
                <div 
                  onClick={() => jumpToModule("simulation", activeNode.recommendedExplorer, activeNode.recommendedExplorerId)}
                  className="p-3 bg-white/[0.02] hover:bg-accent-violet/10 hover:border-accent-violet/30 border border-white/5 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-white/25 uppercase font-bold tracking-wider">Study Workspace</span>
                    <p className="text-white/85 font-semibold group-hover:text-accent-violet transition-colors">Plan Cognitive Synergy Session</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform group-hover:text-accent-violet" />
                </div>

                {/* Pipeline D: Quantum Research Engine */}
                <div 
                  onClick={() => jumpToModule("scientist", activeNode.recommendedResearch)}
                  className="p-3 bg-white/[0.02] hover:bg-accent-violet/10 hover:border-accent-violet/30 border border-white/5 rounded-2xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-mono text-white/25 uppercase font-bold tracking-wider">Autonomous Research</span>
                    <p className="text-white/85 font-semibold group-hover:text-accent-violet transition-colors">Generate Scientific Paper</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20 group-hover:translate-x-1 transition-transform group-hover:text-accent-violet" />
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* Elevated Empty State centering instructions */
        <div className="flex-1 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
          <div className="p-4 bg-accent-violet/10 rounded-2xl text-accent-violet border border-accent-violet/20 animate-pulse">
            <Network className="w-10 h-10" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-heading font-semibold text-[#FF7A00] uppercase tracking-widest">CONCEPT DEPENDENCY MAP IDLE</h3>
            <p className="text-xs text-white/50 font-sans leading-relaxed">
              Enter a concept to begin plotting its dependency structure.
            </p>
          </div>

          <div className="w-full relative">
            <input
              type="text"
              value={newConceptInput}
              onChange={(e) => setNewConceptInput(e.target.value)}
              placeholder="e.g. Thermodynamics, Quantum Physics, Calculus..."
              className="w-full bg-black/40 text-xs pl-4 pr-24 py-3 rounded-xl border border-white/10 text-white outline-none font-mono focus:border-accent-violet/50 transition-all font-semibold"
              onKeyDown={(e) => {
                if (e.key === "Enter") generateNewMap(newConceptInput);
              }}
            />
            <button
              onClick={() => generateNewMap(newConceptInput)}
              disabled={loading || !newConceptInput.trim()}
              className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-[#FF7A00]/20 hover:bg-[#FF7A00]/35 border border-[#FF7A00]/35 text-[#FF7A00] text-[10px] font-bold font-mono rounded-lg transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              CREATE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
