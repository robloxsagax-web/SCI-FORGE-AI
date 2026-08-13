import React, { useState, useEffect } from "react";
import { 
  FolderArchive, 
  BookOpen, 
  HelpCircle, 
  FilePenLine, 
  Database, 
  Network, 
  Activity, 
  TrendingUp, 
  Trash2, 
  Eye, 
  CheckCircle,
  FileSpreadsheet,
  Workflow,
  Sparkles,
  Calendar,
  X,
  FileText,
  BrainCircuit,
  GraduationCap
} from "lucide-react";
import { cn } from "../../lib/utils";
import { PortfolioItem } from "../../lib/utils";

export function ResearchPortfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem("sciforge_research_portfolio");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse portfolio entries", e);
      }
    }
  }, []);

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem("sciforge_research_portfolio", JSON.stringify(updated));
    if (selectedItem?.id === id) {
      setSelectedItem(null);
    }
  };

  const filteredItems = items.filter(item => {
    if (activeFilter === "all") return true;
    return item.type === activeFilter;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case "note":
        return <BookOpen className="w-4 h-4 text-accent-cyan" />;
      case "quiz":
        return <HelpCircle className="w-4 h-4 text-accent-violet" />;
      case "scribble":
        return <FilePenLine className="w-4 h-4 text-accent-violet" />;
      case "scientist":
        return <Database className="w-4 h-4 text-accent-green" />;
      case "dependencymap":
        return <Network className="w-4 h-4 text-accent-green" />;
      case "studyplan":
        return <TrendingUp className="w-4 h-4 text-accent-cyan" />;
      default:
        return <FolderArchive className="w-4 h-4 text-white" />;
    }
  };

  const getLabelForType = (type: string) => {
    switch (type) {
      case "note":
        return "Lecture Notebook";
      case "quiz":
        return "Quiz Assessment";
      case "scribble":
        return "Scribble Breakdown";
      case "scientist":
        return "Research insight";
      case "dependencymap":
        return "Syllabus Curriculum Map";
      case "studyplan":
        return "Academic Study Plan";
      default:
        return "Portfolio Item";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-primary-bg p-6 relative select-none overflow-hidden">
      {/* Visual backdrops */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 border-b border-glass-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-cyan/10 rounded-xl text-accent-cyan border border-accent-cyan/10">
            <FolderArchive className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-semibold text-white tracking-tight">RESEARCH PORTFOLIO</h1>
            <p className="text-xs text-white/40 font-mono">Centralized, automatic record system tracking all verified research works</p>
          </div>
        </div>

        {/* Counters */}
        <div className="flex gap-2">
          <div className="px-3.5 py-1.5 bg-black/40 border border-white/5 rounded-xl font-mono text-[10px] text-white/50">
            TOTAL ASSETS: <span className="text-accent-cyan font-bold">{items.length}</span>
          </div>
        </div>
      </div>

      {/* Filtration tabs list */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-black/45 border border-white/5 rounded-2xl mb-6 self-start shrink-0">
        {[
          { id: "all", label: "Show All Records", type: "all" },
          { id: "note", label: "Notes", type: "note" },
          { id: "quiz", label: "Quizzes", type: "quiz" },
          { id: "scribble", label: "Scribbles", type: "scribble" },
          { id: "scientist", label: "Research insights", type: "scientist" },
          { id: "dependencymap", label: "Dependency Maps", type: "dependencymap" },
          { id: "studyplan", label: "Study Plans", type: "studyplan" }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => {
              setActiveFilter(filter.id);
              setSelectedItem(null);
            }}
            className={cn(
              "px-3.5 py-2 font-mono text-[10px] uppercase font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-transparent",
              activeFilter === filter.id 
                ? "bg-accent-cyan/15 text-accent-cyan border-accent-cyan/25" 
                : "text-white/40 hover:text-white"
            )}
          >
            {filter.id !== "all" && getIconForType(filter.id)}
            {filter.label}
          </button>
        ))}
      </div>

      {/* Primary body view split */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
        
        {/* Left Side: Ledger List */}
        <div className="w-full lg:w-[40%] flex flex-col min-h-0 bg-secondary-bg/15 rounded-3xl border border-white/5 p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-2 shrink-0">
            <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest block font-bold">Automatic Ledger History</span>
            <span className="text-[9px] font-mono text-white/40 uppercase">{filteredItems.length} outputs</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 min-h-0">
            {filteredItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                <FileSpreadsheet className="w-12 h-12 text-white/10" />
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-white/50 uppercase tracking-wider block">No records logged</span>
                  <p className="text-[11px] text-white/30 max-w-xs leading-relaxed font-sans">
                    Every lecture note generated, quiz completed, scribble analyzed, and study strategy simulated will automatically persist here. No bookmarks or manually clicked saves required.
                  </p>
                </div>
              </div>
            ) : (
              filteredItems.map(item => {
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer relative group flex items-start gap-3.5 overflow-hidden",
                      isSelected
                        ? "bg-accent-cyan/[0.04] border-accent-cyan/45 shadow-inner"
                        : "bg-black/25 border-white/5 hover:border-white/15 hover:bg-black/35"
                    )}
                  >
                    <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-white mt-1 shrink-0">
                      {getIconForType(item.type)}
                    </div>

                    <div className="flex-1 min-w-0 pr-6 space-y-1">
                      <div className="flex items-center gap-2 text-[9px] font-mono text-white/30">
                        <span className="uppercase tracking-widest font-extrabold">{getLabelForType(item.type)}</span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                      <h4 className={cn(
                        "text-xs font-semibold tracking-tight uppercase font-mono truncate",
                        isSelected ? "text-accent-cyan" : "text-white/85"
                      )}>{item.title}</h4>
                      <p className="text-[10px] text-white/40 font-sans line-clamp-1">
                        Ref Code: {item.id}
                      </p>
                    </div>

                    {/* Delete action */}
                    <button
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="opacity-0 group-hover:opacity-100 absolute right-3 top-4 p-1.5 bg-white/5 hover:bg-accent-red/15 text-white/30 hover:text-accent-red rounded-lg transition-all cursor-pointer"
                      title="Decompile ledger entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Analytical Inspector */}
        <div className="flex-1 glass-panel rounded-3xl border border-white/5 p-6 overflow-y-auto space-y-6 min-h-0 bg-secondary-bg/25">
          {selectedItem ? (
            <div className="space-y-6">
              
              {/* Entry Inspector Banner */}
              <div className="border-b border-white/5 pb-4 space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-mono text-accent-cyan uppercase tracking-widest font-bold">
                  {getIconForType(selectedItem.type)} {getLabelForType(selectedItem.type)} Asset Card
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase font-sans tracking-wide">{selectedItem.title}</h3>
                  <div className="text-[9px] font-mono text-white/40">REGISTERED: {selectedItem.timestamp}</div>
                </div>
              </div>

              {/* Renders according to type */}
              <div className="space-y-5">
                
                {/* 1. NOTES TYPE VIEW */}
                {selectedItem.type === "note" && (
                  <div className="space-y-5 text-sans text-xs">
                    {selectedItem.data.overview && (
                      <div className="p-4 bg-accent-cyan/[0.02] border border-accent-cyan/10 rounded-2xl space-y-1.5">
                        <span className="font-mono text-[9px] text-accent-cyan uppercase tracking-wider font-extrabold block">Abstract Overview:</span>
                        <p className="text-white/80 leading-relaxed font-sans">{selectedItem.data.overview}</p>
                      </div>
                    )}
                    {selectedItem.data.fullLectureNotes && (
                      <div className="p-5 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                        <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider font-extrabold block">Textbook Material:</span>
                        <p className="text-white/70 leading-relaxed font-sans whitespace-pre-line">{selectedItem.data.fullLectureNotes}</p>
                      </div>
                    )}

                    {selectedItem.data.conceptBreakdown && selectedItem.data.conceptBreakdown.length > 0 && (
                      <div className="space-y-3.5">
                        <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider font-extrabold block">Sub-concept matrix:</span>
                        {selectedItem.data.conceptBreakdown.map((cb: any, i: number) => (
                          <div key={i} className="p-4 bg-secondary-bg/20 rounded-xl border border-white/5 space-y-2">
                            <h5 className="font-mono text-xs font-bold text-white uppercase">{cb.concept}</h5>
                            <p className="text-white/70 font-sans">{cb.detailedExplanation}</p>
                            {cb.example && (
                              <p className="text-[11px] text-accent-cyan opacity-80 leading-relaxed italic">e.g. {cb.example}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedItem.data.formulaSheet && selectedItem.data.formulaSheet.length > 0 && (
                      <div className="space-y-3">
                        <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider font-extrabold block">Formula Bank:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedItem.data.formulaSheet.map((fs: any, i: number) => (
                            <div key={i} className="p-3 bg-black/45 rounded-xl border border-white/5">
                              <code className="text-accent-cyan font-bold text-sm block mb-1">{fs.formula}</code>
                              <span className="text-[11px] text-white/50 block font-sans">{fs.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. QUIZ TYPE VIEW */}
                {selectedItem.type === "quiz" && (
                  <div className="space-y-5">
                    <div className="flex gap-4 p-4 bg-accent-violet/[0.02] border border-accent-violet/10 rounded-2xl items-center">
                      <div className="w-14 h-14 rounded-full border border-accent-violet/20 flex flex-col items-center justify-center bg-black/35 shrink-0 select-none">
                        <span className="text-white font-extrabold text-sm">{selectedItem.data.scorePercent}%</span>
                      </div>
                      <div className="space-y-0.5 font-sans">
                        <span className="text-[9px] font-mono text-accent-violet uppercase block font-bold">Assessment Verification Card</span>
                        <div className="text-xs text-white/80">Completed assessment with a score of <strong className="text-white font-bold">{selectedItem.data.correctCount} / {selectedItem.data.totalQuestions} Questions Correct</strong>.</div>
                      </div>
                    </div>

                    {selectedItem.data.performanceHistory && (
                      <div className="space-y-3">
                        <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider font-extrabold block">Question Response Ledger</span>
                        <div className="space-y-3">
                          {selectedItem.data.performanceHistory.map((ph: any, i: number) => (
                            <div key={i} className="p-4 bg-black/30 border border-white/5 rounded-xl space-y-2 font-sans text-xs">
                              <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-1.5">
                                <span className="font-mono text-[9px] text-white/35 font-bold">QUESTION {i + 1}</span>
                                <span className={cn(
                                  "px-2 py-0.5 rounded font-mono text-[8px] uppercase tracking-wider font-extrabold border bg-black/40",
                                  ph.isCorrect ? "border-accent-green/25 text-accent-green" : "border-accent-red/25 text-accent-red"
                                )}>
                                  {ph.isCorrect ? "Correct answer" : "Incorrect response"}
                                </span>
                              </div>
                              <p className="text-white/80 font-semibold">{ph.question}</p>
                              <div className="text-white/45 pl-2.5 border-l border-white/10 space-y-1">
                                <div className="text-[10px]"><span className="font-semibold text-white/70 font-mono text-[9px]">Your choice:</span> {ph.userSelection}</div>
                                <div className="text-[10px]"><span className="font-semibold text-white/70 font-mono text-[9px]">Correct answer:</span> {ph.correctOption}</div>
                                <p className="text-[10.5px] font-sans italic pt-1 text-white/50">{ph.explanation}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. SCRIBBLE TYPE VIEW */}
                {selectedItem.type === "scribble" && (
                  <div className="space-y-5 text-sans text-xs">
                    <div className="p-4 bg-accent-violet/[0.02] border border-accent-violet/10 rounded-2xl">
                      <span className="font-mono text-[9px] text-accent-violet uppercase tracking-wider font-extrabold block mb-1">Problem evaluated</span>
                      <p className="text-xs text-white/90 leading-relaxed font-sans">{selectedItem.data.problem}</p>
                    </div>

                    {selectedItem.data.steps && selectedItem.data.steps.length > 0 && (
                      <div className="space-y-3">
                        <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider font-extrabold block">Evaluated Milestones & Mistake Isolation</span>
                        <div className="space-y-2.5">
                          {selectedItem.data.steps.map((st: any, i: number) => (
                            <div key={i} className="p-3 bg-secondary-bg/20 rounded-xl border border-white/5 space-y-1.5">
                              <div className="flex items-center justify-between font-mono text-[9px]">
                                <span className="text-white/35 font-bold">STEP {st.step}</span>
                                <span className={cn(
                                  "px-2 py-0.5 rounded font-bold uppercase",
                                  st.isCorrect ? "bg-accent-green/10 text-accent-green" : "bg-accent-red/10 text-accent-red"
                                )}>
                                  {st.isCorrect ? "Validated proof" : "Mathematical error"}
                                </span>
                              </div>
                              <p className="text-white/80">{st.text}</p>
                              {st.errorExplanation && (
                                <p className="p-2 bg-accent-red/10 border border-accent-red/20 rounded text-[10.5px] text-accent-red italic font-sans">{st.errorExplanation}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedItem.data.correction && (
                      <div className="p-4 bg-accent-green/[0.02] border border-accent-green/15 rounded-2xl space-y-1">
                        <span className="font-mono text-[9px] text-accent-green uppercase font-bold tracking-wider">Orthogonal Corrective Pathway:</span>
                        <p className="text-white/80 whitespace-pre-line leading-relaxed">{selectedItem.data.correction}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. AISCIENTIST TYPE VIEW */}
                {selectedItem.type === "scientist" && (
                  <div className="space-y-5 text-sans text-xs">
                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-1.5">
                      <span className="font-mono text-[9px] text-accent-green uppercase tracking-wider block font-bold">Research Title Context</span>
                      <h4 className="text-sm font-bold text-white uppercase font-mono">{selectedItem.title}</h4>
                    </div>

                    {selectedItem.data.explanation && (
                      <div className="space-y-1.5">
                        <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider font-extrabold block">Detailed Scientific Reasoning (Thesis)</span>
                        <div className="p-5 bg-secondary-bg/25 border border-white/5 rounded-2xl text-white/80 leading-relaxed whitespace-pre-line font-sans">
                          {selectedItem.data.explanation}
                        </div>
                      </div>
                    )}

                    {selectedItem.data.principles && selectedItem.data.principles.length > 0 && (
                      <div className="space-y-2.5">
                        <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider font-extrabold block">Key Core Principles:</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedItem.data.principles.map((pr: any, i: number) => (
                            <div key={i} className="p-3.5 bg-black/35 rounded-xl border border-white/5 space-y-1">
                              <h5 className="font-mono text-xs font-bold text-accent-green uppercase">{pr.title}</h5>
                              <p className="text-[11px] text-white/60 font-sans">{pr.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedItem.data.applications && selectedItem.data.applications.length > 0 && (
                      <div className="space-y-2">
                        <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider font-extrabold block">Industrial Applications</span>
                        <div className="space-y-2">
                          {selectedItem.data.applications.map((app: any, i: number) => (
                            <div key={i} className="p-3 bg-secondary-bg/10 rounded-xl border border-white/5 flex gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent-green mt-1.5 shrink-0" />
                              <div className="font-sans">
                                <strong className="text-white block font-semibold text-xs">{app.title}</strong>
                                <span className="text-white/60 text-[11px] leading-relaxed">{app.detail}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] font-mono leading-tight pt-2 border-t border-white/5">
                      {selectedItem.data.limitations && (
                        <div className="space-y-1">
                          <span className="text-[8px] text-white/30 uppercase font-bold tracking-wider">Limitations:</span>
                          <div className="p-3 rounded bg-white/5 text-white/60 border border-white/5 font-sans leading-relaxed">{selectedItem.data.limitations}</div>
                        </div>
                      )}
                      {selectedItem.data.misconceptions && (
                        <div className="space-y-1">
                          <span className="text-[8px] text-white/30 uppercase font-bold tracking-wider">Common Misconceptions:</span>
                          <div className="p-3 rounded bg-white/5 text-white/60 border border-white/5 font-sans leading-relaxed">{selectedItem.data.misconceptions}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. DEPENDENCY MAP TYPE VIEW */}
                {selectedItem.type === "dependencymap" && (
                  <div className="space-y-5 text-sans text-xs">
                    <div className="p-4 bg-accent-green/[0.01] border border-accent-green/10 rounded-2xl">
                      <span className="font-mono text-[9px] text-accent-green uppercase tracking-wider font-extrabold block mb-1">Concept Map Syllabus</span>
                      <p className="text-xs text-white/70 leading-relaxed font-sans">{selectedItem.data.description}</p>
                    </div>

                    {selectedItem.data.nodes && selectedItem.data.nodes.length > 0 && (
                      <div className="space-y-3.5">
                        <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider font-extrabold block">Sequential Syllabus Core Path:</span>
                        {selectedItem.data.nodes.map((nd: any, i: number) => (
                          <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                            <div className="flex items-center justify-between border-b border-white/5 pb-1">
                              <h5 className="font-mono text-xs font-bold text-white uppercase flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-accent-green/15 text-accent-green text-[10px] flex items-center justify-center font-bold">0{i+1}</span>
                                {nd.name}
                              </h5>
                              <span className="px-2 py-0.5 rounded font-mono text-[8px] uppercase tracking-wider bg-white/5 text-white/40 border border-white/5">{nd.difficulty}</span>
                            </div>
                            <p className="text-white/70 font-sans leading-relaxed pt-1">{nd.summary}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* 6. STUDY PLAN TYPE VIEW */}
                {selectedItem.type === "studyplan" && (
                  <div className="space-y-5 text-sans text-xs">
                    <div className="flex items-center gap-3.5 p-4 bg-accent-cyan/[0.02] border border-accent-cyan/10 rounded-2xl">
                      <GraduationCap className="w-8 h-8 text-accent-cyan shrink-0" />
                      <div className="font-sans">
                        <span className="text-[9px] font-mono text-accent-cyan font-bold block uppercase tracking-wider">Dynamic Strategy Matrix</span>
                        <p className="text-white/80 leading-normal">{selectedItem.data.difficultyLabel || "Structured"} curriculum strategy set for mastering: <strong className="text-white font-bold">{selectedItem.title}</strong>.</p>
                      </div>
                    </div>

                    {selectedItem.data.phases && selectedItem.data.phases.length > 0 && (
                      <div className="space-y-4">
                        <span className="font-mono text-[9.5px] text-white/40 uppercase tracking-wider font-extrabold block">Chronological Milestones (Phases)</span>
                        <div className="space-y-3">
                          {selectedItem.data.phases.map((ph: any, i: number) => (
                            <div key={i} className="p-4 bg-black/40 border border-white/5 rounded-xl space-y-2">
                              <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
                                <span className="font-mono text-[10px] text-accent-cyan font-extrabold uppercase tracking-wide">PHASE {i + 1}: {ph.title}</span>
                                <div className="flex gap-2 font-mono text-[8.5px]">
                                  <span className="text-white/30 uppercase">TIME: {ph.time || "2.5 hrs"}</span>
                                  <span>|</span>
                                  <span className="text-white/30 uppercase">PRIORITY: {ph.priority || "High"}</span>
                                </div>
                              </div>
                              <p className="text-white/80 leading-normal font-sans pt-1">{ph.details}</p>
                              
                              {ph.tasks && ph.tasks.length > 0 && (
                                <div className="pt-2 flex flex-wrap gap-1.5">
                                  {ph.tasks.map((tsk: string, tIdx: number) => (
                                    <span key={tIdx} className="px-2 py-0.5 rounded bg-white/5 text-[9.5px] font-mono text-white/50 border border-white/5 lowercase truncate">✓ {tsk}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
              
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 max-w-sm mx-auto py-12">
              <Eye className="w-10 h-10 text-white/10" />
              <div className="space-y-1.5">
                <h3 className="text-sm font-mono font-bold text-white/60 uppercase tracking-widest">Awaiting selection</h3>
                <p className="text-[11px] text-white/40 leading-relaxed font-sans">
                  Choose any automatically backed-up asset node on the left to review telemetry reports, equations, mistake isolates, and full textbook lectures.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
