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
      whileHover={{ x: -3, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      className={`fixed top-4 left-4 z-50 flex items-center gap-1 px-3 py-2
                 backdrop-blur-md border-2 
                 transition-all duration-200 ${
                   isDark 
                     ? "bg-[#2A2A2A]/90 border-[#B87333]/60 text-[#E8E8E8] hover:border-[#B87333] hover:bg-[#3A3A3A]" 
                     : "bg-[#F5F5F5]/90 border-[#B87333]/50 text-[#3E3129] hover:border-[#B87333] hover:bg-white"
                 }`}
      data-testid="button-back"
    >
      <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
      <span className="text-[10px] tracking-[2px] font-bold font-mono">НАЗАД</span>
    </motion.button>
  );
}
