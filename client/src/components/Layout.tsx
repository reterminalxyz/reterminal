import { ReactNode } from "react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className = "" }: LayoutProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center font-mono bg-[#F5F5F7]">
      {/* Aluminum texture background */}
      <div className="fixed inset-0 aluminum-bg" />
      
      {/* Copper blueprint grid */}
      <div className="fixed inset-0 blueprint-grid opacity-100" />
      
      {/* Subtle gradient overlay for depth */}
      <div className="fixed inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/5 pointer-events-none" />

      {/* Main Content Area */}
      <main className={`relative z-20 w-full max-w-4xl px-6 py-12 flex flex-col items-center justify-center h-full ${className}`}>
        {children}
      </main>

      {/* Corner technical markings - copper */}
      <div className="fixed top-6 left-6 w-5 h-5 border-t-[0.5px] border-l-[0.5px] border-[#B87333]/40 z-30" />
      <div className="fixed top-6 right-6 w-5 h-5 border-t-[0.5px] border-r-[0.5px] border-[#B87333]/40 z-30" />
      <div className="fixed bottom-6 left-6 w-5 h-5 border-b-[0.5px] border-l-[0.5px] border-[#B87333]/40 z-30" />
      <div className="fixed bottom-6 right-6 w-5 h-5 border-b-[0.5px] border-r-[0.5px] border-[#B87333]/40 z-30" />

      {/* Top Center Logo/Brand */}
      <motion.div 
        className="fixed top-6 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="glass-panel px-4 py-2 rounded-md floating-shadow">
          <span className="text-[10px] tracking-[0.3em] text-[#B87333] font-semibold eink-text">
            RE_CHAIN // SYS.01
          </span>
        </div>
      </motion.div>
      
      {/* Status indicators - bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 z-30">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-600 pulse-copper" />
          <span className="text-[9px] tracking-wider text-[#3E3129]/50 uppercase eink-text">Online</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#B87333] pulse-copper" />
          <span className="text-[9px] tracking-wider text-[#3E3129]/50 uppercase eink-text">Lightning</span>
        </div>
      </div>
      
      {/* Left corner readout */}
      <div className="fixed top-14 left-6 z-30">
        <div className="tech-readout">
          <span>LIBERTÀ PROTOCOL</span>
        </div>
      </div>
      
      {/* Right corner readout */}
      <div className="fixed top-14 right-6 z-30 text-right">
        <div className="tech-readout">
          <span>2026.02.03</span>
        </div>
      </div>
    </div>
  );
}
