import { useState } from "react";
import { motion } from "motion/react";
import { Shield, ChevronRight, User, Mail, Lock, Sparkles, Zap } from "lucide-react";
import { signIn, signUp, demoLogin } from "../../lib/auth";
import { LoadingScreen } from "./LoadingScreen";

type AuthTab = 'signin' | 'signup';

interface FormData {
  name: string;
  email: string;
  password: string;
}

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

// Premium Feature Icons
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

// Input Field Component
const InputField = ({ 
  icon: Icon, 
  type, 
  placeholder, 
  value, 
  onChange, 
  name 
}: { 
  icon: any; 
  type: string; 
  placeholder: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}) => (
  <div className="relative">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
      <Icon className="w-5 h-5" />
    </div>
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-[#FF7A00]/50 focus:bg-white/[0.07] transition-all"
    />
  </div>
);

// LoginPage Component
export function LoginPage() {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleTabSwitch = (tab: AuthTab) => {
    setActiveTab(tab);
    setError(null);
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (activeTab === 'signin') {
        const result = signIn(formData.email, formData.password);
        if (!result.success) {
          setError(result.error || 'Sign in failed');
          setIsLoading(false);
          return;
        }
      } else {
        const result = signUp(formData.name, formData.email, formData.password);
        if (!result.success) {
          setError(result.error || 'Sign up failed');
          setIsLoading(false);
          return;
        }
      }
      // Auth state change will be handled by App.tsx via storage event
      window.dispatchEvent(new Event('authStateChange'));
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }
    setIsLoading(false);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setError(null);
    demoLogin();
    window.dispatchEvent(new Event('authStateChange'));
  };

  // Show loading screen during auth
  if (isLoading) {
    return <LoadingScreen message="Initializing Neural Nexus..." />;
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-[#050505] overflow-y-auto lg:overflow-hidden">
      {/* Left Pane - Feature Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF7A00]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFB547]/5 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-8 lg:px-16 py-8 lg:py-16">
          {/* Logo & Branding */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 lg:mb-16"
          >
            <div className="flex items-center gap-4 lg:gap-5 mb-4 lg:mb-8">
              <div className="w-20 h-20 rounded-2xl bg-[#1a0f00] border-2 border-[#FF7A00]/30 flex items-center justify-center shadow-[0_0_40px_rgba(255,122,0,0.25)]">
                <NeuralNexusLogo className="w-10 h-10 lg:w-14 lg:h-14" />
              </div>
              <div>
                <h1 className="text-xl lg:text-4xl font-heading font-bold text-white tracking-tight">SCI FORGE AI</h1>
                <p className="text-xs lg:text-base text-[#FFB547] font-mono">Educational Intelligence System</p>
              </div>
            </div>
            <p className="text-sm lg:text-xl text-white/60 max-w-lg leading-relaxed">
              Your intelligent STEM workbench for learning, research, problem solving, and academic growth.
            </p>
          </motion.div>

          {/* Feature Matrix */}
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
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 lg:px-8 py-8 lg:py-12 bg-[#0a0a0a] min-h-[60vh] lg:min-h-0">
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

          {/* Auth Card */}
          <div className="bg-[#111111] border border-white/5 rounded-3xl p-10 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF7A00]/20 to-[#FFB547]/10 border border-[#FF7A00]/20 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(255,122,0,0.15)]">
                <Shield className="w-8 h-8 text-[#FF7A00]" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-white mb-2">
                {activeTab === 'signin' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-white/50">
                {activeTab === 'signin' 
                  ? 'Sign in to access your learning dashboard' 
                  : 'Join SciForge AI and start learning'}
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
              <button
                type="button"
                onClick={() => handleTabSwitch('signin')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'signin' 
                    ? 'bg-[#FF7A00] text-white shadow-lg' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch('signup')}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'signup' 
                    ? 'bg-[#FF7A00] text-white shadow-lg' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'signup' && (
                <InputField
                  icon={User}
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              )}
              <InputField
                icon={Mail}
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
              />
              <InputField
                icon={Lock}
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#FFB547] text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#FF7A00]/30 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-white/40 font-mono">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Demo Login Button - Priority for Hackathon */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDemoLogin}
              className="w-full py-4 px-6 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E] font-semibold flex items-center justify-center gap-2 hover:bg-[#22C55E]/20 hover:border-[#22C55E]/50 transition-all"
            >
              <Zap className="w-5 h-5" />
              Demo Login - Guest Scholar
            </motion.button>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-white/30 mt-8">
            {activeTab === 'signin' 
              ? "Don't have an account? Sign up to get started"
              : "Already have an account? Sign in to continue"
            }
          </p>
        </motion.div>
      </div>
    </div>
  );
}