import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Accessibility, Eye, Type, Zap, Lightbulb } from "lucide-react";

interface InclusionHubProps {
  onNavigateToScribble?: () => void;
}

export function InclusionHub({ onNavigateToScribble }: InclusionHubProps) {
  const [settings, setSettings] = useState({
    dyslexiaFont: true,
    highContrast: true,
    tts: false,
    lightMode: false,
    customCursor: true,
  });

  useEffect(() => {
    const saved = localStorage.getItem("sciforge_accessibility");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings({
        dyslexiaFont: parsed.dyslexiaFont ?? true,
        highContrast: parsed.highContrast ?? true,
        tts: parsed.tts ?? false,
        lightMode: parsed.lightMode ?? false,
        customCursor: parsed.customCursor ?? true,
      });
    }
  }, []);

  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    localStorage.setItem("sciforge_accessibility", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
        enabled ? "bg-[#22C55E]" : "bg-white/10"
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
          enabled ? "left-7" : "left-1"
        }`}
      />
    </button>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="p-3 bg-[#22C55E]/10 rounded-xl text-[#22C55E] border border-[#22C55E]/20">
            <Accessibility className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-white">Inclusion Hub</h1>
            <p className="text-sm text-white/50">Accessibility & learning accommodations</p>
          </div>
        </motion.div>

        {/* Accessibility Settings */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Reading & Vision</h2>
          
          {/* Dyslexia Font */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FF7A00]/10 rounded-lg">
                <Type className="w-5 h-5 text-[#FF7A00]" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Dyslexia-Friendly Font</span>
                <span className="text-xs text-white/40">OpenDyslexic typeface</span>
              </div>
            </div>
            <Toggle
              enabled={settings.dyslexiaFont}
              onToggle={() => updateSetting("dyslexiaFont", !settings.dyslexiaFont)}
            />
          </motion.div>

          {/* High Contrast */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#FFB547]/10 rounded-lg">
                <Eye className="w-5 h-5 text-[#FFB547]" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">High Contrast Highlights</span>
                <span className="text-xs text-white/40">Enhanced color saturation</span>
              </div>
            </div>
            <Toggle
              enabled={settings.highContrast}
              onToggle={() => updateSetting("highContrast", !settings.highContrast)}
            />
          </motion.div>

          {/* Custom Cursor */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#22C55E]/10 rounded-lg">
                <Zap className="w-5 h-5 text-[#22C55E]" />
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Custom Pen Cursor</span>
                <span className="text-xs text-white/40">Interactive learning pointer</span>
              </div>
            </div>
            <Toggle
              enabled={settings.customCursor}
              onToggle={() => updateSetting("customCursor", !settings.customCursor)}
            />
          </motion.div>
        </div>

        {/* Learning Tools */}
        <div className="space-y-4 pt-4">
          <h2 className="text-sm font-semibold text-white/80 uppercase tracking-wider">Learning Tools</h2>

          {/* Diagram Narrator */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            onClick={onNavigateToScribble}
            className="w-full bg-gradient-to-r from-[#22C55E]/20 to-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-5 flex items-center gap-4 hover:border-[#22C55E]/50 transition-all group"
          >
            <div className="p-3 bg-[#22C55E]/20 rounded-xl group-hover:bg-[#22C55E]/30 transition-colors">
              <Lightbulb className="w-6 h-6 text-[#22C55E]" />
            </div>
            <div className="text-left flex-1">
              <span className="text-base font-bold text-white block">Diagram Narrator</span>
              <span className="text-sm text-white/50">AI-powered image analysis with spoken descriptions</span>
            </div>
            <svg className="w-5 h-5 text-white/30 group-hover:text-white/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#22C55E]/5 border border-[#22C55E]/20 rounded-xl p-4"
        >
          <p className="text-xs text-white/60 leading-relaxed">
            SciForge AI is committed to inclusive education. All accessibility settings are 
            automatically saved and will persist across sessions. Adjust your experience 
            to match your unique learning style.
          </p>
        </motion.div>
      </div>
    </div>
  );
}