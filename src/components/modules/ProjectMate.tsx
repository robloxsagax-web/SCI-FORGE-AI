import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  TrendingUp, 
  CheckSquare, 
  Plus, 
  Trash2, 
  Award, 
  Brain, 
  Bookmark, 
  History, 
  ChevronRight, 
  Clock, 
  FolderPlus,
  HelpCircle,
  FileSpreadsheet
} from "lucide-react";
import { cn, addToPortfolio } from "../../lib/utils";
import { updateTelemetryOnAction } from "../../lib/telemetry";

interface ProjectMateProps {
  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (open: boolean) => void;
  onUpdateIntelligence?: (data: any) => void;
}

interface StemProject {
  id: string;
  name: string;
  category: string;
  targetDate: string;
  goals: { text: string; completed: boolean }[];
  progressPercent: number;
  hoursSpent: number;
}

interface ResearchLog {
  id: string;
  title: string;
  paperUrlOrSource: string;
  extractedAbstract: string;
  timestamp: string;
}

interface StudyTask {
  id: string;
  text: string;
  priority: "High" | "Medium" | "Low";
  category: string;
  completed: boolean;
}

export function ProjectMate({ isRightPanelOpen, setIsRightPanelOpen, onUpdateIntelligence }: ProjectMateProps) {
  const [activeTab, setActiveTab] = useState<"timer" | "projects" | "research" | "tasks">("timer");

  // Cognitive timer states
  const [minutes, setMinutes] = useState(45);
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [focusCycles, setFocusCycles] = useState(0);
  const [customMinutesInput, setCustomMinutesInput] = useState("45");
  const [sessionSummary, setSessionSummary] = useState<any | null>(null);
  const [summarizingLoading, setSummarizingLoading] = useState(false);

  // Core study modules dynamic state loads (painless empty lists initially)
  const [projectsList, setProjectsList] = useState<StemProject[]>([]);
  const [researchList, setResearchList] = useState<ResearchLog[]>([]);
  const [tasksList, setTasksList] = useState<StudyTask[]>([]);
  const [studyStreak, setStudyStreak] = useState(0);

  // Load persistence states
  useEffect(() => {
    try {
      const savedProjects = localStorage.getItem("sciforge_projects");
      if (savedProjects) setProjectsList(JSON.parse(savedProjects));

      const savedResearch = localStorage.getItem("sciforge_research_logs");
      if (savedResearch) setResearchList(JSON.parse(savedResearch));

      const savedTasks = localStorage.getItem("sciforge_study_tasks");
      if (savedTasks) setTasksList(JSON.parse(savedTasks));

      const savedStreak = localStorage.getItem("sciforge_study_streak");
      setStudyStreak(savedStreak ? parseInt(savedStreak, 10) : 0);
    } catch (e) {
      console.warn("Storage syncing restricted", e);
    }
  }, []);

  // Save updates helper
  const saveState = (key: string, data: any, updater: any) => {
    updater(data);
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  // Preload topics from Concept Dependency Map
  useEffect(() => {
    const preloadedTopic = localStorage.getItem("sciforge_preloaded_topic");
    if (preloadedTopic) {
      // Create a task automatically for the preloaded topic so the user is guided
      const newTask: StudyTask = {
        id: `tasks_${Date.now()}`,
        text: `Review curriculum node: ${preloadedTopic}`,
        priority: "High",
        category: "Concept Study",
        completed: false
      };
      const updated = [newTask, ...tasksList];
      saveState("sciforge_study_tasks", updated, setTasksList);
      setActiveTab("tasks");
      localStorage.removeItem("sciforge_preloaded_topic");
    }
  }, []);

  const triggerAutoSummarize = async (minutesVal: number) => {
    setSummarizingLoading(true);
    setSessionSummary(null);
    try {
      const activeCompletedTasks = tasksList.filter(t => t.completed).map(t => t.text);
      const activeProjects = projectsList.map(p => `Progressed on STEM project: ${p.name}`);
      const combinedActivities = [...activeCompletedTasks, ...activeProjects];

      const res = await fetch("/api/summarize-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minutes: minutesVal,
          activities: combinedActivities
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSessionSummary(data);

        pendo.track("study_session_completed", {
          session_duration_minutes: minutesVal,
          cognitive_efficiency: data.cognitive_efficiency || 0,
          completed_tasks_count: activeCompletedTasks.length,
          active_projects_count: activeProjects.length
        });

        // Auto save to Central Research Portfolio
        addToPortfolio("scientist", `Cognitive summary: ${minutesVal} Min`, {
          research_topic: `Study session summary - ${minutesVal} Min`,
          explanation: data.scientific_analysis,
          principles: (data.actions_completed || []).map((action: string, i: number) => ({
            title: `Action #${i + 1}`,
            detail: action
          })),
          applications: [
            { title: "Strategic Advice", detail: data.strategic_advice }
          ],
          limitations: data.executive_summary,
          misconceptions: "Cognitive exhaustion points mitigated via structured intervals.",
          related_fields: ["Cognitive Science", "Neurological Consolidation"],
          next_direction: data.strategic_advice
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSummarizingLoading(false);
    }
  };

  // Cognitive timer logic
  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(prev => prev - 1);
        } else if (minutes > 0) {
          setMinutes(prev => prev - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setTimerRunning(false);
          setFocusCycles(prev => prev + 1);
          const nextStreak = studyStreak + 1;
          setStudyStreak(nextStreak);
          localStorage.setItem("sciforge_study_streak", nextStreak.toString());

          // Trigger dynamic auto-summarize
          triggerAutoSummarize(parseInt(customMinutesInput, 10) || 45);

          // Push telemetry update
          updateTelemetryOnAction("timer_run_seconds", 2700); // 45 minutes equivalence

          if (onUpdateIntelligence) {
            onUpdateIntelligence({
              explain: "Focused Cognitive Study cycle logged successfully. Deep focus score incremented by +15%.",
              steps: "Session progression: Initial Calibration -> Sustained Alpha Stage -> Consolidated Memory State",
              theory: "The Cognitive 45-minute cycle operates inside maximum metabolic efficiency blocks, optimizing dendritic spine maturation.",
              hint: "Spend some time on Notes or pass a Quiz to solidify what you just covered during focus sessions."
            });
          }
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, minutes, seconds]);

  // Project managers helpers
  const [newProjName, setNewProjName] = useState("");
  const [newProjCat, setNewProjCat] = useState("Physics");
  const [newProjMilestones, setNewProjMilestones] = useState("");

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;

    const milestones = newProjMilestones
      .split("\n")
      .filter(l => l.trim().length > 0)
      .map(m => ({ text: m.trim(), completed: false }));

    const newProject: StemProject = {
      id: `proj_${Date.now()}`,
      name: newProjName.trim(),
      category: newProjCat,
      targetDate: new Date().toLocaleDateString(),
      goals: milestones,
      progressPercent: 0,
      hoursSpent: 0
    };

    const updated = [newProject, ...projectsList];
    saveState("sciforge_projects", updated, setProjectsList);
    setNewProjName("");
    setNewProjMilestones("");

    pendo.track("study_project_created", {
      project_name: newProject.name,
      category: newProject.category,
      milestone_count: milestones.length
    });

    if (onUpdateIntelligence) {
      onUpdateIntelligence({
        explain: `STEM Research Project design initialized: "${newProject.name}"`,
        steps: `Project milestones structured: ${milestones.length} checkpoints mapped`,
        theory: `Calculated operational complexity: ${milestones.length > 3 ? "Advanced" : "Standard"}`
      });
    }
  };

  const toggleMilestone = (projId: string, milestoneIdx: number) => {
    const updated = projectsList.map(p => {
      if (p.id === projId) {
        const targetGoal = p.goals[milestoneIdx];
        targetGoal.completed = !targetGoal.completed;
        const total = p.goals.length;
        const completed = p.goals.filter(g => g.completed).length;
        p.progressPercent = Math.round((completed / total) * 100);
        // Feed telemetry
        updateTelemetryOnAction("explore_experience", { topic: p.name });
        pendo.track("project_milestone_completed", {
          project_name: p.name,
          project_category: p.category,
          milestone_index: milestoneIdx,
          progress_percent: p.progressPercent,
          total_milestones: total
        });
      }
      return p;
    });
    saveState("sciforge_projects", updated, setProjectsList);
  };

  const deleteProject = (projId: string) => {
    const updated = projectsList.filter(p => p.id !== projId);
    saveState("sciforge_projects", updated, setProjectsList);
  };

  // Research log helpers
  const [researchTitle, setResearchTitle] = useState("");
  const [researchSource, setResearchSource] = useState("");
  const [researchNotes, setResearchNotes] = useState("");

  const handleAddResearchLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!researchTitle.trim()) return;

    const newLog: ResearchLog = {
      id: `res_${Date.now()}`,
      title: researchTitle.trim(),
      paperUrlOrSource: researchSource.trim() || "Consolidated Literature DB",
      extractedAbstract: researchNotes.trim(),
      timestamp: new Date().toLocaleString()
    };

    const updated = [newLog, ...researchList];
    saveState("sciforge_research_logs", updated, setResearchList);
    setResearchTitle("");
    setResearchSource("");
    setResearchNotes("");

    // Telemetry increment for notes-logged milestones
    updateTelemetryOnAction("generate_notes", { topic: newLog.title });

    pendo.track("research_log_created", {
      log_title: newLog.title,
      has_source: !!researchSource.trim(),
      abstract_length: newLog.extractedAbstract.length
    });
  };

  const deleteResearchLog = (id: string) => {
    const updated = researchList.filter(r => r.id !== id);
    saveState("sciforge_research_logs", updated, setResearchList);
  };

  // Task list helpers
  const [taskText, setTaskText] = useState("");
  const [taskPriority, setTaskPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [taskCategory, setTaskCategory] = useState("Syllabus Review");

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTask: StudyTask = {
      id: `task_${Date.now()}`,
      text: taskText.trim(),
      priority: taskPriority,
      category: taskCategory,
      completed: false
    };

    const updated = [newTask, ...tasksList];
    saveState("sciforge_study_tasks", updated, setTasksList);
    setTaskText("");

    pendo.track("study_task_created", {
      task_text: newTask.text,
      priority: newTask.priority,
      category: newTask.category
    });
  };

  const toggleTaskCompletion = (id: string) => {
    const updated = tasksList.map(t => {
      if (t.id === id) {
        t.completed = !t.completed;
        if (t.completed) {
          // Task completed increments learning telemetry parameters
          updateTelemetryOnAction("timer_run_seconds", 300); // 5 focus minutes worth
          pendo.track("study_task_completed", {
            task_text: t.text,
            priority: t.priority,
            category: t.category
          });
        }
      }
      return t;
    });
    saveState("sciforge_study_tasks", updated, setTasksList);
  };

  const deleteTask = (id: string) => {
    const updated = tasksList.filter(t => t.id !== id);
    saveState("sciforge_study_tasks", updated, setTasksList);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col h-full bg-primary-bg p-4 sm:p-6 relative select-none overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-cyan/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Main Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 shrink-0 border-b border-glass-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-cyan/10 rounded-xl text-accent-cyan border border-accent-cyan/10">
            <Brain className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-semibold text-white tracking-tight">COGNITIVE SYNERGY HUB</h1>
            <p className="text-xs text-white/40 font-mono">Personal STEM Study Operating System and Analytical focus modules</p>
          </div>
        </div>

        {/* Global Streak/Focus indicators */}
        <div className="flex items-center gap-3 font-mono text-[10px]">
          <div className="px-3 py-1.5 bg-accent-green/10 border border-accent-green/20 text-accent-green rounded-xl uppercase tracking-wider font-extrabold flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" /> STREAK: {studyStreak} PLOTS
          </div>
          <div className="px-3 py-1.5 bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan rounded-xl uppercase tracking-wider font-extrabold flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> CYCLES DONE: {focusCycles}
          </div>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex p-1 bg-black/40 border border-white/5 rounded-2xl mb-6 self-start shrink-0">
        {[
          { id: "timer", label: "Cognitive Session Tracker", icon: Clock },
          { id: "projects", label: "STEM Project & Goal Tracker", icon: FolderPlus },
          { id: "research", label: "Research Session Tracker", icon: Bookmark },
          { id: "tasks", label: "Task Management Board", icon: CheckSquare }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 font-mono text-[10px] uppercase font-bold rounded-xl transition-all cursor-pointer",
              activeTab === item.id 
                ? "bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/25" 
                : "text-white/40 border border-transparent hover:text-white"
            )}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main active panels workspace render */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
        
        {/* TAB 1: COGNITIVE SESSION TIMER */}
        {activeTab === "timer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
            <div className="lg:col-span-8 flex flex-col items-center justify-center space-y-8 glass-panel p-10 bg-secondary-bg/5 rounded-3xl border border-white/5 h-full min-h-[350px]">
              
              {summarizingLoading ? (
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-10 h-10 rounded-full border-2 border-t-accent-cyan border-r-transparent animate-spin" />
                  <p className="font-mono text-xs text-accent-cyan tracking-wider uppercase animate-pulse">Running Cognitive Performance Analytics...</p>
                  <p className="text-[10px] text-white/40 max-w-xs font-mono">Consolidating active neural memory traces and drafting study strategy digest...</p>
                </div>
              ) : sessionSummary ? (
                <div className="w-full bg-black/40 border border-accent-cyan/20 rounded-2xl p-6 space-y-4 text-left">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[10px] font-mono text-accent-cyan uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5" /> Cognitive Focus digest
                    </span>
                    <span className="text-[10px] font-mono text-white/40 uppercase">
                      Efficiency: <span className="text-accent-cyan font-bold">{sessionSummary.cognitive_efficiency}%</span>
                    </span>
                  </div>

                  <p className="text-xs text-white/95 leading-relaxed font-sans font-medium italic">
                    &ldquo;{sessionSummary.executive_summary}&rdquo;
                  </p>

                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-white/40 uppercase font-bold block">Scientific Neocortical Analysis</span>
                    <p className="text-xs text-white/75 leading-relaxed font-sans">
                      {sessionSummary.scientific_analysis}
                    </p>
                  </div>

                  {sessionSummary.actions_completed && sessionSummary.actions_completed.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-mono text-white/40 uppercase font-bold block">Actions Logged</span>
                      <div className="space-y-1">
                        {sessionSummary.actions_completed.map((ac: string, idx: number) => (
                          <div key={idx} className="text-[11px] font-mono text-white/70 flex items-start gap-1.5 font-medium">
                            <span className="text-accent-cyan select-none">•</span>
                            <span>{ac}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="p-3.5 bg-accent-cyan/5 border border-accent-cyan/15 rounded-xl space-y-1">
                    <span className="text-[9px] font-mono text-accent-cyan uppercase tracking-wider font-extrabold block">Strategic study direction</span>
                    <p className="text-xs text-white/80 leading-relaxed font-sans font-medium">
                      {sessionSummary.strategic_advice}
                    </p>
                  </div>

                  <button
                    onClick={() => setSessionSummary(null)}
                    className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-mono text-white/60 hover:text-white uppercase tracking-wider rounded-xl transition-all cursor-pointer font-bold"
                  >
                    Recalibrate & restart timer
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-accent-cyan font-mono font-bold block">Consolidated Alpha Wave State</span>
                    <h3 className="text-sm font-bold text-white uppercase font-sans">COGNITIVE RUN INTERVAL</h3>
                  </div>

                  {/* Dynamic countdown visualizer */}
                  <div className="w-48 h-48 rounded-full border-2 border-dashed border-accent-cyan/20 bg-black/35 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(0,229,255,0.02)]">
                    <div className="absolute inset-2 border-2 border-accent-cyan/35 rounded-full border-t-transparent animate-spin-slow opacity-60" />
                    <span className="font-mono text-4xl text-white font-extrabold tracking-tight">
                      {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest mt-1">
                      {timerRunning ? "COGNITION ACTIVE" : "ENGINE SUSPENDED"}
                    </span>
                  </div>

                  {/* Timer controls */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className={cn(
                        "px-6 py-3 font-mono text-xs uppercase font-extrabold rounded-2xl flex items-center gap-2 cursor-pointer transition-all border",
                        timerRunning
                          ? "bg-accent-red/10 border-accent-red/35 text-accent-red hover:bg-accent-red/15"
                          : "bg-accent-cyan/15 border-accent-cyan/35 text-accent-cyan hover:bg-accent-cyan/25"
                      )}
                    >
                      {timerRunning ? (
                        <>
                          <Pause className="w-4 h-4" /> SUSPEND PHASE
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> START TRACKING
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        const parsed = parseInt(customMinutesInput, 10);
                        setMinutes(isNaN(parsed) || parsed <= 0 ? 45 : parsed);
                        setSeconds(0);
                      }}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-white/40 hover:text-white cursor-pointer transition-colors"
                      title="Recalibrate timeline"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    
                    {/* Dev helper button to instantly end timer and see summary */}
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setMinutes(0);
                        setSeconds(0);
                        triggerAutoSummarize(parseInt(customMinutesInput, 10) || 45);
                      }}
                      className="text-[9px] font-mono font-bold uppercase py-3 px-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 text-white/30 hover:text-white shrink-0 cursor-pointer"
                      title="Simulate interval completion instantly"
                    >
                      Instant Finish
                    </button>
                  </div>
                </>
              )}

            </div>

            {/* Config panel */}
            <div className="lg:col-span-4 glass-panel p-5 bg-secondary-bg/25 rounded-3xl border border-white/5 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-bold">Calibration Segment</span>
                <h2 className="text-xs font-bold text-white mt-0.5 uppercase tracking-wider">Interval Parameters</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-white/50 uppercase">Session Duration (Minutes)</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={customMinutesInput}
                      onChange={(e) => {
                        setCustomMinutesInput(e.target.value);
                        if (!timerRunning) {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val) && val > 0) {
                            setMinutes(val);
                            setSeconds(0);
                          }
                        }
                      }}
                      className="w-full bg-black/40 text-xs px-3 py-2 rounded-xl border border-white/15 outline-none font-mono focus:border-accent-cyan/35 transition-all text-white"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {[25, 45, 60, 90].map(m => (
                    <button
                      key={m}
                      onClick={() => {
                        setCustomMinutesInput(m.toString());
                        setMinutes(m);
                        setSeconds(0);
                        setTimerRunning(false);
                      }}
                      className={cn(
                        "px-2.5 py-1.5 bg-white/5 border border-white/5 text-[9px] font-mono font-bold rounded hover:bg-white/10 cursor-pointer uppercase transition-all",
                        minutes === m && "text-accent-cyan border-accent-cyan/30"
                      )}
                    >
                      {m} Min Cycle
                    </button>
                  ))}
                </div>

                <div className="p-4 bg-accent-cyan/[0.01] border border-accent-cyan/10 rounded-2xl text-[10px] font-sans text-white/50 leading-relaxed space-y-1">
                  <span className="font-mono text-[9px] text-accent-cyan uppercase tracking-wider font-extrabold block">Alpha State Rules:</span>
                  <p>Consolidated {minutes}-minute workspaces matches professional neural memory retention spikes. Finish each cycle complete to register study hours in telemetry matrix.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS & GOAL TRACKER */}
        {activeTab === "projects" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
            {/* Create Project column */}
            <div className="lg:col-span-4 glass-panel p-5 rounded-3xl border border-white/5 bg-secondary-bg/25 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-bold">Project initialization</span>
                <h3 className="text-xs font-bold text-white mt-0.5 uppercase tracking-wider flex items-center gap-1">
                  <FolderPlus className="w-3.5 h-3.5 text-accent-cyan" /> Map STEM Research
                </h3>
              </div>

              <form onSubmit={handleAddProject} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase">Research Project Name</label>
                  <input
                    type="text"
                    required
                    value={newProjName}
                    onChange={(e) => setNewProjName(e.target.value)}
                    placeholder="Enter Task or Study Goal"
                    className="w-full bg-black/40 text-xs px-3.5 py-2.5 rounded-xl border border-white/5 outline-none font-sans focus:border-accent-cyan/30 text-white transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/40 uppercase">Syllabus Field</label>
                    <select
                      value={newProjCat}
                      onChange={(e) => setNewProjCat(e.target.value)}
                      className="w-full bg-black/40 text-xs px-2.5 py-2.5 rounded-xl border border-white/5 outline-none font-sans text-white/80"
                    >
                      {["Physics", "Chemistry", "Biology", "Mathematics", "Engineering"].map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase block">Milestones & Goals (One Line per Milestone)</label>
                  <textarea
                    rows={4}
                    value={newProjMilestones}
                    onChange={(e) => setNewProjMilestones(e.target.value)}
                    placeholder="Quest 1: Gather raw coefficients&#10;Quest 2: Plot curves&#10;Quest 3: pass validation checkpoint"
                    className="w-full bg-black/40 text-xs px-3.5 py-2.5 rounded-xl border border-white/5 outline-none font-mono focus:border-accent-cyan/30 text-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/35 text-accent-cyan text-xs font-bold font-mono rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" /> Launch Research Path
                </button>
              </form>
            </div>

            {/* Project Display List */}
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-bold px-1 mb-2">ACTIVE STEM PROJECTS MONITOR</span>

              {projectsList.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center bg-secondary-bg/5 flex flex-col items-center justify-center space-y-3">
                  <HelpCircle className="w-10 h-10 text-white/10" />
                  <p className="text-xs text-white/50 leading-relaxed font-mono">
                    Nothing generated yet. Start by entering a topic.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {projectsList.map((proj) => (
                    <div key={proj.id} className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/15 space-y-4 relative group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-1.5 py-0.5 rounded bg-accent-cyan/10 text-accent-cyan text-[8px] font-mono font-extrabold uppercase border border-accent-cyan/10">
                              {proj.category}
                            </span>
                            <span className="text-[9px] font-mono text-white/30">Target: {proj.targetDate}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white font-sans">{proj.name}</h4>
                        </div>

                        <button
                          onClick={() => deleteProject(proj.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/5 hover:bg-accent-red/10 text-white/30 hover:text-accent-red rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Percentage Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[9px] font-mono">
                          <span className="text-white/40">RESEARCH COMPLETION</span>
                          <span className="text-accent-cyan font-bold">{proj.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/45 rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="bg-accent-cyan h-full transition-all duration-500 rounded-full"
                            style={{ width: `${proj.progressPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* Milestones list map */}
                      <div className="pt-2 border-t border-white/5 space-y-2">
                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-wider block font-bold">Milestones checklist:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                          {proj.goals.map((goal, idx) => (
                            <div 
                              key={idx}
                              onClick={() => toggleMilestone(proj.id, idx)}
                              className={cn(
                                "p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between",
                                goal.completed 
                                  ? "bg-accent-green/10 border-accent-green/20 text-accent-green/80" 
                                  : "bg-black/20 border-white/5 text-white/50 hover:bg-black/35 hover:border-white/10"
                              )}
                            >
                              <span className="truncate pr-2">{goal.text}</span>
                              <span className={cn(
                                "w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                                goal.completed ? "bg-accent-green/15 border-accent-green/35 text-accent-green font-bold text-[9px]" : "border-white/10"
                              )}>
                                {goal.completed && "✓"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: RESEARCH SESSION LOGS */}
        {activeTab === "research" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
            {/* Create Log */}
            <div className="lg:col-span-4 glass-panel p-5 rounded-3xl border border-white/5 bg-secondary-bg/25 space-y-5">
              <div className="border-b border-white/5 pb-3">
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-bold">Scientific Repository integration</span>
                <h3 className="text-xs font-bold text-white mt-0.5 uppercase tracking-wider flex items-center gap-1">
                  <Bookmark className="w-3.5 h-3.5 text-accent-cyan" /> Record Research Reading
                </h3>
              </div>

              <form onSubmit={handleAddResearchLog} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase">Paper / Concept Document Title</label>
                  <input
                    type="text"
                    required
                    value={researchTitle}
                    onChange={(e) => setResearchTitle(e.target.value)}
                    placeholder="e.g. Maxwell Relations integration vectors"
                    className="w-full bg-black/40 text-xs px-3.5 py-2.5 rounded-xl border border-white/5 outline-none font-sans focus:border-accent-cyan/30 text-white transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase">Publication Source / Database DOI</label>
                  <input
                    type="text"
                    value={researchSource}
                    onChange={(e) => setResearchSource(e.target.value)}
                    placeholder="e.g. arXiv:2403.01254, Cambridge Press"
                    className="w-full bg-black/40 text-xs px-3.5 py-2.5 rounded-xl border border-white/5 outline-none font-mono focus:border-accent-cyan/30 text-white transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase block">Extracted Abstracts & Findings</label>
                  <textarea
                    rows={4}
                    value={researchNotes}
                    onChange={(e) => setResearchNotes(e.target.value)}
                    placeholder="Note key mathematical proofs, empirical curves verified, and experimental boundaries found..."
                    className="w-full bg-black/40 text-xs px-3.5 py-2.5 rounded-xl border border-white/5 outline-none font-sans focus:border-accent-cyan/30 text-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/35 text-accent-cyan text-xs font-bold font-mono rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" /> Document Abstract Log
                </button>
              </form>
            </div>

            {/* Research logs list */}
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-bold px-1 mb-2">EXTRACTED SCIENTIFIC JOURNAL REGISTRY</span>

              {researchList.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center bg-secondary-bg/5 flex flex-col items-center justify-center space-y-3">
                  <FileSpreadsheet className="w-10 h-10 text-white/10" />
                  <p className="text-xs text-white/50 leading-relaxed font-mono">
                    Nothing generated yet. Start by entering a topic.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {researchList.map((log) => (
                    <div key={log.id} className="glass-panel p-5 rounded-2xl border border-white/5 bg-secondary-bg/15 space-y-3 relative group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <div className="text-[9px] font-mono text-accent-cyan uppercase tracking-wider font-extrabold">
                            INDEXED SOURCE: {log.paperUrlOrSource}
                          </div>
                          <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                            <Bookmark className="w-3.5 h-3.5 text-accent-cyan" /> {log.title}
                          </h4>
                        </div>
                        <button
                          onClick={() => deleteResearchLog(log.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/5 hover:bg-accent-red/10 text-white/30 hover:text-accent-red rounded transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {log.extractedAbstract && (
                        <div className="p-3.5 bg-black/45 rounded-xl border border-white/5 text-xs text-white/70 leading-relaxed font-sans whitespace-pre-line">
                          {log.extractedAbstract}
                        </div>
                      )}

                      <div className="text-[8px] font-mono text-white/30 text-right uppercase">
                        Registered: {log.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: TASK MANAGEMENT BOARD */}
        {activeTab === "tasks" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
            {/* Create Task */}
            <div className="lg:col-span-4 glass-panel p-5 rounded-3xl border border-white/5 bg-secondary-bg/25 space-y-4">
              <div className="border-b border-white/5 pb-3">
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest block font-bold">Priority Objectives</span>
                <h3 className="text-xs font-bold text-white mt-0.5 uppercase tracking-wider">Plan Lesson Milestone Task</h3>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-white/40 uppercase">Task Requirement Action</label>
                  <input
                    type="text"
                    required
                    value={taskText}
                    onChange={(e) => setTaskText(e.target.value)}
                    placeholder="e.g. Master Entropy mathematical derivatives"
                    className="w-full bg-black/40 text-xs px-3.5 py-2.5 rounded-xl border border-white/5 outline-none font-sans focus:border-accent-cyan/30 text-white transition-all font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/40 uppercase">Priority Rating</label>
                    <select
                      value={taskPriority}
                      onChange={(e) => setTaskPriority(e.target.value as any)}
                      className="w-full bg-black/40 text-xs px-2.5 py-2.5 rounded-xl border border-white/5 outline-none font-sans text-white/80"
                    >
                      {["High", "Medium", "Low"].map(pr => (
                        <option key={pr} value={pr}>{pr} Priority</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-white/40 uppercase">Scope Category</label>
                    <input
                      type="text"
                      value={taskCategory}
                      onChange={(e) => setTaskCategory(e.target.value)}
                      placeholder="e.g. Exam Prep"
                      className="w-full bg-black/40 text-xs px-2.5 py-2.5 rounded-xl border border-white/5 outline-none font-sans text-white/80"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-accent-cyan/15 hover:bg-accent-cyan/25 border border-accent-cyan/35 text-accent-cyan text-xs font-bold font-mono rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider"
                >
                  <Plus className="w-4 h-4" /> Add Priority Objective
                </button>
              </form>
            </div>

            {/* Display Tasks Board */}
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block font-bold px-1 mb-2">STEM WORKING REGISTRY CHECKPOINTS</span>

              {tasksList.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl border border-white/5 text-center bg-secondary-bg/5 flex flex-col items-center justify-center space-y-3">
                  <CheckSquare className="w-10 h-10 text-white/10" />
                  <p className="text-xs text-white/50 leading-relaxed font-mono">
                    Nothing generated yet. Start by entering a topic.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {tasksList.map((tsk) => (
                    <div 
                      key={tsk.id} 
                      className={cn(
                        "glass-panel p-4 rounded-xl border flex items-center justify-between gap-4 transition-all relative group bg-secondary-bg/10",
                        tsk.completed ? "border-accent-green/20 bg-accent-green/[0.01]" : "border-white/5"
                      )}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <button
                          onClick={() => toggleTaskCompletion(tsk.id)}
                          className={cn(
                            "w-5 h-5 rounded-xl border flex items-center justify-center transition-all cursor-pointer shrink-0",
                            tsk.completed 
                              ? "bg-accent-green/15 border-accent-green/35 text-accent-green font-bold text-xs" 
                              : "border-white/10 hover:border-accent-cyan/30 bg-black/35"
                          )}
                        >
                          {tsk.completed && "✓"}
                        </button>

                        <div className="space-y-1 min-w-0">
                          <p className={cn(
                            "text-xs font-sans font-semibold leading-tight truncate",
                            tsk.completed ? "text-white/35 line-through" : "text-white/90"
                          )}>
                            {tsk.text}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap text-[8px] font-mono uppercase">
                            <span className={cn(
                              "px-1.5 py-0.5 rounded border font-extrabold",
                              tsk.priority === "High" ? "bg-accent-red/10 text-accent-red border-accent-red/10" :
                              tsk.priority === "Medium" ? "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/10" :
                              "bg-white/5 text-white/40 border-transparent"
                            )}>
                              {tsk.priority} priority
                            </span>
                            <span className="text-white/35">Section: {tsk.category}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => deleteTask(tsk.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/5 hover:bg-accent-red/10 text-white/30 hover:text-accent-red rounded transition-all cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
