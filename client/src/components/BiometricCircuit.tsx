import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0-100%
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // SVG paths for biometric-style circuit lines
  // Lines converge from all edges toward center chip
  const circuitPaths = [
    // TOP section (25%) - vertical descending lines
    { d: "M 200 0 L 200 120 L 180 140", reveal: 25, delay: 0 },
    { d: "M 200 0 L 200 80", reveal: 25, delay: 0.05 },
    { d: "M 150 0 L 150 100 L 170 120", reveal: 25, delay: 0.1 },
    { d: "M 250 0 L 250 100 L 230 120", reveal: 25, delay: 0.15 },
    { d: "M 180 0 L 180 60 L 200 80", reveal: 25, delay: 0.08 },
    { d: "M 220 0 L 220 60 L 200 80", reveal: 25, delay: 0.12 },
    
    // RIGHT section (50%) - horizontal lines from right
    { d: "M 400 200 L 280 200 L 260 220", reveal: 50, delay: 0 },
    { d: "M 400 180 L 300 180 L 280 200", reveal: 50, delay: 0.05 },
    { d: "M 400 220 L 300 220 L 280 200", reveal: 50, delay: 0.1 },
    { d: "M 400 160 L 320 160 L 300 180", reveal: 50, delay: 0.08 },
    { d: "M 400 240 L 320 240 L 300 220", reveal: 50, delay: 0.12 },
    { d: "M 400 200 L 260 200", reveal: 50, delay: 0.15 },
    
    // BOTTOM section (75%) - vertical ascending lines
    { d: "M 200 400 L 200 280 L 220 260", reveal: 75, delay: 0 },
    { d: "M 200 400 L 200 320", reveal: 75, delay: 0.05 },
    { d: "M 150 400 L 150 300 L 170 280", reveal: 75, delay: 0.1 },
    { d: "M 250 400 L 250 300 L 230 280", reveal: 75, delay: 0.15 },
    { d: "M 180 400 L 180 340 L 200 320", reveal: 75, delay: 0.08 },
    { d: "M 220 400 L 220 340 L 200 320", reveal: 75, delay: 0.12 },
    
    // LEFT section (100%) - horizontal lines from left
    { d: "M 0 200 L 120 200 L 140 220", reveal: 100, delay: 0 },
    { d: "M 0 180 L 100 180 L 120 200", reveal: 100, delay: 0.05 },
    { d: "M 0 220 L 100 220 L 120 200", reveal: 100, delay: 0.1 },
    { d: "M 0 160 L 80 160 L 100 180", reveal: 100, delay: 0.08 },
    { d: "M 0 240 L 80 240 L 100 220", reveal: 100, delay: 0.12 },
    { d: "M 0 200 L 140 200", reveal: 100, delay: 0.15 },
    
    // Center convergence traces (100%)
    { d: "M 180 140 L 180 180 L 160 200", reveal: 100, delay: 0.2 },
    { d: "M 220 140 L 220 180 L 240 200", reveal: 100, delay: 0.22 },
    { d: "M 260 200 L 240 200", reveal: 100, delay: 0.25 },
    { d: "M 140 200 L 160 200", reveal: 100, delay: 0.25 },
    { d: "M 180 260 L 180 220 L 160 200", reveal: 100, delay: 0.28 },
    { d: "M 220 260 L 220 220 L 240 200", reveal: 100, delay: 0.3 },
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full max-w-[400px] max-h-[400px]" 
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Circuit paths with progressive reveal */}
        {circuitPaths.map((path, i) => (
          <motion.path
            key={i}
            d={path.d}
            stroke="#B87333"
            strokeWidth={revealProgress >= path.reveal ? 2 : 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: revealProgress >= path.reveal ? 1 : 0,
              opacity: revealProgress >= path.reveal ? 0.7 : 0.15
            }}
            transition={{ 
              duration: 0.8, 
              delay: revealProgress >= path.reveal ? path.delay : 0,
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* Connection nodes at line ends */}
        {revealProgress >= 25 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.3 }}>
            <circle cx="200" cy="120" r="3" fill="#B87333" />
            <circle cx="150" cy="100" r="2" fill="#B87333" />
            <circle cx="250" cy="100" r="2" fill="#B87333" />
          </motion.g>
        )}
        
        {revealProgress >= 50 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.3 }}>
            <circle cx="280" cy="200" r="3" fill="#B87333" />
            <circle cx="300" cy="180" r="2" fill="#B87333" />
            <circle cx="300" cy="220" r="2" fill="#B87333" />
          </motion.g>
        )}
        
        {revealProgress >= 75 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.3 }}>
            <circle cx="200" cy="280" r="3" fill="#B87333" />
            <circle cx="150" cy="300" r="2" fill="#B87333" />
            <circle cx="250" cy="300" r="2" fill="#B87333" />
          </motion.g>
        )}
        
        {revealProgress >= 100 && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.3 }}>
            <circle cx="120" cy="200" r="3" fill="#B87333" />
            <circle cx="100" cy="180" r="2" fill="#B87333" />
            <circle cx="100" cy="220" r="2" fill="#B87333" />
          </motion.g>
        )}
        
        {/* Central chip - appears when 100% complete */}
        {showChip && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* Chip frame */}
            <motion.rect
              x="160"
              y="180"
              width="80"
              height="40"
              rx="2"
              stroke="#B87333"
              strokeWidth={isClickable ? 2.5 : 2}
              fill="rgba(184,115,51,0.1)"
              className={isClickable ? "pointer-events-auto cursor-pointer" : ""}
              onClick={isClickable ? onChipClick : undefined}
              animate={isClickable ? {
                strokeOpacity: [0.8, 1, 0.8],
                fillOpacity: [0.05, 0.15, 0.05]
              } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            
            {/* Chip pins - top */}
            {[170, 185, 200, 215, 230].map((x, i) => (
              <motion.line
                key={`top-${i}`}
                x1={x} y1="175" x2={x} y2="180"
                stroke="#B87333"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.5 + i * 0.03 }}
              />
            ))}
            
            {/* Chip pins - bottom */}
            {[170, 185, 200, 215, 230].map((x, i) => (
              <motion.line
                key={`bottom-${i}`}
                x1={x} y1="220" x2={x} y2="225"
                stroke="#B87333"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.55 + i * 0.03 }}
              />
            ))}
            
            {/* Internal chip detail */}
            <motion.rect
              x="168" y="188" width="24" height="24" rx="1"
              fill="rgba(184,115,51,0.2)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            />
            <motion.rect
              x="196" y="188" width="36" height="10" rx="1"
              fill="rgba(184,115,51,0.15)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            />
            <motion.rect
              x="196" y="202" width="36" height="10" rx="1"
              fill="rgba(184,115,51,0.15)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            />
          </motion.g>
        )}
        
        {/* Pulse effect when chip is clickable */}
        {isClickable && (
          <>
            <motion.rect
              x="160" y="180" width="80" height="40" rx="2"
              stroke="#B87333"
              strokeWidth="1"
              fill="none"
              animate={{ 
                scale: [1, 1.15, 1.3],
                opacity: [0.5, 0.2, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ transformOrigin: "200px 200px" }}
            />
            <motion.rect
              x="160" y="180" width="80" height="40" rx="2"
              stroke="#B87333"
              strokeWidth="0.5"
              fill="none"
              animate={{ 
                scale: [1, 1.25, 1.5],
                opacity: [0.3, 0.1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              style={{ transformOrigin: "200px 200px" }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
