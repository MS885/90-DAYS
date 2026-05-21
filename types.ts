export interface GoalItem {
  id: string;
  text: string;
  completed: boolean;
  streak?: number;
}

export interface Domain {
  id: string;
  title: string;
  icon: string; // lucide icon name
  description: string;
  goals: GoalItem[];
  isCustom?: boolean;
}

export interface CurriculumSubject {
  id: string;
  name: string;
  currentProgressUnits: number;
  totalUnits: number;
  gradeTarget: string;
}

export interface SideSkillCourse {
  id: string;
  title: string;
  provider: string;
  progressPercentage: number;
  nextConcept: string;
  completed: boolean;
}

export interface DailyExpense {
  id: string;
  description: string;
  amount: number;
  category: string;
  timestamp: string; // ISO string
}

export interface ExamStatus {
  subject: string;
  date: string; // YYYY-MM-DD
}

export interface CoachMessage {
  id: string;
  sender: "user" | "coach";
  text: string;
  timestamp: string;
}

export interface AIRecommendation {
  techName: string;
  tag: string;
  whyItMatters: string;
  curriculum: string[];
  projectDescription: string;
}

export type ThemeVibe = 
  | "dark-academic" 
  | "cyberpunk-monk" 
  | "zen-minimalist" 
  | "alpine-focus" 
  | "cosmic-slate";

export interface UserSettings {
  vibe: ThemeVibe;
  coachName: string;
  totalTransformDays: number;
  language: string;
  currencySymbol: string;
  startDate: string; // ISO string format when they started the 90 days
}
