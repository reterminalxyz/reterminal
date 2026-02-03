import { ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TactileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
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

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ y: 0, scale: 0.98 }}
      className={cn(
        "btn-tactile relative group px-8 py-4 font-mono font-medium tracking-wider text-sm md:text-base uppercase transition-all duration-300",
        fullWidth ? "w-full" : "",
        isPrimary 
          ? "bg-primary text-[#1A1A1A] hover:bg-primary/90 hover:shadow-[0_0_15px_rgba(255,87,34,0.4)]" 
          : "bg-transparent text-[#E0E0E0] border border-[#E0E0E0]/30 hover:border-primary hover:text-primary hover:shadow-[0_0_10px_rgba(255,87,34,0.2)]",
        className
      )}
      {...props}
    >
      {/* Technical markings on corners */}
      <span className="absolute top-0 left-0 w-1 h-1 border-t border-l border-current opacity-50" />
      <span className="absolute top-0 right-0 w-1 h-1 border-t border-r border-current opacity-50" />
      <span className="absolute bottom-0 left-0 w-1 h-1 border-b border-l border-current opacity-50" />
      <span className="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-current opacity-50" />
      
      {children}
    </motion.button>
  );
}
