import { motion } from "framer-motion";

interface CircuitBoardProps {
  completedLayers: number;
  onChipClick?: () => void;
}

export function CircuitBoard({ completedLayers, onChipClick }: CircuitBoardProps) {
  const allComplete = completedLayers >= 3;
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 800 600" 
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* NFC-style antenna loops - like the physical card */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: completedLayers >= 1 ? 0.4 : 0.15 }}
          transition={{ duration: 1 }}
        >
          {/* Outer loop */}
          <motion.rect
            x="150"
            y="150"
            width="500"
            height="300"
            rx="20"
            stroke="#B87333"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 1 ? 1 : 0.3 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
          {/* Middle loop */}
          <motion.rect
            x="180"
            y="180"
            width="440"
            height="240"
            rx="15"
            stroke="#B87333"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 1 ? 1 : 0.2 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          />
          {/* Inner loop */}
          <motion.rect
            x="210"
            y="210"
            width="380"
            height="180"
            rx="10"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 2 ? 1 : 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
          />
        </motion.g>

        {/* Connection traces from loops to center chip */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: completedLayers >= 2 ? 0.6 : 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Left trace to chip */}
          <motion.path
            d="M210 300 H320 L340 290"
            stroke="#B87333"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 2 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          {/* Right trace from chip */}
          <motion.path
            d="M460 290 L480 300 H590"
            stroke="#B87333"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 2 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          />
          {/* Top trace */}
          <motion.path
            d="M400 210 V260"
            stroke="#B87333"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 2 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          {/* Bottom trace */}
          <motion.path
            d="M400 340 V390"
            stroke="#B87333"
            strokeWidth="1.5"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 3 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
        </motion.g>

        {/* Central chip - becomes the CTA button */}
        <motion.g
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ 
            opacity: completedLayers >= 2 ? 1 : 0,
            scale: completedLayers >= 2 ? 1 : 0.5
          }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ transformOrigin: "400px 300px" }}
        >
          {/* Chip outer frame */}
          <motion.rect
            x="340"
            y="260"
            width="120"
            height="80"
            rx="4"
            stroke="#B87333"
            strokeWidth={allComplete ? 2.5 : 1.5}
            fill={allComplete ? "rgba(184,115,51,0.15)" : "none"}
            className={allComplete ? "pointer-events-auto cursor-pointer" : ""}
            onClick={allComplete ? onChipClick : undefined}
            animate={allComplete ? {
              strokeOpacity: [0.8, 1, 0.8],
              fillOpacity: [0.1, 0.2, 0.1]
            } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Chip pins - left side */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: completedLayers >= 3 ? 1 : 0 }}
            transition={{ delay: 0.8 }}
          >
            {[275, 290, 305, 320].map((y, i) => (
              <motion.line
                key={`left-${i}`}
                x1="330"
                y1={y}
                x2="340"
                y2={y}
                stroke="#B87333"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: completedLayers >= 3 ? 1 : 0 }}
                transition={{ delay: 0.8 + i * 0.05 }}
              />
            ))}
          </motion.g>
          
          {/* Chip pins - right side */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: completedLayers >= 3 ? 1 : 0 }}
            transition={{ delay: 0.9 }}
          >
            {[275, 290, 305, 320].map((y, i) => (
              <motion.line
                key={`right-${i}`}
                x1="460"
                y1={y}
                x2="470"
                y2={y}
                stroke="#B87333"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: completedLayers >= 3 ? 1 : 0 }}
                transition={{ delay: 0.9 + i * 0.05 }}
              />
            ))}
          </motion.g>
          
          {/* Internal chip circuitry */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: completedLayers >= 3 ? 0.7 : 0 }}
            transition={{ delay: 1 }}
          >
            <motion.rect x="355" y="275" width="30" height="20" fill="#B87333" fillOpacity="0.3" />
            <motion.rect x="395" y="275" width="50" height="8" fill="#B87333" fillOpacity="0.2" />
            <motion.rect x="395" y="288" width="50" height="8" fill="#B87333" fillOpacity="0.2" />
            <motion.rect x="355" y="305" width="90" height="20" fill="#B87333" fillOpacity="0.15" />
            <motion.line x1="360" y1="315" x2="440" y2="315" stroke="#B87333" strokeWidth="0.5" />
          </motion.g>
        </motion.g>

        {/* Pulse effect when complete */}
        {allComplete && (
          <>
            <motion.rect
              x="340"
              y="260"
              width="120"
              height="80"
              rx="4"
              stroke="#B87333"
              strokeWidth="1"
              fill="none"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ 
                scale: [1, 1.3, 1.5],
                opacity: [0.6, 0.2, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeOut"
              }}
              style={{ transformOrigin: "400px 300px" }}
            />
            <motion.rect
              x="340"
              y="260"
              width="120"
              height="80"
              rx="4"
              stroke="#B87333"
              strokeWidth="0.5"
              fill="none"
              initial={{ scale: 1, opacity: 0.4 }}
              animate={{ 
                scale: [1, 1.5, 2],
                opacity: [0.4, 0.1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: 0.5,
                ease: "easeOut"
              }}
              style={{ transformOrigin: "400px 300px" }}
            />
          </>
        )}
        
        {/* Connection nodes at trace endpoints */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: completedLayers >= 3 ? 0.8 : 0 }}
          transition={{ delay: 1.1 }}
        >
          <circle cx="150" cy="300" r="4" fill="#B87333" />
          <circle cx="650" cy="300" r="4" fill="#B87333" />
          <circle cx="400" cy="150" r="4" fill="#B87333" />
          <circle cx="400" cy="450" r="4" fill="#B87333" />
        </motion.g>
      </svg>
      
      {/* CTA overlay text when chip is ready */}
      {allComplete && onChipClick && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          <motion.div 
            className="text-[10px] text-[#B87333] tracking-[3px] font-mono mt-24"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            НАЖМИТЕ НА ЧИП
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
