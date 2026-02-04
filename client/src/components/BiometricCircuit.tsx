import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // All lines converge to the chip at center (200, 200)
  // Lines start from CORNERS and EDGES, not center
  // No overlapping with center content area (roughly 120-280 x 160-240)
  
  // TOP-LEFT diagonal lines (25%)
  const topLeftPaths = [
    { d: "M 0 0 L 40 40 L 40 160 L 155 160", delay: 0 },
    { d: "M 30 0 L 60 30 L 60 150 L 155 150", delay: 0.1 },
    { d: "M 0 30 L 30 60 L 30 170 L 155 170", delay: 0.15 },
  ];
  
  // TOP-RIGHT diagonal lines (25%)
  const topRightPaths = [
    { d: "M 400 0 L 360 40 L 360 160 L 245 160", delay: 0.05 },
    { d: "M 370 0 L 340 30 L 340 150 L 245 150", delay: 0.12 },
    { d: "M 400 30 L 370 60 L 370 170 L 245 170", delay: 0.18 },
  ];
  
  // RIGHT side lines (50%)
  const rightPaths = [
    { d: "M 400 120 L 320 120 L 320 180 L 245 180", delay: 0 },
    { d: "M 400 180 L 340 180 L 340 190 L 245 190", delay: 0.08 },
    { d: "M 400 240 L 350 240 L 350 200 L 245 200", delay: 0.15 },
  ];
  
  // BOTTOM-RIGHT diagonal lines (75%)
  const bottomRightPaths = [
    { d: "M 400 400 L 360 360 L 360 240 L 245 240", delay: 0 },
    { d: "M 370 400 L 340 370 L 340 250 L 245 250", delay: 0.1 },
    { d: "M 400 370 L 370 340 L 370 230 L 245 230", delay: 0.15 },
  ];
  
  // BOTTOM-LEFT diagonal lines (75%)
  const bottomLeftPaths = [
    { d: "M 0 400 L 40 360 L 40 240 L 155 240", delay: 0.05 },
    { d: "M 30 400 L 60 370 L 60 250 L 155 250", delay: 0.12 },
    { d: "M 0 370 L 30 340 L 30 230 L 155 230", delay: 0.18 },
  ];
  
  // LEFT side lines (100%)
  const leftPaths = [
    { d: "M 0 120 L 80 120 L 80 180 L 155 180", delay: 0 },
    { d: "M 0 180 L 60 180 L 60 190 L 155 190", delay: 0.08 },
    { d: "M 0 240 L 50 240 L 50 200 L 155 200", delay: 0.15 },
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
          opacity: revealProgress >= minProgress ? 0.75 : 0
        }}
        transition={{ 
          duration: 1.5,
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
        {/* TOP paths from corners - 25% */}
        {renderPaths(topLeftPaths, 25)}
        {renderPaths(topRightPaths, 25)}
        
        {/* RIGHT paths - 50% */}
        {renderPaths(rightPaths, 50)}
        
        {/* BOTTOM paths from corners - 75% */}
        {renderPaths(bottomRightPaths, 75)}
        {renderPaths(bottomLeftPaths, 75)}
        
        {/* LEFT paths - 100% */}
        {renderPaths(leftPaths, 100)}
        
        {/* Central chip - all lines converge here */}
        {showChip && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {/* Outer glow ring */}
            <motion.rect
              x="148"
              y="153"
              width="104"
              height="94"
              rx="4"
              fill="none"
              stroke="#B87333"
              strokeWidth="1"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ transformOrigin: "200px 200px" }}
            />
            
            {/* Main chip frame */}
            <motion.rect
              x="155"
              y="160"
              width="90"
              height="80"
              rx="3"
              stroke="#B87333"
              strokeWidth={isClickable ? 3 : 2}
              fill="rgba(184,115,51,0.08)"
              className={isClickable ? "pointer-events-auto cursor-pointer" : ""}
              onClick={isClickable ? onChipClick : undefined}
              animate={isClickable ? {
                strokeOpacity: [0.6, 1, 0.6],
                fillOpacity: [0.05, 0.15, 0.05]
              } : {}}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            
            {/* Chip pins - top */}
            {[165, 180, 195, 210, 225, 238].map((x, i) => (
              <motion.line
                key={`top-pin-${i}`}
                x1={x} y1="152" x2={x} y2="160"
                stroke="#B87333"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ delay: 0.6 + i * 0.04 }}
              />
            ))}
            
            {/* Chip pins - bottom */}
            {[165, 180, 195, 210, 225, 238].map((x, i) => (
              <motion.line
                key={`bottom-pin-${i}`}
                x1={x} y1="240" x2={x} y2="248"
                stroke="#B87333"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.85 }}
                transition={{ delay: 0.65 + i * 0.04 }}
              />
            ))}
            
            {/* Internal chip structure */}
            <motion.rect
              x="162" y="168" width="32" height="32" rx="2"
              fill="rgba(184,115,51,0.2)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            />
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              <rect x="200" y="168" width="38" height="10" rx="1" fill="rgba(184,115,51,0.15)" />
              <rect x="200" y="182" width="38" height="10" rx="1" fill="rgba(184,115,51,0.15)" />
              <rect x="162" y="206" width="76" height="12" rx="1" fill="rgba(184,115,51,0.12)" />
              <rect x="162" y="222" width="76" height="12" rx="1" fill="rgba(184,115,51,0.1)" />
            </motion.g>
            
            {/* Animated scan line */}
            <motion.rect
              x="162"
              y="168"
              width="76"
              height="2"
              fill="#B87333"
              opacity={0.5}
              animate={{ y: [168, 232, 168] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Corner brackets */}
            <motion.path
              d="M 155 168 L 155 160 L 163 160"
              stroke="#B87333" strokeWidth="2" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.9 }}
            />
            <motion.path
              d="M 245 168 L 245 160 L 237 160"
              stroke="#B87333" strokeWidth="2" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.95 }}
            />
            <motion.path
              d="M 155 232 L 155 240 L 163 240"
              stroke="#B87333" strokeWidth="2" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 1.0 }}
            />
            <motion.path
              d="M 245 232 L 245 240 L 237 240"
              stroke="#B87333" strokeWidth="2" fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 1.05 }}
            />
          </motion.g>
        )}
        
        {/* Pulse rings when clickable */}
        {isClickable && (
          <>
            <motion.rect
              x="155" y="160" width="90" height="80" rx="3"
              stroke="#B87333" strokeWidth="1.5" fill="none"
              animate={{ scale: [1, 1.15, 1.3], opacity: [0.5, 0.2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ transformOrigin: "200px 200px" }}
            />
            <motion.rect
              x="155" y="160" width="90" height="80" rx="3"
              stroke="#B87333" strokeWidth="1" fill="none"
              animate={{ scale: [1, 1.25, 1.5], opacity: [0.3, 0.1, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
              style={{ transformOrigin: "200px 200px" }}
            />
          </>
        )}
      </svg>
    </div>
  );
}
