import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // All unique paths - no mirroring
  // TOP section (25%) - descending from top edge
  const topPaths = [
    { d: "M 200 0 L 200 80 L 200 140", delay: 0 },
    { d: "M 200 0 L 200 60 L 170 90 L 170 130", delay: 0.1 },
    { d: "M 200 0 L 200 50 L 230 80 L 230 130", delay: 0.15 },
    { d: "M 140 0 L 140 70 L 160 90 L 160 120", delay: 0.2 },
    { d: "M 260 0 L 260 60 L 240 80 L 240 120", delay: 0.25 },
    { d: "M 120 0 L 120 50 L 150 80", delay: 0.3 },
    { d: "M 280 0 L 280 50 L 250 80", delay: 0.35 },
  ];
  
  // RIGHT section (50%) - from right edge, unique asymmetric pattern
  const rightPaths = [
    { d: "M 400 200 L 320 200 L 270 200", delay: 0 },
    { d: "M 400 160 L 340 160 L 300 180 L 280 180", delay: 0.1 },
    { d: "M 400 240 L 350 240 L 310 220 L 280 220", delay: 0.15 },
    { d: "M 400 130 L 360 130 L 330 150 L 290 150", delay: 0.2 },
    { d: "M 400 270 L 370 270 L 340 250 L 290 250", delay: 0.25 },
    { d: "M 400 180 L 310 180 L 270 190", delay: 0.3 },
  ];
  
  // BOTTOM section (75%) - ascending from bottom edge, unique pattern
  const bottomPaths = [
    { d: "M 200 400 L 200 320 L 200 260", delay: 0 },
    { d: "M 180 400 L 180 340 L 175 280 L 180 260", delay: 0.1 },
    { d: "M 220 400 L 220 350 L 225 290 L 220 260", delay: 0.15 },
    { d: "M 150 400 L 150 360 L 165 300 L 165 270", delay: 0.2 },
    { d: "M 250 400 L 250 350 L 235 300 L 235 270", delay: 0.25 },
    { d: "M 130 400 L 130 370 L 155 320", delay: 0.3 },
    { d: "M 270 400 L 270 370 L 245 320", delay: 0.35 },
  ];
  
  // LEFT section (100%) - from left edge, unique asymmetric
  const leftPaths = [
    { d: "M 0 200 L 80 200 L 130 200", delay: 0 },
    { d: "M 0 170 L 60 170 L 100 185 L 120 185", delay: 0.1 },
    { d: "M 0 230 L 50 230 L 90 215 L 120 215", delay: 0.15 },
    { d: "M 0 140 L 40 140 L 70 160 L 110 160", delay: 0.2 },
    { d: "M 0 260 L 30 260 L 60 240 L 110 240", delay: 0.25 },
    { d: "M 0 200 L 70 200 L 110 210", delay: 0.3 },
  ];
  
  // Central convergence paths (100%)
  const centerPaths = [
    { d: "M 170 130 L 170 170 L 155 200", delay: 0.4 },
    { d: "M 230 130 L 230 170 L 245 200", delay: 0.45 },
    { d: "M 270 200 L 245 200", delay: 0.5 },
    { d: "M 130 200 L 155 200", delay: 0.5 },
    { d: "M 180 260 L 180 230 L 165 200", delay: 0.55 },
    { d: "M 220 260 L 220 230 L 235 200", delay: 0.6 },
  ];

  const renderPaths = (paths: {d: string, delay: number}[], minProgress: number) => (
    paths.map((path, i) => (
      <motion.path
        key={`${minProgress}-${i}`}
        d={path.d}
        stroke="#B87333"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: revealProgress >= minProgress ? 1 : 0,
          opacity: revealProgress >= minProgress ? 0.8 : 0
        }}
        transition={{ 
          duration: 1.2,
          delay: revealProgress >= minProgress ? path.delay : 0,
          ease: "easeOut"
        }}
      />
    ))
  );

  // Animated dots at endpoints
  const renderDots = (positions: {x: number, y: number}[], minProgress: number) => (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: revealProgress >= minProgress ? 1 : 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
    >
      {positions.map((pos, i) => (
        <motion.circle
          key={i}
          cx={pos.x}
          cy={pos.y}
          r={4}
          fill="#B87333"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </motion.g>
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* TOP paths - 25% */}
        {renderPaths(topPaths, 25)}
        {renderDots([{x:200, y:140}, {x:170, y:130}, {x:230, y:130}], 25)}
        
        {/* RIGHT paths - 50% */}
        {renderPaths(rightPaths, 50)}
        {renderDots([{x:270, y:200}, {x:280, y:180}, {x:280, y:220}], 50)}
        
        {/* BOTTOM paths - 75% */}
        {renderPaths(bottomPaths, 75)}
        {renderDots([{x:200, y:260}, {x:180, y:260}, {x:220, y:260}], 75)}
        
        {/* LEFT paths - 100% */}
        {renderPaths(leftPaths, 100)}
        {renderPaths(centerPaths, 100)}
        {renderDots([{x:130, y:200}, {x:120, y:185}, {x:120, y:215}], 100)}
        
        {/* Central chip - cyberpunk style */}
        {showChip && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {/* Outer glow */}
            <motion.rect
              x="145"
              y="175"
              width="110"
              height="50"
              rx="3"
              fill="none"
              stroke="#B87333"
              strokeWidth="1"
              animate={{
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transformOrigin: "200px 200px" }}
            />
            
            {/* Main chip frame */}
            <motion.rect
              x="150"
              y="180"
              width="100"
              height="40"
              rx="2"
              stroke="#B87333"
              strokeWidth={isClickable ? 3 : 2}
              fill="rgba(184,115,51,0.12)"
              className={isClickable ? "pointer-events-auto cursor-pointer" : ""}
              onClick={isClickable ? onChipClick : undefined}
              animate={isClickable ? {
                strokeOpacity: [0.7, 1, 0.7],
                fillOpacity: [0.08, 0.18, 0.08]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            
            {/* Chip pins - top */}
            {[160, 175, 190, 205, 220, 235].map((x, i) => (
              <motion.line
                key={`top-pin-${i}`}
                x1={x} y1="172" x2={x} y2="180"
                stroke="#B87333"
                strokeWidth="2.5"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: 0.8 + i * 0.05 }}
              />
            ))}
            
            {/* Chip pins - bottom */}
            {[160, 175, 190, 205, 220, 235].map((x, i) => (
              <motion.line
                key={`bottom-pin-${i}`}
                x1={x} y1="220" x2={x} y2="228"
                stroke="#B87333"
                strokeWidth="2.5"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 0.9, y: 0 }}
                transition={{ delay: 0.85 + i * 0.05 }}
              />
            ))}
            
            {/* Internal chip details - cyberpunk style */}
            <motion.rect
              x="156" y="186" width="28" height="28" rx="1"
              fill="rgba(184,115,51,0.25)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            />
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <rect x="188" y="186" width="56" height="8" rx="1" fill="rgba(184,115,51,0.18)" />
              <rect x="188" y="198" width="56" height="8" rx="1" fill="rgba(184,115,51,0.18)" />
              <rect x="188" y="210" width="56" height="8" rx="1" fill="rgba(184,115,51,0.18)" />
            </motion.g>
            
            {/* Animated scan line inside chip */}
            <motion.rect
              x="156"
              y="186"
              width="88"
              height="2"
              fill="#B87333"
              opacity={0.6}
              animate={{ y: [186, 216, 186] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Corner accents for cyberpunk feel */}
            <motion.path
              d="M 150 185 L 150 180 L 155 180"
              stroke="#B87333"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.1 }}
            />
            <motion.path
              d="M 250 185 L 250 180 L 245 180"
              stroke="#B87333"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.15 }}
            />
            <motion.path
              d="M 150 215 L 150 220 L 155 220"
              stroke="#B87333"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.2 }}
            />
            <motion.path
              d="M 250 215 L 250 220 L 245 220"
              stroke="#B87333"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.25 }}
            />
          </motion.g>
        )}
        
        {/* Pulse rings when clickable */}
        {isClickable && (
          <>
            <motion.rect
              x="150" y="180" width="100" height="40" rx="2"
              stroke="#B87333"
              strokeWidth="1.5"
              fill="none"
              animate={{ 
                scale: [1, 1.2, 1.4],
                opacity: [0.6, 0.2, 0]
              }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{ transformOrigin: "200px 200px" }}
            />
            <motion.rect
              x="150" y="180" width="100" height="40" rx="2"
              stroke="#B87333"
              strokeWidth="1"
              fill="none"
              animate={{ 
                scale: [1, 1.3, 1.6],
                opacity: [0.4, 0.15, 0]
              }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.4 }}
              style={{ transformOrigin: "200px 200px" }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
