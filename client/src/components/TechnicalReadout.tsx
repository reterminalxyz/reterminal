import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TechnicalReadoutProps {
  lines: string[];
  className?: string;
  delay?: number;
}

export function TechnicalReadout({ lines, className = "", delay = 0 }: TechnicalReadoutProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);

  useEffect(() => {
    setVisibleLines([]);
    let timeout: NodeJS.Timeout;
    
    // Staggered appearance of lines
    lines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
      }, delay + (index * 600)); // 600ms between lines
    });

    return () => clearTimeout(timeout);
  }, [lines, delay]);

  return (
    <div className={`font-mono text-[10px] md:text-xs text-primary/80 leading-relaxed uppercase tracking-widest ${className}`}>
      {visibleLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="w-1 h-1 bg-primary rounded-full inline-block animate-pulse" />
          {line}
          {i === visibleLines.length - 1 && (
            <span className="animate-pulse inline-block w-2 h-3 bg-primary ml-1 align-middle" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
