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
    
    lines.forEach((line, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line]);
      }, delay + (index * 600));
    });
  }, [lines, delay]);

  return (
    <div className={`font-mono text-[10px] md:text-xs text-[#B87333]/70 leading-relaxed uppercase tracking-widest ${className}`}>
      {visibleLines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <span className="w-1 h-1 bg-[#B87333] rounded-full inline-block breathe" />
          <span className="eink-text">{line}</span>
          {i === visibleLines.length - 1 && (
            <span className="breathe inline-block w-2 h-3 bg-[#B87333]/60 ml-1 align-middle" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
