import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ModuleType, RecentSession } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function saveRecentSession(workspaceType: ModuleType, title: string, state: any) {
  if (typeof window === "undefined") return;
  const saved = localStorage.getItem("sciforge_recent_sessions");
  let sessions: RecentSession[] = [];
  if (saved) {
    try {
      sessions = JSON.parse(saved);
    } catch (err) {
      console.error(err);
    }
  }

  // Create a clean new session object
  const newSession: RecentSession = {
    id: `sess_${Date.now()}`,
    title: title || "Active Workshop State",
    timestamp: new Date().toLocaleTimeString([], { month: "short", day: "numeric", hour: '2-digit', minute: '2-digit' }),
    workspaceType,
    state
  };

  // Prevent dual duplicates of the exact same title & workspace in the list to preserve UI neatness
  sessions = sessions.filter(s => s.workspaceType !== workspaceType || s.title !== title);
  sessions = [newSession, ...sessions].slice(0, 50);

  localStorage.setItem("sciforge_recent_sessions", JSON.stringify(sessions));
}

export interface PortfolioItem {
  id: string;
  type: "note" | "quiz" | "scribble" | "scientist" | "dependencymap" | "studyplan";
  title: string;
  timestamp: string;
  data: any;
}

export function addToPortfolio(type: "note" | "quiz" | "scribble" | "scientist" | "dependencymap" | "studyplan", title: string, data: any) {
  if (typeof window === "undefined") return;
  try {
    const saved = localStorage.getItem("sciforge_research_portfolio");
    let portfolio: PortfolioItem[] = [];
    if (saved) {
      portfolio = JSON.parse(saved);
    }
    // Prevent direct duplicate copies of identical assets
    portfolio = portfolio.filter(p => !(p.type === type && p.title.toLowerCase() === title.toLowerCase()));

    const newItem: PortfolioItem = {
      id: `port_${type}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type,
      title,
      timestamp: new Date().toLocaleDateString(undefined, { 
        month: "short", 
        day: "numeric", 
        hour: "2-digit", 
        minute: "2-digit" 
      }),
      data
    };

    portfolio.unshift(newItem);
    localStorage.setItem("sciforge_research_portfolio", JSON.stringify(portfolio));
    
    // Also save in recent sessions for integration
    saveRecentSession(type as ModuleType, `Portfolio Indexed: ${title}`, data);
  } catch (err) {
    console.error("Failed to append to central portfolio database:", err);
  }
}

