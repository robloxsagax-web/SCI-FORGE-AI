import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";
import { 
  MessageSquare, Pencil, FlaskConical, FileText, Target, 
  BrainCircuit, Sparkles, ChevronRight, Zap, Shield, Award
} from "lucide-react";

// Premium Neural Nexus Logo
const NeuralNexusLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 36 36" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="loginNexusGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#FFB547" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="loginNexusGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFB547" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.5" />
      </linearGradient>
      <filter id="loginNexusGlow">
        <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <ellipse cx="18" cy="18" rx="15" ry="6" stroke="url(#loginNexusGrad1)" strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(-30 18 18)" />
    <ellipse cx="18" cy="18" rx="15" ry="6" stroke="url(#loginNexusGrad2)" strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(30 18 18)" />
    <circle cx="18" cy="10" r="2.5" fill="#FF7A00" filter="url(#loginNexusGlow)" />
    <circle cx="24" cy="15" r="2" fill="#FFB547" />
    <circle cx="22" cy="22" r="2" fill="#FF7A00" />
    <circle cx="14" cy="22" r="2" fill="#FFB547" />
    <circle cx="12" cy="15" r="2" fill="#FF7A00" />
    <circle cx="18" cy="18" r="3.5" fill="#FF7A00" filter="url(#loginNexusGlow)" />
    <path d="M18 10L24 15M24 15L22 22M22 22L14 22M14 22L12 15M12 15L18 10" stroke="#FF7A00" strokeWidth="1" strokeOpacity="0.6" strokeLinecap="round" />
    <path d="M18 10L18 18M24 15L18 18M22 22L18 18M14 22L18 18M12 15L18 18" stroke="#FFB547" strokeWidth="0.8" strokeOpacity="0.5" strokeLinecap="round" />
  </svg>
);

interface LoginPageProps {
  onLogin: () => void;
  dyslexiaMode: boolean;
  highContrast: boolean;
  onToggleDyslexia: () => void;
  onToggleHighContrast: () => void;
}

const FEATURES = [
  { icon: MessageSquare, title: "Core Intelligence Console", desc: "Multi-model collaborative STEM mentor", color: "#FF7A00" },
  { icon: Pencil, title: "Scribble Analysis Lab", desc: "Real-time reasoning and hand-drawn canvas processing", color: "#8B5CF6" },
  { icon: FlaskConical, title: "Quantum Research Engine", desc: "In-depth academic investigations", color: "#22C55E" },
  { icon: FileText, title: "Notes & Quiz Generator", desc: "Dynamic revision compilation and personalized roadmaps", color: "#FFB547" },
];

export function LoginPage({ onLogin, dyslexiaMode, highContrast, onToggleDyslexia, onToggleHighContrast }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    // Simulate auth delay
    await new Promise(resolve => setTimeout(resolve, 800));
    onLogin();
  };

  return (
    <div className="flex h-screen w-full bg-[#050505]">
      {/* Left Pane - Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF7A00]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFB547]/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 py-16">
          {/* Logo & Branding */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1a0f00] border-2 border-[#FF7A00]/30 flex items-center justify-center shadow-[0_0_30px_rgba(255,122,0,0.2)]">
                <NeuralNexusLogo className="w-12 h-12" />
              </div>
              <div>
                <h1 className="text-3xl font-heading font-bold text-white tracking-tight">SCI FORGE AI</h1>
                <p className="text-sm text-[#FFB547] font-mono">Educational Intelligence System</p>
              </div>
            </div>
            <p className="text-lg text-white/60 max-w-md leading-relaxed">
              Your intelligent STEM workbench for learning, research, problem solving, and academic growth.
            </p>
          </motion.div>

          {/* Feature Matrix */}
          <div className="space-y-4">
            <p className="text-xs text-white/30 uppercase tracking-widest font-mono mb-4">System Capabilities</p>
            {FEATURES.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#FF7A00]/20 transition-all duration-300 group"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#FFB547] transition-colors">{feature.title}</h3>
                  <p className="text-xs text-white/40 mt-0.5">{feature.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/20 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex items-center gap-8"
          >
            {[
              { value: "10K+", label: "Students" },
              { value: "98%", label: "Satisfaction" },
              { value: "50ms", label: "Response" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-heading font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40 font-mono">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Pane - Authentication */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-8 py-12 bg-[#0a0a0a]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#1a0f00] border border-[#FF7A00]/30 flex items-center justify-center">
              <NeuralNexusLogo className="w-8 h-8" />
            </div>
            <span className="text-xl font-heading font-bold text-white">SCI FORGE AI</span>
          </div>

          {/* Auth Card */}
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FFB547]/10 border border-[#FF7A00]/20 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#FF7A00]" />
              </div>
              <h2 className="text-xl font-heading font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-sm text-white/50">Sign in to access your learning dashboard</p>
            </div>

            {/* Google Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl bg-white text-gray-800 font-semibold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all disabled:opacity-70 shadow-lg"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-gray-400 border-t-gray-800 rounded-full"
                />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Sign in with Google</span>
                </>
              )}
            </motion.button>

            {/* Quick Access Settings Tray */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[10px] text-white/30 uppercase tracking-wider font-mono mb-4 text-center">Quick Accessibility</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#FFB547]" />
                    <span className="text-xs text-white/70">Dyslexia-Friendly Font</span>
                  </div>
                  <button 
                    onClick={onToggleDyslexia}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative cursor-pointer",
                      dyslexiaMode ? "bg-[#FF7A00]" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                      dyslexiaMode ? "left-5" : "left-0.5"
                    )} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FF7A00]" />
                    <span className="text-xs text-white/70">High Contrast Mode</span>
                  </div>
                  <button 
                    onClick={onToggleHighContrast}
                    className={cn(
                      "w-10 h-5 rounded-full transition-colors relative cursor-pointer",
                      highContrast ? "bg-[#FF7A00]" : "bg-white/10"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
                      highContrast ? "left-5" : "left-0.5"
                    )} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-white/30 mt-6">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}