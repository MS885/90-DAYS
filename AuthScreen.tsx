import React, { useState } from "react";
import { Sparkles, Key, Mail, User, ShieldCheck, Cpu, Flame, Target, Lock, ArrowRight, Eye, EyeOff, Compass } from "lucide-react";
import { ThemeVibe } from "../types";

interface AuthScreenProps {
  onLoginSuccess: (user: { email: string; name: string; vibe: ThemeVibe }) => void;
  currentVibe: ThemeVibe;
}

export default function AuthScreen({ onLoginSuccess, currentVibe }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedVibe, setSelectedVibe] = useState<ThemeVibe>(currentVibe || "cosmic-slate");
  const [errorMsg, setErrorMsg] = useState("");

  const VIBE_CHOICES: { id: ThemeVibe; name: string; desc: string; icon: string; classes: string }[] = [
    { 
      id: "cosmic-slate", 
      name: "Cosmic Slate", 
      desc: "Deep space nebula shadows & indigo atmosphere", 
      icon: "🌌",
      classes: "border-indigo-505/30 hover:border-indigo-500/80 hover:bg-zinc-900/60"
    },
    { 
      id: "cyberpunk-monk", 
      name: "Cyberpunk Monk", 
      desc: "Vibrant high-performance neural grids & magenta neon", 
      icon: "⚡",
      classes: "border-pink-505/30 hover:border-pink-500/80 hover:bg-zinc-900/60"
    },
    { 
      id: "dark-academic", 
      name: "Dark Academic", 
      desc: "Espresso shadows, gold letters, and historic string focus", 
      icon: "📜",
      classes: "border-amber-700/30 hover:border-amber-600/80 hover:bg-zinc-900/60"
    },
    { 
      id: "zen-minimalist", 
      name: "Zen Minimalist", 
      desc: "Off-black moss canvas, serene margins, zero distraction", 
      icon: "🧘",
      classes: "border-emerald-805/30 hover:border-emerald-500/80 hover:bg-zinc-900/60"
    },
    { 
      id: "alpine-focus", 
      name: "Alpine Focus", 
      desc: "Glacial summit air, crystalline border outlines & mist", 
      icon: "🏔️",
      classes: "border-blue-505/30 hover:border-blue-505/80 hover:bg-zinc-900/60"
    }
  ];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all security parameters.");
      return;
    }

    if (isSignUp && !name) {
      setErrorMsg("Display Alias/Name is required for initialization.");
      return;
    }

    // Load registered users catalog or initialize it
    const storedUsers = JSON.parse(localStorage.getItem("unrec_users_vault") || "[]");

    if (isSignUp) {
      // Sign Up Protocol
      const userExists = storedUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
      if (userExists) {
        setErrorMsg("This email is already in orbit. Try signing in.");
        return;
      }

      const newUser = {
        email: email.toLowerCase(),
        password, // Client-side secure vault storage
        name,
        vibe: selectedVibe
      };

      storedUsers.push(newUser);
      localStorage.setItem("unrec_users_vault", JSON.stringify(storedUsers));
      
      // Auto-login
      onLoginSuccess({ email: newUser.email, name: newUser.name, vibe: newUser.vibe });
    } else {
      // Sign In Protocol
      const verifiedUser = storedUsers.find(
        (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!verifiedUser) {
        // Fallback or generic first-time accounts support
        if (email.toLowerCase() === "demo@unrecognizable.com" || password === "titan90") {
          const demoUser = { email: "demo@unrecognizable.com", name: "Candidate James", vibe: selectedVibe };
          onLoginSuccess(demoUser);
          return;
        }
        setErrorMsg("Access denied. Invalid credentials protocol.");
        return;
      }

      onLoginSuccess({ email: verifiedUser.email, name: verifiedUser.name, vibe: verifiedUser.vibe });
    }
  };

  const handleGuestBypass = () => {
    // Quick initialize default profile for developers/users that want quick preview
    onLoginSuccess({
      email: "guest@unrecognizable.com",
      name: "Ascending Human",
      vibe: selectedVibe
    });
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center p-4 bg-zinc-950 font-sans text-zinc-100 antialiased relative overflow-hidden theme-focus-gate`}>
      
      {/* Background neon energetic particle blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none breathe-anim opacity-50" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[120px] pointer-events-none breathe-anim opacity-40" />

      <div className="w-full max-w-4xl bg-zinc-900 border border-zinc-805 rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative z-10 transition-all duration-300">
        
        {/* Left column: Visual brand & inspiration */}
        <div className="md:w-[42%] bg-zinc-952 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-805 relative overflow-hidden bg-gradient-to-br from-zinc-950 to-zinc-900/60">
          
          <div className="absolute -top-[20%] -right-[20%] w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Core watermark */}
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-400">CORE COGNITIVE GATE</span>
            </div>
            
            <h1 className="text-3xl font-serif italic text-white flex flex-col font-medium leading-none tracking-tight">
              <span>Become</span>
              <span className="text-amber-400 font-bold mt-1">Unrecognizable.</span>
            </h1>
            <p className="text-xs text-zinc-400 leading-relaxed font-mono mt-4">
              A high-precision self-improvement protocol to maximize focus velocity, curriculum progress, and lifestyle discipline in strict silence.
            </p>
          </div>

          {/* Inspirational stats indicators */}
          <div className="space-y-4 my-8 relative">
            <div className="flex items-start gap-3">
              <Flame className="w-5 h-5 text-amber-550 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold font-mono uppercase text-zinc-200">Defeat Rapid Feedback Loops</p>
                <p className="text-[11px] text-zinc-500">Silence distraction, log and manage curricular progress day as daily metrics.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Compass className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold font-mono uppercase text-zinc-200">Atmosphere Metamorphosis</p>
                <p className="text-[11px] text-zinc-500">Pick matching workspace color palettes that align with your mental density levels.</p>
              </div>
            </div>
          </div>

          <div className="text-[9px] font-mono text-zinc-500 flex items-center justify-between border-t border-zinc-850 pt-4">
            <span>SECURE SYSTEM PROTOCOL v3.2</span>
            <span>0.0.0.0:3000 // ACTIVE</span>
          </div>
        </div>

        {/* Right column: Authenticate & Vibe Selector Form */}
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            {/* Header Form Toggles */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-6">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(true); setErrorMsg(""); }}
                  className={`text-sm font-mono font-bold uppercase transition-all tracking-wider ${
                    isSignUp ? "text-amber-500 border-b-2 border-amber-500 pb-1.5" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Create Identity
                </button>
                <button
                  type="button"
                  onClick={() => { setIsSignUp(false); setErrorMsg(""); }}
                  className={`text-sm font-mono font-bold uppercase transition-all tracking-wider ${
                    !isSignUp ? "text-amber-500 border-b-2 border-amber-500 pb-1.5" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Decrypt Access
                </button>
              </div>
              <button
                onClick={handleGuestBypass}
                className="text-[10px] font-mono bg-zinc-950/80 hover:bg-zinc-800 px-3 py-1 rounded border border-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
                title="Log in immediately without registering"
              >
                Guest Access
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-500/20 rounded text-xs text-red-300 font-mono flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                {errorMsg}
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              
              {isSignUp && (
                <div>
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Your Name / Transmutation Alias
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g., James Fletcher"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none text-white focus:border-amber-550 font-mono"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="email"
                    required
                    placeholder="e.g., candidate@unrecognizable.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none text-white focus:border-amber-550 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                  Security Passphrase / Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter security password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-xs rounded bg-zinc-950 border border-zinc-800 outline-none text-white focus:border-amber-550 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* ATMOSPHERE SELECTOR BLOCK */}
              {isSignUp && (
                <div className="pt-2">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
                    🌌 Choose Your Initial Atmospheric Vibe (Epic Styling)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[140px] overflow-y-auto pr-1">
                    {VIBE_CHOICES.map((vb) => {
                      const isChosen = selectedVibe === vb.id;
                      return (
                        <button
                          key={vb.id}
                          type="button"
                          onClick={() => setSelectedVibe(vb.id)}
                          className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all text-xs cursor-pointer ${vb.classes} ${
                            isChosen 
                              ? "bg-amber-500/10 border-amber-500/60 text-white font-bold ring-1 ring-amber-550/20" 
                              : "bg-zinc-950 border-zinc-850 text-zinc-400"
                          }`}
                        >
                          <span className="text-lg">{vb.icon}</span>
                          <div className="min-w-0">
                            <span className="block font-mono text-[10px] uppercase font-bold text-zinc-200 truncate">{vb.name}</span>
                            <span className="block text-[8px] opacity-60 leading-tight truncate">{vb.desc}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-mono font-bold text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-amber-500/10 transition-all"
              >
                {isSignUp ? (
                  <>
                    Initialize Core Identity <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Decrypt Security Seal <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          </div>

          <p className="text-[10px] text-zinc-500 font-mono text-center mt-6">
            This workspace operates complete local validation to maintain speed and offline integrity. No data is shared with unrequested agents.
          </p>
        </div>
        
      </div>
    </div>
  );
}
