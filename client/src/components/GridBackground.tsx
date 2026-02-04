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
      
      {/* Mesmerizing animated copper orbs - BRIGHTER and LARGER on high intensity */}
      {isHigh && (
        <>
          {/* Large slow-moving orb - MUCH BRIGHTER */}
          <motion.div
            className="absolute w-80 h-80 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184,115,51,0.5) 0%, rgba(184,115,51,0.2) 40%, transparent 70%)",
              top: "5%",
              left: "0%",
              filter: "blur(20px)"
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, 60, 0],
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Medium orb - BRIGHTER */}
          <motion.div
            className="absolute w-64 h-64 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184,115,51,0.45) 0%, rgba(184,115,51,0.15) 40%, transparent 70%)",
              top: "45%",
              right: "5%",
              filter: "blur(15px)"
            }}
            animate={{
              x: [0, -80, 0],
              y: [0, -50, 0],
              scale: [1, 1.4, 1],
              opacity: [0.5, 0.85, 0.5]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          
          {/* Small bright orb - VERY BRIGHT */}
          <motion.div
            className="absolute w-48 h-48 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184,115,51,0.55) 0%, rgba(184,115,51,0.25) 35%, transparent 60%)",
              bottom: "20%",
              left: "15%",
              filter: "blur(12px)"
            }}
            animate={{
              x: [0, 70, 0],
              y: [0, -30, 0],
              opacity: [0.55, 0.9, 0.55]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          
          {/* Extra floating orb for more dynamism */}
          <motion.div
            className="absolute w-40 h-40 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184,115,51,0.6) 0%, rgba(184,115,51,0.2) 50%, transparent 70%)",
              top: "60%",
              left: "50%",
              filter: "blur(10px)"
            }}
            animate={{
              x: [-50, 50, -50],
              y: [0, -40, 0],
              scale: [0.8, 1.2, 0.8],
              opacity: [0.4, 0.8, 0.4]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          
          {/* Flowing horizontal light beam - FASTER */}
          <motion.div
            className="absolute h-1 w-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(184,115,51,0.5) 50%, transparent 100%)",
              top: "30%"
            }}
            animate={{
              x: ["-100%", "100%"],
              opacity: [0, 0.9, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Second horizontal beam - offset timing */}
          <motion.div
            className="absolute h-0.5 w-full"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(184,115,51,0.4) 50%, transparent 100%)",
              top: "70%"
            }}
            animate={{
              x: ["100%", "-100%"],
              opacity: [0, 0.8, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          
          {/* Vertical light beam - FASTER */}
          <motion.div
            className="absolute w-1 h-full"
            style={{
              background: "linear-gradient(180deg, transparent 0%, rgba(184,115,51,0.45) 50%, transparent 100%)",
              left: "75%"
            }}
            animate={{
              y: ["-100%", "100%"],
              opacity: [0, 0.85, 0]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          
          {/* Pulsing corner accents - BRIGHTER */}
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
            className="absolute bottom-24 left-4"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
          >
            <div className="w-[3px] h-10 bg-[#B87333]" />
            <div className="w-10 h-[3px] bg-[#B87333]" />
          </motion.div>
          
          <motion.div
            className="absolute bottom-24 right-4 flex flex-col items-end"
            animate={{ opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
          >
            <div className="w-[3px] h-10 bg-[#B87333] self-end" />
            <div className="w-10 h-[3px] bg-[#B87333]" />
          </motion.div>
        </>
      )}
      
      {/* Subtle version for other screens */}
      {!isHigh && (
        <>
          <motion.div
            className="absolute w-48 h-48 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184,115,51,0.1) 0%, transparent 70%)",
              top: "20%",
              left: "10%",
              filter: "blur(10px)"
            }}
            animate={{
              x: [0, 30, 0],
              opacity: [0.25, 0.4, 0.25]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-32 h-32 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(184,115,51,0.08) 0%, transparent 70%)",
              bottom: "30%",
              right: "15%",
              filter: "blur(8px)"
            }}
            animate={{
              x: [0, -20, 0],
              opacity: [0.2, 0.35, 0.2]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </>
      )}
    </div>
  );
}
