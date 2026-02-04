import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // Center of chip at (200, 200) in viewBox (400x400)
  // Chip area: x=155-245, y=170-230
  // All lines start from EXACT edges (0 or 400) and converge to chip

  // FAST animation speed for "untraceable transactions" feel
  const animDuration = 0.35;
  
  // TOP section paths (25%) - from TOP EDGE (y=0) to chip top
  const topPaths = [
    // From exact top-left corner (0,0)
    { d: "M 0 0 L 40 40 L 40 150 L 155 175", delay: 0 },
    // From top edge left side
    { d: "M 80 0 L 80 60 L 60 100 L 60 155 L 155 185", delay: 0.05 },
    // From exact top-right corner (400,0)
    { d: "M 400 0 L 360 40 L 360 150 L 245 175", delay: 0.03 },
    // From top edge right side
    { d: "M 320 0 L 320 60 L 340 100 L 340 155 L 245 185", delay: 0.08 },
  ];
  
  // RIGHT section paths (50%) - from RIGHT EDGE (x=400) to chip right
  const rightPaths = [
    // From right edge top
    { d: "M 400 120 L 350 120 L 320 160 L 320 185 L 245 185", delay: 0 },
    // From right edge middle
    { d: "M 400 200 L 330 200 L 245 200", delay: 0.04 },
    // From right edge bottom
    { d: "M 400 280 L 350 280 L 320 240 L 320 215 L 245 215", delay: 0.07 },
  ];
  
  // BOTTOM section paths (75%) - from BOTTOM EDGE (y=400) to chip bottom
  const bottomPaths = [
    // From exact bottom-left corner (0,400)
    { d: "M 0 400 L 40 360 L 40 250 L 155 225", delay: 0 },
    // From bottom edge left side
    { d: "M 80 400 L 80 340 L 60 300 L 60 245 L 155 215", delay: 0.04 },
    // From exact bottom-right corner (400,400)
    { d: "M 400 400 L 360 360 L 360 250 L 245 225", delay: 0.02 },
    // From bottom edge right side
    { d: "M 320 400 L 320 340 L 340 300 L 340 245 L 245 215", delay: 0.06 },
  ];
  
  // LEFT section paths (100%) - from LEFT EDGE (x=0) to chip left
  const leftPaths = [
    // From left edge top
    { d: "M 0 120 L 50 120 L 80 160 L 80 185 L 155 185", delay: 0 },
    // From left edge middle
    { d: "M 0 200 L 70 200 L 155 200", delay: 0.04 },
    // From left edge bottom
    { d: "M 0 280 L 50 280 L 80 240 L 80 215 L 155 215", delay: 0.07 },
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
        preserveAspectRatio="xMidYMid slice"
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
