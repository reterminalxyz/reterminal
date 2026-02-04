import { motion } from "framer-motion";

interface IndependenceBarProps {
  progress: number; // 0-100 percentage
  phase: "phase_1" | "phase_2" | "complete";
}

export function IndependenceBar({ progress, phase }: IndependenceBarProps) {
  const isDark = phase === "phase_2" || phase === "complete";
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="flex flex-col items-center gap-2 max-w-lg mx-auto">
        <motion.span 
          className={`text-[10px] tracking-[3px] font-medium ${
            isDark ? "text-[#B87333]" : "text-[#B87333]"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          НЕЗАВИСИМОСТЬ
        </motion.span>
        
        <div className={`w-full h-2 rounded-full overflow-hidden border border-[#B87333]/30 ${
          isDark ? "bg-[#1E1E1E]" : "bg-[#E8E8E8]"
        }`}>
          <motion.div
            className="h-full relative overflow-hidden"
            style={{
              background: "linear-gradient(90deg, #B87333 0%, #D4956A 50%, #B87333 100%)"
            }}
            initial={{ width: "0%" }}
            animate={{ width: `${Math.max(0, progress)}%` }}
            transition={{ 
              duration: 0.8, 
              ease: [0.25, 0.46, 0.45, 0.94] 
            }}
          >
            {/* Animated shimmer effect */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)"
              }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatDelay: 1,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
        
        <div className={`flex justify-between w-full text-[9px] tracking-wider ${
          isDark ? "text-[#E8E8E8]/50" : "text-[#3E3129]/50"
        }`}>
          <span>0%</span>
          <motion.span 
            key={progress}
            className="text-[#B87333] font-medium"
            initial={{ scale: 1.3, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {Math.round(progress)}%
          </motion.span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
