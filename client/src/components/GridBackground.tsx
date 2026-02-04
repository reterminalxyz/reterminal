import { motion } from "framer-motion";

export function GridBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Base aluminum gradient */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(145deg, #F5F5F5 0%, #E8E8E8 50%, #F0F0F0 100%)"
        }}
      />
      
      {/* Subtle brushed metal texture */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            transparent,
            transparent 1px,
            rgba(184,115,51,0.5) 1px,
            rgba(184,115,51,0.5) 2px
          )`,
          backgroundSize: "4px 4px"
        }}
      />
      
      {/* Animated copper accent lines - Teenage Engineering style */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.08]">
        <defs>
          <pattern id="teGrid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path 
              d="M 80 0 L 0 0 0 80" 
              fill="none" 
              stroke="#B87333" 
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#teGrid)" />
      </svg>
      
      {/* Floating copper accent - top left */}
      <motion.div
        className="absolute top-8 left-6 w-16 h-[1px] bg-gradient-to-r from-[#B87333]/40 to-transparent"
        animate={{ 
          opacity: [0.3, 0.6, 0.3],
          x: [0, 5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Floating copper accent - top right */}
      <motion.div
        className="absolute top-12 right-8 w-12 h-[1px] bg-gradient-to-l from-[#B87333]/40 to-transparent"
        animate={{ 
          opacity: [0.2, 0.5, 0.2],
          x: [0, -3, 0]
        }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      
      {/* Floating copper accent - bottom left */}
      <motion.div
        className="absolute bottom-24 left-8 w-20 h-[1px] bg-gradient-to-r from-[#B87333]/30 to-transparent"
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          x: [0, 8, 0]
        }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      {/* Vertical accent - right side */}
      <motion.div
        className="absolute top-1/4 right-6 w-[1px] h-12 bg-gradient-to-b from-transparent via-[#B87333]/30 to-transparent"
        animate={{ 
          opacity: [0.2, 0.5, 0.2],
          y: [0, 10, 0]
        }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      />
      
      {/* Corner marks - TE style */}
      <div className="absolute top-4 left-4">
        <div className="w-4 h-[1px] bg-[#B87333]/20" />
        <div className="w-[1px] h-4 bg-[#B87333]/20" />
      </div>
      <div className="absolute top-4 right-4">
        <div className="w-4 h-[1px] bg-[#B87333]/20 ml-auto" />
        <div className="w-[1px] h-4 bg-[#B87333]/20 ml-auto" />
      </div>
      <div className="absolute bottom-20 left-4">
        <div className="w-[1px] h-4 bg-[#B87333]/20" />
        <div className="w-4 h-[1px] bg-[#B87333]/20" />
      </div>
      <div className="absolute bottom-20 right-4">
        <div className="w-[1px] h-4 bg-[#B87333]/20 ml-auto" />
        <div className="w-4 h-[1px] bg-[#B87333]/20 ml-auto" />
      </div>
      
      {/* Subtle pulsing dot - digital resistance */}
      <motion.div
        className="absolute top-1/3 left-1/4 w-1 h-1 rounded-full bg-[#B87333]"
        animate={{ 
          opacity: [0, 0.4, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
      />
      <motion.div
        className="absolute top-2/3 right-1/3 w-1 h-1 rounded-full bg-[#B87333]"
        animate={{ 
          opacity: [0, 0.3, 0],
          scale: [0.5, 1, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
}
