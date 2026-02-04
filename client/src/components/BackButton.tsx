import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
  isDark?: boolean;
}

export function BackButton({ onClick, isDark = false }: BackButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed top-20 left-4 z-50 flex items-center gap-2 px-5 py-3
                 backdrop-blur-md rounded-sm
                 border-2 shadow-lg
                 transition-all duration-200 ${
                   isDark 
                     ? "bg-[#1E1E1E]/95 border-[#B87333] text-[#B87333] hover:bg-[#2A2A2A]" 
                     : "bg-white/95 border-[#B87333] text-[#B87333] hover:bg-[#F5F5F5]"
                 }`}
      data-testid="button-back"
    >
      <ArrowLeft className="w-5 h-5" strokeWidth={2.5} />
      <span className="text-[12px] tracking-[3px] font-bold font-mono">НАЗАД</span>
    </motion.button>
  );
}
