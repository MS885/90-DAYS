import React, { useState } from "react";
import { Domain, CurriculumSubject, SideSkillCourse, DailyExpense } from "../types";
import { Play, TrendingUp, DollarSign, BookOpen, CheckCircle, ArrowRight, Activity, Flame, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

interface HomeOverviewProps {
  settings: any;
  domains: Domain[];
  subjects: CurriculumSubject[];
  courses: SideSkillCourse[];
  expenses: DailyExpense[];
  onToggleGoal: (domainId: string, goalId: string) => void;
  daysRemaining: number;
  totalGoalsCount: { completed: number; total: number };
  setActiveTab: (tab: string) => void;
  syncId: string;
}

export default function HomeOverview({
  settings,
  domains,
  subjects,
  courses,
  expenses,
  onToggleGoal,
  daysRemaining,
  totalGoalsCount,
  setActiveTab,
  syncId
}: HomeOverviewProps) {
  const [manifestPhrase, setManifestPhrase] = useState("Your potential is infinite, but your days are numbered. Refuse mediocrity.");

  const refreshManifest = () => {
    const lines = [
      "No one is coming to save you. Build your own fortress in silence.",
      "The price of discipline is always less than the pain of regret.",
      "Win the morning, conquer the day. One deliberate choice at a time.",
      "Become the warrior who thrives behind closed doors. Build in solitude.",
      "Excellence is not an act, but a repetitive ritual of hard execution.",
      "Let them gossip. Keep your head down, maintain focus pace, and win.",
      "90 days of absolute grit can erase 10 years of bad habits."
    ];
    const pick = lines[Math.floor(Math.random() * lines.length)];
    setManifestPhrase(pick);
  };

  // Extract all goals flat for simple, soft visual checkmarks on the front page
  const allActiveGoals = domains.flatMap(dom => 
    dom.goals.map(g => ({ ...g, domainId: dom.id, domainTitle: dom.title }))
  );

  const calculateTodaySpend = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    return expenses
      .filter(e => e.timestamp.startsWith(todayStr))
      .reduce((sum, e) => sum + e.amount, 0);
  };

  const completedSubjectsCount = subjects.filter(s => s.currentProgressUnits >= s.totalUnits).length;

  return (
    <div className="space-y-6 animate-fadeIn pb-6">
      
      {/* Soft welcoming grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Welcome card & Manifest */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase bg-amber-500/10 text-amber-500 rounded border border-amber-500/20">
                DAILY MANIFESTO
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Ready to dominate</span>
            </div>
            
            <p className="text-lg md:text-xl font-serif italic text-white leading-relaxed font-semibold">
              "{manifestPhrase}"
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-zinc-800/80 pt-4">
            <button 
              onClick={refreshManifest}
              className="px-2.5 py-1 text-[10px] font-mono hover:text-white text-zinc-400 border border-zinc-800 hover:border-zinc-700 rounded transition-all bg-zinc-950"
            >
              🎲 Rerall cognitive focus
            </button>
            <span className="text-[11px] font-mono text-zinc-400">
              Personal Coach: <span className="text-amber-400 font-bold italic font-serif">{settings.coachName || "Titan AI"}</span>
            </span>
          </div>
        </div>

        {/* Quick stat blocks */}
        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div>
            <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest block mb-1">VELOCITY OVERVIEW</span>
            <h3 className="text-xl font-serif text-white font-bold leading-none mb-4">Current Stance</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-mono">Completed Habits</span>
                <span className="font-mono font-bold text-amber-500">{totalGoalsCount.completed} / {totalGoalsCount.total}</span>
              </div>
              <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-300" 
                  style={{ width: `${totalGoalsCount.total > 0 ? (totalGoalsCount.completed / totalGoalsCount.total) * 100 : 0}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs pt-1">
                <span className="text-zinc-400 font-mono">Active Subjects</span>
                <span className="font-mono text-zinc-300">{subjects.length} ({completedSubjectsCount} Mastered)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400 font-mono">Daily Outflow</span>
                <span className="font-mono text-emerald-400 font-bold">{settings.currencySymbol || "$"}{calculateTodaySpend().toFixed(2)} Today</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab("settings")}
            className="w-full mt-4 py-1.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-[10px] font-mono rounded text-zinc-300 hover:text-white transition-all text-center block"
          >
            Manage Profiles & Parameters →
          </button>
        </div>

      </div>

      {/* Main Focus Area: Action Center (Checklists) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rapid Check-in Panel (Habits & Rituals on spot!) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-zinc-900 border border-zinc-800">
          <div className="flex items-center justify-between mb-4 border-b border-zinc-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Rapid Check-in Panel</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">Tap to tick off immediately</span>
          </div>

          {allActiveGoals.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500 italic">
              Your customized domains are empty! Head to Settings or Daily Rituals to specify focus goals.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {allActiveGoals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => onToggleGoal(goal.domainId, goal.id)}
                  className={`p-3 text-left rounded-lg border text-xs font-mono transition-all flex items-start gap-2.5 ${
                    goal.completed
                      ? "bg-emerald-950/20 border-emerald-900/60 text-emerald-200 opacity-60"
                      : "bg-zinc-950 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:text-white"
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px] ${
                    goal.completed 
                      ? "bg-emerald-500 border-emerald-500 text-black" 
                      : "border-zinc-700"
                  }`}>
                    {goal.completed ? "✓" : ""}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`flex items-center gap-1.5 flex-wrap ${goal.completed ? "line-through opacity-70" : ""}`}>
                      <span>{goal.text}</span>
                      {goal.streak && goal.streak > 0 ? (
                        <span className="inline-flex items-center gap-0.5 text-amber-500 font-bold bg-amber-500/10 border border-amber-500/20 px-1 py-0.2 rounded text-[10px]">
                          🔥 {goal.streak}
                        </span>
                      ) : null}
                    </p>
                    <span className="text-[8px] opacity-40 uppercase block mt-1 tracking-wider text-zinc-500">{goal.domainTitle}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Motivation Side column */}
        <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-widest border-b border-zinc-800/80 pb-2">Academic & Skills Focus</h4>
            
            {subjects.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No curriculum subjects loaded yet.</p>
            ) : (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {subjects.slice(0, 3).map((sub) => {
                  const subPct = Math.round((sub.currentProgressUnits / sub.totalUnits) * 100);
                  return (
                    <div key={sub.id} className="text-xs space-y-1">
                      <div className="flex justify-between items-center font-mono">
                        <span className="text-zinc-300 font-bold truncate">{sub.name}</span>
                        <span className="text-zinc-500">{sub.currentProgressUnits}/{sub.totalUnits} Units</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-400 h-full rounded-full" 
                          style={{ width: `${subPct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <h4 className="text-xs font-mono uppercase text-zinc-400 tracking-widest border-b border-zinc-800/80 pb-2 pt-2">AI Mastery Courses</h4>
            {courses.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No tech skills being actively pursued.</p>
            ) : (
              <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
                {courses.slice(0, 3).map((course) => (
                  <div key={course.id} className="flex justify-between items-center text-[11px] font-mono text-zinc-300">
                    <span className="truncate max-w-[150px]">• {course.title}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${course.completed ? "bg-emerald-950 text-emerald-400" : "bg-zinc-850 text-zinc-400"}`}>
                      {course.completed ? "Mastered" : "Active"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setActiveTab("academic")}
              className="flex-1 py-1 px-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 text-[10px] font-mono rounded text-zinc-350 hover:text-white transition-all text-center"
            >
              Review Syllabus
            </button>
            <button
              onClick={() => setActiveTab("side-skill")}
              className="flex-1 py-1 px-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 text-[10px] font-mono rounded text-zinc-350 hover:text-white transition-all text-center"
            >
              Study AI Skills
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
