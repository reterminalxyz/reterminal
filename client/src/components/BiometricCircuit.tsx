import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // Fingerprint-style reveal: 3-4 unique curved lines per answer
  // CRITICAL: Lines must NOT cross the center content area (x=80-320, y=120-330)
  // Lines stay in the margins and only converge to chip when chip is shown
  // Content safe zone is roughly y=80 to y=350, x=60 to x=340
  
  const animDuration = 0.7;
  
  // Q1 lines (25%) - 4 lines in TOP margin area only (y=0-80)
  const q1Lines = [
    // Top-left corner trace
    { d: "M 0 0 L 0 40 L 40 40 L 40 0", delay: 0 },
    // Top edge horizontal
    { d: "M 60 20 Q 100 25 140 20", delay: 0.1 },
    // Top-right area
    { d: "M 400 0 L 400 40 L 360 40 L 360 0", delay: 0.15 },
    // Another top edge
    { d: "M 260 20 Q 300 30 340 20", delay: 0.2 },
  ];
  
  // Q2 lines (50%) - 4 lines in RIGHT margin area only (x=340-400)
  const q2Lines = [
    // Right edge vertical
    { d: "M 380 80 L 380 120 L 400 120", delay: 0 },
    // Right edge lower
    { d: "M 360 140 L 400 140 L 400 180", delay: 0.08 },
    // Right bottom area
    { d: "M 380 350 L 380 400 L 400 400", delay: 0.15 },
    // Right edge mid-bottom
    { d: "M 360 360 L 400 360", delay: 0.2 },
  ];
  
  // Q3 lines (75%) - 4 lines in BOTTOM margin area only (y=350-400)
  const q3Lines = [
    // Bottom-left corner
    { d: "M 0 400 L 0 360 L 40 360 L 40 400", delay: 0 },
    // Bottom edge horizontal
    { d: "M 60 380 Q 100 375 140 380", delay: 0.1 },
    // Bottom-right corner  
    { d: "M 400 400 L 400 360 L 360 360 L 360 400", delay: 0.15 },
    // Another bottom edge
    { d: "M 260 380 Q 300 370 340 380", delay: 0.2 },
  ];
  
  // Q4 lines (100%) - 4 lines in LEFT margin area only (x=0-60)
  const q4Lines = [
    // Left edge vertical
    { d: "M 20 80 L 20 120 L 0 120", delay: 0 },
    // Left edge lower
    { d: "M 40 140 L 0 140 L 0 180", delay: 0.08 },
    // Left bottom area
    { d: "M 20 350 L 20 400 L 0 400", delay: 0.15 },
    // Left edge mid-bottom
    { d: "M 40 360 L 0 360", delay: 0.2 },
  ];
  
  // Connecting lines that appear ONLY when chip is shown (all questions done)
  // These draw from the margin traces to the central chip
  const connectingLines = showChip ? [
    // From top traces to chip
    { d: "M 100 20 L 100 80 L 155 170", delay: 0.3 },
    { d: "M 300 20 L 300 80 L 245 170", delay: 0.35 },
    // From right traces to chip
    { d: "M 380 120 L 300 150 L 245 185", delay: 0.4 },
    { d: "M 380 350 L 300 280 L 245 230", delay: 0.45 },
    // From bottom traces to chip
    { d: "M 100 380 L 100 320 L 155 230", delay: 0.5 },
    { d: "M 300 380 L 300 320 L 245 230", delay: 0.55 },
    // From left traces to chip
    { d: "M 20 120 L 100 150 L 155 185", delay: 0.6 },
    { d: "M 20 350 L 100 280 L 155 230", delay: 0.65 },
  ] : [];

  const renderLines = (lines: {d: string, delay: number}[], minProgress: number) => (
    lines.map((line, i) => (
      <motion.path
        key={`line-${minProgress}-${i}`}
        d={line.d}
        stroke="#B87333"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: revealProgress >= minProgress ? 1 : 0,
          opacity: revealProgress >= minProgress ? 0.7 : 0
        }}
        transition={{ 
          duration: animDuration,
          delay: revealProgress >= minProgress ? line.delay : 0,
          ease: "easeOut"
        }}
      />
    ))
  );
  
  const renderConnectingLines = () => (
    connectingLines.map((line, i) => (
      <motion.path
        key={`connect-${i}`}
        d={line.d}
        stroke="#B87333"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        transition={{ 
          duration: 0.6,
          delay: line.delay,
          ease: "easeOut"
        }}
      />
    ))
  );

  // Small vias at corners
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
        transition={{ duration: 0.3, delay: 0.5 }}
      />
    ))
  );

  const q1Vias = [{ x: 40, y: 40 }, { x: 360, y: 40 }];
  const q2Vias = [{ x: 380, y: 120 }, { x: 380, y: 350 }];
  const q3Vias = [{ x: 40, y: 360 }, { x: 360, y: 360 }];
  const q4Vias = [{ x: 20, y: 120 }, { x: 20, y: 350 }];

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Q1 lines - 25% - TOP margin */}
        {renderLines(q1Lines, 25)}
        {renderVias(q1Vias, 25)}
        
        {/* Q2 lines - 50% - RIGHT margin */}
        {renderLines(q2Lines, 50)}
        {renderVias(q2Vias, 50)}
        
        {/* Q3 lines - 75% - BOTTOM margin */}
        {renderLines(q3Lines, 75)}
        {renderVias(q3Vias, 75)}
        
        {/* Q4 lines - 100% - LEFT margin */}
        {renderLines(q4Lines, 100)}
        {renderVias(q4Vias, 100)}
        
        {/* Connecting lines to chip - only when chip is shown */}
        {renderConnectingLines()}
        
        {/* Central chip - appears after all margin traces complete */}
        {showChip && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
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
            
            {/* Outer glow */}
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
            
            {/* Main chip body */}
            <rect
              x="155"
              y="170"
              width="90"
              height="60"
              rx="3"
              fill="url(#chipGradient)"
              stroke="#B87333"
              strokeWidth={isClickable ? 2.5 : 1.5}
            />
            
            {/* Shiny overlay */}
            <rect
              x="155"
              y="170"
              width="90"
              height="60"
              rx="3"
              fill="url(#chipHighlight)"
            />
            
            {/* Chip pins - top */}
            {[165, 178, 191, 204, 217, 230].map((x, i) => (
              <motion.rect
                key={`top-pin-${i}`}
                x={x - 2} y="162" width="4" height="8"
                fill="#B87333"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.5 + i * 0.03 }}
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
                transition={{ delay: 0.55 + i * 0.03 }}
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
              transition={{ delay: 0.65 }}
            />
            
            {/* Internal circuit pattern */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.7 }}
            >
              <line x1="180" y1="190" x2="220" y2="190" stroke="#B87333" strokeWidth="0.5" />
              <line x1="180" y1="200" x2="220" y2="200" stroke="#B87333" strokeWidth="0.5" />
              <line x1="180" y1="210" x2="220" y2="210" stroke="#B87333" strokeWidth="0.5" />
              <line x1="190" y1="185" x2="190" y2="215" stroke="#B87333" strokeWidth="0.5" />
              <line x1="210" y1="185" x2="210" y2="215" stroke="#B87333" strokeWidth="0.5" />
            </motion.g>
            
            {/* Pulse effect when clickable */}
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
      
      {/* Clickable overlay for chip - positioned over SVG chip */}
      {isClickable && (
        <motion.button
          onClick={onChipClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute cursor-pointer z-50"
          style={{
            width: '120px',
            height: '90px',
            background: 'transparent',
            border: 'none',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'auto',
          }}
          aria-label="Activate chip"
          data-testid="button-chip"
        />
      )}
    </div>
  );
}
