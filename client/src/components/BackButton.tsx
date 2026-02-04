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
      className={`fixed top-4 left-4 z-50 flex items-center gap-1 px-2 py-1.5
                 bg-opacity-80 backdrop-blur-sm
                 border border-[#B87333]/40 hover:border-[#B87333] 
                 transition-colors duration-200 ${
                   isDark 
                     ? "bg-[#2A2A2A]/80 text-[#E8E8E8]/70 hover:text-[#E8E8E8]" 
                     : "bg-[#F5F5F5]/80 text-[#3E3129]/70 hover:text-[#3E3129]"
                 }`}
      data-testid="button-back"
    >
      <ChevronLeft className="w-3 h-3" />
      <span className="text-[9px] tracking-[1px] font-mono">НАЗАД</span>
    </motion.button>
  );
}
