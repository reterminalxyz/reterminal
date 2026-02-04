import { motion } from "framer-motion";

interface GridBackgroundProps {
  intensity?: "high" | "low";
  variant?: "light" | "dark";
}

export function GridBackground({ intensity = "high", variant = "light" }: GridBackgroundProps) {
  const isHigh = intensity === "high";
  const isDark = variant === "dark";
  
  // Subtle opacity values - toned down
  const orbOpacityBase = isDark ? 0.35 : 0.3;
  const orbOpacityHigh = isDark ? 0.5 : 0.45;
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base gradient - light or dark */}
      <div 
        className="absolute inset-0"
        style={{
          background: isDark 
            ? "linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 50%, #1F1F1F 100%)"
            : "linear-gradient(135deg, #F9F9F9 0%, #E6E6E6 50%, #F4F4F4 100%)"
        }}
      />
      
      {/* Very subtle grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: isHigh ? 0.08 : 0.05 }}>
        <defs>
          <pattern id="subtleGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#B87333" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#subtleGrid)" />
      </svg>
      
      {/* Copper orbs - subtle */}
      {/* Large slow-moving orb */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(184,115,51,${isHigh ? 0.4 : 0.25}) 0%, rgba(184,115,51,${isHigh ? 0.2 : 0.1}) 40%, transparent 70%)`,
          top: "2%",
          left: "-5%",
          filter: "blur(25px)"
        }}
        animate={{
          x: [0, 120, 0],
          y: [0, 80, 0],
          scale: [1, 1.4, 1],
          opacity: [orbOpacityBase, orbOpacityHigh, orbOpacityBase]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Medium orb - right side */}
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(184,115,51,${isHigh ? 0.35 : 0.2}) 0%, rgba(184,115,51,${isHigh ? 0.15 : 0.08}) 40%, transparent 70%)`,
          top: "40%",
          right: "-5%",
          filter: "blur(20px)"
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -60, 0],
          scale: [1, 1.5, 1],
          opacity: [orbOpacityBase, orbOpacityHigh, orbOpacityBase]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
      />
      
      {/* Small bright orb - bottom left */}
      <motion.div
        className="absolute w-64 h-64 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(184,115,51,${isHigh ? 0.4 : 0.25}) 0%, rgba(184,115,51,${isHigh ? 0.2 : 0.12}) 35%, transparent 60%)`,
          bottom: "15%",
          left: "10%",
          filter: "blur(15px)"
        }}
        animate={{
          x: [0, 90, 0],
          y: [0, -40, 0],
          opacity: [orbOpacityBase, orbOpacityHigh, orbOpacityBase]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      
      {/* Extra floating orb - center */}
      <motion.div
        className="absolute w-56 h-56 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(184,115,51,${isHigh ? 0.45 : 0.3}) 0%, rgba(184,115,51,0.18) 50%, transparent 70%)`,
          top: "55%",
          left: "45%",
          filter: "blur(12px)"
        }}
        animate={{
          x: [-60, 60, -60],
          y: [0, -50, 0],
          scale: [0.9, 1.3, 0.9],
          opacity: [0.45, orbOpacityHigh, 0.45]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* Light beams - ONLY on high intensity (Q1), FASTER */}
      {isHigh && (
        <>
          {/* Flowing horizontal light beam - FAST */}
          <motion.div
            className="absolute h-1 w-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(184,115,51,0.55) 50%, transparent 100%)",
              top: "30%"
            }}
            animate={{
              x: ["-100%", "100%"],
              opacity: [0, 0.95, 0]
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Second horizontal beam - offset timing */}
          <motion.div
            className="absolute h-0.5 w-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(184,115,51,0.45) 50%, transparent 100%)",
              top: "70%"
            }}
            animate={{
              x: ["100%", "-100%"],
              opacity: [0, 0.85, 0]
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Vertical light beam - FAST */}
          <motion.div
            className="absolute w-1 h-full"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(184,115,51,0.5) 50%, transparent 100%)",
              left: "75%"
            }}
            animate={{
              y: ["-100%", "100%"],
              opacity: [0, 0.9, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          />
          
          {/* Pulsing corner accents */}
          <motion.div
            className="absolute top-4 left-4"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <div className="w-10 h-[3px] bg-[#B87333]" />
            <div className="w-[3px] h-10 bg-[#B87333]" />
          </motion.div>
          
          <motion.div
            className="absolute top-4 right-4 flex flex-col items-end"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
          >
            <div className="w-10 h-[3px] bg-[#B87333]" />
            <div className="w-[3px] h-10 bg-[#B87333] self-end" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-28 left-4"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
          >
            <div className="w-[3px] h-10 bg-[#B87333]" />
            <div className="w-10 h-[3px] bg-[#B87333]" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-28 right-4 flex flex-col items-end"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
          >
            <div className="w-[3px] h-10 bg-[#B87333] self-end" />
            <div className="w-10 h-[3px] bg-[#B87333]" />
          </motion.div>
        </>
      )}
    </div>
  );
}
