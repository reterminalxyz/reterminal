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
      whileTap={{ scale: 0.95 }}
      className="fixed top-28 left-4 z-50 px-4 py-2 transition-all duration-200"
      style={{
        background: "#F5F5F5",
        border: "1px solid rgba(184, 115, 51, 0.2)",
        borderRadius: 0,
      }}
      data-testid="button-back"
    >
      <svg
        width="28"
        height="14"
        viewBox="0 0 28 14"
        fill="none"
        stroke="#B87333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M26 7H2" />
        <path d="M7 13L1 7L7 1" />
      </svg>
    </motion.button>
  );
}
