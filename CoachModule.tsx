import React, { useState, useRef, useEffect } from "react";
import { UserSettings, CoachMessage, CurriculumSubject } from "../types";
import { Compass, Send, Sparkles, RefreshCcw, Smile, Calendar, BookOpen, Clock, ShieldCheck, ArrowRight } from "lucide-react";

interface CoachModuleProps {
  settings: UserSettings;
  subjects: CurriculumSubject[];
  exams: Array<{ subject: string; date: string }>;
  messages: CoachMessage[];
  onSendMessage: (text: string) => void;
  onClearChat: () => void;
  studyScheduleText: string;
  onGenerateStudySchedule: (subject: string, examDate: string, focusHours: number, complexity: string) => void;
  loadingSchedule: boolean;
}

// Custom simple parser to render Markdown text safely in React
function SafeMarkdown({ text }: { text: string }) {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="space-y-2 font-sans text-sm leading-relaxed text-current">
      {lines.map((line, idx) => {
        // Headers Level 3 or 2
        if (line.startsWith("### ")) {
          return (
            <h4 key={idx} className="text-sm font-bold text-amber-500 font-display mt-3 uppercase tracking-wider">
              {line.replace("### ", "")}
            </h4>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h3 key={idx} className="text-xs font-mono font-bold text-amber-400 mt-4 tracking-wider uppercase border-b border-zinc-850 pb-1.5">
              {line.replace("## ", "")}
            </h3>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h2 key={idx} className="text-lg font-bold text-indigo-400 font-display mt-5 uppercase tracking-widest">
              {line.replace("# ", "")}
            </h2>
          );
        }
        // Bullets
        if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          const rawText = line.trim().substring(2);
          // Simple bold formatting parser **bold**
          return (
            <div key={idx} className="flex items-start gap-1.5 ml-2">
              <span className="text-amber-500 shrink-0 mt-1">•</span>
              <p className="flex-1 text-xs opacity-90">
                {parseBoldText(rawText)}
              </p>
            </div>
          );
        }
        // Empty lines
        if (!line.trim()) {
          return <div key={idx} className="h-2" />;
        }
        // Normal text lines
        return <p key={idx} className="text-xs opacity-90">{parseBoldText(line)}</p>;
      })}
    </div>
  );
}

// Simple parser for bold tags (i.e. **bold**) in string
function parseBoldText(text: string) {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return (
        <strong key={index} className="font-bold text-amber-400">
          {part}
        </strong>
      );
    }
    return part;
  });
}

export default function CoachModule({
  settings,
  subjects,
  exams,
  messages,
  onSendMessage,
  onClearChat,
  studyScheduleText,
  onGenerateStudySchedule,
  loadingSchedule
}: CoachModuleProps) {
  const [userInput, setUserInput] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [focusHours, setFocusHours] = useState(3);
  const [currentComplexity, setCurrentComplexity] = useState("Intermediate Node");
  const [activeSubTab, setActiveSubTab] = useState<"coach-chat" | "study-planner">("coach-chat");

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bot message bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    onSendMessage(userInput);
    setUserInput("");
  };

  const handleTriggerSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;
    // Attempt to match exam date or fallback to default
    const mathExam = exams.find(ex => ex.subject === selectedSubject);
    const targetDate = mathExam ? mathExam.date : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    onGenerateStudySchedule(selectedSubject, targetDate, focusHours, currentComplexity);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn max-w-7xl mx-auto pb-10">
      {/* Selector Subtabs */}
      <div className="lg:col-span-3 flex justify-between items-center border-b border-zinc-800 pb-3">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab("coach-chat")}
            className={`px-4 py-1.5 text-xs font-mono font-bold rounded-full transition-all border ${
              activeSubTab === "coach-chat"
                ? "bg-amber-500/10 border-amber-500/40 text-amber-500"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            💬 Unlimited Coach Dialogue
          </button>
          <button
            onClick={() => setActiveSubTab("study-planner")}
            className={`px-4 py-1.5 text-xs font-mono font-bold rounded-full transition-all border ${
              activeSubTab === "study-planner"
                ? "bg-amber-500/10 border-amber-500/40 text-amber-500"
                : "border-transparent text-zinc-400 hover:text-white"
            }`}
          >
            🗓️ Rigorous Study Strategist
          </button>
        </div>

        <span className="text-[10px] font-mono text-zinc-500 block">HOST: COGNITIVE SERVICES</span>
      </div>

      {activeSubTab === "coach-chat" ? (
        <>
          {/* Chat simulator dialogue (Left 2 columns) */}
          <div className="lg:col-span-2 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col h-[600px]">
            {/* Coach Banner */}
            <div className="p-4 border-b border-zinc-800/85 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-wide text-amber-500 font-mono text-[13px] uppercase">
                    {settings.coachName || "Core Coach"}
                  </h3>
                  <p className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase mt-0.5">
                    Elite High-Performance AI Coach
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClearChat}
                  className="p-1 px-2.5 rounded bg-zinc-950 border border-zinc-850 text-[10px] font-mono text-zinc-400 hover:text-white"
                  title="Wipe conversation logs"
                >
                  Clear Chat Logs
                </button>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
            </div>

            {/* Middle chat message area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center max-w-sm mx-auto text-zinc-400 space-y-4 font-mono">
                  <Sparkles className="w-8 h-8 text-amber-500" />
                  <p className="text-xs leading-relaxed">
                    "I am {settings.coachName || "your AI Coach"}. Speak to me of your roadblocks, your absolute vision, or request deep strategy. I have unlimited talk available. Ready to become the best version of yourself?"
                  </p>
                  <p className="text-[10px] text-indigo-400">
                    Ask me how to partition your tasks or build high-rigor daily streaks.
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender === "user" ? "justify-end" : "justify-start animate-slideUp"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 border text-[11px] leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-305 rounded-tr-none"
                          : "bg-zinc-950 border-zinc-850/80 rounded-tl-none text-zinc-200"
                      }`}
                    >
                      <span className="text-[9px] font-mono opacity-40 uppercase block mb-1">
                        {msg.sender === "user" ? "YOU" : settings.coachName?.toUpperCase() || "COACH"}
                      </span>
                      <SafeMarkdown text={msg.text} />
                    </div>
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Footer message submission input bar */}
            <form onSubmit={handleSend} className="p-4 border-t border-zinc-800/85 flex gap-2">
              <input
                type="text"
                placeholder={`Speak to ${settings.coachName || "AI Coach"}...`}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 text-xs text-white font-mono"
              />
              <button
                type="submit"
                className="px-4 bg-amber-500 hover:bg-amber-400 text-black rounded font-mono font-bold text-xs uppercase flex items-center justify-center gap-1 shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Quick recommendations sidebar (Right column) */}
          <div className="space-y-6">
            <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
              <h4 className="text-xs font-mono uppercase text-zinc-400 border-b border-zinc-850 pb-2 mb-3">
                Action Prompts for Dialogue
              </h4>
              <div className="space-y-2">
                <button
                  onClick={() =>
                    onSendMessage("Design a ruthless morning routine for absolute focus and zero phone use.")
                  }
                  className="w-full text-left p-3 rounded-lg bg-zinc-950 hover:bg-zinc-900 text-xs font-mono text-zinc-300 border border-zinc-850 hover:border-amber-500/30 transition-all cursor-pointer"
                >
                  🌅 Draft ruthless focus morning routine
                </button>
                <button
                  onClick={() =>
                    onSendMessage("Analyze my domain goals and identify leaks that stop me from becoming the best.")
                  }
                  className="w-full text-left p-3 rounded-lg bg-zinc-950 hover:bg-zinc-900 text-xs font-mono text-zinc-300 border border-zinc-850 hover:border-amber-500/30 transition-all cursor-pointer"
                >
                  ⚡ Diagnose potential execution leaks
                </button>
                <button
                  onClick={() =>
                    onSendMessage("I feel distracted because of academic stress. Build me a motivation shield.")
                  }
                  className="w-full text-left p-3 rounded-lg bg-zinc-950 hover:bg-zinc-900 text-xs font-mono text-zinc-300 border border-zinc-850 hover:border-amber-500/30 transition-all cursor-pointer"
                >
                  📚 Handle intense curriculum study pressure
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Rigorous Study Planner (Left 2 columns) */}
          <div className="lg:col-span-2 bg-zinc-900 p-5 rounded-xl border border-zinc-800 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4 border-b border-zinc-850 pb-3">
              <div>
                <h3 className="text-sm font-bold tracking-wide text-white uppercase font-mono">
                  Academic Strategy: Build Study Schedules
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                  Syllabus attack planner mapped directly to upcoming exams.
                </p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>

            {studyScheduleText ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-850 max-h-[420px] overflow-y-auto">
                  <SafeMarkdown text={studyScheduleText} />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() =>
                      onSendMessage(
                        `Coach study schedule calibration: Refine the roadmap generated for ${selectedSubject || "the course"} to optimize week-end retention.`
                      )
                    }
                    className="px-4 py-2 hover:bg-indigo-600 rounded bg-indigo-500 text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    Discuss This Plan With {settings.coachName} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-zinc-500 font-mono text-xs">
                <p className="italic">
                  Select a subject and configure hours to compile a customizable daily study schedule protocol.
                </p>
              </div>
            )}
          </div>

          {/* Builder Options Sidebar (Right column) */}
          <div className="space-y-6">
            <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
              <h4 className="text-xs font-mono uppercase text-zinc-400 border-b border-zinc-850 pb-1.5 mb-4">
                Configure Protocol
              </h4>

              <form onSubmit={handleTriggerSchedule} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-zinc-450 block uppercase mb-1">
                    Select Subject Focus
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 text-white font-mono"
                    required
                  >
                    <option value="" className="text-zinc-500">
                      -- Choice --
                    </option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.name} className="text-zinc-900 bg-zinc-950">
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-450 block uppercase mb-1">
                    Daily Study Intensity Hours
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min="1"
                      max="8"
                      value={focusHours}
                      onChange={(e) => setFocusHours(parseInt(e.target.value))}
                      className="flex-1 accent-amber-500"
                    />
                    <span className="text-xs font-mono font-bold text-amber-500 shrink-0">
                      {focusHours} Hrs / Day
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-zinc-450 block uppercase mb-1">
                    Current Knowledge Level
                  </label>
                  <input
                    type="text"
                    value={currentComplexity}
                    onChange={(e) => setCurrentComplexity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 text-white font-mono"
                    placeholder="e.g., Novice state, completed half of chapter etc."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingSchedule || !selectedSubject}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black text-xs font-mono font-bold uppercase tracking-widest rounded disabled:opacity-40 cursor-pointer"
                >
                  {loadingSchedule ? "CALCULATING MATRICES..." : "GENERATE PROTOCOL"}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
