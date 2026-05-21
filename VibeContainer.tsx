import React, { useState } from "react";
import { Sparkles, Calendar, Zap, Compass, Moon, Sun, ShieldAlert, Sliders, ArrowUpRight, Share2, Download, Upload, Cpu, Smartphone } from "lucide-react";
import { UserSettings, ThemeVibe } from "../types";
import PomodoroTimer from "./PomodoroTimer";

interface VibeContainerProps {
  settings: UserSettings;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onModifyDays: (days: number) => void;
  daysRemaining: number;
  totalGoalsCount: { completed: number; total: number };
  syncId: string;
  setSyncId: (id: string) => void;
  onSaveToServer: (id: string) => void;
  onLoadFromServer: (id: string) => void;
  onExportBackup: () => void;
  onImportBackup: (file: File) => void;
  syncLoading: boolean;
  syncMessage: string;
  currentUser?: { email: string; name: string } | null;
  onSignOut?: () => void;
  onVibeSelect?: (vibe: ThemeVibe) => void;
}

const QUOTES: Record<string, { quote: string; author: string }> = {
  "dark-academic": {
    quote: "Quiet minds study the universe in silence; true greatness is forged in solitude.",
    author: "W. H. Auden"
  },
  "cyberpunk-monk": {
    quote: "Be silent. Build in the dark. Upgrade your physical machine, optimize your neural path.",
    author: "Anonymous Protocols"
  },
  "zen-minimalist": {
    quote: "Simplicity is the ultimate sophistication. Eliminate the noise, discover the core self.",
    author: "Lao Tzu"
  },
  "alpine-focus": {
    quote: "He who climbs the highest peaks laughs at all tragedies, real or imaginary.",
    author: "Friedrich Nietzsche"
  },
  "cosmic-slate": {
    quote: "You are a cosmic coincidence. Show the stars what human willpower looks like.",
    author: "Carl Sagan"
  }
};

export default function VibeContainer({
  settings,
  children,
  activeTab,
  setActiveTab,
  onModifyDays,
  daysRemaining,
  totalGoalsCount,
  syncId,
  setSyncId,
  onSaveToServer,
  onLoadFromServer,
  onExportBackup,
  onImportBackup,
  syncLoading,
  syncMessage,
  currentUser,
  onSignOut,
  onVibeSelect
}: VibeContainerProps) {
  const quoteObj = QUOTES[settings.vibe] || QUOTES["cosmic-slate"];
  const [localSyncInput, setLocalSyncInput] = useState(syncId);

  const navItems = [
    { id: "home", num: "00.", label: "Home Overview", icon: "🌌" },
    { id: "domains", num: "01.", label: "Daily Rituals", icon: "🛡️" },
    { id: "academic", num: "02.", label: "Curriculum & Syllabus", icon: "📚" },
    { id: "side-skill", num: "03.", label: "Skill & AI Mastery", icon: "⚡" },
    { id: "finance", num: "04.", label: "Daily Expenses", icon: "💸" },
    { id: "ai-coach", num: "05.", label: settings.coachName || "AI Coach", icon: "🤖" },
    { id: "settings", num: "06.", label: "Settings Panel", icon: "⚙" }
  ];

  const handleSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localSyncInput.trim()) return;
    setSyncId(localSyncInput.trim());
    onLoadFromServer(localSyncInput.trim());
  };

  const handleTriggerSave = () => {
    if (!syncId) {
      alert("Please designate a Device Sync ID first in the input field.");
      return;
    }
    onSaveToServer(syncId);
  };

  return (
    <div className={`min-h-screen w-full transition-all duration-300 vibe-${settings.vibe} flex flex-col lg:flex-row p-3 md:p-6 gap-6 md:gap-8 overflow-x-hidden antialiased`}>
      
      {/* Left Sidebar Layout pattern (Super Clean Editorial Aesthetic) */}
      <aside className="w-full lg:w-60 flex flex-col justify-between shrink-0 lg:border-r border-zinc-800/85 pr-0 lg:pr-6 gap-6 pt-2">
        <div className="space-y-6">
          {/* Minimalist Identity Block */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse animate-duration-1000"></span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-50">ESTABLISHED PROTOCOL</span>
            </div>
            <h2 className="font-serif italic text-2xl md:text-3xl tracking-tight text-white leading-tight">
              The Best Version.
            </h2>
            <p className="text-[9px] uppercase tracking-[0.3em] opacity-40 mt-1.5 font-mono">
              UNRECOGNIZABLE IN {settings.totalTransformDays} DAYS
            </p>
          </div>
          
          {/* Vertical Editorial Navigation */}
          <nav className="space-y-2 md:space-y-3">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left group cursor-pointer px-3 py-2 transition-all rounded-lg flex items-center justify-between ${
                    isActive 
                      ? "bg-zinc-900 border-l-4 border-amber-500 text-white font-medium" 
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-xs font-mono font-medium">{item.label}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-50 text-right">{item.num}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Vibe Status Box & Portfolio backup buttons */}
        <div className="space-y-3 pt-6 lg:border-t border-zinc-800/80">
          
          {/* Authenticated User Status Segment */}
          {currentUser && (
            <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 flex items-center justify-between text-xs font-mono animate-fadeIn">
              <div className="truncate pr-1">
                <p className="text-[8px] uppercase tracking-widest text-zinc-500">Active Agent</p>
                <p className="text-[11px] font-bold text-zinc-300 truncate" title={currentUser.email}>{currentUser.name}</p>
              </div>
              <button
                onClick={onSignOut}
                className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-[9px] font-bold text-red-400 hover:text-red-300 transition-all cursor-pointer"
                title="Wipe session and show lockscreen"
              >
                Sign Out
              </button>
            </div>
          )}

          {/* Quick Portfolio Actions */}
          <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/60 space-y-2 text-xs">
            <h4 className="text-[9px] uppercase tracking-widest text-zinc-400 font-mono mb-1">State Portfolio Actions</h4>
            
            <div className="flex gap-2">
              <button
                onClick={onExportBackup}
                className="flex-1 py-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono rounded flex items-center justify-center gap-1.5 text-zinc-250 hover:text-white transition-all text-center"
                title="Export all data, subjects, settings to backup.json"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" /> Export JSON
              </button>
              
              <label className="flex-1 py-1 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-mono rounded flex items-center justify-center gap-1.5 text-zinc-250 hover:text-white transition-all text-center cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-indigo-400" /> Restore
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onImportBackup(f);
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Atmos Selector Module (EPIC QUICK SWAP CONTROLS) */}
          <div className="bg-zinc-950 p-3.5 rounded-lg border border-zinc-800/60 flex items-center justify-between text-xs">
            <div>
              <p className="text-[8px] uppercase tracking-widest opacity-40 font-mono">Atmosphere</p>
              <span className="text-[10px] uppercase font-mono font-bold text-amber-500 tracking-wider">
                {settings.vibe.replace("-", " ")}
              </span>
            </div>
            <div className="flex gap-1.5">
              <button 
                onClick={() => onVibeSelect?.("cosmic-slate")}
                className={`w-3.5 h-3.5 rounded-full bg-indigo-500 cursor-pointer hover:scale-125 transition-all ${settings.vibe === "cosmic-slate" ? "ring-2 ring-white" : ""}`} 
                title="Cosmic Slate (Blue Galaxy)"
              />
              <button 
                onClick={() => onVibeSelect?.("dark-academic")}
                className={`w-3.5 h-3.5 rounded-full bg-amber-600 cursor-pointer hover:scale-125 transition-all ${settings.vibe === "dark-academic" ? "ring-2 ring-white" : ""}`} 
                title="Dark Academic (Classical Leather)"
              />
              <button 
                onClick={() => onVibeSelect?.("cyberpunk-monk")}
                className={`w-3.5 h-3.5 rounded-full bg-pink-500 cursor-pointer hover:scale-125 transition-all ${settings.vibe === "cyberpunk-monk" ? "ring-2 ring-white" : ""}`} 
                title="Cyberpunk Monk (Neon Matrix)"
              />
              <button 
                onClick={() => onVibeSelect?.("zen-minimalist")}
                className={`w-3.5 h-3.5 rounded-full bg-emerald-550 cursor-pointer hover:scale-125 transition-all ${settings.vibe === "zen-minimalist" ? "ring-2 ring-white" : ""}`} 
                title="Zen Minimalist (Bamboo Calm)"
              />
              <button 
                onClick={() => onVibeSelect?.("alpine-focus")}
                className={`w-3.5 h-3.5 rounded-full bg-blue-400 cursor-pointer hover:scale-125 transition-all ${settings.vibe === "alpine-focus" ? "ring-2 ring-white" : ""}`} 
                title="Alpine Focus (Glacial Summit)"
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 flex flex-col min-w-0 pr-0">
        
        {/* Dynamic Header Frame with real watermark identifier */}
        <header className="relative flex flex-col sm:flex-row justify-between items-baseline mb-5 md:mb-6 gap-4 pt-2">
          
          {/* Big number underlay mapping to countdown days */}
          <h1 className="text-[110px] lg:text-[130px] font-serif italic font-light leading-none tracking-tighter opacity-10 absolute -top-14 lg:-top-16 -left-4 pointer-events-none select-none text-zinc-700">
            {Math.max(0, daysRemaining)}
          </h1>
          
          {/* Left panel info */}
          <div className="z-10 relative">
            <p className="text-[9px] uppercase tracking-[0.3em] mb-1.5 text-amber-500 font-mono">
              THE 90-DAY PROTOCOL
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-xl sm:text-2xl md:text-3.5xl font-serif italic tracking-tight font-black pb-0.5 uppercase text-white font-mono leading-none">
                Become Unrecognizable
              </h1>
              <span className="text-[10px] font-mono opacity-60 border border-zinc-800 px-2.5 py-1 rounded-full flex items-center gap-1 bg-zinc-900/60 select-none w-fit">
                CYCLE: 
                <input
                  type="number"
                  value={settings.totalTransformDays}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 90;
                    onModifyDays(val);
                  }}
                  className="w-8 text-center font-bold bg-transparent border-b border-opacity-50 border-white outline-none text-amber-400 font-mono text-center focus:border-amber-400"
                  min="1"
                  max="365"
                /> 
                DAYS
              </span>
            </div>
          </div>

          {/* Right panel summary metrics - clean and bold */}
          <div className="text-left sm:text-right shrink-0 z-10 self-end sm:self-center">
            <p className="text-[9px] uppercase tracking-widest opacity-40 font-mono leading-none">Days Left</p>
            <p className="text-xl md:text-2xl font-serif italic text-amber-400 font-bold block leading-normal">{daysRemaining} Days Remaining</p>
            <span className="text-[10px] opacity-60 font-mono text-emerald-400 bg-emerald-900/20 px-2 py-0.5 rounded border border-emerald-500/20">
              Discipline: {totalGoalsCount.total > 0 ? Math.round((totalGoalsCount.completed / totalGoalsCount.total) * 100) : 0}% Check-ins Done
            </span>
          </div>
        </header>

        {/* POMODORO DEEP FOCUS & INSPIRATION MATRIX BAR */}
        <div className="mb-4 flex flex-col md:flex-row gap-4 items-stretch justify-between">
          <PomodoroTimer coachName={settings.coachName} />
          
          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-850 flex-1 flex flex-col justify-center min-w-0 font-mono text-xs">
            <div className="flex items-center gap-1.5 text-[10px] text-amber-500 font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Transformation Codex Directive</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-relaxed italic pr-2">
              "{quoteObj.quote}"
            </p>
            <p className="text-[9px] text-zinc-500 mt-1 text-right uppercase tracking-widest">
              — {quoteObj.author}
            </p>
          </div>
        </div>

        {/* Cross-device instant Sync bar */}
        <div className="mb-4 bg-zinc-900/40 p-3 rounded-lg border border-zinc-800/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <form onSubmit={handleSyncSubmit} className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <span className="text-xs font-mono text-zinc-300 flex items-center gap-1.5 shrink-0">
              <Cpu className="w-4 h-4 text-amber-500 animate-pulse" /> 
              Device Sync Key:
            </span>
            <input
              type="text"
              placeholder="Enter ID (e.g. james99) to sync data..."
              value={localSyncInput}
              onChange={(e) => setLocalSyncInput(e.target.value)}
              className="flex-1 max-w-sm px-3 py-1 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none text-white focus:border-amber-500 font-mono"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={syncLoading}
                className="px-3.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                {syncLoading ? "Loading..." : "Load State"}
              </button>
              {syncId && (
                <button
                  type="button"
                  onClick={handleTriggerSave}
                  disabled={syncLoading}
                  className="px-3.5 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded text-[11px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer"
                >
                  Save Current
                </button>
              )}
            </div>
          </form>

          {syncMessage ? (
            <div className="text-[11px] font-mono text-amber-400 bg-amber-950/40 px-3 py-1 rounded border border-amber-500/20 self-center">
              {syncMessage}
            </div>
          ) : syncId ? (
            <div className="text-[10px] font-mono text-zinc-500 self-center">
              Synced with ID: <span className="text-emerald-400 font-bold">{syncId}</span>
            </div>
          ) : (
            <div className="text-[10px] font-mono text-zinc-500 self-center">
              Not Synced (Local)
            </div>
          )}
        </div>

        {/* Rendering Content area holding exact components - pristine simple background */}
        <div className="flex-1 bg-zinc-950/90 border border-zinc-800/80 rounded-xl p-4 md:p-6 shadow-2xl relative overflow-y-auto max-h-[calc(100vh-270px)] lg:max-h-[calc(100vh-250px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
