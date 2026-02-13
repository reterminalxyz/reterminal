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
      className="fixed top-28 left-4 z-50 px-3 py-2.5 transition-all duration-200"
      style={{
        background: "linear-gradient(135deg, #7A3B20 0%, #A0522D 20%, #B87333 40%, #D4956A 60%, #E8B89D 80%, #B87333 100%)",
        boxShadow: "0 0 8px rgba(184, 115, 51, 0.3), inset 0 1px 1px rgba(232, 184, 157, 0.3)",
        border: "1px solid rgba(212, 149, 106, 0.5)",
        borderRadius: 0,
      }}
      data-testid="button-back"
    >
      <svg
        width="24"
        height="16"
        viewBox="0 0 24 16"
        fill="none"
        stroke="#F5F5F5"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 8H2" />
        <path d="M8 14L2 8L8 2" />
      </svg>
    </motion.button>
  );
}
