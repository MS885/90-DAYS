import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, AlertTriangle, Coffee, Sparkles, Brain, Clock, Plus, Minus, Volume2, VolumeX } from "lucide-react";

interface PomodoroTimerProps {
  coachName?: string;
  onSessionComplete?: (durationMinutes: number) => void;
}

export default function PomodoroTimer({ coachName = "AI Coach", onSessionComplete }: PomodoroTimerProps) {
  // Config state
  const [mode, setMode] = useState<"focus" | "break">("focus");
  const [duration, setDuration] = useState<number>(25); // In minutes
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60); // In seconds
  const [isActive, setIsActive] = useState<boolean>(false);
  const [completedSessionsToday, setCompletedSessionsToday] = useState<number>(() => {
    const saved = localStorage.getItem("unrec_pomo_completed_today");
    if (saved) {
      try {
        const { date, count } = JSON.parse(saved);
        if (date === new Date().toISOString().split("T")[0]) {
          return count;
        }
      } catch (e) {
        return 0;
      }
    }
    return 0;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync timeLeft when preset duration changes (only if timer is not active/running)
  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isActive]);

  // Handle ticking
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            triggerCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode, duration]);

  // Web Audio Synth to create an elegant, pure digital tone on completion
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Series of nice chime notes
      const playTone = (freq: number, delay: number, dur: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
        
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime + delay);
        gainNode.gain.linearRampToValueAtTime(0.15, audioCtx.currentTime + delay + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + dur);
        
        osc.start(audioCtx.currentTime + delay);
        osc.stop(audioCtx.currentTime + delay + dur);
      };
      
      if (mode === "focus") {
        // High ascending pleasant chime for focus lock
        playTone(523.25, 0, 0.4); // C5
        playTone(659.25, 0.15, 0.4); // E5
        playTone(783.99, 0.3, 0.6); // G5
      } else {
        // Low cozy chime for break starting
        playTone(440.00, 0, 0.5); // A4
        playTone(349.23, 0.2, 0.7); // F4
      }
    } catch (e) {
      console.warn("Web Audio API not allowed or supported yet on user interaction.", e);
    }
  };

  const triggerCompletion = () => {
    setIsActive(false);
    playBeep();

    if (mode === "focus") {
      // Record completed focus session
      const newCount = completedSessionsToday + 1;
      setCompletedSessionsToday(newCount);
      localStorage.setItem("unrec_pomo_completed_today", JSON.stringify({
        date: new Date().toISOString().split("T")[0],
        count: newCount
      }));

      if (onSessionComplete) {
        onSessionComplete(duration);
      }

      // Switch to break automatically
      setMode("break");
      setDuration(5);
      setTimeLeft(5 * 60);
    } else {
      // Switch back to focus automatically
      setMode("focus");
      setDuration(25);
      setTimeLeft(25 * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };

  const setPreset = (mins: number) => {
    setIsActive(false);
    setDuration(mins);
    setTimeLeft(mins * 60);
  };

  const adjustMinutes = (delta: number) => {
    setIsActive(false);
    const newMins = Math.max(1, Math.min(180, duration + delta));
    setDuration(newMins);
    setTimeLeft(newMins * 60);
  };

  // Format Helper
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const percentage = (timeLeft / (duration * 60)) * 100;

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row items-center gap-4 justify-between w-full md:max-w-xl z-20 shadow-md">
      {/* Visual countdown progress indicators */}
      <div className="flex items-center gap-4">
        <div className="relative shrink-0 w-14 h-14 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-zinc-805"
              strokeWidth="2.5"
              stroke="rgba(63, 63, 70, 0.4)"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={`transition-all duration-300 ${
                mode === "focus" ? "text-amber-500" : "text-emerald-400"
              }`}
              strokeDasharray={`${100 - percentage}, 100`}
              strokeWidth="2.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            {mode === "focus" ? (
              <Brain className="w-4 h-4 text-amber-500 animate-pulse" />
            ) : (
              <Coffee className="w-4 h-4 text-emerald-400" />
            )}
          </div>
        </div>

        {/* Digital Time Reading */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-mono font-bold tracking-widest text-white leading-none">
              {formatTime(timeLeft)}
            </span>
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
              mode === "focus" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            }`}>
              {mode}
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 mt-1 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-500" />
            <span>Today: {completedSessionsToday} cycles deep</span>
          </div>
        </div>
      </div>

      {/* presets selector blocks */}
      <div className="flex flex-col gap-2 items-center md:items-end w-full md:w-auto">
        <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-850">
          <button
            onClick={() => setPreset(25)}
            className={`px-2 py-1 text-[10px] font-mono rounded transition-all ${
              duration === 25 ? "bg-amber-505 text-white font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            25m
          </button>
          <button
            onClick={() => setPreset(50)}
            className={`px-2 py-1 text-[10px] font-mono rounded transition-all ${
              duration === 50 ? "bg-amber-505 text-white font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            50m
          </button>
          <button
            onClick={() => setPreset(90)}
            className={`px-2 py-1 text-[10px] font-mono rounded transition-all ${
              duration === 90 ? "bg-amber-505 text-white font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            90m
          </button>
          
          <div className="h-4 w-px bg-zinc-800 mx-1" />
          
          <button 
            disabled={isActive}
            onClick={() => adjustMinutes(-5)}
            className="p-1 hover:text-white text-zinc-500 disabled:opacity-30 cursor-pointer"
            title="Decrease 5m"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-[10px] font-mono font-bold text-zinc-300 min-w-4 text-center">{duration}m</span>
          <button 
            disabled={isActive}
            onClick={() => adjustMinutes(5)}
            className="p-1 hover:text-white text-zinc-500 disabled:opacity-30 cursor-pointer"
            title="Increase 5m"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Play control, mute, reset buttons row */}
        <div className="flex items-center justify-between w-full md:justify-end gap-3 md:gap-4 mt-1">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 text-zinc-400 hover:text-white rounded transition-all cursor-pointer"
            title={soundEnabled ? "Mute audio focus cues" : "Unmute audio focus cues"}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-zinc-300" /> : <VolumeX className="w-3.5 h-3.5 text-zinc-500" />}
          </button>

          <div className="flex gap-1.5">
            <button
              onClick={resetTimer}
              className="p-1.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono font-bold rounded flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={toggleTimer}
              className={`p-1.5 px-4 rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all ${
                isActive 
                  ? "bg-red-650/40 border border-red-500/30 text-red-200 hover:bg-red-600 hover:text-white"
                  : "bg-amber-500 hover:bg-amber-400 text-black shadow-lg"
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> Focus
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
