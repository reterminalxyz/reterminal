import { motion } from "framer-motion";

interface IndependenceBarProps {
  progress: number;
  phase: "phase_1" | "phase_2";
  showBackground?: boolean;
}

export function IndependenceBar({ progress, phase, showBackground = false }: IndependenceBarProps) {
  const isDark = phase === "phase_2";
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3 ${isDark ? 'bg-[#0A0A0A] border-t-2 border-[#B87333]/40' : ''}`}>
      <motion.div 
        className="flex flex-col items-center gap-2 max-w-md mx-auto"
        animate={phase === "phase_2" ? { opacity: [0.85, 1, 0.85] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {/* Title */}
        <motion.span 
          className={`text-[12px] tracking-[5px] font-bold ${isDark ? 'text-[#B87333]' : 'text-[#B87333]'} ${!isDark && showBackground ? 'bg-[#F5F5F5]/90 px-4 py-1 border border-[#B87333]/20' : ''}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          НЕЗАВИСИМОСТЬ
        </motion.span>
        
        {/* Bar container - bigger in phase_2 */}
        <div 
          className={`w-full ${isDark ? 'h-8' : 'h-6'} rounded-sm overflow-hidden relative`}
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
        
        {/* Percentage - bigger in phase_2 */}
        <motion.span 
          key={progress}
          className={`text-[#B87333] font-bold ${isDark ? 'text-[18px]' : 'text-[16px]'} tracking-[0.3em]`}
          initial={{ scale: 1.3, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={isDark ? {
            textShadow: "0 0 15px rgba(184,115,51,0.6)"
          } : {}}
        >
          {Math.round(progress)}%
        </motion.span>
      </motion.div>
    </div>
  );
}
