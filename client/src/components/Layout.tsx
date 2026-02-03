import { ReactNode } from "react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export function Layout({ children, className = "" }: LayoutProps) {
  return (
    <div className="relative w-full h-screen bg-[#1A1A1A] text-[#E0E0E0] overflow-hidden flex flex-col items-center justify-center font-mono">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10" />

      {/* CRT Scanlines */}
      <div className="scanlines pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay" />

      {/* Main Content Area */}
      <main className={`relative z-20 w-full max-w-4xl px-6 py-12 flex flex-col items-center justify-center h-full ${className}`}>
        {children}
      </main>

      {/* Decorative Corner Marks */}
      <div className="fixed top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-primary/50 z-30" />
      <div className="fixed top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-primary/50 z-30" />
      <div className="fixed bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-primary/50 z-30" />
      <div className="fixed bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-primary/50 z-30" />

      {/* Top Center Logo/Brand */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.3em] text-primary/70 z-30 font-bold">
        RE_CHAIN // SYS.01
      </div>
    </div>
  );
}
