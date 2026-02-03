import { ReactNode } from "react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className = "" }: LayoutProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center font-mono">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#1e2128] via-[#252931] to-[#1a1d23]" />
      
      {/* Animated gradient orbs for depth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-[120px]"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500/5 rounded-full blur-[120px]"
          animate={{ 
            x: [0, -30, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      
      {/* Subtle dot pattern overlay */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20 pointer-events-none" />
      
      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(20,22,28,0.7)_100%)] pointer-events-none z-10" />

      {/* Very subtle scanlines */}
      <div className="scanlines pointer-events-none fixed inset-0 z-50 opacity-10" />

      {/* Main Content Area - Glass Panel */}
      <main className={`relative z-20 w-full max-w-4xl px-6 py-12 flex flex-col items-center justify-center h-full ${className}`}>
        {children}
      </main>

      {/* Decorative Corner Marks - more subtle */}
      <div className="fixed top-6 left-6 w-6 h-6 border-t border-l border-primary/30 z-30" />
      <div className="fixed top-6 right-6 w-6 h-6 border-t border-r border-primary/30 z-30" />
      <div className="fixed bottom-6 left-6 w-6 h-6 border-b border-l border-primary/30 z-30" />
      <div className="fixed bottom-6 right-6 w-6 h-6 border-b border-r border-primary/30 z-30" />

      {/* Top Center Logo/Brand with subtle animation */}
      <motion.div 
        className="fixed top-6 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="glass-panel px-4 py-2 rounded-md">
          <span className="text-[10px] tracking-[0.3em] text-primary/90 font-bold">
            RE_CHAIN // SYS.01
          </span>
        </div>
      </motion.div>
      
      {/* Status indicators - bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-indicator" />
          <span className="text-[9px] tracking-wider text-foreground/40 uppercase">Online</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-indicator" />
          <span className="text-[9px] tracking-wider text-foreground/40 uppercase">Lightning</span>
        </div>
      </div>
    </div>
  );
}
