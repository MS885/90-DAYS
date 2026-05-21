import React, { useState, useEffect } from "react";
import { UserSettings, Domain, CurriculumSubject, SideSkillCourse, DailyExpense, ExamStatus, CoachMessage, GoalItem, ThemeVibe } from "./types";
import VibeContainer from "./VibeContainer";
import AuthScreen from "./AuthScreen";
import HomeOverview from "./HomeOverview";
import SideSkillModule from "./SideSkillModule";
import AcademicModule from "./AcademicModule";
import FinanceModule from "./FinanceModule";
import CoachModule from "./CoachModule";
import SettingsModule from "./SettingsModule";
import { ClipboardList, Flame, UserCheck, ShieldAlert, CheckSquare, Plus, Trash } from "lucide-react";

// Initializing beautiful offline-first default states for first-time builders
const DEFAULT_SETTINGS: UserSettings = {
  vibe: "cosmic-slate",
  coachName: "Titan AI Coach",
  totalTransformDays: 90,
  language: "English",
  currencySymbol: "$",
  startDate: new Date().toISOString().split("T")[0]
};

const DEFAULT_DOMAINS: Domain[] = [
  {
    id: "health-energy",
    title: "Health & Energy Protocol",
    icon: "Flame",
    description: "Physical mastery, cellular energy levels, cardiovascular capacity, and muscle growth factors.",
    goals: [
      { id: "h1", text: "Drank 4 Liters of purified mineral water", completed: false },
      { id: "h2", text: "Completed 45 minutes high-intensity heavy lift session", completed: false },
      { id: "h3", text: "Maintained absolute clean diet (no sugars, zero seed oils)", completed: false },
      { id: "h4", text: "8 Hours complete eye-mask darkness sleep cycle", completed: false }
    ]
  },
  {
    id: "discipline",
    title: "Extreme Discipline & Habits",
    icon: "ClipboardList",
    description: "Defeating rapid dopamine feedback loops to unlock total mental focus and focus velocity.",
    goals: [
      { id: "d1", text: "Woke up instantly with 5-second countdown rule (no alarm snoozing)", completed: false },
      { id: "d2", text: "No recreational screen scroll / social media access", completed: false },
      { id: "d3", text: "Completed 2 full blocks of 90-minute undisturbed focus work", completed: false }
    ]
  },
  {
    id: "style-appearance",
    title: "Aesthetic Identity & Style",
    icon: "UserCheck",
    description: "Refining personal representation, postural core strength, personal grooming, and confidence multipliers.",
    goals: [
      { id: "s1", text: "Maintained ideal facial skin hygiene care regime (morning & evening)", completed: false },
      { id: "s2", text: "Stood/sat straight with core engaged during desktop work sessions", completed: false },
      { id: "s3", text: "Selected structured outfits with clean aesthetic color palettes", completed: false }
    ]
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(() => {
    const saved = localStorage.getItem("unrec_current_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem("unrec_settings");
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [domains, setDomains] = useState<Domain[]>(() => {
    const saved = localStorage.getItem("unrec_domains");
    return saved ? JSON.parse(saved) : DEFAULT_DOMAINS;
  });

  const [subjects, setSubjects] = useState<CurriculumSubject[]>(() => {
    const saved = localStorage.getItem("unrec_subjects");
    return saved ? JSON.parse(saved) : [];
  });

  const [courses, setCourses] = useState<SideSkillCourse[]>(() => {
    const saved = localStorage.getItem("unrec_courses");
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<DailyExpense[]>(() => {
    const saved = localStorage.getItem("unrec_expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [exams, setExams] = useState<ExamStatus[]>(() => {
    const saved = localStorage.getItem("unrec_exams");
    return saved ? JSON.parse(saved) : [];
  });

  const [coachMessages, setCoachMessages] = useState<CoachMessage[]>(() => {
    const saved = localStorage.getItem("unrec_coach_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [studyScheduleText, setStudyScheduleText] = useState("");
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("home");

  const [syncId, setSyncId] = useState<string>(() => {
    return localStorage.getItem("unrec_sync_id") || "";
  });
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  // Save states to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("unrec_current_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("unrec_current_user");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("unrec_sync_id", syncId);
  }, [syncId]);
  useEffect(() => {
    localStorage.setItem("unrec_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("unrec_domains", JSON.stringify(domains));
  }, [domains]);

  useEffect(() => {
    localStorage.setItem("unrec_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("unrec_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("unrec_expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("unrec_exams", JSON.stringify(exams));
  }, [exams]);

  useEffect(() => {
    localStorage.setItem("unrec_coach_messages", JSON.stringify(coachMessages));
  }, [coachMessages]);

  // Global variables
  const daysRemaining = (() => {
    const start = new Date(settings.startDate).getTime();
    const nowOutput = new Date().getTime();
    const elapsedDays = Math.floor((nowOutput - start) / (1000 * 60 * 60 * 24));
    return Math.max(0, settings.totalTransformDays - elapsedDays);
  })();

  const totalGoalsCount = (() => {
    let total = 0;
    let completed = 0;
    domains.forEach((dom) => {
      dom.goals.forEach((g) => {
        total++;
        if (g.completed) completed++;
      });
    });
    return { completed, total };
  })();

  // Core Goal Toggler
  const handleToggleGoal = (domainId: string, goalId: string) => {
    setDomains(
      domains.map((dom) => {
        if (dom.id === domainId) {
          return {
            ...dom,
            goals: dom.goals.map((g) => {
              if (g.id === goalId) {
                const nextCompleted = !g.completed;
                const currentStreak = g.streak || 0;
                let nextStreak = currentStreak;
                if (nextCompleted) {
                  nextStreak = currentStreak + 1;
                } else {
                  nextStreak = Math.max(0, currentStreak - 1);
                }
                return {
                  ...g,
                  completed: nextCompleted,
                  streak: nextStreak
                };
              }
              return g;
            })
          };
        }
        return dom;
      })
    );
  };

  // Manual Streak modifier
  const handleModifyStreak = (domainId: string, goalId: string, delta: number) => {
    setDomains(
      domains.map((dom) => {
        if (dom.id === domainId) {
          return {
            ...dom,
            goals: dom.goals.map((g) => {
              if (g.id === goalId) {
                const newStreak = Math.max(0, (g.streak || 0) + delta);
                // Also optionally mark as completed if streak is incremented from 0, or keep current state
                return {
                  ...g,
                  streak: newStreak
                };
              }
              return g;
            })
          };
        }
        return dom;
      })
    );
  };

  // Add individual custom goals to domain
  const handleAddGoalToDomain = (domainId: string, text: string) => {
    setDomains(
      domains.map((dom) => {
        if (dom.id === domainId) {
          return {
            ...dom,
            goals: [...dom.goals, { id: Math.random().toString(), text, completed: false }]
          };
        }
        return dom;
      })
    );
  };

  const handleDeleteGoalFromDomain = (domainId: string, goalId: string) => {
    setDomains(
      domains.map((dom) => {
        if (dom.id === domainId) {
          return {
            ...dom,
            goals: dom.goals.filter((g) => g.id !== goalId)
          };
        }
        return dom;
      })
    );
  };

  // Create customized domains
  const handleAddDomain = (title: string, description: string) => {
    const newDom: Domain = {
      id: Math.random().toString(),
      title,
      icon: "ClipboardList",
      description,
      goals: [],
      isCustom: true
    };
    setDomains([...domains, newDom]);
  };

  const handleDeleteDomain = (id: string) => {
    setDomains(domains.filter((dom) => dom.id !== id));
  };

  // Courses
  const handleAddCourse = (course: Omit<SideSkillCourse, "id" | "completed">) => {
    setCourses([...courses, { ...course, id: Math.random().toString(), completed: false }]);
  };

  const handleToggleCourse = (id: string) => {
    if (!id) {
      setCourses([...courses]); // Trigger generic re-render on slider move
      return;
    }
    setCourses(
      courses.map((c) => (c.id === id ? { ...c, completed: !c.completed, progressPercentage: c.completed ? 0 : 100 } : c))
    );
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  // Subjects
  const handleAddSubject = (sub: Omit<CurriculumSubject, "id">) => {
    setSubjects([...subjects, { ...sub, id: Math.random().toString() }]);
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleUpdateSubjectProgress = (id: string, units: number) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, currentProgressUnits: units } : s))
    );
  };

  // Expenses
  const handleAddExpense = (expense: Omit<DailyExpense, "id" | "timestamp">) => {
    setExpenses([
      ...expenses,
      { ...expense, id: Math.random().toString(), timestamp: new Date().toISOString() }
    ]);
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Exams
  const handleAddExam = (exam: ExamStatus) => {
    setExams([...exams, exam]);
  };

  const handleDeleteExam = (idx: number) => {
    setExams(exams.filter((_, i) => i !== idx));
  };

  // Ask AI Coach Dialogue
  const handleSendMessage = async (text: string) => {
    const userMsg: CoachMessage = {
      id: Math.random().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString()
    };
    setCoachMessages((prev) => [...prev, userMsg]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coachName: settings.coachName,
          messages: [...coachMessages, userMsg],
          context: {
            daysLeft: daysRemaining,
            goals: domains.map((d) => d.title),
            domains: domains.map((d) => d.title),
            aiSkills: courses.filter((c) => !c.completed).map((c) => c.title),
            subjects: subjects.map((s) => s.name),
            examSubject: exams[0]?.subject || "N/A",
            examDate: exams[0]?.date || "N/A"
          }
        })
      });
      const data = await response.json();
      const coachMsg: CoachMessage = {
        id: Math.random().toString(),
        sender: "coach",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString()
      };
      setCoachMessages((prev) => [...prev, coachMsg]);
    } catch (err) {
      console.error(err);
    }
  };

  // Study schedule API generator
  const handleGenerateStudySchedule = async (
    subject: string,
    examDate: string,
    focusHours: number,
    complexity: string
  ) => {
    setLoadingSchedule(true);
    setStudyScheduleText("");
    try {
      const response = await fetch("/api/study-schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          examDate,
          daysLeft: Math.max(1, Math.round((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))),
          currentComplexity: complexity,
          focusHours
        })
      });
      const data = await response.json();
      setStudyScheduleText(data.schedule || "");
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const handleApplyDaysRemaining = (days: number) => {
    setSettings((prev) => ({
      ...prev,
      totalTransformDays: days,
      startDate: new Date().toISOString().split("T")[0] // Recalibrate start date so new countdown matches exactly
    }));
  };

  const handleSaveToServer = async (id: string) => {
    if (!id) return;
    setSyncLoading(true);
    setSyncMessage("");
    try {
      const statePayload = {
        settings,
        domains,
        subjects,
        courses,
        expenses,
        exams,
        coachMessages
      };
      const response = await fetch("/api/save-state", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ syncId: id, stateData: statePayload })
      });
      const data = await response.json();
      if (data.status === "success") {
        setSyncMessage("✓ Synced to cloud");
        localStorage.setItem("unrec_sync_id", id);
        setTimeout(() => setSyncMessage(""), 4000);
      } else {
        setSyncMessage(`Sync failed: ${data.message}`);
      }
    } catch (err: any) {
      setSyncMessage(`Network error: ${err.message}`);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleLoadFromServer = async (id: string) => {
    if (!id) return;
    setSyncLoading(true);
    setSyncMessage("");
    try {
      const response = await fetch(`/api/load-state/${encodeURIComponent(id)}`);
      const data = await response.json();
      if (data.status === "success" && data.stateData) {
        const payload = data.stateData;
        if (payload.settings) setSettings(payload.settings);
        if (payload.domains) setDomains(payload.domains);
        if (payload.subjects) setSubjects(payload.subjects);
        if (payload.courses) setCourses(payload.courses);
        if (payload.expenses) setExpenses(payload.expenses);
        if (payload.exams) setExams(payload.exams);
        if (payload.coachMessages) setCoachMessages(payload.coachMessages);
        
        localStorage.setItem("unrec_sync_id", id);
        setSyncMessage("✓ Load Restored!");
        setTimeout(() => setSyncMessage(""), 4000);
      } else {
        setSyncMessage(`Not found: ${data.message || "ID error"}`);
        setTimeout(() => setSyncMessage(""), 5000);
      }
    } catch (err: any) {
      setSyncMessage(`Network error: ${err.message}`);
      setTimeout(() => setSyncMessage(""), 5000);
    } finally {
      setSyncLoading(false);
    }
  };

  const handleExportBackup = () => {
    const backupState = {
      settings,
      domains,
      subjects,
      courses,
      expenses,
      exams,
      coachMessages
    };
    const blob = new Blob([JSON.stringify(backupState, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `unrecognizable-portfolio-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (!json) throw new Error("File empty");
        
        if (json.settings) setSettings(json.settings);
        if (json.domains) setDomains(json.domains);
        if (json.subjects) setSubjects(json.subjects);
        if (json.courses) setCourses(json.courses);
        if (json.expenses) setExpenses(json.expenses);
        if (json.exams) setExams(json.exams);
        if (json.coachMessages) setCoachMessages(json.coachMessages);
        
        alert("✓ State portfolio successfully imported and restored!");
      } catch (err: any) {
        alert(`Failed to restore file: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleRequestScheduleFromExam = (subj: string, exDate: string) => {
    setActiveTab("ai-coach");
    handleGenerateStudySchedule(subj, exDate, 3, "Moderate difficulty, standard chapters");
  };

  if (!currentUser) {
    return (
      <AuthScreen
        currentVibe={settings.vibe}
        onLoginSuccess={(user) => {
          setCurrentUser({ email: user.email, name: user.name });
          setSettings((prev) => ({
            ...prev,
            vibe: user.vibe
          }));
        }}
      />
    );
  }

  return (
    <VibeContainer
      settings={settings}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onModifyDays={handleApplyDaysRemaining}
      daysRemaining={daysRemaining}
      totalGoalsCount={totalGoalsCount}
      syncId={syncId}
      setSyncId={setSyncId}
      onSaveToServer={handleSaveToServer}
      onLoadFromServer={handleLoadFromServer}
      onExportBackup={handleExportBackup}
      onImportBackup={handleImportBackup}
      syncLoading={syncLoading}
      syncMessage={syncMessage}
      currentUser={currentUser}
      onSignOut={() => setCurrentUser(null)}
      onVibeSelect={(newVibe) => {
        setSettings((prev) => ({
          ...prev,
          vibe: newVibe
        }));
      }}
      children={
        <>
          {activeTab === "home" && (
            <HomeOverview
              settings={settings}
              domains={domains}
              subjects={subjects}
              courses={courses}
              expenses={expenses}
              onToggleGoal={handleToggleGoal}
              daysRemaining={daysRemaining}
              totalGoalsCount={totalGoalsCount}
              setActiveTab={setActiveTab}
              syncId={syncId}
            />
          )}

          {activeTab === "domains" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {domains.map((dom) => (
                  <div
                    key={dom.id}
                    className="p-5 rounded-xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-md font-bold font-mono uppercase tracking-wider text-amber-500">
                          {dom.title}
                        </h3>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">{dom.description}</p>

                      <div className="space-y-2 border-t border-zinc-800/80 pt-3">
                        {dom.goals.length === 0 ? (
                          <p className="text-[10px] text-zinc-500 italic">
                            Empty. Manage domain goals inside the Settings panel or type below to append items.
                          </p>
                        ) : (
                          dom.goals.map((goal) => (
                            <div
                              key={goal.id}
                              className="w-full flex items-center justify-between gap-1.5 py-1 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                            >
                              <button
                                onClick={() => handleToggleGoal(dom.id, goal.id)}
                                className="flex items-start gap-2.5 text-left flex-1 cursor-pointer group"
                              >
                                <span
                                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    goal.completed
                                      ? "bg-emerald-500 border-emerald-500 text-black font-bold text-[10px]"
                                      : "border-zinc-700 group-hover:border-zinc-500"
                                  }`}
                                >
                                  {goal.completed ? "✓" : ""}
                                </span>
                                <span className={goal.completed ? "line-through opacity-50" : "text-zinc-350"}>
                                  {goal.text}
                                </span>
                              </button>

                              {/* Interactive Streak display tag */}
                              <div className="flex items-center gap-1 bg-zinc-950/60 px-2 py-0.5 rounded border border-zinc-800/80 shrink-0 text-[10px]">
                                {goal.streak && goal.streak > 0 ? (
                                  <span className="text-amber-500 font-bold flex items-center gap-0.5" title="Consecutive daily check-ins">
                                    🔥 {goal.streak}
                                  </span>
                                ) : (
                                  <span className="text-zinc-650" title="Zero streak, start checklist to build energy">
                                    💤 0
                                  </span>
                                )}
                                <div className="flex items-center gap-0.5 ml-1 border-l border-zinc-800/80 pl-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleModifyStreak(dom.id, goal.id, -1);
                                    }}
                                    className="w-3.5 h-3.5 rounded bg-zinc-900 hover:bg-zinc-800 hover:text-red-400 flex items-center justify-center text-[9px] font-bold text-zinc-500"
                                    title="Decrease Streak Count"
                                  >
                                    -
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleModifyStreak(dom.id, goal.id, 1);
                                    }}
                                    className="w-3.5 h-3.5 rounded bg-zinc-900 hover:bg-zinc-800 hover:text-emerald-400 flex items-center justify-center text-[9px] font-bold text-zinc-500"
                                    title="Increase Streak Count"
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Quick interactive single field to write goals inside domain directly */}
                    <div className="mt-4 pt-3 border-t border-zinc-800/80 flex gap-2">
                      <input
                        type="text"
                        placeholder="New goal item..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const val = e.currentTarget.value;
                            if (val.trim()) {
                              handleAddGoalToDomain(dom.id, val.trim());
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                        className="flex-1 px-3 py-1.5 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 font-mono text-zinc-300"
                      />
                    </div>
                  </div>
                ))}

                {/* Micro block helping them learn what visual features exist */}
                <div className="p-5 rounded-xl bg-gradient-to-br from-amber-600/5 to-indigo-600/5 border border-zinc-800/80 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-emerald-400">
                      Silent Protocols Active
                    </h3>
                    <p className="text-xs leading-normal text-zinc-400 mt-2 font-mono">
                      No distraction. Keep updating your active checkmarks, study deep blocks, and log spending.
                    </p>
                  </div>
                  <div className="text-[10px] font-mono opacity-50 mt-4 leading-normal">
                    *Tip: Add more customized domains under the vibe settings dashboard.*
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "academic" && (
            <AcademicModule
              subjects={subjects}
              exams={exams}
              onAddSubject={handleAddSubject}
              onDeleteSubject={handleDeleteSubject}
              onUpdateSubjectProgress={handleUpdateSubjectProgress}
              onAddExam={handleAddExam}
              onDeleteExam={handleDeleteExam}
              onRequestSchedule={handleRequestScheduleFromExam}
              currencySymbol={settings.currencySymbol}
            />
          )}

          {activeTab === "side-skill" && (
            <SideSkillModule
              courses={courses}
              onAddCourse={handleAddCourse}
              onToggleCourse={handleToggleCourse}
              onDeleteCourse={handleDeleteCourse}
              onRecommendCourse={handleAddCourse}
              currencySymbol={settings.currencySymbol}
            />
          )}

          {activeTab === "finance" && (
            <FinanceModule
              expenses={expenses}
              onAddExpense={handleAddExpense}
              onDeleteExpense={handleDeleteExpense}
              currencySymbol={settings.currencySymbol}
            />
          )}

          {activeTab === "ai-coach" && (
            <CoachModule
              settings={settings}
              subjects={subjects}
              exams={exams}
              messages={coachMessages}
              onSendMessage={handleSendMessage}
              onClearChat={() => setCoachMessages([])}
              studyScheduleText={studyScheduleText}
              onGenerateStudySchedule={handleGenerateStudySchedule}
              loadingSchedule={loadingSchedule}
            />
          )}

          {activeTab === "settings" && (
            <SettingsModule
              settings={settings}
              onUpdateSettings={setSettings}
              domains={domains}
              onAddDomain={handleAddDomain}
              onDeleteDomain={handleDeleteDomain}
              onAddGoalToDomain={handleAddGoalToDomain}
              onDeleteGoalFromDomain={handleDeleteGoalFromDomain}
              currentUser={currentUser}
              onSignOut={() => setCurrentUser(null)}
            />
          )}
        </>
      }
    />
  );
}
