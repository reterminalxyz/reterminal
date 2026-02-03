import { ButtonHTMLAttributes } from "react";
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
    <button
      className={cn(
        "relative group px-8 py-4 font-mono font-medium tracking-wider text-sm md:text-base uppercase transition-all duration-75 rounded-md eink-text",
        fullWidth ? "w-full" : "",
        isPrimary && "btn-physical-primary",
        isSecondary && "btn-physical text-[#3E3129]",
        isGhost && "bg-transparent text-[#3E3129]/60 hover:text-[#B87333] hover:bg-[#B87333]/5 border-0",
        className
      )}
      {...props}
    >
      {/* Technical markings on corners */}
      <span className="absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t-[0.5px] border-l-[0.5px] border-current opacity-30" />
      <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t-[0.5px] border-r-[0.5px] border-current opacity-30" />
      <span className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b-[0.5px] border-l-[0.5px] border-current opacity-30" />
      <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b-[0.5px] border-r-[0.5px] border-current opacity-30" />
      
      <span className="relative z-10">{children}</span>
    </button>
  );
}
