import React, { useState } from "react";
import { BookOpen, Calendar, Plus, Clock, Bookmark, Brain, ArrowRight, Trash, FileText, Upload, Sparkles, ChevronDown } from "lucide-react";
import { CurriculumSubject, ExamStatus } from "../types";

interface AcademicModuleProps {
  subjects: CurriculumSubject[];
  exams: ExamStatus[];
  onAddSubject: (subject: Omit<CurriculumSubject, "id">) => void;
  onDeleteSubject: (id: string) => void;
  onUpdateSubjectProgress: (id: string, units: number) => void;
  onAddExam: (exam: ExamStatus) => void;
  onDeleteExam: (idx: number) => void;
  onRequestSchedule: (subjectName: string, examDate: string) => void;
  currencySymbol: string;
}

export default function AcademicModule({
  subjects,
  exams,
  onAddSubject,
  onDeleteSubject,
  onUpdateSubjectProgress,
  onAddExam,
  onDeleteExam,
  onRequestSchedule,
  currencySymbol
}: AcademicModuleProps) {
  const [subjectName, setSubjectName] = useState("");
  const [totalUnits, setTotalUnits] = useState(10);
  const [targetGrade, setTargetGrade] = useState("A+");

  const [examSubject, setExamSubject] = useState("");
  const [examDate, setExamDate] = useState("");

  // Syllabus AI Strategist states
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [pastedSyllabusText, setPastedSyllabusText] = useState("");
  const [syllabusTargetSubject, setSyllabusTargetSubject] = useState("");
  const [syllabusExamDate, setSyllabusExamDate] = useState("");
  const [syllabusHours, setSyllabusHours] = useState(3);
  const [isGeneratingSyllabusPlan, setIsGeneratingSyllabusPlan] = useState(false);
  const [generatedSyllabusPlan, setGeneratedSyllabusPlan] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    onAddSubject({
      name: subjectName,
      currentProgressUnits: 0,
      totalUnits: totalUnits || 10,
      gradeTarget: targetGrade || "A+"
    });
    setSubjectName("");
  };

  const handleAddExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examSubject.trim() || !examDate) return;
    onAddExam({
      subject: examSubject,
      date: examDate
    });
    setExamSubject("");
    setExamDate("");
  };

  const calculateDaysLeft = (targetDateStr: string) => {
    const examTime = new Date(targetDateStr).getTime();
    const nowTime = new Date().getTime();
    const diff = examTime - nowTime;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Syllabus Drag and Drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSyllabusFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setPastedSyllabusText(text.slice(0, 6000));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSyllabusFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          setPastedSyllabusText(text.slice(0, 6000));
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGenerateSyllabusPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!syllabusTargetSubject) {
      alert("Please state which subject this syllabus belongs to first.");
      return;
    }
    setIsGeneratingSyllabusPlan(true);
    setGeneratedSyllabusPlan("");
    try {
      const response = await fetch("/api/generate-from-syllabus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: syllabusFile ? syllabusFile.name : "Syllabus_Outline.txt",
          fileContent: pastedSyllabusText || "Standard multi-unit academic requirements",
          subjectName: syllabusTargetSubject,
          examDate: syllabusExamDate || "Soon",
          focusHours: syllabusHours
        })
      });
      const data = await response.json();
      setGeneratedSyllabusPlan(data.schedule || "Study plan generation timed out.");
    } catch (err: any) {
      setGeneratedSyllabusPlan(`Study strategy construction failed: ${err.message}`);
    } finally {
      setIsGeneratingSyllabusPlan(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn">
      
      {/* Subject list curriculum (Left 2 columns) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Curricular Subject tracker */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-zinc-800/85">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider flex items-center gap-2 text-white">
              <BookOpen className="w-4 h-4 text-amber-500 animate-pulse" /> Academic Curriculum & Subjects
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-950 text-zinc-400 rounded border border-zinc-800/80">
              Curricular Tracker
            </span>
          </div>

          {/* Core Subject Creator */}
          <form onSubmit={handleAddSubjectSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
            <input
              type="text"
              placeholder="Subject name (e.g. AP Calculus)"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 text-white sm:col-span-2 font-mono"
              required
            />
            <input
              type="number"
              placeholder="Total Units"
              value={totalUnits || ""}
              onChange={(e) => setTotalUnits(parseInt(e.target.value) || 10)}
              className="px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 text-white font-mono"
              min="1"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Target Grade"
                value={targetGrade}
                onChange={(e) => setTargetGrade(e.target.value)}
                className="px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 text-white font-mono flex-1 text-center"
              />
              <button
                type="submit"
                className="p-2 bg-amber-500 hover:bg-amber-400 rounded text-black font-mono font-bold transition-all"
                title="Add subject core tracker"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>

          {subjects.length === 0 ? (
            <div className="text-center py-8 text-xs text-zinc-500 italic">
              No curriculum tracking subjects loaded. Add your courses above to start tracking units.
            </div>
          ) : (
            <div className="space-y-3.5">
              {subjects.map((sub) => {
                const subPct = Math.round((sub.currentProgressUnits / sub.totalUnits) * 100);
                return (
                  <div
                    key={sub.id}
                    className="p-4 rounded-lg bg-zinc-950 border border-zinc-850 flex flex-col md:flex-row items-baseline md:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-zinc-900 border border-zinc-800 text-amber-500">
                          <Bookmark className="w-3.5 h-3.5" />
                        </span>
                        <h3 className="text-sm font-bold text-white truncate">{sub.name}</h3>
                        <span className="text-[9px] font-mono text-zinc-400 border border-zinc-800 px-1.5 py-0.2 rounded ml-1">
                          Grade goal: {sub.gradeTarget}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2 w-full">
                        <div className="flex-1 bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${subPct}%` }}
                          />
                        </div>
                        <div className="flex justify-between sm:justify-start items-center gap-4 text-[10px] font-mono text-zinc-400 shrink-0">
                          <span>
                            Progress: {sub.currentProgressUnits} / {sub.totalUnits} Units ({subPct}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 border-zinc-850 pt-2 md:pt-0">
                      <div className="flex items-center bg-zinc-900 rounded border border-zinc-850">
                        <button
                          onClick={() =>
                            onUpdateSubjectProgress(
                              sub.id,
                              Math.max(0, sub.currentProgressUnits - 1)
                            )
                          }
                          className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white font-bold"
                        >
                          -
                        </button>
                        <span className="px-1 text-xs font-mono text-white">{sub.currentProgressUnits}</span>
                        <button
                          onClick={() =>
                            onUpdateSubjectProgress(
                              sub.id,
                              Math.min(sub.totalUnits, sub.currentProgressUnits + 1)
                            )
                          }
                          className="px-2.5 py-1 text-xs text-zinc-400 hover:text-white font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => onDeleteSubject(sub.id)}
                        className="p-1 text-red-400 hover:bg-zinc-900 rounded"
                        title="Delete discipline"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Syllabus PDF study strategist */}
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 space-y-4">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-2.5">
            <Brain className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Syllabus-Based Study Scheduler</h3>
          </div>
          
          <p className="text-xs text-zinc-400 font-mono leading-relaxed">
            Upload your official curriculum outline (PDF/TXT) or paste topics directly. Our AI coach parses core concepts to construct an optimal learning pipeline.
          </p>

          <form onSubmit={handleGenerateSyllabusPlan} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Target Subject / Core Focus</label>
                <select
                  value={syllabusTargetSubject}
                  onChange={(e) => setSyllabusTargetSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-zinc-950 border border-zinc-800 text-white font-mono outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">-- Choose Subject --</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name}</option>
                  ))}
                  {subjects.length === 0 && <option value="General Semester Term">General Term Exam</option>}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Study Focus Limit (hrs/day)</label>
                <select
                  value={syllabusHours}
                  onChange={(e) => setSyllabusHours(parseInt(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-zinc-950 border border-zinc-800 text-white font-mono outline-none focus:border-indigo-500"
                >
                  <option value="2">2 Hours Daily (High Focus)</option>
                  <option value="3">3 Hours Daily (Standard Protocol)</option>
                  <option value="4">4 Hours Daily (High intensity)</option>
                  <option value="6">6 Hours Daily (Absolute Monkmode)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Target Assessment Date</label>
                <input
                  type="date"
                  value={syllabusExamDate}
                  onChange={(e) => setSyllabusExamDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-zinc-950 border border-zinc-800 text-white font-mono outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Drag & Drop uploader zone */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-5 text-center transition-all ${
                dragActive ? "border-amber-400 bg-amber-950/10" : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700"
              }`}
            >
              <input
                type="file"
                id="syllabus-upload"
                className="hidden"
                accept=".txt,.pdf,.json,.csv,.md"
                onChange={handleFileChange}
              />
              
              <label htmlFor="syllabus-upload" className="cursor-pointer block space-y-2">
                <Upload className="w-8 h-8 text-zinc-500 mx-auto animate-pulse" />
                <div className="text-xs font-mono text-zinc-300 font-bold">
                  {syllabusFile ? `📄 Selected: ${syllabusFile.name}` : "Drag & Drop syllabus file here (PDF, TXT, etc.) or click to browse"}
                </div>
                <p className="text-[10px] font-mono text-zinc-500">
                  We automatically extract study topics from text-compatible outlines
                </p>
              </label>
            </div>

            {/* Optional outline keywords custom entry */}
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">
                Raw Curriculum Details / Key Chapters (Optional)
              </label>
              <textarea
                placeholder="Unit 1: Foundations, Unit 2: Thermodynamic engines, Unit 3: Kinetic theory equations..."
                value={pastedSyllabusText}
                onChange={(e) => setPastedSyllabusText(e.target.value)}
                className="w-full h-20 p-3 text-xs bg-zinc-950 border border-zinc-800 rounded font-mono text-zinc-300 outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isGeneratingSyllabusPlan}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> {isGeneratingSyllabusPlan ? "STRATEGIZING CORE SCHEDULE..." : "GENERATE STUDY CALENDAR FROM SYLLABUS"}
            </button>
          </form>

          {/* Generated Study Calendar block */}
          {generatedSyllabusPlan && (
            <div className="bg-zinc-950 p-4 border border-zinc-800 rounded-lg space-y-2 text-xs font-mono animate-fadeIn">
              <div className="flex justify-between items-center border-b border-zinc-850 pb-2 mb-2">
                <span className="text-indigo-400 font-bold uppercase tracking-wider text-[10px]">AI Strategic Study Plan</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedSyllabusPlan);
                    alert("Study plan copied to clipboard!");
                  }}
                  className="px-2 py-0.5 bg-zinc-900 border border-zinc-850 text-[9px] hover:text-white rounded"
                >
                  Copy Plan
                </button>
              </div>
              <div className="text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto pr-1">
                {generatedSyllabusPlan}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Exam calendar & exact study schedules (Right column) */}
      <div className="space-y-6">
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 mb-3 border-b border-zinc-800 pb-2">
            <Calendar className="w-4 h-4 text-amber-500 animate-pulse" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-white">Target Exam Dates</h2>
          </div>

          <form onSubmit={handleAddExamSubmit} className="space-y-3 mb-6">
            <div>
              <label className="text-[10px] font-mono opacity-60 block uppercase mb-1">
                Select Tested Subject
              </label>
              <select
                value={examSubject}
                onChange={(e) => setExamSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 text-white font-mono"
                required
              >
                <option value="">-- Choose Subject --</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.name}>
                    {sub.name}
                  </option>
                ))}
                <option value="General Semester Term">General Semester Finals</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono opacity-60 block uppercase mb-1">
                Actual Exam Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 text-white font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-mono font-bold tracking-wider rounded"
            >
              + LOG UPCOMING EXAM
            </button>
          </form>

          {/* Scheduled exams pool */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-mono opacity-50 uppercase tracking-widest border-b border-zinc-800 pb-1.5">
              Active Transmutation Cutdowns
            </h3>

            {exams.length === 0 ? (
              <div className="text-center py-4 text-xs text-zinc-500 italic">
                No upcoming exam dates set.
              </div>
            ) : (
              exams.map((exam, idx) => {
                const daysLeft = calculateDaysLeft(exam.date);
                const isOverdue = daysLeft < 0;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-zinc-950 border border-zinc-850 flex flex-col gap-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-bold tracking-wide text-white">{exam.subject}</h4>
                        <span className="text-[10px] opacity-50 font-mono">{exam.date}</span>
                      </div>
                      <button
                        onClick={() => onDeleteExam(idx)}
                        className="text-[10px] font-mono text-red-400 opacity-60 hover:opacity-100"
                        title="Delete Exam Record"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-xs">
                      {isOverdue ? (
                        <span className="text-red-400 font-mono">Exam Concluded</span>
                      ) : (
                        <span className="text-amber-500 font-mono font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {daysLeft} Days Countdown
                        </span>
                      )}

                      {!isOverdue && (
                        <button
                          onClick={() => onRequestSchedule(exam.subject, exam.date)}
                          className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-[10px] font-mono text-amber-300 flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Brain className="w-3 h-3 text-amber-400" /> Study Planner <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
