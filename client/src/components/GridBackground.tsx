import { motion } from "framer-motion";

interface GridBackgroundProps {
  intensity?: "high" | "low";
}

export function GridBackground({ intensity = "high" }: GridBackgroundProps) {
  const isHigh = intensity === "high";
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base aluminum gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #F9F9F9 0%, #E6E6E6 50%, #F4F4F4 100%)"
        }}
      />
      
      {/* Very subtle grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: isHigh ? 0.08 : 0.04 }}>
        <defs>
          <pattern id="subtleGrid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#B87333" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#subtleGrid)" />
      </svg>
      
      {/* Mesmerizing animated copper orbs - only on high intensity */}
      {isHigh && (
        <>
          {/* Large slow-moving orb */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184,115,51,0.15) 0%, transparent 70%)",
              top: "10%",
              left: "5%"
            }}
            animate={{
              x: [0, 80, 0],
              y: [0, 40, 0],
              scale: [1, 1.2, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Medium orb - different timing */}
          <motion.div
            className="absolute w-48 h-48 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184,115,51,0.12) 0%, transparent 70%)",
              top: "50%",
              right: "10%"
            }}
            animate={{
              x: [0, -60, 0],
              y: [0, -30, 0],
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          
          {/* Small bright orb */}
          <motion.div
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184,115,51,0.2) 0%, transparent 60%)",
              bottom: "25%",
              left: "20%"
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, -20, 0],
              opacity: [0.35, 0.65, 0.35]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          />
          
          {/* Flowing horizontal light beam */}
          <motion.div
            className="absolute h-1 w-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(184,115,51,0.3) 50%, transparent 100%)",
              top: "35%"
            }}
            animate={{
              x: ["-100%", "100%"],
              opacity: [0, 0.8, 0]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Vertical light beam */}
          <motion.div
            className="absolute w-1 h-full"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(184,115,51,0.25) 50%, transparent 100%)",
              left: "70%"
            }}
            animate={{
              y: ["-100%", "100%"],
              opacity: [0, 0.7, 0]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          
          {/* Pulsing corner accents */}
          <motion.div
            className="absolute top-4 left-4"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <div className="w-8 h-[2px] bg-[#B87333]" />
            <div className="w-[2px] h-8 bg-[#B87333]" />
          </motion.div>
          
          <motion.div
            className="absolute top-4 right-4 flex flex-col items-end"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
          >
            <div className="w-8 h-[2px] bg-[#B87333]" />
            <div className="w-[2px] h-8 bg-[#B87333] self-end" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-24 left-4"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          >
            <div className="w-[2px] h-8 bg-[#B87333]" />
            <div className="w-8 h-[2px] bg-[#B87333]" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-24 right-4 flex flex-col items-end"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          >
            <div className="w-[2px] h-8 bg-[#B87333] self-end" />
            <div className="w-8 h-[2px] bg-[#B87333]" />
          </motion.div>
        </>
      )}
      
      {/* Subtle version for other screens */}
      {!isHigh && (
        <>
          <motion.div
            className="absolute w-48 h-48 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184,115,51,0.06) 0%, transparent 70%)",
              top: "20%",
              left: "10%"
            }}
            animate={{
              x: [0, 30, 0],
              opacity: [0.2, 0.35, 0.2]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184,115,51,0.05) 0%, transparent 70%)",
              bottom: "30%",
              right: "15%"
            }}
            animate={{
              x: [0, -20, 0],
              opacity: [0.15, 0.3, 0.15]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </>
      )}
    </div>
  );
}
