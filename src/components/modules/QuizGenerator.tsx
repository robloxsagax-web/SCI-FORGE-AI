import { useState, useEffect } from "react";
import { HelpCircle, Sparkles, CheckSquare, XSquare, ArrowRight, Zap, Target, BookOpen, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn, saveRecentSession, addToPortfolio } from "../../lib/utils";
import { updateTelemetryOnAction } from "../../lib/telemetry";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer?: string;
  answer?: string;
  explanation: string;
}

interface QuizData {
  topic: string;
  questions: QuizQuestion[];
  difficulty: "easy" | "medium" | "hard";
}

export function QuizGenerator() {
  const [topicInput, setTopicInput] = useState("");
  const [questionCount, setQuestionCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<QuizData | null>(null);

  // Quiz running states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answeredState, setAnsweredState] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Auto-load preloaded topic from Concept Dependency Map
  useEffect(() => {
    const preloaded = localStorage.getItem("sciforge_preloaded_topic");
    if (preloaded) {
      setTopicInput(preloaded);
      fetchQuiz(preloaded);
      localStorage.removeItem("sciforge_preloaded_topic");
    }
  }, []);

  const fetchQuiz = async (topic: string) => {
    setLoading(true);
    setQuiz(null);
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnsweredState(null);
    setScore(0);
    setIsFinished(false);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, count: questionCount })
      });
      if (res.ok) {
        const data = await res.json();
        setQuiz(data);
        saveRecentSession("quiz", `Quiz: ${data.topic || topic}`, data);
      }
    } catch (err) {
      console.error("Quiz fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (opt: string) => {
    if (answeredState) return; // Prevent double selecting
    setSelectedOption(opt);
  };

  const handleVerifyAnswer = () => {
    if (!quiz || !selectedOption || answeredState) return;
    const correctAns = quiz.questions[currentIndex].correctAnswer || quiz.questions[currentIndex].answer;
    const isCorrect = selectedOption === correctAns;

    if (isCorrect) {
      setAnsweredState("correct");
      setScore(prev => prev + 1);
      updateTelemetryOnAction("quiz_answer", { topic: quiz.topic || topicInput, isCorrect: true });
    } else {
      setAnsweredState("incorrect");
      updateTelemetryOnAction("quiz_answer", { topic: quiz.topic || topicInput, isCorrect: false });
    }
  };

  const handleNext = () => {
    if (!quiz) return;
    setSelectedOption(null);
    setAnsweredState(null);

    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
      updateTelemetryOnAction("complete_quiz");
      addToPortfolio("quiz", quiz.topic, {
        score: score,
        total: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        difficulty: quiz.difficulty
      });
    }
  };

  const totalQuestions = quiz?.questions?.length || 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-primary-bg p-6 overflow-hidden relative">
      {/* Background soft lighting */}
      <div className="absolute top-0 right-1/3 w-80 h-80 bg-accent-violet/5 blur-[120px] rounded-full pointer-events-none -none z-10" />

      {/* Header element */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 border-b border-glass-border pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-violet/10 rounded-xl text-accent-violet border border-accent-violet/10">
            <HelpCircle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-heading font-semibold text-white tracking-tight">QUIZ GENERATOR WORKSPACE</h1>
            <p className="text-xs text-white/40 font-mono">Convert physical, mechanical, and bio topics into real-time interactive challenges</p>
          </div>
        </div>

        {/* Input widget */}
        <div className="flex items-center gap-2 max-w-xl w-full shrink-0">
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter your quiz topic..."
            className="flex-1 bg-black/40 text-xs px-3.5 py-2.5 rounded-lg text-white border border-white/5 outline-none font-mono focus:border-accent-violet/30 transition-all font-semibold"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono text-white/40 uppercase hidden sm:inline">Limit:</span>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="bg-black/40 text-[10px] px-2 py-2.5 rounded-lg text-white border border-white/5 outline-none font-mono focus:border-accent-violet/30 transition-all font-semibold cursor-pointer"
            >
              {[3, 4, 5, 8, 10].map((num) => (
                <option key={num} value={num} className="bg-primary-bg text-white">
                  {num} Qs
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => fetchQuiz(topicInput)}
            disabled={loading || !topicInput.trim()}
            className="px-4 py-2.5 bg-accent-violet/20 hover:bg-accent-violet/30 border border-accent-violet/30 text-accent-violet text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <Sparkles className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            {loading ? "GENERATING..." : "BUILD QUIZ"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 glass-panel rounded-3xl bg-black/50 p-8">
          <div className="w-12 h-12 rounded-full border-2 border-t-accent-violet border-r-transparent animate-spin mb-2" />
          <p className="font-mono text-xs text-accent-violet tracking-wider uppercase animate-pulse">Assembling custom evaluation matrix...</p>
          <p className="text-[10px] text-white/30 max-w-xs font-mono font-medium">Llama-3.3 compiling five rigorous multiple choice problems with scientific proof indexes.</p>
        </div>
      ) : quiz ? (
        <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
          
          {/* Active Question Panel */}
          <div className="flex-[3] flex flex-col min-h-0 overflow-y-auto space-y-5 bg-secondary-bg/15 rounded-3xl border border-white/5 p-6 md:p-8">
            
            {!isFinished ? (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  {/* Status track info */}
                  <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                    <span className="text-[11px] font-mono text-accent-violet tracking-widest uppercase font-bold">
                      Topic: {quiz.topic}
                    </span>
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">
                      Question {currentIndex + 1} of {totalQuestions}
                    </span>
                  </div>

                  {/* Question stem */}
                  <h3 className="text-base md:text-lg font-heading text-white font-medium tracking-tight mb-8">
                    {quiz.questions[currentIndex]?.question}
                  </h3>

                  {/* Options map */}
                  <div className="grid grid-cols-1 gap-3.5 max-w-2xl">
                    {quiz.questions[currentIndex]?.options?.map((opt, oIdx) => {
                      const isSelected = selectedOption === opt;
                      const isCorrectAnswer = opt === (quiz.questions[currentIndex].correctAnswer || quiz.questions[currentIndex].answer);
                      const showCorrectGlow = answeredState && isCorrectAnswer;
                      const showIncorrectGlow = answeredState && isSelected && answeredState === "incorrect";

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectOption(opt)}
                          disabled={!!answeredState}
                          className={cn(
                            "w-full text-left p-4 rounded-xl border font-sans text-xs transition-all relative overflow-hidden flex items-center justify-between",
                            isSelected && !answeredState ? "border-accent-violet bg-accent-violet/10 text-white" :
                            showCorrectGlow ? "border-accent-green bg-accent-green/10 text-white font-semibold" :
                            showIncorrectGlow ? "border-accent-red bg-accent-red/10 text-white" :
                            "border-white/5 bg-black/25 text-white/60 hover:text-white hover:border-white/20 hover:bg-black/40"
                          )}
                        >
                          <span>{opt}</span>
                          {showCorrectGlow && <CheckSquare className="w-4 h-4 text-accent-green shrink-0 ml-3" />}
                          {showIncorrectGlow && <XSquare className="w-4 h-4 text-accent-red shrink-0 ml-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer action */}
                <div className="border-t border-white/5 pt-6 mt-8 flex justify-between items-center gap-4">
                  <div className="text-[10px] font-mono text-white/30 uppercase">
                    Level: <span className="text-accent-violet font-bold">{quiz.difficulty}</span>
                  </div>

                  <div className="flex gap-3">
                    {selectedOption && !answeredState && (
                      <button
                        onClick={handleVerifyAnswer}
                        className="py-2.5 px-6 bg-accent-violet text-white font-mono font-bold text-xs rounded-xl hover:bg-purple-600 transition-all cursor-pointer shadow-[0_0_15px_rgba(124,77,255,0.2)]"
                      >
                        SUBMIT ANSWER
                      </button>
                    )}

                    {answeredState && (
                      <button
                        onClick={handleNext}
                        className="py-2.5 px-6 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-mono font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                      >
                        {currentIndex < totalQuestions - 1 ? "NEXT QUESTION" : "SUMMARIZE PROGRESS"}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center max-w-xl mx-auto space-y-6">
                <div className="w-16 h-16 rounded-full bg-accent-violet/10 border border-accent-violet/20 flex items-center justify-center text-accent-violet">
                  <Target className="w-8 h-8 animate-bounce" />
                </div>
                <div>
                  <h3 className="text-[10px] font-mono text-white/30 tracking-widest uppercase mb-1">EVALUATION CONCLUDED</h3>
                  <h4 className="text-2xl font-heading text-white font-semibold">Quiz Challenge Results</h4>
                </div>
                
                {/* Result metrics card */}
                <div className="grid grid-cols-2 gap-4 w-full p-6 bg-black/35 rounded-2xl border border-white/5">
                  <div className="space-y-1 border-r border-white/5">
                    <span className="text-[9px] font-mono text-white/40 uppercase">Correct Answers</span>
                    <p className="text-2xl font-bold font-heading text-accent-green">{score} / {totalQuestions}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono text-white/40 uppercase">Acuity Percent</span>
                    <p className="text-2xl font-bold font-heading text-accent-violet">
                      {Math.round((score / totalQuestions) * 100)}%
                    </p>
                  </div>
                </div>

                <div className="text-xs text-white/60 leading-relaxed font-sans max-w-sm">
                  Excellent completion coordinates achieved. Local telemetry metrics have been recalibrated to integrate this progress dataset.
                </div>

                <button
                  onClick={() => fetchQuiz(topicInput)}
                  className="px-6 py-2.5 bg-accent-violet text-white font-mono font-bold text-xs rounded-xl hover:bg-purple-600 transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(124,77,255,0.2)]"
                >
                  <RotateCcw className="w-4 h-4" /> RETRY PLAYGROUND
                </button>
              </div>
            )}

          </div>

          {/* Right Explanation Context Panel */}
          <div className="flex-[2] flex flex-col min-h-0 space-y-4">
            
            <div className="flex-1 glass-panel rounded-2xl border border-white/5 bg-secondary-bg/20 p-5 flex flex-col min-h-0 justify-between">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest font-bold border-b border-white/5 pb-2 block mb-4">
                  AI Forensic Explanation
                </span>

                {answeredState ? (
                  <div className="space-y-4">
                    <div className={cn(
                      "px-3 py-1.5 rounded-lg border text-[10px] font-mono font-bold uppercase tracking-wider inline-block",
                      answeredState === "correct" ? "bg-accent-green/10 border-accent-green/30 text-accent-green" : "bg-accent-red/10 border-accent-red/30 text-accent-red"
                    )}>
                      {answeredState === "correct" ? "Sequence Accurate" : "Discrepancy Located"}
                    </div>

                    <p className="text-xs text-white/80 leading-relaxed font-sans font-medium">
                      {quiz.questions[currentIndex]?.explanation}
                    </p>
                  </div>
                ) : (
                  <div className="py-8 text-center text-white/30 space-y-2">
                    <BookOpen className="w-8 h-8 mx-auto opacity-30 animate-pulse" />
                    <p className="text-[11px] font-mono uppercase font-bold tracking-wider">Awaiting Verification Indicator</p>
                    <p className="text-[10px] text-white/20">Select an option and submit answer to receive deep logical scientific reasoning diagnostics.</p>
                  </div>
                )}
              </div>

              {quiz && !isFinished && (
                <div className="p-3.5 bg-black/45 rounded-xl border border-white/5 text-[10px] text-white/40 leading-relaxed font-sans flex items-start gap-2 mt-4">
                  <Zap className="w-4 h-4 text-accent-violet shrink-0 mt-0.5" />
                  <span>
                    Scientific logic feedback updates the active Workspace Focus Score recursively. Completing quizzes adds focus weighting.
                  </span>
                </div>
              )}
            </div>

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
  );
}
