import { motion } from "framer-motion";

interface IndependenceBarProps {
  progress: number;
  phase: "phase_1" | "phase_2";
  showBackground?: boolean;
}

export function IndependenceBar({ progress, phase, showBackground = false }: IndependenceBarProps) {
  const isDark = phase === "phase_2";
  const isCompact = phase === "phase_2";
  
  return (
    <div className={`fixed left-0 right-0 z-40 px-4 ${isCompact ? 'bottom-[68px] pb-2 pt-2' : 'bottom-0 pb-6 pt-3'}`}>
      <motion.div 
        className={`flex ${isCompact ? 'flex-row items-center justify-center gap-4' : 'flex-col items-center gap-2.5'} max-w-md mx-auto`}
        animate={phase === "phase_2" ? { opacity: [0.85, 1, 0.85] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Title - with optional background, hidden in compact mode */}
        {!isCompact && (
          <motion.span 
            className={`text-[13px] tracking-[5px] font-bold text-[#B87333] ${showBackground ? 'bg-[#F5F5F5]/90 px-4 py-1 border border-[#B87333]/20' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            НЕЗАВИСИМОСТЬ
          </motion.span>
        )}
        
        {/* Metallic bar container */}
        <div 
          className={`${isCompact ? 'w-40 h-4' : 'w-full h-6'} rounded-sm overflow-hidden relative`}
          style={{
            background: isDark 
              ? "linear-gradient(180deg, #1A1A1A 0%, #2A2A2A 50%, #1A1A1A 100%)"
              : "linear-gradient(180deg, #C8C8C8 0%, #E0E0E0 50%, #B8B8B8 100%)",
            boxShadow: isDark 
              ? "inset 0 3px 6px rgba(0,0,0,0.7), 0 2px 0 rgba(255,255,255,0.1)"
              : "inset 0 3px 6px rgba(0,0,0,0.25), 0 2px 0 rgba(255,255,255,0.95)",
            border: `3px solid ${isDark ? 'rgba(184,115,51,0.6)' : 'rgba(184,115,51,0.5)'}`
          }}
        >
          {/* Metallic fill */}
          <motion.div
            className="h-full relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #D9A066 0%, #B87333 40%, #8B5A2B 100%)",
              boxShadow: "inset 0 3px 0 rgba(255,255,255,0.4), inset 0 -3px 0 rgba(0,0,0,0.3)"
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.max(0, progress)}%` }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Shimmer effect */}
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
            
            {/* Top highlight */}
            <div 
              className="absolute top-0 left-0 right-0 h-[3px]" 
              style={{ background: "rgba(255,255,255,0.55)" }}
            />
          </motion.div>
        </div>
        
        {/* Percentage */}
        <motion.span 
          key={progress}
          className={`text-[#B87333] font-bold ${isCompact ? 'text-[12px]' : 'text-[16px]'} tracking-[0.2em]`}
          initial={{ scale: 1.3, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={isDark ? {
            textShadow: "0 0 10px rgba(184,115,51,0.6)"
          } : {}}
        >
          {Math.round(progress)}%
        </motion.span>
      </motion.div>
    </div>
  );
}
