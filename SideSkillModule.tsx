import React, { useState } from "react";
import { Plus, BookOpen, Sparkles, Code, CheckCircle, RotateCw, Lightbulb, Trash } from "lucide-react";
import { SideSkillCourse, AIRecommendation } from "../types";

interface SideSkillModuleProps {
  courses: SideSkillCourse[];
  onAddCourse: (course: Omit<SideSkillCourse, "id" | "completed">) => void;
  onToggleCourse: (id: string) => void;
  onDeleteCourse: (id: string) => void;
  onRecommendCourse: (newCourse: SideSkillCourse) => void;
  currencySymbol: string;
}

export default function SideSkillModule({
  courses,
  onAddCourse,
  onToggleCourse,
  onDeleteCourse,
  onRecommendCourse,
  currencySymbol
}: SideSkillModuleProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newProvider, setNewProvider] = useState("");
  const [newNextConcept, setNewNextConcept] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [userInterest, setUserInterest] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddCourse({
      title: newTitle,
      provider: newProvider || "Self-Study",
      progressPercentage: 0,
      nextConcept: newNextConcept || "Getting Started"
    });
    setNewTitle("");
    setNewProvider("");
    setNewNextConcept("");
  };

  const fetchAIRecommendations = async () => {
    setLoadingSuggestions(true);
    try {
      const response = await fetch("/api/suggest-next-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSkills: courses.map(c => c.title),
          interests: userInterest
        })
      });
      const data = await response.json();
      setRecommendations(data.suggestions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleActivateRecommendation = (rec: AIRecommendation) => {
    onRecommendCourse({
      id: Math.random().toString(),
      title: rec.techName,
      provider: "AI Coach Advisory",
      progressPercentage: 5,
      nextConcept: rec.curriculum[0] || "Foundational setup",
      completed: false
    });
    // Remove from visible recommendations so they feel it was activated
    setRecommendations(prev => prev.filter(r => r.techName !== rec.techName));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      {/* Course List & Creation (Left 2 columns) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800/85">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <Code className="w-4 h-4 text-indigo-400" /> Side Skill & AI Courses
            </h2>
            <span className="text-[10px] font-mono px-2.5 py-0.5 bg-indigo-950/40 text-indigo-450 rounded border border-indigo-500/20">
              Personal Development (Non-Academic)
            </span>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <input
              type="text"
              placeholder="e.g., Deep Learning with PyTorch"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-indigo-500 text-white font-mono"
              required
            />
            <input
              type="text"
              placeholder="e.g., Coursera / HuggingFace"
              value={newProvider}
              onChange={(e) => setNewProvider(e.target.value)}
              className="px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-indigo-500 text-white font-mono"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Next chapter topic..."
                value={newNextConcept}
                onChange={(e) => setNewNextConcept(e.target.value)}
                className="px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-indigo-500 flex-1 text-white font-mono"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white flex items-center justify-center font-bold"
                title="Add New Side Skill"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </form>

          {/* List layout */}
          {courses.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500 italic">
              No side skills logged. Learn AI technologies to become elite. Use the AI suggestions pool on the right!
            </div>
          ) : (
            <div className="space-y-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`p-4 rounded-lg transition-all border ${
                    course.completed
                      ? "bg-zinc-950 border-emerald-900/60 text-emerald-250 opacity-80"
                      : "bg-zinc-950 border-zinc-850/80 text-zinc-300"
                  } flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleCourse(course.id)}
                        className={`p-0.5 rounded-full transition-all ${
                          course.completed ? "text-emerald-400" : "opacity-45 hover:opacity-100"
                        }`}
                      >
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </button>
                      <h3
                        className={`text-sm font-bold truncate ${
                          course.completed ? "line-through opacity-50 text-emerald-300" : "text-white"
                        }`}
                      >
                        {course.title}
                      </h3>
                      <span className="text-[10px] font-mono opacity-60 px-1.5 py-0.2 rounded bg-zinc-900 border border-zinc-800">
                        {course.provider}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex-1 max-w-[150px] bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                        <div
                          className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${course.progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-zinc-400">
                        {course.progressPercentage}% complete
                      </span>
                      {course.nextConcept && !course.completed && (
                        <span className="text-xs font-mono text-amber-400 pl-2 border-l border-zinc-850 truncate">
                          🎯 Next: {course.nextConcept}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                    {!course.completed && (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={course.progressPercentage}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          // We pass update inline via togglers or sliders here
                          course.progressPercentage = val;
                          if (val === 100) course.completed = true;
                          onToggleCourse(""); // quick force rerender triggered by sending list update or empty text toggler
                        }}
                        className="w-24 accent-indigo-500"
                        title="Adjust lessons weight completed"
                      />
                    )}
                    <button
                      onClick={() => onDeleteCourse(course.id)}
                      className="p-1 px-2 text-xs rounded hover:bg-zinc-900 text-red-400 transition-all font-mono"
                      title="Remove side course"
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic educational suggestion box on standard topics */}
        <div className="p-4 rounded-xl bg-indigo-950/35 border border-indigo-500/20 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-zinc-300">
            <span className="font-semibold block mb-0.5 text-indigo-300">Strategy Advisory</span>
            Separate side skill exploration from standard curricular syllabus coursework. Mastering Artificial Intelligence, Prompt Engineering, and RAG architectures equips you with modern leverage while standard courses score academic medals.
          </div>
        </div>
      </div>

      {/* AI Next technology suggestion pool (Right column) */}
      <div className="space-y-6">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Which AI to learn next?</h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono mb-4 leading-normal">
            Enter your tech focus or career goal, and the AI will analyze your profile to suggest cutting-edge subjects to dominate next.
          </p>

          <div className="space-y-3 mb-4">
            <input
              type="text"
              placeholder="e.g., Full Stack Web Dev, Machine Learning"
              value={userInterest}
              onChange={(e) => setUserInterest(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 text-white font-mono"
            />
            <button
              onClick={fetchAIRecommendations}
              disabled={loadingSuggestions}
              className="w-full py-2 bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white rounded text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loadingSuggestions ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" /> GENERATING INSIGHTS...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" /> ASK TRANSCENDENT DESIGNER
                </>
              )}
            </button>
          </div>

          {/* Render Recommendations list */}
          <div className="space-y-3 overflow-y-auto max-h-[380px] flex-1 pr-1">
            {recommendations.length > 0 ? (
              recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col gap-2"
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                        {rec.tag}
                      </span>
                      <h4 className="text-xs font-bold mt-1.5 tracking-wide text-white">{rec.techName}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{rec.whyItMatters}</p>

                  <div className="bg-zinc-900 p-2.5 rounded text-[10px] font-mono text-indigo-300 border border-zinc-850">
                    <span className="opacity-50 block font-bold mb-1 uppercase">1-Week Syllabus:</span>
                    {rec.curriculum?.map((cur, j) => (
                      <div key={j} className="truncate text-zinc-350">
                        • {cur}
                      </div>
                    ))}
                  </div>

                  <p className="text-[10px] italic leading-tight text-emerald-400">
                    Project: {rec.projectDescription}
                  </p>

                  <button
                    onClick={() => handleActivateRecommendation(rec)}
                    className="w-full py-1.5 mt-1 bg-indigo-650/40 hover:bg-indigo-600 text-[10px] text-zinc-100 rounded font-mono font-bold border border-indigo-500/20 cursor-pointer transition-all"
                  >
                    + ADD TO SIDE SKILLS
                  </button>
                </div>
              ))
            ) : !loadingSuggestions ? (
              <div className="text-center py-8 text-xs text-zinc-500 italic border border-dashed border-zinc-800 rounded-xl">
                Enter your interests above and generate high-yield paths designed specifically for the top 1%.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
