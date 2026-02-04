import { motion } from "framer-motion";

export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Main grid pattern */}
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path 
              d="M 40 0 L 0 0 0 40" 
              fill="none" 
              stroke="#B87333" 
              strokeWidth="0.3"
              strokeOpacity="0.2"
            />
          </pattern>
          <pattern id="gridLarge" width="120" height="120" patternUnits="userSpaceOnUse">
            <path 
              d="M 120 0 L 0 0 0 120" 
              fill="none" 
              stroke="#B87333" 
              strokeWidth="0.5"
              strokeOpacity="0.15"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#gridLarge)" />
      </svg>

      {/* Animated scan lines */}
      <motion.div
        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#B87333]/40 to-transparent"
        initial={{ top: 0, opacity: 0 }}
        animate={{ 
          top: ["0%", "100%"],
          opacity: [0, 0.6, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Vertical scan line */}
      <motion.div
        className="absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#B87333]/30 to-transparent"
        initial={{ left: 0 }}
        animate={{ 
          left: ["0%", "100%"],
          opacity: [0, 0.4, 0]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "linear",
          delay: 2
        }}
      />

      {/* Corner accents with pulse */}
      <motion.div 
        className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[#B87333]/40"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div 
        className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[#B87333]/40"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      <motion.div 
        className="absolute bottom-20 left-4 w-8 h-8 border-l-2 border-b-2 border-[#B87333]/40"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
      <motion.div 
        className="absolute bottom-20 right-4 w-8 h-8 border-r-2 border-b-2 border-[#B87333]/40"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
      />

      {/* Data stream dots */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#B87333]/50"
          style={{
            left: `${15 + i * 15}%`,
            top: 0
          }}
          animate={{
            top: ["0%", "100%"],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}
