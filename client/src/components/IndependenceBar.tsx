import { motion } from "framer-motion";

interface IndependenceBarProps {
  score: number;
  maxScore: number;
}

export function IndependenceBar({ score, maxScore }: IndependenceBarProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4">
      <div className="flex flex-col items-center gap-2 max-w-lg mx-auto">
        <motion.span 
          className="text-[10px] text-[#B87333] tracking-[3px] font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          НЕЗАВИСИМОСТЬ
        </motion.span>
        
        <div className="w-full h-2 bg-[#E8E8E8] rounded-full overflow-hidden border border-[#B87333]/30">
          <motion.div
            className="h-full bg-gradient-to-r from-[#B87333] to-[#D4956A]"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex justify-between w-full text-[9px] text-[#3E3129]/50 tracking-wider">
          <span>0%</span>
          <motion.span 
            key={score}
            className="text-[#B87333] font-medium"
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
          >
            {Math.round(percentage)}%
          </motion.span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
