import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface IndependenceBarProps {
  progress: number;
  phase: "phase_1" | "phase_2";
  showBackground?: boolean;
}

export function IndependenceBar({ progress, phase, showBackground = false }: IndependenceBarProps) {
  const isDark = phase === "phase_2";
  const [isPulsing, setIsPulsing] = useState(false);
  const prevProgressRef = useRef(progress);

  useEffect(() => {
    if (progress > prevProgressRef.current) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 1200);
      prevProgressRef.current = progress;
      return () => clearTimeout(timer);
    }
    prevProgressRef.current = progress;
  }, [progress]);
  
  return (
    <div 
      className={`${isDark ? 'relative' : 'fixed bottom-0 left-0 right-0'} z-40 px-4 pt-3 ${isDark ? 'bg-[#0A0A0A] border-t-2 border-[#B87333]/40' : ''}`}
      style={{ paddingBottom: `max(16px, env(safe-area-inset-bottom))` }}
    >
      <motion.div 
        className="flex flex-col items-center gap-2 max-w-md mx-auto"
        animate={phase === "phase_2" ? { opacity: [0.85, 1, 0.85] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.span 
          className={`text-[12px] tracking-[5px] font-bold ${!isDark && showBackground ? 'bg-[#F5F5F5]/90 px-4 py-1 border border-[#B87333]/20' : ''}`}
          style={isDark ? { color: "#B87333" } : { background: "linear-gradient(135deg, #8B4513, #B87333 30%, #D4956A 60%, #E8B89D 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          НЕЗАВИСИМОСТЬ
        </motion.span>
        
        <div className="relative w-full">
          {isPulsing && isDark && (
            <motion.div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                boxShadow: "0 0 20px rgba(184,115,51,0.6), 0 0 40px rgba(184,115,51,0.3), inset 0 0 10px rgba(184,115,51,0.2)",
                border: "2px solid rgba(184,115,51,0.8)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.2, times: [0, 0.1, 0.6, 1] }}
            />
          )}
          <div 
            className="w-full h-6 rounded-sm overflow-hidden relative"
            style={{
              background: isDark 
                ? "linear-gradient(180deg, #151515 0%, #1A1A1A 50%, #151515 100%)"
                : "linear-gradient(180deg, #C8C8C8 0%, #E0E0E0 50%, #B8B8B8 100%)",
              boxShadow: isDark 
                ? "inset 0 3px 6px rgba(0,0,0,0.7), 0 2px 0 rgba(255,255,255,0.1)"
                : "inset 0 3px 6px rgba(0,0,0,0.25), 0 2px 0 rgba(255,255,255,0.95)",
              border: `3px solid ${isDark ? 'rgba(184,115,51,0.7)' : 'rgba(184,115,51,0.5)'}`
            }}
          >
            <motion.div
              className="h-full relative overflow-hidden"
              style={{
                background: "linear-gradient(180deg, #E8B89D 0%, #D4956A 20%, #B87333 50%, #8B4513 100%)",
                boxShadow: "inset 0 3px 0 rgba(255,255,255,0.4), inset 0 -3px 0 rgba(0,0,0,0.3)"
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${Math.max(0, progress)}%` }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)"
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
              />
              
              {isPulsing && (
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.5) 50%, transparent 100%)"
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.8, 0], x: ["-100%", "200%"] }}
                  transition={{ duration: 0.8 }}
                />
              )}
              
              <div 
                className="absolute top-0 left-0 right-0 h-[3px]" 
                style={{ background: "rgba(255,255,255,0.55)" }}
              />
            </motion.div>
          </div>
        </div>
        
        <motion.span 
          key={progress}
          className="font-bold text-[16px] tracking-[0.3em]"
          initial={{ scale: 1.3, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={isDark ? {
            color: "#B87333",
            textShadow: isPulsing 
              ? "0 0 20px rgba(184,115,51,0.9), 0 0 40px rgba(255,215,0,0.4)"
              : "0 0 15px rgba(184,115,51,0.6)"
          } : { background: "linear-gradient(135deg, #8B4513, #B87333 30%, #D4956A 60%, #E8B89D 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          {Math.round(progress)}%
        </motion.span>
      </motion.div>
    </div>
  );
}