import React, { useState } from "react";
import { ThemeVibe, UserSettings, Domain } from "../types";
import { Shield, Sparkles, User, Globe, Coins, Calendar, Plus, Trash, Check, Compass, Settings } from "lucide-react";

interface SettingsModuleProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  domains: Domain[];
  onAddDomain: (title: string, description: string) => void;
  onDeleteDomain: (id: string) => void;
  onAddGoalToDomain: (domainId: string, goalText: string) => void;
  onDeleteGoalFromDomain: (domainId: string, goalId: string) => void;
  currentUser?: { email: string; name: string } | null;
  onSignOut?: () => void;
}

const CONSTANT_VIBES: { id: ThemeVibe; name: string; desc: string; icon: string }[] = [
  { id: "dark-academic", name: "📜 Dark Academic", desc: "Library shadows, warm paper, classical string focus overlays.", icon: "📚" },
  { id: "cyberpunk-monk", name: "⚡ Cyberpunk Monk", desc: "Pure high-performance neon matrices and physical optimization tracks.", icon: "👾" },
  { id: "zen-minimalist", name: "🧘 Zen Minimalist", desc: "Beige canvas, spacious typography, peaceful focus, zero clutter.", icon: "🌱" },
  { id: "alpine-focus", name: "🏔️ Alpine Focus", desc: "Sharp glacial peaks, clean slate, absolute alpine clarity.", icon: "❄️" },
  { id: "cosmic-slate", name: "🌌 Cosmic Slate", desc: "Mystery slate matte, futuristic gaseous dust gradients.", icon: "🌠" }
];

const SUGGESTED_DOMAINS = [
  { title: "Physical Mastery", desc: "Workouts, strength standards, elite sleep mechanics, and hydration benchmarks." },
  { title: "Dopamine Fasting", desc: "Removing social scrolls, high-stimulation habits, and screen overloads." },
  { title: "Public Voice Mode", desc: "Publishing learnings, writing blogs, contributing open source, or speaking." },
  { title: "Aesthetic Alignment", desc: "Wardrobe updates, facial hygiene routines, postural core sessions." }
];

export default function SettingsModule({
  settings,
  onUpdateSettings,
  domains,
  onAddDomain,
  onDeleteDomain,
  onAddGoalToDomain,
  onDeleteGoalFromDomain,
  currentUser,
  onSignOut
}: SettingsModuleProps) {
  const [newDomainTitle, setNewDomainTitle] = useState("");
  const [newDomainDesc, setNewDomainDesc] = useState("");
  const [selectedDomainForGoal, setSelectedDomainForGoal] = useState(domains[0]?.id || "");
  const [newGoalText, setNewGoalText] = useState("");

  const handleUpdate = (field: keyof UserSettings, value: any) => {
    onUpdateSettings({
      ...settings,
      [field]: value
    });
  };

  const handleAddDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDomainTitle.trim()) return;
    onAddDomain(newDomainTitle, newDomainDesc || "Custom structured focus path");
    setNewDomainTitle("");
    setNewDomainDesc("");
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim() || !selectedDomainForGoal) return;
    onAddGoalToDomain(selectedDomainForGoal, newGoalText);
    setNewGoalText("");
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto pb-12">
      {currentUser && (
        <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-mono font-bold text-amber-500 text-lg">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                Logged In Security Identity
              </h3>
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                Name/Alias: <span className="text-amber-400 font-bold">{currentUser.name}</span> • Email: <span className="text-zinc-305">{currentUser.email}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="px-4 py-2 bg-red-650/10 hover:bg-red-650/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded text-xs font-mono font-bold uppercase cursor-pointer transition-all"
            title="Log out of this security profile"
          >
            Sign Out / Disconnect Profile
          </button>
        </div>
      )}

      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider flex items-center gap-2 mb-4 text-white">
          <Settings className="w-4 h-4 text-indigo-400" /> Transmutation Profile & Personalization
        </h2>

        {/* Global properties grids */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-mono opacity-60 uppercase block mb-1 text-zinc-400">
                Visual Atmospheric Vibe
              </label>
              <div className="space-y-2 mt-2">
                {CONSTANT_VIBES.map((vb) => (
                  <button
                    key={vb.id}
                    onClick={() => handleUpdate("vibe", vb.id)}
                    className={`w-full p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
                      settings.vibe === vb.id
                        ? "bg-amber-500/10 border-amber-500/40 text-amber-500"
                        : "bg-zinc-950 border-zinc-850 hover:border-zinc-700"
                    }`}
                  >
                    <span className="text-2xl">{vb.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold font-mono uppercase tracking-wider">{vb.name}</h4>
                      <p className="text-[11px] opacity-70 leading-relaxed mt-0.5">{vb.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-xs font-mono opacity-60 uppercase block mb-1 text-zinc-400">
                AI Coach Custom Naming (Free to Rename)
              </label>
              <div className="relative mt-1">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-indigo-400 pointer-events-none" />
                <input
                  type="text"
                  value={settings.coachName}
                  onChange={(e) => handleUpdate("coachName", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-indigo-500 text-white font-mono"
                  placeholder="e.g., Grandmaster AI"
                />
              </div>
              <p className="text-[11px] opacity-50 font-mono mt-1">
                This custom name will inherit across the coach module with limitless chat available.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono opacity-60 uppercase block mb-1">
                  Primary Language
                </label>
                <div className="relative mt-1">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-indigo-400 pointer-events-none" />
                  <select
                    value={settings.language}
                    onChange={(e) => handleUpdate("language", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-indigo-500 font-mono text-white"
                  >
                    <option value="English">English</option>
                    <option value="Español">Español (Spanish)</option>
                    <option value="Français">Français (French)</option>
                    <option value="Deutsch">Deutsch (German)</option>
                    <option value="日本語">日本語 (Japanese)</option>
                    <option value="中文">中文 (Chinese)</option>
                    <option value="हिन्दी">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-mono opacity-60 uppercase block mb-1">
                  Currency Symbol
                </label>
                <div className="relative mt-1">
                  <Coins className="absolute left-3 top-2.5 w-4 h-4 text-indigo-400 pointer-events-none" />
                  <select
                    value={settings.currencySymbol}
                    onChange={(e) => handleUpdate("currencySymbol", e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-indigo-500 font-mono text-white text-center"
                  >
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (EUR)</option>
                    <option value="£">£ (GBP)</option>
                    <option value="¥">¥ (JPY/CNY)</option>
                    <option value="₹">₹ (INR)</option>
                    <option value="₩">₩ (KRW)</option>
                    <option value="₪">₪ (ILS)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono opacity-60 uppercase block mb-1 text-zinc-400">
                Dynamic Start Date Calibration
              </label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-indigo-400 pointer-events-none" />
                <input
                  type="date"
                  value={settings.startDate}
                  onChange={(e) => handleUpdate("startDate", e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-indigo-500 text-white font-mono"
                />
              </div>
              <p className="text-[11px] opacity-50 font-mono mt-1">
                Updates transformation day metrics calculated from start day.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Editor Settings */}
      <div className="bg-zinc-900 p-5 rounded-xl border border-zinc-800">
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-amber-500 mb-4">
          🛡️ Manage Current Focus Domains
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <h3 className="text-xs font-mono uppercase text-zinc-400 border-b border-zinc-850 pb-1.5">
              Create New Domain
            </h3>

            <form onSubmit={handleAddDomainSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Domain title (e.g., Physical Resilience)"
                value={newDomainTitle}
                onChange={(e) => setNewDomainTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 text-white font-mono font-bold"
                required
              />
              <textarea
                placeholder="Briefly decribe this domain focus..."
                value={newDomainDesc}
                onChange={(e) => setNewDomainDesc(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 h-16 resize-none text-white font-mono"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
              >
                + ADD FOCUS DOMAIN
              </button>
            </form>

            {/* Ideas pool */}
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-850">
              <span className="text-[10px] font-mono opacity-50 block uppercase mb-1.5 text-zinc-400">
                Transformation Ideas to add:
              </span>
              <div className="space-y-1.5">
                {SUGGESTED_DOMAINS.map((sd, i) => (
                  <div key={i} className="text-xs leading-normal">
                    <button
                      onClick={() => onAddDomain(sd.title, sd.desc)}
                      className="text-amber-500 hover:underline font-bold text-left block cursor-pointer"
                    >
                      + {sd.title}
                    </button>
                    <p className="opacity-60 text-[10px] text-zinc-400">{sd.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-xs font-mono uppercase text-zinc-400 border-b border-zinc-850 pb-1.5">
              Add Goal / Edit Checklist inside active domains
            </h3>

            <form onSubmit={handleAddGoalSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={selectedDomainForGoal}
                  onChange={(e) => setSelectedDomainForGoal(e.target.value)}
                  className="w-full px-2 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 font-mono text-white"
                >
                  {domains.map((dom) => (
                    <option key={dom.id} value={dom.id} className="text-zinc-900 bg-zinc-950">
                      {dom.title}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Type new custom goal..."
                  value={newGoalText}
                  onChange={(e) => setNewGoalText(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none focus:border-amber-500 text-white font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black rounded text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
              >
                + APPEND GOAL ITEM
              </button>
            </form>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {domains.map((dom) => (
                <div key={dom.id} className="text-xs p-3.5 rounded-lg bg-zinc-950 border border-zinc-850">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold underline text-indigo-300">{dom.title}</span>
                    {dom.isCustom && (
                      <button
                        onClick={() => onDeleteDomain(dom.id)}
                        className="text-[10px] text-red-400 hover:underline font-mono cursor-pointer"
                      >
                        Delete Domain
                      </button>
                    )}
                  </div>

                  {dom.goals.length === 0 ? (
                    <p className="text-[10px] italic opacity-50 text-zinc-500">Empty. Add your first goal item.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {dom.goals.map((g) => (
                        <div key={g.id} className="flex justify-between items-center text-[11px] font-mono opacity-80 text-zinc-300">
                          <span className="flex items-center gap-1.5 flex-wrap">
                            <span>• {g.text}</span>
                            {g.streak && g.streak > 0 ? (
                              <span className="text-amber-500 font-bold" title="Completed consecutively">
                                🔥 {g.streak}
                              </span>
                            ) : null}
                          </span>
                          <button
                            onClick={() => onDeleteGoalFromDomain(dom.id, g.id)}
                            className="text-red-400 hover:text-red-300 ml-1 opacity-60 hover:opacity-100 cursor-pointer text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
