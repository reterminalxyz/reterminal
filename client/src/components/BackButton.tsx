import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onClick={onClick}
      className="fixed top-24 left-6 z-40 flex items-center gap-1 btn-physical px-3 py-2 rounded-md text-xs tracking-wider text-[#3E3129]/70 hover:text-[#B87333] transition-colors group"
      data-testid="button-back"
    >
      <ChevronLeft className="w-4 h-4 group-hover:text-[#B87333] transition-colors" />
      <span className="uppercase eink-text">Back</span>
    </motion.button>
  );
}
