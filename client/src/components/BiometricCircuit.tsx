import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // PCB-style microchip traces with 90-degree angles
  // Lines stay in EDGES/CORNERS of screen, avoiding center content area
  // Content area roughly: x=80-320, y=120-320 (where questions appear)
  
  const animDuration = 0.4;
  
  // TOP-LEFT CORNER traces (25%) - PCB style with 90° angles
  const topLeftPaths = [
    // Outer trace - runs along top edge then down left edge
    { d: "M 0 0 L 60 0 L 60 20 L 20 20 L 20 80 L 0 80", delay: 0 },
    // Inner parallel trace
    { d: "M 0 30 L 40 30 L 40 60 L 10 60 L 10 100 L 0 100", delay: 0.05 },
    // Horizontal bus at top
    { d: "M 0 50 L 25 50 L 25 40 L 50 40", delay: 0.08 },
    // Vertical trace near corner
    { d: "M 35 0 L 35 35 L 15 35 L 15 70", delay: 0.03 },
  ];
  
  // TOP-RIGHT CORNER traces (50%) - mirror of top-left
  const topRightPaths = [
    // Outer trace
    { d: "M 400 0 L 340 0 L 340 20 L 380 20 L 380 80 L 400 80", delay: 0 },
    // Inner parallel trace
    { d: "M 400 30 L 360 30 L 360 60 L 390 60 L 390 100 L 400 100", delay: 0.04 },
    // Horizontal bus
    { d: "M 400 50 L 375 50 L 375 40 L 350 40", delay: 0.07 },
    // Vertical trace
    { d: "M 365 0 L 365 35 L 385 35 L 385 70", delay: 0.02 },
  ];
  
  // BOTTOM-LEFT CORNER traces (75%)
  const bottomLeftPaths = [
    // Outer trace - runs along bottom edge then up left edge
    { d: "M 0 400 L 60 400 L 60 380 L 20 380 L 20 320 L 0 320", delay: 0 },
    // Inner parallel trace
    { d: "M 0 370 L 40 370 L 40 340 L 10 340 L 10 300 L 0 300", delay: 0.05 },
    // Horizontal bus at bottom
    { d: "M 0 350 L 25 350 L 25 360 L 50 360", delay: 0.06 },
    // Vertical trace
    { d: "M 35 400 L 35 365 L 15 365 L 15 330", delay: 0.03 },
  ];
  
  // BOTTOM-RIGHT CORNER traces (100%)
  const bottomRightPaths = [
    // Outer trace
    { d: "M 400 400 L 340 400 L 340 380 L 380 380 L 380 320 L 400 320", delay: 0 },
    // Inner parallel trace
    { d: "M 400 370 L 360 370 L 360 340 L 390 340 L 390 300 L 400 300", delay: 0.04 },
    // Horizontal bus
    { d: "M 400 350 L 375 350 L 375 360 L 350 360", delay: 0.05 },
    // Vertical trace
    { d: "M 365 400 L 365 365 L 385 365 L 385 330", delay: 0.02 },
  ];

  const renderPaths = (paths: {d: string, delay: number}[], minProgress: number) => (
    paths.map((path, i) => (
      <motion.path
        key={`${minProgress}-${i}`}
        d={path.d}
        stroke="#B87333"
        strokeWidth={1.5}
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

  // Small connection pads (vias) at trace endpoints
  const renderVias = (positions: {x: number, y: number}[], minProgress: number) => (
    positions.map((pos, i) => (
      <motion.rect
        key={`via-${minProgress}-${i}`}
        x={pos.x - 2}
        y={pos.y - 2}
        width={4}
        height={4}
        fill="#B87333"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: revealProgress >= minProgress ? 0.8 : 0,
          scale: revealProgress >= minProgress ? 1 : 0
        }}
        transition={{ duration: 0.2, delay: 0.3 }}
      />
    ))
  );

  // Via positions for each corner
  const topLeftVias = [{ x: 50, y: 40 }, { x: 15, y: 70 }, { x: 35, y: 35 }];
  const topRightVias = [{ x: 350, y: 40 }, { x: 385, y: 70 }, { x: 365, y: 35 }];
  const bottomLeftVias = [{ x: 50, y: 360 }, { x: 15, y: 330 }, { x: 35, y: 365 }];
  const bottomRightVias = [{ x: 350, y: 360 }, { x: 385, y: 330 }, { x: 365, y: 365 }];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* TOP-LEFT corner traces - 25% */}
        {renderPaths(topLeftPaths, 25)}
        {renderVias(topLeftVias, 25)}
        
        {/* TOP-RIGHT corner traces - 50% */}
        {renderPaths(topRightPaths, 50)}
        {renderVias(topRightVias, 50)}
        
        {/* BOTTOM-LEFT corner traces - 75% */}
        {renderPaths(bottomLeftPaths, 75)}
        {renderVias(bottomLeftVias, 75)}
        
        {/* BOTTOM-RIGHT corner traces - 100% */}
        {renderPaths(bottomRightPaths, 100)}
        {renderVias(bottomRightVias, 100)}
        
        {/* Central BLACK SHINY chip */}
        {showChip && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Outer glow ring - copper pulse */}
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
            
            {/* Main chip frame - BLACK SHINY with STRONG PULSATION when clickable */}
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
            
            {/* Chip pins - top - copper colored */}
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
            
            {/* Internal chip die - small copper square */}
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
            
            {/* STRONG pulsating glow when clickable */}
            {isClickable && (
              <>
                {/* Inner pulse */}
                <motion.rect
                  x="155" y="170" width="90" height="60" rx="3"
                  stroke="#B87333" strokeWidth="4" fill="none"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    strokeWidth: [3, 5, 3]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                {/* Expanding pulse ring 1 */}
                <motion.rect
                  x="155" y="170" width="90" height="60" rx="3"
                  stroke="#B87333" strokeWidth="2" fill="none"
                  animate={{ scale: [1, 1.3, 1.5], opacity: [0.8, 0.3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ transformOrigin: "200px 200px" }}
                />
                {/* Expanding pulse ring 2 */}
                <motion.rect
                  x="155" y="170" width="90" height="60" rx="3"
                  stroke="#B87333" strokeWidth="1.5" fill="none"
                  animate={{ scale: [1, 1.4, 1.7], opacity: [0.6, 0.2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
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
