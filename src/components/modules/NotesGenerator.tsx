import { useState, useEffect } from "react";
import { BookOpen, Sparkles, Search, Trash2, Plus, ArrowUpRight, ShieldCheck, ListCollapse, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn, saveRecentSession, addToPortfolio } from "../../lib/utils";
import { updateTelemetryOnAction } from "../../lib/telemetry";

interface ConceptItem {
  concept: string;
  detailedExplanation: string;
  example: string;
}

interface KeyDefinition {
  term: string;
  definition: string;
}

interface FormulaItem {
  formula: string;
  description: string;
}

interface RealWorldApp {
  application: string;
  explanation: string;
}

interface NoteData {
  id: string;
  topic: string;
  overview: string;
  fullLectureNotes: string;
  conceptBreakdown: ConceptItem[];
  keyDefinitions: KeyDefinition[];
  formulaSheet: FormulaItem[];
  realWorldApplications: RealWorldApp[];
  revisionSummary: string;
  createdAt: string;
}

export function NotesGenerator() {
  const [topicInput, setTopicInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedNotes, setSavedNotes] = useState<NoteData[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState("");

  // Load saved notes from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("sciforge_compiled_notebooks");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSavedNotes(parsed);
        if (parsed.length > 0) {
          setActiveNoteId(parsed[0].id);
        }
      } catch (err) {
        console.error("Error parsing saved notebooks", err);
      }
    }
  }, []);

  const saveToLocal = (notes: NoteData[]) => {
    setSavedNotes(notes);
    localStorage.setItem("sciforge_compiled_notebooks", JSON.stringify(notes));
  };

  // Auto-load preloaded topic from Concept Dependency Map
  useEffect(() => {
    const preloaded = localStorage.getItem("sciforge_preloaded_topic");
    if (preloaded) {
      setTopicInput(preloaded);
      generateNotes(preloaded);
      localStorage.removeItem("sciforge_preloaded_topic");
    }
  }, []);

  const generateNotes = async (topic: string) => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });
      if (res.ok) {
        const data = await res.json();
        const newNote: NoteData = {
          id: `note_${Date.now()}`,
          topic: data.topic || topic,
          overview: data.overview || "",
          fullLectureNotes: data.fullLectureNotes || "",
          conceptBreakdown: data.conceptBreakdown || [],
          keyDefinitions: data.keyDefinitions || [],
          formulaSheet: data.formulaSheet || [],
          realWorldApplications: data.realWorldApplications || [],
          revisionSummary: data.revisionSummary || "",
          createdAt: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
        };

        const updated = [newNote, ...savedNotes];
        saveToLocal(updated);
        setActiveNoteId(newNote.id);
        updateTelemetryOnAction("generate_notes", { topic: newNote.topic });

        saveRecentSession("notes", `Notebook: ${newNote.topic}`, newNote);
        addToPortfolio("note", newNote.topic, newNote);
      }
    } catch (err) {
      console.error("Notes generation failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = (id: string, e: any) => {
    e.stopPropagation();
    const updated = savedNotes.filter(n => n.id !== id);
    saveToLocal(updated);
    if (activeNoteId === id) {
      setActiveNoteId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const activeNote = savedNotes.find(n => n.id === activeNoteId);

  // Filter criteria
  const filteredNotes = savedNotes.filter(n => 
    n.topic.toLowerCase().includes(searchHistory.toLowerCase()) || 
    n.summary.toLowerCase().includes(searchHistory.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-primary-bg p-6 overflow-hidden relative">
      {/* Glow */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 border-b border-glass-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-cyan/10 rounded-xl text-accent-cyan border border-accent-cyan/10">
            <BookOpen className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-semibold text-white tracking-tight">SCIENTIFIC DOCUMENTATION LAB</h1>
            <p className="text-xs text-white/40 font-mono">Autonomous compiler of detailed STEM lecture notes and glossary index cards</p>
          </div>
        </div>

        {/* Search tool */}
        <div className="flex items-center gap-2 max-w-sm md:max-w-md w-full shrink-0">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter your notebook topic..."
            className="flex-1 bg-black/40 text-xs px-3.5 py-2.5 rounded-lg text-white border border-white/5 outline-none font-mono focus:border-accent-cyan/30 transition-all font-semibold"
          />
          <button
            onClick={() => generateNotes(topicInput)}
            disabled={loading || !topicInput.trim()}
            className="px-4 py-2.5 bg-accent-cyan/20 hover:bg-accent-cyan/30 border border-accent-cyan/30 text-accent-cyan text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            {loading ? "COMPILING..." : "BUILD NOTEBOOK"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
        
        {/* Left notebook timeline list sidebar */}
        <div className="w-full lg:w-76 glass-panel rounded-3xl border border-white/5 p-4 flex flex-col shrink-0 min-h-0 bg-secondary-bg/20">
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold pb-2 border-b border-white/5 mb-3 flex items-center justify-between">
            <span>SAVED NOTEBOOKS</span>
            <span className="text-[9px] font-mono text-accent-cyan">{savedNotes.length} Nodes</span>
          </span>

          {/* Search history input */}
          <div className="relative mb-3 shrink-0">
            <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchHistory}
              onChange={(e) => setSearchHistory(e.target.value)}
              placeholder="Filter notebooks..."
              className="w-full bg-black/30 placeholder-white/20 text-xs pl-8 pr-3 py-2 rounded-lg text-white border border-white/5 outline-none font-sans focus:border-accent-cyan/20 transition-all"
            />
          </div>

          {/* Notes items timeline list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0 select-none">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-8 text-white/20 text-[11px] font-mono">
                No notebooks matched
              </div>
            ) : (
              filteredNotes.map((note) => {
                const isActive = note.id === activeNoteId;
                return (
                  <div
                    key={note.id}
                    onClick={() => setActiveNoteId(note.id)}
                    className={cn(
                      "p-3 rounded-xl border text-left transition-all cursor-pointer relative group flex justify-between items-start",
                      isActive 
                        ? "border-accent-cyan/45 bg-accent-cyan/5 text-white" 
                        : "border-white/5 bg-black/20 text-white/60 hover:text-white hover:border-white/10 hover:bg-black/35"
                    )}
                  >
                    <div className="truncate pr-4 flex-1">
                      <p className="text-xs font-semibold truncate font-sans text-white/95 leading-tight mb-0.5">{note.topic}</p>
                      <span className="text-[9px] font-mono text-white/30">{note.createdAt}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteNote(note.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-accent-red cursor-pointer transition-all shrink-0"
                      title="Decompile notes node"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main interactive notebook presentation sheets */}
        <div className="flex-1 flex flex-col min-h-0">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 glass-panel rounded-3xl bg-black/50 p-8">
              <div className="w-12 h-12 rounded-full border-2 border-t-accent-cyan border-r-transparent animate-spin mb-2" />
              <p className="font-mono text-xs text-accent-cyan tracking-wider uppercase animate-pulse">Running Analytical Extraction & Compiling Lectures...</p>
              <p className="text-[10px] text-white/30 max-w-xs font-mono font-medium">Please wait while the AI synthesizes detailed notebook, glossary gloss, and mathematical equations.</p>
            </div>
          ) : activeNote ? (
            <div className="flex-1 glass-panel rounded-3xl border border-white/5 p-6 md:p-8 overflow-y-auto space-y-6 bg-secondary-bg/15 relative">
              
              {/* Lecture Title Banner */}
              <div className="p-5 bg-black/30 rounded-2xl border border-white/5 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest font-bold">Academic Textbook Volume</div>
                  <h2 className="text-xl font-heading font-bold text-white tracking-tight">{activeNote.topic}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const text = `TOPIC: ${activeNote.topic}\n\nOVERVIEW:\n${activeNote.overview}\n\nLECTURE NOTES:\n${activeNote.fullLectureNotes}\n\nCONCEPT REVISION SUMMARY:\n${activeNote.revisionSummary}`;
                      navigator.clipboard.writeText(text);
                      alert("Textbook copied to clipboard!");
                    }}
                    className="px-3 py-1.5 bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan text-xs font-mono rounded-lg transition-all cursor-pointer"
                  >
                    COPY DIGEST
                  </button>
                  <span className="text-[9px] font-mono text-white/40 hidden md:flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" /> VERIFIED COMPILER
                  </span>
                </div>
              </div>

              {/* Overview Abstract */}
              <div className="space-y-1 bg-accent-cyan/[0.01] border border-accent-cyan/10 p-5 rounded-2xl">
                <h3 className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest font-bold mb-2">Subject Abstract</h3>
                <p className="text-xs text-white/90 leading-relaxed font-sans">
                  {activeNote.overview}
                </p>
              </div>

              {/* Full Lecture Notes */}
              {activeNote.fullLectureNotes && (
                <div className="p-6 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                  <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold border-b border-white/5 pb-2">Full Lecture Text</h3>
                  <p className="text-xs text-white/80 leading-relaxed font-sans whitespace-pre-line">
                    {activeNote.fullLectureNotes}
                  </p>
                </div>
              )}

              {/* Concept breakdown */}
              {activeNote.conceptBreakdown && activeNote.conceptBreakdown.length > 0 && (
                <div className="space-y-5">
                  <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold">Deep Concept Breakdowns</h3>

                  {activeNote.conceptBreakdown.map((sec, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/5 bg-black/15 space-y-4">
                      <h4 className="text-xs font-mono font-bold text-white uppercase border-b border-white/5 pb-2 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-accent-cyan/15 text-accent-cyan text-[10px] flex items-center justify-center font-bold font-mono">
                          {idx + 1}
                        </span>
                        {sec.concept}
                      </h4>

                      <p className="text-xs text-white/70 leading-relaxed font-sans">
                        {sec.detailedExplanation}
                      </p>

                      {sec.example && (
                        <div className="p-3 bg-black/35 rounded-xl border border-white/5 text-[11px] text-white/50 space-y-1">
                          <span className="font-mono text-[9px] text-accent-cyan uppercase tracking-wider font-bold block">Scientific Illustration / Application:</span>
                          <p className="font-sans italic">{sec.example}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Formula Sheet */}
              {activeNote.formulaSheet && activeNote.formulaSheet.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold px-1">Mathematical Formula Reference</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeNote.formulaSheet.map((f, fIdx) => (
                      <div key={fIdx} className="p-4 bg-accent-cyan/[0.02] hover:bg-black/40 rounded-2xl border border-accent-cyan/10 space-y-1.5 transition-all">
                        <div className="font-mono text-sm text-accent-cyan font-bold">{f.formula}</div>
                        <div className="text-xs text-white/60 font-sans leading-snug">{f.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vocabulary Glossary Table */}
              {activeNote.keyDefinitions && activeNote.keyDefinitions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold px-1">Concept Terms Glossary</h3>

                  <div className="border border-white/5 rounded-2xl overflow-hidden bg-black/20">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 bg-black/40 text-[10px] font-mono text-white/40 uppercase tracking-wider">
                          <th className="py-2.5 px-4 font-bold">Standard Term</th>
                          <th className="py-2.5 px-4 font-bold">Explanatory Definition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeNote.keyDefinitions.map((vocab, vIdx) => (
                          <tr key={vIdx} className="border-b border-white/5 text-xs hover:bg-white/5 transition-all">
                            <td className="py-3 px-4 font-mono font-bold text-accent-cyan leading-none w-1/3 align-top">{vocab.term}</td>
                            <td className="py-3 px-4 text-white/70 leading-relaxed font-sans">{vocab.definition}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Real World Applications */}
              {activeNote.realWorldApplications && activeNote.realWorldApplications.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold px-1">Industrial & Ecological Scope</h3>
                  <div className="space-y-2">
                    {activeNote.realWorldApplications.map((app, aIdx) => (
                      <div key={aIdx} className="p-4 bg-accent-green/[0.02] border border-accent-green/10 rounded-2xl flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-green shrink-0 mt-1.5" />
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-white/95 font-sans">{app.application}</div>
                          <div className="text-xs text-white/60 font-sans leading-relaxed">{app.explanation}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Revision summary block */}
              {activeNote.revisionSummary && (
                <div className="border-t border-white/10 pt-5 mt-8">
                  <div className="p-5 bg-accent-cyan/[0.03] border border-accent-cyan/15 rounded-2xl space-y-2">
                    <h4 className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest font-bold">Core Revision Solidifier</h4>
                    <p className="text-xs text-white/90 leading-relaxed font-sans italic">{activeNote.revisionSummary}</p>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
              <BookOpen className="w-12 h-12 text-white/10" />
              <p className="text-xs text-white/50 leading-relaxed font-mono">
                Nothing generated yet. Start by entering a topic.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
