import { useState } from "react";
import { motion } from "motion/react";
import { Shield, ChevronRight } from "lucide-react";
import { signInWithGoogle } from "../../lib/firebase";
import { LoadingScreen } from "./LoadingScreen";

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

// Premium Feature Icons (synced with dashboard)
const PremiumFeatureIcons = {
  chat: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="featureChatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="2" y="4" width="20" height="14" rx="3" fill="url(#featureChatGrad)" />
      <path d="M6 8h12M6 12h8" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="18" cy="10" r="1" fill="#FF7A00" />
      <path d="M20 16l2 2-2 2" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  scribble: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="featureScribbleGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="featureScribbleGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A00" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FF7A00" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="16" height="16" rx="3" fill="url(#featureScribbleGrad1)" />
      <path d="M12 6C9 6 7 8 7 10.5c0 1.5.5 2.5 1.5 3.5l-1 4 2.5-2c.5.5 1 .5 2 .5s1.5 0 2-.5l2.5 2-1-4c1-1 1.5-2 1.5-3.5 0-2.5-2-4.5-5-4.5z" stroke="url(#featureScribbleGrad2)" strokeWidth="1.2" fill="none" />
      <path d="M17 3L21 7M19 1L23 5" stroke="#FF7A00" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  scientist: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="featureAtomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="3" fill="#22C55E" fillOpacity="0.3" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="url(#featureAtomGrad)" strokeWidth="1.2" strokeOpacity="0.6" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="url(#featureAtomGrad)" strokeWidth="1.2" strokeOpacity="0.6" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="4" stroke="url(#featureAtomGrad)" strokeWidth="1.2" strokeOpacity="0.6" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r="2" fill="#22C55E" />
      <circle cx="12" cy="8" r="0.8" fill="#22C55E" />
      <circle cx="15.5" cy="14" r="0.8" fill="#22C55E" />
      <circle cx="8.5" cy="14" r="0.8" fill="#22C55E" />
    </svg>
  ),
  notes: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="featureNotesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFB547" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFB547" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect x="4" y="3" width="16" height="18" rx="2" fill="url(#featureNotesGrad)" />
      <path d="M8 8h8M8 12h6M8 16h4" stroke="#FFB547" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 3V7H20" stroke="#FFB547" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="19" cy="5" r="1" fill="#FFB547" />
    </svg>
  ),
};

// Feature icons mapped to premium SVG components
const FEATURES = [
  { iconKey: "chat", title: "Core Intelligence Console", desc: "Multi-model collaborative STEM mentor", color: "#FF7A00" },
  { iconKey: "scribble", title: "Scribble Analysis Lab", desc: "Real-time reasoning and hand-drawn canvas processing", color: "#22C55E" },
  { iconKey: "scientist", title: "Quantum Research Engine", desc: "In-depth academic investigations", color: "#22C55E" },
  { iconKey: "notes", title: "Notes & Quiz Generator", desc: "Dynamic revision compilation and personalized roadmaps", color: "#FFB547" },
];

// LoginPage - No props needed, Firebase handles auth automatically
export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show loading screen when sign-in is in progress
  if (isLoading) {
    return <LoadingScreen message="Synchronizing STEM Engine..." />;
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Use centralized Firebase auth module
      // This triggers the redirect to Google OAuth
      await signInWithGoogle();
      // onAuthStateChanged in App.tsx will handle the state update after redirect
    } catch (err: any) {
      console.error('Auth error:', err);
      setIsLoading(false);
      
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in cancelled. Please try again.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with a different sign-in method.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection.');
      } else {
        setError('Authentication failed. Please try again.');
      }
    }
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

        <div className="relative z-10 flex flex-col justify-center px-16 py-16">
          {/* Logo & Branding */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-[#1a0f00] border-2 border-[#FF7A00]/30 flex items-center justify-center shadow-[0_0_40px_rgba(255,122,0,0.25)]">
                <NeuralNexusLogo className="w-14 h-14" />
              </div>
              <div>
                <h1 className="text-4xl font-heading font-bold text-white tracking-tight">SCI FORGE AI</h1>
                <p className="text-base text-[#FFB547] font-mono">Educational Intelligence System</p>
              </div>
            </div>
            <p className="text-xl text-white/60 max-w-lg leading-relaxed">
              Your intelligent STEM workbench for learning, research, problem solving, and academic growth.
            </p>
          </motion.div>

          {/* Feature Matrix with Premium Icons */}
          <div className="space-y-5">
            <p className="text-xs text-white/30 uppercase tracking-widest font-mono mb-6">System Capabilities</p>
            {FEATURES.map((feature, idx) => {
              const IconComponent = PremiumFeatureIcons[feature.iconKey as keyof typeof PremiumFeatureIcons];
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="flex items-start gap-5 p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-[#FF7A00]/30 transition-all duration-300 group"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}30` }}
                  >
                    {IconComponent && <IconComponent className="w-7 h-7" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white group-hover:text-[#FFB547] transition-colors">{feature.title}</h3>
                    <p className="text-sm text-white/40 mt-1">{feature.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </motion.div>
              );
            })}
          </div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex items-center gap-12"
          >
            {[
              { value: "10K+", label: "Students" },
              { value: "98%", label: "Satisfaction" },
              { value: "50ms", label: "Response" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-heading font-bold text-white">{stat.value}</div>
                <div className="text-xs text-white/40 font-mono mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Pane - Authentication Terminal */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12 bg-[#0a0a0a]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-xl bg-[#1a0f00] border border-[#FF7A00]/30 flex items-center justify-center">
              <NeuralNexusLogo className="w-10 h-10" />
            </div>
            <span className="text-2xl font-heading font-bold text-white">SCI FORGE AI</span>
          </div>

          {/* Auth Card - Centered */}
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-10 shadow-2xl">
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FFB547]/10 border border-[#FF7A00]/20 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,122,0,0.15)]">
                <Shield className="w-10 h-10 text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-white mb-3">Welcome Back</h2>
              <p className="text-sm text-white/50">Sign in to access your learning dashboard</p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Google Sign In Button */}
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-5 px-6 rounded-xl bg-white text-gray-800 font-semibold flex items-center justify-center gap-4 hover:bg-gray-100 transition-all disabled:opacity-70 shadow-lg"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-gray-400 border-t-gray-800 rounded-full"
                />
              ) : (
                <>
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-lg">Sign in with Google</span>
                </>
              )}
            </motion.button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-white/30 mt-8">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </motion.div>
      </div>
    </div>
  );
}