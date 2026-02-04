import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // PCB-style traces that START from edges and CONVERGE to the central chip
  // Chip center: (200, 200), Chip area: x=155-245, y=170-230
  // Content area (questions) roughly: y=120-280 center, avoid this
  // Lines run along edges then turn toward chip, avoiding center content
  
  const animDuration = 0.5;
  
  // Q1 - TOP traces (25%) - from top edge, converging to chip top
  const topPaths = [
    // Left side - from top-left corner, runs down left edge, then to chip
    { d: "M 0 0 L 0 60 L 30 60 L 30 140 L 100 140 L 100 170 L 155 170", delay: 0 },
    // Right side - from top-right corner, runs down right edge, then to chip  
    { d: "M 400 0 L 400 60 L 370 60 L 370 140 L 300 140 L 300 170 L 245 170", delay: 0.05 },
    // Center top - short trace from top edge
    { d: "M 200 0 L 200 50 L 180 50 L 180 100", delay: 0.1 },
    { d: "M 200 0 L 200 50 L 220 50 L 220 100", delay: 0.12 },
  ];
  
  // Q2 - RIGHT traces (50%) - from right edge, converging to chip right
  const rightPaths = [
    // Upper right - from right edge to chip
    { d: "M 400 150 L 350 150 L 350 185 L 245 185", delay: 0 },
    // Middle right
    { d: "M 400 200 L 320 200 L 320 200 L 245 200", delay: 0.04 },
    // Lower right
    { d: "M 400 250 L 350 250 L 350 215 L 245 215", delay: 0.08 },
  ];
  
  // Q3 - BOTTOM traces (75%) - from bottom edge, converging to chip bottom
  const bottomPaths = [
    // Left side - from bottom-left corner, runs up left edge, then to chip
    { d: "M 0 400 L 0 340 L 30 340 L 30 260 L 100 260 L 100 230 L 155 230", delay: 0 },
    // Right side - from bottom-right corner
    { d: "M 400 400 L 400 340 L 370 340 L 370 260 L 300 260 L 300 230 L 245 230", delay: 0.05 },
    // Center bottom - short trace
    { d: "M 200 400 L 200 350 L 180 350 L 180 300", delay: 0.1 },
    { d: "M 200 400 L 200 350 L 220 350 L 220 300", delay: 0.12 },
  ];
  
  // Q4 - LEFT traces (100%) - from left edge, converging to chip left
  const leftPaths = [
    // Upper left - from left edge to chip
    { d: "M 0 150 L 50 150 L 50 185 L 155 185", delay: 0 },
    // Middle left
    { d: "M 0 200 L 80 200 L 80 200 L 155 200", delay: 0.04 },
    // Lower left
    { d: "M 0 250 L 50 250 L 50 215 L 155 215", delay: 0.08 },
  ];

  const renderPaths = (paths: {d: string, delay: number}[], minProgress: number) => (
    paths.map((path, i) => (
      <motion.path
        key={`${minProgress}-${i}`}
        d={path.d}
        stroke="#B87333"
        strokeWidth={2}
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: revealProgress >= minProgress ? 1 : 0,
          opacity: revealProgress >= minProgress ? 0.85 : 0
        }}
        transition={{ 
          duration: animDuration,
          delay: revealProgress >= minProgress ? path.delay : 0,
          ease: "easeOut"
        }}
      />
    ))
  );

  // Small connection pads at key junctions
  const renderVias = (positions: {x: number, y: number}[], minProgress: number) => (
    positions.map((pos, i) => (
      <motion.rect
        key={`via-${minProgress}-${i}`}
        x={pos.x - 3}
        y={pos.y - 3}
        width={6}
        height={6}
        fill="#B87333"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: revealProgress >= minProgress ? 0.9 : 0,
          scale: revealProgress >= minProgress ? 1 : 0
        }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />
    ))
  );

  // Via positions where traces meet chip
  const topVias = [{ x: 155, y: 170 }, { x: 245, y: 170 }];
  const rightVias = [{ x: 245, y: 185 }, { x: 245, y: 200 }, { x: 245, y: 215 }];
  const bottomVias = [{ x: 155, y: 230 }, { x: 245, y: 230 }];
  const leftVias = [{ x: 155, y: 185 }, { x: 155, y: 200 }, { x: 155, y: 215 }];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* TOP paths - Q1 (25%) */}
        {renderPaths(topPaths, 25)}
        {renderVias(topVias, 25)}
        
        {/* RIGHT paths - Q2 (50%) */}
        {renderPaths(rightPaths, 50)}
        {renderVias(rightVias, 50)}
        
        {/* BOTTOM paths - Q3 (75%) */}
        {renderPaths(bottomPaths, 75)}
        {renderVias(bottomVias, 75)}
        
        {/* LEFT paths - Q4 (100%) */}
        {renderPaths(leftPaths, 100)}
        {renderVias(leftVias, 100)}
        
        {/* Central BLACK SHINY chip - appears after all paths */}
        {showChip && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Outer glow ring */}
            <motion.rect
              x="148"
              y="163"
              width="104"
              height="74"
              rx="4"
              fill="none"
              stroke="#B87333"
              strokeWidth="2"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.03, 1]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ transformOrigin: "200px 200px" }}
            />
            
            {/* Black shiny chip base */}
            <defs>
              <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="30%" stopColor="#2d2d2d" />
                <stop offset="50%" stopColor="#1f1f1f" />
                <stop offset="70%" stopColor="#2a2a2a" />
                <stop offset="100%" stopColor="#151515" />
              </linearGradient>
              <linearGradient id="chipHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.02)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
              </linearGradient>
            </defs>
            
            {/* Main chip frame */}
            <motion.rect
              x="155"
              y="170"
              width="90"
              height="60"
              rx="3"
              fill="url(#chipGradient)"
              stroke="#B87333"
              strokeWidth={isClickable ? 2.5 : 1.5}
              className={isClickable ? "pointer-events-auto cursor-pointer" : ""}
              onClick={isClickable ? onChipClick : undefined}
              animate={isClickable ? {
                scale: [1, 1.05, 1],
              } : {}}
              transition={isClickable ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" } : {}}
              style={{ transformOrigin: "200px 200px" }}
            />
            
            {/* Shiny reflection overlay */}
            <rect
              x="155"
              y="170"
              width="90"
              height="60"
              rx="3"
              fill="url(#chipHighlight)"
              style={{ pointerEvents: "none" }}
            />
            
            {/* Chip pins - top */}
            {[165, 178, 191, 204, 217, 230].map((x, i) => (
              <motion.rect
                key={`top-pin-${i}`}
                x={x - 2} y="162" width="4" height="8"
                fill="#B87333"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.4 + i * 0.03 }}
              />
            ))}
            
            {/* Chip pins - bottom */}
            {[165, 178, 191, 204, 217, 230].map((x, i) => (
              <motion.rect
                key={`bottom-pin-${i}`}
                x={x - 2} y="230" width="4" height="8"
                fill="#B87333"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.45 + i * 0.03 }}
              />
            ))}
            
            {/* Internal chip die */}
            <motion.rect
              x="175" y="183" width="50" height="34" rx="2"
              fill="none"
              stroke="#B87333"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.55 }}
            />
            
            {/* Tiny circuit lines inside die */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.6 }}
            >
              <line x1="180" y1="190" x2="220" y2="190" stroke="#B87333" strokeWidth="0.5" />
              <line x1="180" y1="200" x2="220" y2="200" stroke="#B87333" strokeWidth="0.5" />
              <line x1="180" y1="210" x2="220" y2="210" stroke="#B87333" strokeWidth="0.5" />
              <line x1="190" y1="185" x2="190" y2="215" stroke="#B87333" strokeWidth="0.5" />
              <line x1="210" y1="185" x2="210" y2="215" stroke="#B87333" strokeWidth="0.5" />
            </motion.g>
            
            {/* Pulsating glow when clickable */}
            {isClickable && (
              <>
                <motion.rect
                  x="155" y="170" width="90" height="60" rx="3"
                  stroke="#B87333" strokeWidth="4" fill="none"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    strokeWidth: [3, 5, 3]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.rect
                  x="155" y="170" width="90" height="60" rx="3"
                  stroke="#B87333" strokeWidth="2" fill="none"
                  animate={{ scale: [1, 1.3, 1.5], opacity: [0.8, 0.3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ transformOrigin: "200px 200px" }}
                />
              </>
            )}
          </motion.g>
        )}
      </svg>
    </div>
  );
}
