import { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TactileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
}

export function TactileButton({ 
  children, 
  className, 
  variant = "primary", 
  fullWidth = false,
  ...props 
}: TactileButtonProps) {
  const isPrimary = variant === "primary";
  const isSecondary = variant === "secondary";
  const isGhost = variant === "ghost";

  return (
    <motion.button
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ y: 0, scale: 0.98 }}
      className={cn(
        "btn-tactile relative group px-8 py-4 font-mono font-medium tracking-wider text-sm md:text-base uppercase transition-all duration-300 rounded-md",
        fullWidth ? "w-full" : "",
        isPrimary && "bg-primary text-[#1A1A1A] shadow-[0_4px_20px_rgba(255,87,34,0.3)] hover:shadow-[0_6px_30px_rgba(255,87,34,0.5)]",
        isSecondary && "glass-panel text-foreground/90 hover:border-primary/50 hover:text-primary hover:shadow-[0_0_20px_rgba(255,87,34,0.15)]",
        isGhost && "bg-transparent text-foreground/60 hover:text-primary hover:bg-primary/5",
        className
      )}
      {...props}
    >
      {/* Animated gradient overlay for primary */}
      {isPrimary && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-md"
          initial={false}
        />
      )}
      
      {/* Technical markings on corners */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-current opacity-30" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-30" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-30" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-current opacity-30" />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
