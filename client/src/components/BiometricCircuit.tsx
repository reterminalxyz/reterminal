import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // Center of chip at (200, 200) in viewBox
  // Chip area: x=155-245, y=170-230
  // All lines must END at chip edges

  // FAST animation speed for "untraceable transactions" feel
  const animDuration = 0.4;
  
  // TOP section paths (25%) - from top-left and top-right corners to chip TOP
  const topPaths = [
    // From top-left corner to chip top-left
    { d: "M 0 0 Q 40 40 40 100 L 40 170 L 155 170", delay: 0 },
    // From top-left mid
    { d: "M 60 0 Q 70 30 60 80 L 60 180 L 155 180", delay: 0.05 },
    // From top-right corner to chip top-right
    { d: "M 400 0 Q 360 40 360 100 L 360 170 L 245 170", delay: 0.03 },
    // From top-right mid
    { d: "M 340 0 Q 330 30 340 80 L 340 180 L 245 180", delay: 0.08 },
  ];
  
  // RIGHT section paths (50%) - from right side to chip RIGHT edge
  const rightPaths = [
    { d: "M 400 130 L 320 130 L 320 185 L 245 185", delay: 0 },
    { d: "M 400 180 L 340 180 L 340 195 L 245 195", delay: 0.04 },
    { d: "M 400 230 L 330 230 L 330 205 L 245 205", delay: 0.07 },
  ];
  
  // BOTTOM section paths (75%) - from bottom corners to chip BOTTOM
  const bottomPaths = [
    // From bottom-left corner
    { d: "M 0 400 Q 40 360 40 300 L 40 230 L 155 230", delay: 0 },
    // From bottom-left mid
    { d: "M 60 400 Q 70 370 60 320 L 60 220 L 155 220", delay: 0.04 },
    // From bottom-right corner
    { d: "M 400 400 Q 360 360 360 300 L 360 230 L 245 230", delay: 0.02 },
    // From bottom-right mid
    { d: "M 340 400 Q 330 370 340 320 L 340 220 L 245 220", delay: 0.06 },
  ];
  
  // LEFT section paths (100%) - from left side to chip LEFT edge
  const leftPaths = [
    { d: "M 0 130 L 80 130 L 80 185 L 155 185", delay: 0 },
    { d: "M 0 180 L 60 180 L 60 195 L 155 195", delay: 0.04 },
    { d: "M 0 230 L 70 230 L 70 205 L 155 205", delay: 0.07 },
  ];

  const renderPaths = (paths: {d: string, delay: number}[], minProgress: number) => (
    paths.map((path, i) => (
      <motion.path
        key={`${minProgress}-${i}`}
        d={path.d}
        stroke="#B87333"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: revealProgress >= minProgress ? 1 : 0,
          opacity: revealProgress >= minProgress ? 0.8 : 0
        }}
        transition={{ 
          duration: animDuration,
          delay: revealProgress >= minProgress ? path.delay : 0,
          ease: "easeOut"
        }}
      />
    ))
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
        
        {/* RIGHT paths - 50% */}
        {renderPaths(rightPaths, 50)}
        
        {/* BOTTOM paths - 75% */}
        {renderPaths(bottomPaths, 75)}
        
        {/* LEFT paths - 100% */}
        {renderPaths(leftPaths, 100)}
        
        {/* Central BLACK SHINY chip - all lines converge here */}
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
            
            {/* Main chip frame - BLACK SHINY */}
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
            
            {/* Pulsating glow when clickable */}
            {isClickable && (
              <>
                <motion.rect
                  x="155" y="170" width="90" height="60" rx="3"
                  stroke="#B87333" strokeWidth="3" fill="none"
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                    strokeWidth: [2, 4, 2]
                  }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                />
                {/* Expanding pulse rings */}
                <motion.rect
                  x="155" y="170" width="90" height="60" rx="3"
                  stroke="#B87333" strokeWidth="1.5" fill="none"
                  animate={{ scale: [1, 1.2, 1.4], opacity: [0.6, 0.2, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ transformOrigin: "200px 200px" }}
                />
                <motion.rect
                  x="155" y="170" width="90" height="60" rx="3"
                  stroke="#B87333" strokeWidth="1" fill="none"
                  animate={{ scale: [1, 1.3, 1.6], opacity: [0.4, 0.15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
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
