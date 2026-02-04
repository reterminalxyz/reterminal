import { motion } from "framer-motion";

interface GridBackgroundProps {
  intensity?: "high" | "low"; // high for first screen, low for others
}

export function GridBackground({ intensity = "high" }: GridBackgroundProps) {
  const isHigh = intensity === "high";
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base aluminum gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(145deg, #F8F8F8 0%, #E8E8E8 50%, #F2F2F2 100%)"
        }}
      />
      
      {/* Subtle brushed metal texture */}
      <div 
        className="absolute inset-0"
        style={{
          opacity: isHigh ? 0.04 : 0.02,
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 1px,
            rgba(184,115,51,0.4) 1px,
            rgba(184,115,51,0.4) 2px
          )`,
          backgroundSize: "3px 3px"
        }}
      />
      
      {/* Animated grid */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: isHigh ? 0.12 : 0.06 }}>
        <defs>
          <pattern id="animGrid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#B87333" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#animGrid)" />
      </svg>
      
      {/* Floating horizontal copper lines - mesmerizing animation */}
      {isHigh && (
        <>
          <motion.div
            className="absolute h-[2px] w-24 bg-gradient-to-r from-transparent via-[#B87333] to-transparent"
            style={{ top: "15%", left: "10%" }}
            animate={{ 
              x: [0, 100, 0],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute h-[2px] w-32 bg-gradient-to-r from-transparent via-[#B87333] to-transparent"
            style={{ top: "25%", right: "15%" }}
            animate={{ 
              x: [0, -80, 0],
              opacity: [0.2, 0.6, 0.2]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
          <motion.div
            className="absolute h-[2px] w-20 bg-gradient-to-r from-transparent via-[#B87333] to-transparent"
            style={{ top: "70%", left: "20%" }}
            animate={{ 
              x: [0, 60, 0],
              opacity: [0.25, 0.5, 0.25]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          <motion.div
            className="absolute h-[2px] w-28 bg-gradient-to-r from-transparent via-[#B87333] to-transparent"
            style={{ top: "80%", right: "10%" }}
            animate={{ 
              x: [0, -50, 0],
              opacity: [0.2, 0.55, 0.2]
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
          
          {/* Vertical floating lines */}
          <motion.div
            className="absolute w-[2px] h-20 bg-gradient-to-b from-transparent via-[#B87333] to-transparent"
            style={{ left: "8%", top: "30%" }}
            animate={{ 
              y: [0, 40, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          />
          <motion.div
            className="absolute w-[2px] h-16 bg-gradient-to-b from-transparent via-[#B87333] to-transparent"
            style={{ right: "12%", top: "40%" }}
            animate={{ 
              y: [0, -30, 0],
              opacity: [0.25, 0.45, 0.25]
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </>
      )}
      
      {/* Pulsing corner nodes - digital resistance */}
      <motion.div
        className="absolute w-2 h-2 rounded-full bg-[#B87333]"
        style={{ top: "20%", left: "25%", opacity: isHigh ? 1 : 0.5 }}
        animate={{ 
          scale: [0.8, 1.2, 0.8],
          opacity: isHigh ? [0.3, 0.7, 0.3] : [0.15, 0.35, 0.15]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full bg-[#B87333]"
        style={{ top: "65%", right: "30%", opacity: isHigh ? 1 : 0.5 }}
        animate={{ 
          scale: [1, 1.4, 1],
          opacity: isHigh ? [0.25, 0.6, 0.25] : [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute w-1 h-1 rounded-full bg-[#B87333]"
        style={{ bottom: "35%", left: "35%", opacity: isHigh ? 1 : 0.5 }}
        animate={{ 
          scale: [0.9, 1.3, 0.9],
          opacity: isHigh ? [0.2, 0.5, 0.2] : [0.1, 0.25, 0.1]
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 2 }}
      />
      
      {/* Corner marks - TE style */}
      <div className="absolute top-3 left-3">
        <motion.div 
          className="w-5 h-[2px] bg-[#B87333]" 
          style={{ opacity: isHigh ? 0.4 : 0.2 }}
          animate={{ opacity: isHigh ? [0.3, 0.5, 0.3] : [0.15, 0.25, 0.15] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div 
          className="w-[2px] h-5 bg-[#B87333]" 
          style={{ opacity: isHigh ? 0.4 : 0.2 }}
          animate={{ opacity: isHigh ? [0.3, 0.5, 0.3] : [0.15, 0.25, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />
      </div>
      <div className="absolute top-3 right-3 flex flex-col items-end">
        <motion.div 
          className="w-5 h-[2px] bg-[#B87333]" 
          style={{ opacity: isHigh ? 0.4 : 0.2 }}
          animate={{ opacity: isHigh ? [0.3, 0.5, 0.3] : [0.15, 0.25, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
        />
        <motion.div 
          className="w-[2px] h-5 bg-[#B87333] self-end" 
          style={{ opacity: isHigh ? 0.4 : 0.2 }}
          animate={{ opacity: isHigh ? [0.3, 0.5, 0.3] : [0.15, 0.25, 0.15] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
        />
      </div>
      <div className="absolute bottom-20 left-3">
        <motion.div 
          className="w-[2px] h-5 bg-[#B87333]" 
          style={{ opacity: isHigh ? 0.4 : 0.2 }}
        />
        <motion.div 
          className="w-5 h-[2px] bg-[#B87333]" 
          style={{ opacity: isHigh ? 0.4 : 0.2 }}
        />
      </div>
      <div className="absolute bottom-20 right-3 flex flex-col items-end">
        <motion.div 
          className="w-[2px] h-5 bg-[#B87333] self-end" 
          style={{ opacity: isHigh ? 0.4 : 0.2 }}
        />
        <motion.div 
          className="w-5 h-[2px] bg-[#B87333]" 
          style={{ opacity: isHigh ? 0.4 : 0.2 }}
        />
      </div>
      
      {/* Diagonal accent lines for depth - only on high intensity */}
      {isHigh && (
        <>
          <motion.div
            className="absolute h-[1px] w-40 origin-left"
            style={{ 
              top: "45%", 
              left: "5%",
              background: "linear-gradient(90deg, rgba(184,115,51,0.4) 0%, transparent 100%)",
              transform: "rotate(-15deg)"
            }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute h-[1px] w-32 origin-right"
            style={{ 
              top: "55%", 
              right: "5%",
              background: "linear-gradient(270deg, rgba(184,115,51,0.4) 0%, transparent 100%)",
              transform: "rotate(12deg)"
            }}
            animate={{ opacity: [0.15, 0.35, 0.15] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1.5 }}
          />
        </>
      )}
    </div>
  );
}
