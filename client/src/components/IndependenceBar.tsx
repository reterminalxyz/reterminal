import { motion } from "framer-motion";

interface IndependenceBarProps {
  progress: number; // 0-100 percentage
  phase: "phase_1" | "phase_2" | "complete";
}

export function IndependenceBar({ progress, phase }: IndependenceBarProps) {
  const isDark = phase === "phase_2" || phase === "complete";
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
      <motion.div 
        className="flex flex-col items-center gap-2 max-w-md mx-auto"
        animate={phase === "phase_2" ? { opacity: [0.8, 1, 0.8] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.span 
          className="text-[9px] tracking-[3px] font-medium text-[#B87333]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          НЕЗАВИСИМОСТЬ
        </motion.span>
        
        {/* Metallic bar container */}
        <div 
          className="w-full h-3 rounded-sm overflow-hidden relative"
          style={{
            background: isDark 
              ? "linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)"
              : "linear-gradient(180deg, #D8D8D8 0%, #E8E8E8 50%, #C8C8C8 100%)",
            boxShadow: isDark 
              ? "inset 0 1px 3px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)"
              : "inset 0 1px 3px rgba(0,0,0,0.15), 0 1px 0 rgba(255,255,255,0.8)",
            border: `1px solid ${isDark ? 'rgba(184,115,51,0.4)' : 'rgba(184,115,51,0.3)'}`
          }}
        >
          {/* Metallic fill */}
          <motion.div
            className="h-full relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #D4956A 0%, #B87333 40%, #8B5A2B 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)"
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.max(0, progress)}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)"
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 1,
                ease: "easeInOut"
              }}
            />
            
            {/* Top highlight line */}
            <div 
              className="absolute top-0 left-0 right-0 h-[1px]" 
              style={{ background: "rgba(255,255,255,0.4)" }}
            />
          </motion.div>
        </div>
        
        {/* Percentage display */}
        <div className="flex justify-between w-full text-[9px] tracking-wider">
          <span className={isDark ? "text-[#E8E8E8]/40" : "text-[#3E3129]/40"}>0%</span>
          <motion.span 
            className="text-[#B87333] font-semibold"
            animate={phase === "phase_2" ? { 
              textShadow: ["0 0 4px rgba(184,115,51,0.3)", "0 0 8px rgba(184,115,51,0.6)", "0 0 4px rgba(184,115,51,0.3)"]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {Math.round(progress)}%
          </motion.span>
          <span className={isDark ? "text-[#E8E8E8]/40" : "text-[#3E3129]/40"}>100%</span>
        </div>
      </motion.div>
    </div>
  );
}
