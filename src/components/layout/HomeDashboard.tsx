import { useState, useEffect, useRef, useCallback } from "react";
import { 
  MessageSquare, BookOpen, HelpCircle, Database, Activity, Network, 
  GraduationCap, FolderArchive, Sparkles, ChevronRight, Clock, 
  FileText, BrainCircuit, ArrowRight, Target, TrendingUp, BookMarked, 
  FlaskConical, Zap, Activity as ActivityIcon, Flame, Check, Upload,
  PanelLeft, Clock3, DoorOpen, ArrowUp, Menu
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { ModuleType, ChatMessage } from "../../types";
import { updateTelemetryOnAction, getTelemetry } from "../../lib/telemetry";

// Premium Neural Helix Logo - Adaptive Mentor
const NeuralHelixLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="helixGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22C55E" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.5" />
      </linearGradient>
      <linearGradient id="helixGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#22C55E" stopOpacity="0.4" />
      </linearGradient>
      <filter id="helixGlow">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* DNA Helix strands */}
    <path d="M12 6C16 10 20 14 24 18C20 22 16 26 12 30" stroke="url(#helixGrad1)" strokeWidth="1.5" strokeLinecap="round" filter="url(#helixGlow)" />
    <path d="M24 6C20 10 16 14 12 18C16 22 20 26 24 30" stroke="url(#helixGrad2)" strokeWidth="1.5" strokeLinecap="round" filter="url(#helixGlow)" />
    {/* Base pairs */}
    <path d="M14 10H22M11 15H25M14 20H22M11 25H25" stroke="#22C55E" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
    {/* Neural nodes */}
    <circle cx="12" cy="6" r="1.5" fill="#4ADE80" />
    <circle cx="24" cy="18" r="2" fill="#22C55E" filter="url(#helixGlow)" />
    <circle cx="12" cy="30" r="1.5" fill="#4ADE80" />
    <circle cx="18" cy="12" r="1" fill="#22C55E" opacity="0.6" />
    <circle cx="18" cy="24" r="1" fill="#22C55E" opacity="0.6" />
    {/* Center */}
    <circle cx="18" cy="18" r="2.5" fill="#22C55E" filter="url(#helixGlow)" />
    <circle cx="18" cy="18" r="1" fill="#4ADE80" />
  </svg>
);

// Premium Wireframe Flame - Learning Streak
const WireframeFlameLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="flameGrad" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#FFB547" stopOpacity="0.6" />
        <stop offset="100%" stopColor="#FFB547" stopOpacity="0.3" />
      </linearGradient>
      <filter id="flameGlow">
        <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M12 2C8 6 6 10 6 13C6 17 8 20 12 22C16 20 18 17 18 13C18 10 16 6 12 2Z" stroke="url(#flameGrad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#flameGlow)" />
    <path d="M12 5C10 8 9 10 9 12C9 14.5 10 16 12 17.5" stroke="#FF7A00" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
    <path d="M12 5C14 8 15 10 15 12C15 14.5 14 16 12 17.5" stroke="#FFB547" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
    <circle cx="12" cy="14" r="2" stroke="#FF7A00" strokeWidth="0.8" strokeOpacity="0.6" />
    <circle cx="12" cy="14" r="0.8" fill="#FF7A00" />
  </svg>
);

// Premium Wireframe Brain - Quick-Scan
const WireframeBrainLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#22C55E" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#4ADE80" stopOpacity="0.4" />
      </linearGradient>
      <filter id="brainGlow">
        <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <path d="M12 3C8 3 5 5 4 8C3 10 4 12 4 12C3 14 4 16 5 17C4 19 6 21 8 21C9 21 10 20 11 19C11 20 12 21 12 21C12 21 13 20 13 19C14 20 15 21 16 21C18 21 20 19 19 17C20 16 21 14 20 12C20 12 21 10 20 8C19 5 16 3 12 3Z" stroke="url(#brainGrad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#brainGlow)" />
    <path d="M8 8C10 9 11 11 11 12" stroke="#22C55E" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
    <path d="M16 8C14 9 13 11 13 12" stroke="#22C55E" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
    <circle cx="9" cy="10" r="1" fill="#22C55E" opacity="0.6" />
    <circle cx="15" cy="10" r="1" fill="#22C55E" opacity="0.6" />
    <circle cx="12" cy="12" r="1.5" fill="#4ADE80" filter="url(#brainGlow)" />
    <circle cx="12" cy="12" r="0.5" fill="white" />
  </svg>
);

// Premium Custom SVG Icons for Workspace Cards
const PremiumIcons = {
  chat: ({ className, color }: { className?: string; color: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <filter id="chatGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <rect x="2" y="4" width="20" height="14" rx="3" fill="url(#chatGrad)" />
      <path d="M6 8h12M6 12h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" filter="url(#chatGlow)" />
      <circle cx="18" cy="10" r="1" fill={color} />
      <circle cx="18" cy="14" r="1" fill={color} opacity="0.6" />
      <path d="M20 16l2 2-2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#chatGlow)" />
    </svg>
  ),
  scribble: ({ className, color }: { className?: string; color: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="16" height="16" rx="3" fill="url(#brainGrad)" />
      <path d="M12 6C9 6 7 8 7 10.5c0 1.5.5 2.5 1.5 3.5l-1 4 2.5-2c.5.5 1 .5 2 .5s1.5 0 2-.5l2.5 2-1-4c1-1 1.5-2 1.5-3.5 0-2.5-2-4.5-5-4.5z" stroke={color} strokeWidth="1.2" fill={color} fillOpacity="0.2" />
      <path d="M17 3L21 7M19 1L23 5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  scientist: ({ className, color }: { className?: string; color: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="atomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="3" fill={color} fillOpacity="0.3" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke={color} strokeWidth="1.2" strokeOpacity="0.6" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="2" fill={color} />
      <circle cx="12" cy="8" r="0.8" fill={color} />
      <circle cx="15.5" cy="14" r="0.8" fill={color} />
      <circle cx="8.5" cy="14" r="0.8" fill={color} />
    </svg>
  ),
  notes: ({ className, color }: { className?: string; color: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="notesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="4" y="3" width="16" height="18" rx="2" fill="url(#notesGrad)" />
      <path d="M8 8h8M8 12h6M8 16h4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3V7H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="5" r="1" fill={color} />
    </svg>
  ),
  quiz: ({ className, color }: { className?: string; color: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="quizGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#quizGrad)" stroke={color} strokeWidth="1.2" />
      <text x="12" y="16" textAnchor="middle" fill={color} fontSize="10" fontWeight="bold">?</text>
      <path d="M9 9l6 6M15 9l-6 6" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    </svg>
  ),
  dependencymap: ({ className, color }: { className?: string; color: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#mapGrad)" />
      <circle cx="12" cy="6" r="2" fill={color} />
      <circle cx="6" cy="12" r="2" fill={color} />
      <circle cx="18" cy="12" r="2" fill={color} />
      <circle cx="9" cy="18" r="2" fill={color} />
      <circle cx="15" cy="18" r="2" fill={color} />
      <path d="M12 8v2M10 12l-2-2M14 12l2-2M9 14v2M15 14v2M11 16l-1 1M13 16l1 1" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  progress: ({ className, color }: { className?: string; color: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M4 21V10L12 3L20 10V21H14V14H10V21H4Z" fill="url(#progressGrad)" stroke={color} strokeWidth="1.2" />
      <path d="M12 3L12 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="2" fill={color} />
    </svg>
  ),
  portfolio: ({ className, color }: { className?: string; color: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="portfolioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M3 7C3 5.89543 3.89543 5 5 5H9L11 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" fill="url(#portfolioGrad)" stroke={color} strokeWidth="1.2" />
      <path d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7" stroke={color} strokeWidth="1.2" />
      <path d="M3 12H21" stroke={color} strokeWidth="1" opacity="0.5" />
    </svg>
  ),
} as const;

type WorkspaceIconKey = keyof typeof PremiumIcons;

// Premium Custom SVG Icons for Telemetry/Stats Cards
// Data-focused with Scientific Orange (#FF7A00) and Amber (#FFB547) duo-tone glow
const PremiumStatsIcons = {
  questionsSolved: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="statsTargetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.05" />
        </linearGradient>
        <filter id="statsTargetGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Target matrix rings */}
      <circle cx="12" cy="12" r="9" fill="url(#statsTargetGrad)" />
      <circle cx="12" cy="12" r="9" stroke="#FF7A00" strokeWidth="1.5" strokeOpacity="0.6" filter="url(#statsTargetGlow)" />
      <circle cx="12" cy="12" r="6" stroke="#FF7A00" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="12" cy="12" r="3" stroke="#FF7A00" strokeWidth="1" strokeOpacity="0.3" />
      {/* Center checkmark badge */}
      <circle cx="12" cy="12" r="3.5" fill="#FF7A00" />
      <path d="M10 12l1.5 1.5L14 10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  notesGenerated: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="statsNotesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB547" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFB547" stopOpacity="0.05" />
        </linearGradient>
        <filter id="statsNotesGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Stacked notebook/Data index cards */}
      <rect x="5" y="6" width="14" height="12" rx="1.5" fill="url(#statsNotesGrad)" stroke="#FFB547" strokeWidth="1" strokeOpacity="0.5" />
      <rect x="4" y="4" width="14" height="12" rx="1.5" fill="url(#statsNotesGrad)" stroke="#FFB547" strokeWidth="1.2" strokeOpacity="0.6" filter="url(#statsNotesGlow)" />
      <rect x="3" y="2" width="14" height="12" rx="1.5" fill="url(#statsNotesGrad)" stroke="#FFB547" strokeWidth="1.2" strokeOpacity="0.8" />
      {/* Data index lines */}
      <path d="M6 6h8M6 9h6M6 12h4" stroke="#FFB547" strokeWidth="1" strokeLinecap="round" opacity="0.8" />
      {/* Analytical badge */}
      <circle cx="17" cy="5" r="2" fill="#FFB547" />
      <path d="M16.5 5l.5.5.5-.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  ),
  quizzesCompleted: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 28 28" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="statsQuizGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB547" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#FFB547" stopOpacity="0.1" />
        </linearGradient>
        <filter id="statsQuizGlow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="trophyShadow">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FFB547" floodOpacity="0.4"/>
        </filter>
      </defs>
      {/* Trophy/Achievement emblem - scaled up */}
      <path d="M9 5h10v2.5c0 2.5-2 5-5 5s-5-2.5-5-5V5z" fill="url(#statsQuizGrad)" stroke="#FFB547" strokeWidth="1.8" strokeLinejoin="round" filter="url(#trophyShadow)" />
      <path d="M9 7H6c0 2.5 2 5 3.5 5" stroke="#FFB547" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M19 7h3c0 2.5-2 5-3.5 5" stroke="#FFB547" strokeWidth="1.4" strokeLinecap="round" />
      {/* Trophy handles */}
      <path d="M10 5V2.5M18 5V2.5" stroke="#FFB547" strokeWidth="1.4" strokeLinecap="round" />
      {/* Trophy base */}
      <rect x="12" y="12.5" width="4" height="2.5" fill="#FFB547" opacity="0.7" />
      <rect x="9.5" y="15" width="9" height="2.5" rx="0.6" fill="#FFB547" />
      {/* Achievement star - larger */}
      <path d="M14 2.5l.8 2.2h2.4l-2 1.5.8 2.2-2-1.5-2 1.5.8-2.2-2-1.5h2.4z" fill="#FFB547" filter="url(#statsQuizGlow)" />
    </svg>
  ),
  researchProjects: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="statsAtomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.05" />
        </linearGradient>
        <filter id="statsAtomGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Microscope lens grid / nested node graph */}
      <rect x="4" y="4" width="16" height="16" rx="3" fill="url(#statsAtomGrad)" />
      <rect x="4" y="4" width="16" height="16" rx="3" stroke="#FF7A00" strokeWidth="1.2" strokeOpacity="0.5" filter="url(#statsAtomGlow)" />
      {/* Nested hexagonal nodes */}
      <circle cx="12" cy="8" r="2.5" fill="#FF7A00" fillOpacity="0.6" stroke="#FF7A00" strokeWidth="1" />
      <circle cx="7" cy="13" r="2" fill="#FF7A00" fillOpacity="0.4" stroke="#FF7A00" strokeWidth="1" />
      <circle cx="17" cy="13" r="2" fill="#FF7A00" fillOpacity="0.4" stroke="#FF7A00" strokeWidth="1" />
      <circle cx="12" cy="17" r="1.5" fill="#FF7A00" fillOpacity="0.3" stroke="#FF7A00" strokeWidth="0.8" />
      {/* Connection lines */}
      <path d="M12 10.5v2M10 12.5l-2 .5M14 12.5l2 .5M12 15.5v1.5" stroke="#FF7A00" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
    </svg>
  ),
} as const;

type StatsIconKey = keyof typeof PremiumStatsIcons;

interface HomeDashboardProps {
  onRoute: (module: ModuleType) => void;
  onStartChat: (initialMessage?: string) => void;
  chatMessages: ChatMessage[];
  onViewConversations: () => void;
  onTransferToWorkspace: (workspace: ModuleType, data?: any) => void;
}

interface WorkspaceCard {
  id: ModuleType;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; color: string }>;
  color: string;
  hoverColor: string;
}

const WORKSPACE_CARDS: WorkspaceCard[] = [
  {
    id: "chat",
    title: "Core Intelligence Console",
    description: "Collaborate with your adaptive STEM mentor",
    icon: PremiumIcons.chat,
    color: "#FF7A00",
    hoverColor: "hover:border-[#FF7A00]"
  },
  {
    id: "scribble",
    title: "Scribble Analysis Lab",
    description: "Detailed reasoning and error correction",
    icon: PremiumIcons.scribble,
    color: "#22C55E",
    hoverColor: "hover:border-[#22C55E]"
  },
  {
    id: "scientist",
    title: "Quantum Research Engine",
    description: "Deep academic investigations",
    icon: PremiumIcons.scientist,
    color: "#22C55E",
    hoverColor: "hover:border-[#22C55E]"
  },
  {
    id: "notes",
    title: "Scientific Documentation Lab",
    description: "Revision notes and exam prep",
    icon: PremiumIcons.notes,
    color: "#FFB547",
    hoverColor: "hover:border-[#FFB547]"
  },
  {
    id: "quiz",
    title: "Mastery Assessment Engine",
    description: "Custom quizzes with difficulty levels",
    icon: PremiumIcons.quiz,
    color: "#FFB547",
    hoverColor: "hover:border-[#FFB547]"
  },
  {
    id: "dependencymap",
    title: "Concept Dependency Map",
    description: "Visualize concept relationships",
    icon: PremiumIcons.dependencymap,
    color: "#FFB547",
    hoverColor: "hover:border-[#FFB547]"
  },
  {
    id: "progress",
    title: "Academic Propulsion",
    description: "Personalized study roadmaps",
    icon: PremiumIcons.progress,
    color: "#FF7A00",
    hoverColor: "hover:border-[#FF7A00]"
  },
  {
    id: "portfolio",
    title: "Research Portfolio",
    description: "All your artifacts in one place",
    icon: PremiumIcons.portfolio,
    color: "#A1A1AA",
    hoverColor: "hover:border-[#A1A1AA]"
  },
];

const SUGGESTIONS = [
  { text: "Teach me Photosynthesis", icon: "🌿" },
  { text: "Create a quiz on Physics", icon: "⚡" },
  { text: "Generate study notes", icon: "📝" },
  { text: "Explain Newton's Laws", icon: "🔬" },
];

export function HomeDashboard({ onRoute, onStartChat, chatMessages, onViewConversations, onTransferToWorkspace }: HomeDashboardProps) {
  const [telemetry, setTelemetry] = useState(getTelemetry());
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem("sciforge_streak") || "0", 10);
  });
  const [showStreakBurst, setShowStreakBurst] = useState(false);
  const [clipboardText, setClipboardText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  useEffect(() => {
    const saved = localStorage.getItem("sciforge_recent_sessions");
    if (saved) {
      try {
        setRecentSessions(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading sessions:", e);
      }
    }
    
    const interval = setInterval(() => {
      setTelemetry(getTelemetry());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  // Handle scroll for back-to-top button visibility
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    // Show button when scrolled more than 300px
    setShowBackToTop(scrollTop > 300);
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  // Handle suggestion click - fill input and route to chat
  const handleSuggestionClick = useCallback((text: string) => {
    setChatInput(text);
    onStartChat(text);
    onRoute("chat");
    inputRef.current?.focus();
  }, [onStartChat, onRoute]);

  // Handle send message - route to chat with input
  const handleSendMessage = useCallback(() => {
    if (chatInput.trim()) {
      onStartChat(chatInput.trim());
      onRoute("chat");
    }
  }, [chatInput, onStartChat, onRoute]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle streak check-in with particle burst
  const handleStreakCheckIn = () => {
    const newStreak = streak + 1;
    setStreak(newStreak);
    localStorage.setItem("sciforge_streak", newStreak.toString());
    setShowStreakBurst(true);
    updateTelemetryOnAction("streak_checkin");
    pendo.track("streak_check_in", {
      streak_count: newStreak
    });
    setTimeout(() => setShowStreakBurst(false), 1000);
  };

  // Handle recent chat click - resume conversation
  const handleRecentChatClick = useCallback((session: any) => {
    const moduleMap: Record<string, ModuleType> = {
      'chat': 'chat', 'notes': 'notes', 'quiz': 'quiz',
      'scribble': 'scribble', 'scientist': 'scientist',
      'simulation': 'simulation', 'dependencymap': 'dependencymap'
    };
    const targetModule = moduleMap[session.type] || 'chat';
    
    // Restore conversation state and route
    if (session.state) {
      // Store the session state to be picked up by the target workspace
      localStorage.setItem("sciforge_restored_session", JSON.stringify({
        module: targetModule,
        state: session.state,
        title: session.title
      }));
    }
    onRoute(targetModule);
  }, [onRoute]);

  // Handle clipboard paste - auto-route to scribble or notes
  const handleClipboardPaste = useCallback((text: string) => {
    setClipboardText(text);
    const targetWorkspace = text.length > 100 ? "notes" : "scribble";
    pendo.track("clipboard_content_submitted", {
      content_length: text.length,
      target_workspace: targetWorkspace
    });
    if (text.length > 100) {
      // Long text - route to notes generator
      onTransferToWorkspace("notes", { preloadedTopic: text.substring(0, 200) });
      onRoute("notes");
    } else {
      // Short text - route to scribble analysis
      onTransferToWorkspace("scribble", { rawText: text });
      onRoute("scribble");
    }
  }, [onTransferToWorkspace, onRoute]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleClipboardPaste(text);
    } catch (err) {
      console.error("Failed to read clipboard:", err);
    }
  };

  const stats = [
    { label: "Questions Solved", value: telemetry.quizCorrectAnswers || 0, iconKey: "questionsSolved" as StatsIconKey, color: "#FF7A00" },
    { label: "Notes Generated", value: telemetry.notesGeneratedCount || 0, iconKey: "notesGenerated" as StatsIconKey, color: "#FFB547" },
    { label: "Quizzes Completed", value: telemetry.quizzesCompletedCount || 0, iconKey: "quizzesCompleted" as StatsIconKey, color: "#FFB547" },
    { label: "Research Projects", value: telemetry.researchInvestigationsCount || 0, iconKey: "researchProjects" as StatsIconKey, color: "#A1A1AA" },
  ];

  const formatTimeAgo = (timestamp: string | number | null | undefined) => {
    // Handle null, undefined, or invalid timestamps - show "Just now"
    if (!timestamp) {
      return "Just now";
    }
    
    // Convert to number if string
    const ts = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    
    // Check if timestamp is a valid number (not NaN, not 0, not negative in the future)
    if (isNaN(ts) || ts <= 0) {
      return "Just now";
    }
    
    const now = new Date();
    const date = new Date(ts);
    
    // Validate the date object
    if (isNaN(date.getTime())) {
      return "Just now";
    }
    
    const diffMs = now.getTime() - date.getTime();
    
    // If date is in the future, return "Just now"
    if (diffMs < 0) {
      return "Just now";
    }
    
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);
    
    if (diffSecs < 60) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return "Over a year ago";
  };

  return (
    <div className="flex flex-col relative bg-[#050505] h-full w-full">
      {/* Scrollable Content */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth overscroll-contain"
      >
        {/* Main Content Container */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-2 tracking-tight">
            {getGreeting()} 👋
          </h1>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg text-[#A1A1AA]">Welcome back to</span>
            <span className="text-lg font-semibold bg-gradient-to-r from-[#FF7A00] to-[#FFB547] bg-clip-text text-transparent">
              SciForge AI
            </span>
          </div>
          <p className="text-sm text-[#71717A] max-w-xl">
            Your Intelligent STEM workbench for learning, research, problem solving, and academic growth.
          </p>
        </motion.div>

        {/* Live Activity Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full p-4 justify-center items-center"
        >
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 + idx * 0.05 }}
              className="flex flex-col items-center justify-center text-center p-5 bg-white/5 border border-white/10 rounded-xl transition-all duration-300 ease-out hover:scale-[1.03] hover:border-[#FF7A00]/30 hover:shadow-[0_0_20px_rgba(255,122,0,0.08)]"
            >
              <div 
                className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                {PremiumStatsIcons[stat.iconKey]({ className: "w-8 h-8 lg:w-10 lg:h-10" })}
              </div>
              <motion.div 
                className="text-2xl sm:text-3xl font-heading font-bold text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-[10px] sm:text-xs text-[#71717A] font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Mentor Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-[#111111] border border-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-6 relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 sm:w-96 h-48 sm:h-64 bg-gradient-to-br from-[#FF7A00]/5 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10">
            {/* Mentor Header */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#0a2010] border border-[#22C55E]/30 flex items-center justify-center">
                  <NeuralHelixLogo className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#22C55E] rounded-full border-2 border-[#111111] shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              </div>
              <div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <h2 className="text-lg sm:text-xl font-heading font-semibold text-white tracking-tight">SciForge Adaptive Mentor</h2>
                  <span className="text-[10px] sm:text-xs text-[#22C55E] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#22C55E] rounded-full animate-pulse" />
                    Mentor Online
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#71717A]">Your AI-powered STEM companion</p>
              </div>
            </div>

            {/* Clean Input Area - Send Button Outside */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div 
                className={cn(
                  "flex-1 bg-[#1a1a1a] rounded-full px-4 sm:px-6 py-3 sm:py-4 border transition-all duration-300",
                  isInputFocused 
                    ? "border-[#FF7A00]/50 shadow-[0_0_20px_rgba(255,122,0,0.15)]" 
                    : "border-white/5 hover:border-white/10"
                )}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question..."
                  className="w-full bg-transparent text-white text-sm sm:text-base placeholder:text-[#71717A] outline-none"
                />
              </div>

              {/* Send Button - Outside, Sharp Circular */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSendMessage}
                disabled={!chatInput.trim()}
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 shrink-0",
                  chatInput.trim() 
                    ? "bg-[#FF7A00] hover:bg-[#FF8C1A] shadow-lg shadow-[#FF7A00]/30 text-white" 
                    : "bg-white/5 text-[#71717A] cursor-not-allowed"
                )}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="sm:w-5 sm:h-5">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            </div>

            {/* Quick Action Suggestion Pills */}
            <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
              {SUGGESTIONS.map((suggestion, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#FF7A00]/30 rounded-full text-xs text-[#A1A1AA] hover:text-white transition-all duration-200"
                >
                  <span>{suggestion.icon}</span>
                  <span>{suggestion.text}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout for Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* System Status & Streak Tracker Column */}
          <div className="space-y-6">
            
            {/* System Latency Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="bg-[#111111] border border-white/5 rounded-2xl p-5"
            >
              <h3 className="text-sm font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FF7A00]" />
                System Status
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-[#71717A] mb-1">Model</p>
                  <p className="text-sm font-mono text-white">Llama 3.3</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#71717A] mb-1">Latency</p>
                  <div className="flex items-center justify-center gap-1">
                    <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                    <span className="text-sm font-mono text-white">42ms</span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#71717A] mb-1">Tokens/s</p>
                  <p className="text-sm font-mono text-white">85 t/s</p>
                </div>
              </div>
            </motion.div>

            {/* Academic Streak Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#111111] border border-white/5 rounded-2xl p-5 relative overflow-hidden"
            >
              <h3 className="text-sm font-heading font-semibold text-white mb-4 flex items-center gap-2">
                <WireframeFlameLogo className="w-4 h-4" />
                Learning Streak
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#1a0a00] border border-[#FF7A00]/20 flex items-center justify-center">
                    <WireframeFlameLogo className="w-7 h-7" />
                  </div>
                  <div>
                    <motion.p 
                      className="text-2xl font-heading font-bold text-white"
                      key={streak}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                    >
                      {streak} Day{streak !== 1 ? 's' : ''}
                    </motion.p>
                    <p className="text-xs text-[#71717A]">Keep it going!</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStreakCheckIn}
                  className="relative px-4 py-2 bg-[#FF7A00]/10 hover:bg-[#FF7A00]/20 border border-[#FF7A00]/30 rounded-xl text-sm text-[#FF7A00] font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Check In
                  
                  {/* Particle Burst Animation */}
                  <AnimatePresence>
                    {showStreakBurst && (
                      <>
                        {[...Array(8)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 1, scale: 0 }}
                            animate={{ 
                              opacity: 0, 
                              scale: 1,
                              x: Math.cos(i * 45 * Math.PI / 180) * 40,
                              y: Math.sin(i * 45 * Math.PI / 180) * 40
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-0 flex items-center justify-center"
                          >
                            <div className="w-2 h-2 rounded-full bg-[#FF7A00]" />
                          </motion.div>
                        ))}
                      </>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Quick-Scan Clipboard Dropper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            whileHover={{ y: -2 }}
            className="bg-[#111111] border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-[#22C55E]/30 transition-all duration-300"
            onClick={() => onRoute("scribble")}
          >
            <h3 className="text-sm font-heading font-semibold text-white mb-4 flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Upload className="w-4 h-4 text-[#22C55E]" />
              </motion.div>
              Quick-Scan Input Lab
            </h3>
            
            <motion.div
              animate={{ borderColor: isDragOver ? "#FF7A00" : "rgba(255,255,255,0.05)" }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 min-h-[120px] flex flex-col items-center justify-center gap-3 cursor-pointer",
                isDragOver ? "bg-[#FF7A00]/5 border-[#FF7A00]" : "bg-[#1a1a1a]/50 hover:border-[#22C55E]/30"
              )}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                const text = e.dataTransfer.getData("text/plain");
                if (text) handleClipboardPaste(text);
              }}
            >
              <motion.div 
                className="w-10 h-10 rounded-xl bg-[#0a2010] border border-[#22C55E]/20 flex items-center justify-center"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <WireframeBrainLogo className="w-5 h-5" />
              </motion.div>
              
              {clipboardText ? (
                <div className="w-full text-left">
                  <p className="text-xs text-[#71717A] mb-1">Pasted content ({clipboardText.length} chars)</p>
                  <p className="text-sm text-white/80 line-clamp-2">{clipboardText.substring(0, 100)}...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <motion.p 
                    className="text-sm text-[#71717A]"
                    initial={{ opacity: 0.7 }}
                    whileHover={{ opacity: 1 }}
                  >
                    Drop text here or paste from clipboard
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs text-[#FFB547] flex items-center justify-center gap-1"
                  >
                    <span className="inline-block w-2 h-2 bg-[#22C55E] rounded-full animate-pulse" />
                    Click to open Scribble Analysis Lab
                  </motion.div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Recent Conversations */}
        {recentSessions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-heading font-semibold text-white">Recent Conversations</h3>
              <button 
                onClick={onViewConversations}
                className="text-xs text-[#FF7A00] hover:text-[#FFB547] transition-colors duration-200"
              >
                View all
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
              {recentSessions.slice(0, 4).map((session, idx) => (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  transition={{ delay: 0.4 + idx * 0.05, duration: 0.2 }}
                  onClick={() => handleRecentChatClick(session)}
                  className="group flex-shrink-0 flex items-center gap-3 p-3 bg-[#111111] hover:bg-[#1a1a1a] border border-white/5 hover:border-[#FF7A00]/30 rounded-xl transition-all duration-200"
                >
                  <motion.div 
                    className="w-8 h-8 rounded-lg bg-[#FF7A00]/10 flex items-center justify-center"
                    whileHover={{ rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MessageSquare className="w-4 h-4 text-[#FF7A00]" />
                  </motion.div>
                  <div className="text-left min-w-0">
                    <p className="text-sm text-white font-medium truncate max-w-[120px]">{session.title}</p>
                    <p className="text-[10px] text-[#71717A]">{formatTimeAgo(session.timestamp)}</p>
                  </div>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-[#71717A] group-hover:text-[#FF7A00] transition-colors shrink-0" />
                  </motion.div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Workspace Hub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-sm font-heading font-semibold text-white mb-4">Workspace Hub</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {WORKSPACE_CARDS.map((card, idx) => (
              <motion.button
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.4, delay: 0.5 + idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => onRoute(card.id)}
                className={cn(
                  "group relative bg-[#111111] rounded-2xl p-5 text-left overflow-hidden transition-all duration-300 workspace-card-premium",
                  card.hoverColor,
                  "border border-white/5 hover:border-opacity-100"
                )}
              >
                {/* Glow Background */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 card-glow"
                  style={{ 
                    background: `radial-gradient(circle at 50% 0%, ${card.color}20 0%, transparent 70%)`,
                    boxShadow: `inset 0 0 40px ${card.color}10`
                  }} 
                />
                
                {/* Animated Border Glow */}
                <motion.div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${card.color}30 0%, transparent 50%, ${card.color}20 100%)`,
                    padding: '1px'
                  }}
                >
                  <div className="w-full h-full rounded-2xl bg-[#111111]" />
                </motion.div>
                
                <div className="relative z-10">
                  {/* Premium Icon Container with Glow */}
                  <motion.div 
                    className="card-icon-container w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative"
                    style={{ backgroundColor: `${card.color}15` }}
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Icon Glow Effect */}
                    <div 
                      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ 
                        boxShadow: `0 0 20px ${card.color}40, inset 0 0 15px ${card.color}20`,
                        filter: `blur(8px)`
                      }} 
                    />
                    <card.icon className="w-6 h-6 transition-transform duration-300 relative z-10" color={card.color} />
                  </motion.div>
                  
                  <h4 className="text-sm font-semibold text-white mb-1.5 group-hover:text-white transition-colors">
                    {card.title}
                  </h4>
                  <p className="text-xs text-[#71717A] leading-relaxed group-hover:text-white/70 transition-colors">
                    {card.description}
                  </p>
                </div>
                
                {/* Animated Arrow */}
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-4 right-4"
                >
                  <ChevronRight className="w-5 h-5 transition-colors duration-300" style={{ color: card.color }} />
                </motion.div>
                
                {/* Bottom Glow Line */}
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100"
                  style={{ 
                    background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                    boxShadow: `0 0 10px ${card.color}`
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Bottom Spacing */}
        <div className="h-8" />
        </div>
      </div>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#FF7A00] text-white flex items-center justify-center shadow-lg shadow-[#FF7A00]/30 z-[100] cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}