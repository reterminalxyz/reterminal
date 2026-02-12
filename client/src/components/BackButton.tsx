import { motion } from "framer-motion";

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
      whileTap={{ scale: 0.92 }}
      className={`fixed top-20 left-4 z-50 p-2.5
                 backdrop-blur-md rounded-sm
                 transition-all duration-200 ${
                   isDark 
                     ? "text-[#B87333]" 
                     : "text-[#B87333]"
                 }`}
      style={{ background: "transparent" }}
      data-testid="button-back"
    >
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5" />
        <path d="M12 19l-7-7 7-7" />
      </svg>
    </motion.button>
  );
}
