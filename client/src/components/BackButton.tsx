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
      whileHover={{ x: -3 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed top-20 left-6 z-40 flex items-center gap-1 glass-panel px-3 py-2 rounded-md text-xs tracking-wider text-foreground/70 hover:text-primary hover:border-primary/30 transition-colors group"
      data-testid="button-back"
    >
      <ChevronLeft className="w-4 h-4 group-hover:text-primary transition-colors" />
      <span className="uppercase">Back</span>
    </motion.button>
  );
}
