import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // PCB traces that stay ONLY on screen edges - like a decorative frame
  // NO traces cross into center content area
  // Safe zone (center content): x=60-340, y=60-340
  // Traces stay in: x=0-60 (left), x=340-400 (right), y=0-60 (top), y=340-400 (bottom)
  
  const animDuration = 0.6;
  
  // TOP EDGE traces (25%) - only along top 60px
  const topPaths = [
    // Top-left corner L-shape
    { d: "M 0 0 L 0 50 M 0 0 L 50 0", delay: 0 },
    { d: "M 10 10 L 10 40 M 10 10 L 40 10", delay: 0.05 },
    // Top edge horizontal traces
    { d: "M 60 15 L 140 15", delay: 0.1 },
    { d: "M 60 30 L 120 30", delay: 0.15 },
    // Top-right corner L-shape  
    { d: "M 400 0 L 400 50 M 400 0 L 350 0", delay: 0.08 },
    { d: "M 390 10 L 390 40 M 390 10 L 360 10", delay: 0.12 },
    // More top edge traces
    { d: "M 260 15 L 340 15", delay: 0.1 },
    { d: "M 280 30 L 340 30", delay: 0.15 },
  ];
  
  // RIGHT EDGE traces (50%) - only along right 60px
  const rightPaths = [
    // Right edge vertical traces
    { d: "M 385 70 L 385 140", delay: 0 },
    { d: "M 370 80 L 370 120", delay: 0.05 },
    // Small corner accent
    { d: "M 360 60 L 400 60", delay: 0.08 },
    // Lower right area
    { d: "M 385 260 L 385 330", delay: 0.1 },
    { d: "M 370 280 L 370 320", delay: 0.12 },
    { d: "M 360 340 L 400 340", delay: 0.15 },
  ];
  
  // BOTTOM EDGE traces (75%) - only along bottom 60px
  const bottomPaths = [
    // Bottom-left corner L-shape
    { d: "M 0 400 L 0 350 M 0 400 L 50 400", delay: 0 },
    { d: "M 10 390 L 10 360 M 10 390 L 40 390", delay: 0.05 },
    // Bottom edge horizontal traces
    { d: "M 60 385 L 140 385", delay: 0.1 },
    { d: "M 60 370 L 120 370", delay: 0.15 },
    // Bottom-right corner L-shape
    { d: "M 400 400 L 400 350 M 400 400 L 350 400", delay: 0.08 },
    { d: "M 390 390 L 390 360 M 390 390 L 360 390", delay: 0.12 },
    // More bottom edge traces
    { d: "M 260 385 L 340 385", delay: 0.1 },
    { d: "M 280 370 L 340 370", delay: 0.15 },
  ];
  
  // LEFT EDGE traces (100%) - only along left 60px
  const leftPaths = [
    // Left edge vertical traces
    { d: "M 15 70 L 15 140", delay: 0 },
    { d: "M 30 80 L 30 120", delay: 0.05 },
    // Small corner accent
    { d: "M 0 60 L 40 60", delay: 0.08 },
    // Lower left area
    { d: "M 15 260 L 15 330", delay: 0.1 },
    { d: "M 30 280 L 30 320", delay: 0.12 },
    { d: "M 0 340 L 40 340", delay: 0.15 },
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
          opacity: revealProgress >= minProgress ? 0.7 : 0
        }}
        transition={{ 
          duration: animDuration,
          delay: revealProgress >= minProgress ? path.delay : 0,
          ease: "easeOut"
        }}
      />
    ))
  );

  // Small vias (connection points) at corners
  const renderVias = (positions: {x: number, y: number}[], minProgress: number) => (
    positions.map((pos, i) => (
      <motion.circle
        key={`via-${minProgress}-${i}`}
        cx={pos.x}
        cy={pos.y}
        r={3}
        fill="#B87333"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: revealProgress >= minProgress ? 0.8 : 0,
          scale: revealProgress >= minProgress ? 1 : 0
        }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />
    ))
  );

  // Via positions in corners only
  const topVias = [{ x: 10, y: 10 }, { x: 390, y: 10 }];
  const rightVias = [{ x: 385, y: 70 }, { x: 385, y: 330 }];
  const bottomVias = [{ x: 10, y: 390 }, { x: 390, y: 390 }];
  const leftVias = [{ x: 15, y: 70 }, { x: 15, y: 330 }];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* TOP edge - Q1 (25%) */}
        {renderPaths(topPaths, 25)}
        {renderVias(topVias, 25)}
        
        {/* RIGHT edge - Q2 (50%) */}
        {renderPaths(rightPaths, 50)}
        {renderVias(rightVias, 50)}
        
        {/* BOTTOM edge - Q3 (75%) */}
        {renderPaths(bottomPaths, 75)}
        {renderVias(bottomVias, 75)}
        
        {/* LEFT edge - Q4 (100%) */}
        {renderPaths(leftPaths, 100)}
        {renderVias(leftVias, 100)}
        
        {/* Central chip - only appears when all 4 edges complete */}
        {showChip && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Chip gradients */}
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
            
            {/* Main chip */}
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
            
            {/* Shiny overlay */}
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
            
            {/* Inner die */}
            <motion.rect
              x="175" y="183" width="50" height="34" rx="2"
              fill="none"
              stroke="#B87333"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.55 }}
            />
            
            {/* Internal circuit lines */}
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
