import { X } from "lucide-react";
import { cn } from "../../lib/utils";
import { ModuleType } from "../../types";
import { motion } from "motion/react";

// Premium Neural Nexus Logo - SciForge AI
const NeuralNexusLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="nexusGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFB547" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="nexusGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFB547" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.5" />
      </linearGradient>
      <filter id="nexusGlow">
        <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="nodeGlow">
        <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    {/* Outer orbital ring */}
    <ellipse cx="18" cy="18" rx="15" ry="6" stroke="url(#nexusGrad1)" strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(-30 18 18)" />
    <ellipse cx="18" cy="18" rx="15" ry="6" stroke="url(#nexusGrad2)" strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(30 18 18)" />
    <ellipse cx="18" cy="18" rx="15" ry="6" stroke="#FF7A00" strokeWidth="0.5" strokeOpacity="0.3" />
    {/* Neural nodes */}
    <circle cx="18" cy="10" r="2.5" fill="#FF7A00" filter="url(#nodeGlow)" />
    <circle cx="24" cy="15" r="2" fill="#FFB547" filter="url(#nodeGlow)" />
    <circle cx="22" cy="22" r="2" fill="#FF7A00" filter="url(#nodeGlow)" />
    <circle cx="14" cy="22" r="2" fill="#FFB547" filter="url(#nodeGlow)" />
    <circle cx="12" cy="15" r="2" fill="#FF7A00" filter="url(#nodeGlow)" />
    <circle cx="18" cy="18" r="3" fill="#FF7A00" filter="url(#nexusGlow)" />
    {/* Connection lines */}
    <path d="M18 10L24 15M24 15L22 22M22 22L14 22M14 22L12 15M12 15L18 10" stroke="#FF7A00" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
    <path d="M18 10L18 18M24 15L18 18M22 22L18 18M14 22L18 18M12 15L18 18" stroke="#FFB547" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
    {/* Orbital electrons */}
    <circle cx="28" cy="12" r="1" fill="#FF7A00" opacity="0.7" />
    <circle cx="10" cy="26" r="1" fill="#FFB547" opacity="0.7" />
    <circle cx="8" cy="10" r="0.8" fill="#FF7A00" opacity="0.5" />
  </svg>
);

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
    <path d="M14 10H22M11 15H25M14 20H22M11 25H25M14 30" stroke="#22C55E" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
    {/* Neural nodes along helix */}
    <circle cx="12" cy="6" r="1.5" fill="#4ADE80" />
    <circle cx="24" cy="18" r="2" fill="#22C55E" filter="url(#helixGlow)" />
    <circle cx="12" cy="30" r="1.5" fill="#4ADE80" />
    <circle cx="18" cy="12" r="1" fill="#22C55E" opacity="0.6" />
    <circle cx="18" cy="24" r="1" fill="#22C55E" opacity="0.6" />
    {/* Central intelligence node */}
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
    {/* Outer flame wireframe */}
    <path d="M12 2C8 6 6 10 6 13C6 17 8 20 12 22C16 20 18 17 18 13C18 10 16 6 12 2Z" stroke="url(#flameGrad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#flameGlow)" />
    {/* Inner flame layers */}
    <path d="M12 5C10 8 9 10 9 12C9 14.5 10 16 12 17.5" stroke="#FF7A00" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
    <path d="M12 5C14 8 15 10 15 12C15 14.5 14 16 12 17.5" stroke="#FFB547" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
    {/* Core */}
    <circle cx="12" cy="14" r="2" stroke="#FF7A00" strokeWidth="0.8" strokeOpacity="0.6" />
    <circle cx="12" cy="14" r="0.8" fill="#FF7A00" />
  </svg>
);

// Premium Wireframe Brain - Quick-Scan Lab
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
    {/* Brain outline */}
    <path d="M12 3C8 3 5 5 4 8C3 10 4 12 4 12C3 14 4 16 5 17C4 19 6 21 8 21C9 21 10 20 11 19C11 20 12 21 12 21C12 21 13 20 13 19C14 20 15 21 16 21C18 21 20 19 19 17C20 16 21 14 20 12C20 12 21 10 20 8C19 5 16 3 12 3Z" stroke="url(#brainGrad)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" filter="url(#brainGlow)" />
    {/* Neural pathways */}
    <path d="M8 8C10 9 11 11 11 12" stroke="#22C55E" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
    <path d="M16 8C14 9 13 11 13 12" stroke="#22C55E" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
    <path d="M9 13C10 14 11 15 11 16" stroke="#4ADE80" strokeWidth="0.6" strokeOpacity="0.4" strokeLinecap="round" />
    <path d="M15 13C14 14 13 15 13 16" stroke="#4ADE80" strokeWidth="0.6" strokeOpacity="0.4" strokeLinecap="round" />
    {/* Neural nodes */}
    <circle cx="9" cy="10" r="1" fill="#22C55E" opacity="0.6" />
    <circle cx="15" cy="10" r="1" fill="#22C55E" opacity="0.6" />
    <circle cx="12" cy="12" r="1.5" fill="#4ADE80" filter="url(#brainGlow)" />
    <circle cx="10" cy="16" r="0.8" fill="#22C55E" opacity="0.5" />
    <circle cx="14" cy="16" r="0.8" fill="#22C55E" opacity="0.5" />
    {/* Center processing node */}
    <circle cx="12" cy="12" r="0.5" fill="white" />
  </svg>
);

// Premium Duo-Tone SVG Icons for Sidebar
const PremiumSidebarIcons = {
  home: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect x="3" y="10" width="18" height="11" rx="2" fill="url(#homeGrad)" />
      <path d="M12 3L3 10H5V17H9V13H15V17H19V10H21L12 3Z" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="7" r="2" fill="#FF7A00" fillOpacity="0.3" />
    </svg>
  ),
  chat: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chatSidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
        </linearGradient>
        <filter id="chatGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect x="2" y="4" width="20" height="14" rx="3" fill="url(#chatSidebarGrad)" />
      <path d="M6 8h12M6 12h8" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" filter="url(#chatGlow)" />
      <circle cx="18" cy="10" r="1" fill="#FF7A00" />
      <path d="M20 16l2 2-2 2" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#chatGlow)" />
    </svg>
  ),
  notes: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="notesSidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB547" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFB547" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="4" y="2" width="16" height="18" rx="2" fill="url(#notesSidebarGrad)" />
      <path d="M8 7h8M8 11h6M8 15h4" stroke="#FFB547" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 2V6H20" stroke="#FFB547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="4" r="1" fill="#FFB547" />
    </svg>
  ),
  quiz: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="quizSidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB547" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFB547" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#quizSidebarGrad)" />
      <text x="12" y="16" textAnchor="middle" fill="#FFB547" fontSize="11" fontWeight="bold">?</text>
      <circle cx="12" cy="12" r="9" stroke="#FFB547" strokeWidth="1" strokeOpacity="0.5" />
    </svg>
  ),
  scribble: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="brainSidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="3" fill="url(#brainSidebarGrad)" />
      <path d="M12 6C9 6 7 8 7 10.5c0 1.5.5 2.5 1.5 3.5l-1 4 2.5-2c.5.5 1 .5 2 .5s1.5 0 2-.5l2.5 2-1-4c1-1 1.5-2 1.5-3.5 0-2.5-2-4.5-5-4.5z" stroke="#22C55E" strokeWidth="1.2" />
      <path d="M17 3L21 7M19 1L23 5" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  scientist: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="atomSidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="3" fill="#22C55E" fillOpacity="0.3" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="#22C55E" strokeWidth="1.2" strokeOpacity="0.6" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="#22C55E" strokeWidth="1.2" strokeOpacity="0.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="#22C55E" strokeWidth="1.2" strokeOpacity="0.6" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="2" fill="#22C55E" />
    </svg>
  ),
  simulation: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="simSidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="4" fill="url(#simSidebarGrad)" />
      <circle cx="8" cy="8" r="2" fill="#FF7A00" />
      <circle cx="16" cy="8" r="2" fill="#FF7A00" />
      <circle cx="8" cy="16" r="2" fill="#FF7A00" />
      <circle cx="16" cy="16" r="2" fill="#FF7A00" />
      <path d="M10 8h4M8 10v4M16 10v4M10 16h4" stroke="#FF7A00" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="12" cy="12" r="3" stroke="#FF7A00" strokeWidth="1.5" />
    </svg>
  ),
  dependencymap: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mapSidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB547" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFB547" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="20" height="20" rx="3" fill="url(#mapSidebarGrad)" />
      <circle cx="12" cy="6" r="2" fill="#FFB547" />
      <circle cx="6" cy="12" r="2" fill="#FFB547" />
      <circle cx="18" cy="12" r="2" fill="#FFB547" />
      <circle cx="9" cy="18" r="2" fill="#FFB547" />
      <circle cx="15" cy="18" r="2" fill="#FFB547" />
      <path d="M12 8v2M10 12l-2-2M14 12l2-2M9 14v2M15 14v2M11 16l-1 1M13 16l1 1" stroke="#FFB547" strokeWidth="1" strokeLinecap="round" />
    </svg>
  ),
  progress: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="progressSidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M4 21V10L12 3L20 10V21H14V14H10V21H4Z" fill="url(#progressSidebarGrad)" stroke="#FF7A00" strokeWidth="1.2" />
      <path d="M12 3L12 10" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="8" r="2" fill="#FF7A00" />
    </svg>
  ),
  portfolio: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="portfolioSidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A1A1AA" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#A1A1AA" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M3 7C3 5.89543 3.89543 5 5 5H9L11 7H19C20.1046 7 21 7.89543 21 9V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7Z" fill="url(#portfolioSidebarGrad)" stroke="#A1A1AA" strokeWidth="1.2" />
      <path d="M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7" stroke="#A1A1AA" strokeWidth="1.2" />
      <path d="M3 12H21" stroke="#A1A1AA" strokeWidth="1" opacity="0.5" />
    </svg>
  ),
  settings: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="settingsSidebarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A1A1AA" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#A1A1AA" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" fill="url(#settingsSidebarGrad)" stroke="#A1A1AA" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="4" stroke="#A1A1AA" strokeWidth="1.5" />
      <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.64 5.64l1.41 1.41M16.95 16.95l1.41 1.41M5.64 18.36l1.41-1.41M16.95 7.05l1.41-1.41" stroke="#A1A1AA" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  logout: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logoutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17L21 12L16 7" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12H9" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
} as const;

type SidebarIconKey = keyof typeof PremiumSidebarIcons;

interface SidebarProps {
  activeModule: ModuleType;
  onChangeModule: (m: ModuleType) => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { id: "home", label: "Home", iconKey: "home" as SidebarIconKey, color: "#FF7A00" },
  { id: "chat", label: "Core Intelligence Console", iconKey: "chat" as SidebarIconKey, color: "#FF7A00" },
  { id: "scribble", label: "Scribble Analysis Lab", iconKey: "scribble" as SidebarIconKey, color: "#22C55E" },
  { id: "scientist", label: "Quantum Research Engine", iconKey: "scientist" as SidebarIconKey, color: "#22C55E" },
  { id: "dependencymap", label: "Concept Dependency Map", iconKey: "dependencymap" as SidebarIconKey, color: "#FFB547" },
  { id: "progress", label: "Academic Propulsion", iconKey: "progress" as SidebarIconKey, color: "#FF7A00" },
  { id: "notes", label: "Scientific Documentation Lab", iconKey: "notes" as SidebarIconKey, color: "#FFB547" },
  { id: "quiz", label: "Mastery Assessment Engine", iconKey: "quiz" as SidebarIconKey, color: "#FFB547" },
  { id: "simulation", label: "Cognitive Synergy Hub", iconKey: "simulation" as SidebarIconKey, color: "#FF7A00" },
  { id: "portfolio", label: "Research Portfolio", iconKey: "portfolio" as SidebarIconKey, color: "#A1A1AA" },
  { id: "settings", label: "Settings", iconKey: "settings" as SidebarIconKey, color: "#A1A1AA" },
] as const;

export function Sidebar({ activeModule, onChangeModule, isOpenOnMobile, onCloseMobile }: SidebarProps) {
  const handleItemClick = (m: ModuleType) => {
    onChangeModule(m);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleSignOut = () => {
    // Clear authentication state from localStorage
    localStorage.removeItem("sciforge_auth");
    localStorage.removeItem("sciforge_user");
    localStorage.removeItem("sciforge_recent_sessions");
    
    // Clear any active auth layout states
    localStorage.removeItem("sciforge_accessibility");
    
    // Dispatch auth state change event to trigger re-render
    window.dispatchEvent(new Event('authStateChange'));
    
    // Force a complete page reload to ensure clean state
    window.location.href = '/';
    window.location.reload();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenOnMobile && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" 
          onClick={onCloseMobile}
        />
      )}

      <div className={cn(
        "w-64 border-r border-white/8 bg-[#111111] flex flex-col h-full shrink-0 transition-all duration-200 ease-in-out z-50 lg:z-auto lg:translate-x-0 lg:static fixed inset-y-0 left-0",
        isOpenOnMobile ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Logo Area */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/8 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
              <NeuralNexusLogo className="w-9 h-9" />
            </div>
            <div>
              <span className="font-heading font-bold text-base text-white tracking-tight">SCI FORGE</span>
              <span className="font-heading font-normal text-base text-[#A1A1AA] ml-1">AI</span>
            </div>
          </div>
          {onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg text-[#71717A] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {/* Back to Landing Page Bridge */}
            <motion.a
              href="https://sci-forge-ai.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0, duration: 0.3 }}
              whileHover={{ scale: 1.05, x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#22C55E] hover:text-[#22C55E] hover:bg-[#22C55E]/10 transition-all duration-300 group relative border border-[#22C55E]/20 hover:border-[#22C55E]/40 mb-2"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-semibold">Back to Home</span>
            </motion.a>

            {NAV_ITEMS.map((item, idx) => {
              const isActive = activeModule === item.id;
              const IconComponent = PremiumSidebarIcons[item.iconKey];
              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.2 }}
                  whileHover={{ x: 4, backgroundColor: isActive ? 'rgba(255,122,0,0.15)' : 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleItemClick(item.id as ModuleType)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative active:scale-95",
                    isActive 
                      ? "bg-[#FF7A00]/10 text-white border border-[#FF7A00]/20" 
                      : "text-[#A1A1AA] hover:text-white hover:bg-white/5"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav-indicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#FF7A00] rounded-r-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <motion.div
                    whileHover={{ rotate: isActive ? 0 : 5, scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                    className="w-5 h-5"
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.div>
                  <span className={cn(isActive ? "text-white font-medium" : "")}>{item.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/8">
          {/* Sign Out */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#71717A] hover:text-[#EF4444] hover:bg-[#EF4444]/5 transition-all duration-200 group"
          >
            <div className="w-5 h-5">
              {PremiumSidebarIcons.logout({ className: "w-5 h-5" })}
            </div>
            <span>Sign Out</span>
          </motion.button>
        </div>
      </div>
    </>
  );
}