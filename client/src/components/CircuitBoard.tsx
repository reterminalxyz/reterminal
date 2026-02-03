import { motion } from "framer-motion";

interface CircuitBoardProps {
  completedLayers: number;
}

export function CircuitBoard({ completedLayers }: CircuitBoardProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 800 600" 
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Layer 1: Horizontal traces left side */}
        <motion.g
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ 
            opacity: completedLayers >= 1 ? 0.6 : 0,
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Main horizontal traces */}
          <motion.path
            d="M0 200 H180 L200 220 H280"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 1 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.path
            d="M0 260 H150 L180 280 H250"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 1 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
          <motion.path
            d="M0 320 H200 L220 340 H300"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 1 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
          <motion.path
            d="M0 380 H160 L190 400 H270"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 1 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          />
          
          {/* Connection nodes */}
          <motion.circle
            cx="280"
            cy="220"
            r="4"
            fill="#B87333"
            initial={{ scale: 0 }}
            animate={{ scale: completedLayers >= 1 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          />
          <motion.circle
            cx="250"
            cy="280"
            r="4"
            fill="#B87333"
            initial={{ scale: 0 }}
            animate={{ scale: completedLayers >= 1 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />
          <motion.circle
            cx="300"
            cy="340"
            r="4"
            fill="#B87333"
            initial={{ scale: 0 }}
            animate={{ scale: completedLayers >= 1 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          />
        </motion.g>

        {/* Layer 2: Vertical connections center */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: completedLayers >= 2 ? 0.6 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Vertical traces connecting to center */}
          <motion.path
            d="M400 100 V200 L380 220 V280 L400 300"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 2 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.path
            d="M350 150 V250 L370 270 V350"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 2 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
          <motion.path
            d="M450 120 V230 L420 260 V340"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 2 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
          <motion.path
            d="M400 300 V400 L380 420 V500"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 2 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          />
          
          {/* Central chip frame */}
          <motion.rect
            x="360"
            y="260"
            width="80"
            height="60"
            stroke="#B87333"
            strokeWidth="1.5"
            fill="none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: completedLayers >= 2 ? 1 : 0,
              opacity: completedLayers >= 2 ? 1 : 0
            }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ transformOrigin: "400px 290px" }}
          />
          
          {/* Chip internal lines */}
          <motion.line x1="370" y1="275" x2="430" y2="275" stroke="#B87333" strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 2 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />
          <motion.line x1="370" y1="290" x2="430" y2="290" stroke="#B87333" strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 2 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          />
          <motion.line x1="370" y1="305" x2="430" y2="305" stroke="#B87333" strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 2 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          />
        </motion.g>

        {/* Layer 3: Complete node right side */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: completedLayers >= 3 ? 0.8 : 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Right side traces */}
          <motion.path
            d="M520 220 H600 L620 240 H800"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 3 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
          <motion.path
            d="M550 280 H620 L650 300 H800"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 3 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
          />
          <motion.path
            d="M500 340 H580 L600 360 H800"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 3 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          />
          <motion.path
            d="M530 400 H640 L660 420 H800"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 3 ? 1 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
          />
          
          {/* Connecting traces from center to right */}
          <motion.path
            d="M440 280 H520"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 3 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          <motion.path
            d="M440 300 H500 L520 320 V340 H550"
            stroke="#B87333"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: completedLayers >= 3 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
          
          {/* Final connection nodes */}
          <motion.circle
            cx="520"
            cy="220"
            r="5"
            fill="#B87333"
            initial={{ scale: 0 }}
            animate={{ scale: completedLayers >= 3 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />
          <motion.circle
            cx="550"
            cy="280"
            r="5"
            fill="#B87333"
            initial={{ scale: 0 }}
            animate={{ scale: completedLayers >= 3 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          />
          <motion.circle
            cx="550"
            cy="340"
            r="5"
            fill="#B87333"
            initial={{ scale: 0 }}
            animate={{ scale: completedLayers >= 3 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          />
          
          {/* Completion pulse effect */}
          {completedLayers >= 3 && (
            <motion.circle
              cx="400"
              cy="290"
              r="60"
              stroke="#B87333"
              strokeWidth="2"
              fill="none"
              initial={{ scale: 0.5, opacity: 0.8 }}
              animate={{ 
                scale: [0.5, 1.5, 2],
                opacity: [0.8, 0.3, 0]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          )}
        </motion.g>
      </svg>
    </div>
  );
}
