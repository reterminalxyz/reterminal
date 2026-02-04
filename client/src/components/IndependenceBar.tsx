import { motion } from "framer-motion";

interface IndependenceBarProps {
  progress: number;
  phase: "phase_1" | "phase_2" | "complete";
}

export function IndependenceBar({ progress, phase }: IndependenceBarProps) {
  const isDark = phase === "phase_2" || phase === "complete";
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-5 pt-2">
      <motion.div 
        className="flex flex-col items-center gap-2 max-w-md mx-auto"
        animate={phase === "phase_2" ? { opacity: [0.85, 1, 0.85] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Title - bolder */}
        <motion.span 
          className="text-[11px] tracking-[4px] font-bold text-[#B87333]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          НЕЗАВИСИМОСТЬ
        </motion.span>
        
        {/* Metallic bar container - thicker */}
        <div 
          className="w-full h-4 rounded-sm overflow-hidden relative"
          style={{
            background: isDark 
              ? "linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)"
              : "linear-gradient(180deg, #D0D0D0 0%, #E0E0E0 50%, #C0C0C0 100%)",
            boxShadow: isDark 
              ? "inset 0 2px 4px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.08)"
              : "inset 0 2px 4px rgba(0,0,0,0.2), 0 1px 0 rgba(255,255,255,0.9)",
            border: `2px solid ${isDark ? 'rgba(184,115,51,0.5)' : 'rgba(184,115,51,0.4)'}`
          }}
        >
          {/* Metallic fill */}
          <motion.div
            className="h-full relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #D4956A 0%, #B87333 40%, #8B5A2B 100%)",
              boxShadow: "inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(0,0,0,0.25)"
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.max(0, progress)}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)"
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 1,
                ease: "easeInOut"
              }}
            />
            
            {/* Top highlight */}
            <div 
              className="absolute top-0 left-0 right-0 h-[2px]" 
              style={{ background: "rgba(255,255,255,0.5)" }}
            />
          </motion.div>
        </div>
        
        {/* Percentage - bolder */}
        <motion.span 
          key={progress}
          className="text-[#B87333] font-bold text-[13px] tracking-widest"
          initial={{ scale: 1.3, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={phase === "phase_2" ? {
            textShadow: "0 0 8px rgba(184,115,51,0.5)"
          } : {}}
        >
          {Math.round(progress)}%
        </motion.span>
      </motion.div>
    </div>
  );
}
