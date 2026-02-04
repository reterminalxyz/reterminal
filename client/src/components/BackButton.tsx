import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  isDark?: boolean;
}

export function BackButton({ onClick, isDark = false }: BackButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: -2 }}
      whileTap={{ scale: 0.95 }}
      className={`absolute top-6 left-4 z-30 flex items-center gap-1 px-3 py-2 
                 border border-[#B87333]/50 hover:border-[#B87333] 
                 transition-colors duration-200 ${
                   isDark 
                     ? "text-[#E8E8E8]/70 hover:text-[#E8E8E8]" 
                     : "text-[#3E3129]/70 hover:text-[#3E3129]"
                 }`}
      data-testid="button-back"
    >
      <ChevronLeft className="w-4 h-4" />
      <span className="text-[10px] tracking-[2px] font-mono">НАЗАД</span>
    </motion.button>
  );
}
