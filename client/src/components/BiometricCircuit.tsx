import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // ONLY TRACES during Q1-Q3. Chip body appears ONLY at 100% (after Q4).
  // SAFE ZONE (no traces here): x=60-340, y=100-300
  // Traces stay in MARGINS: TOP (y<100), BOTTOM (y>300), LEFT (x<60), RIGHT (x>340)
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ============ Q1 (25%) - TOP MARGIN TRACES (y < 100) ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 25 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top-left corner - L-shaped trace */}
          <motion.path
            d="M 0 20 L 30 20 L 30 50 L 50 50 L 50 80"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          />
          
          {/* Top center trace with bend */}
          <motion.path
            d="M 180 0 L 180 30 L 200 30 L 200 60 L 220 60 L 220 30 L 240 30 L 240 0"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          
          {/* Top-right corner - L-shaped trace */}
          <motion.path
            d="M 400 20 L 370 20 L 370 50 L 350 50 L 350 80"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
          
          {/* Via points */}
          <motion.circle cx={50} cy={80} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }} />
          <motion.circle cx={50} cy={80} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
            
          <motion.circle cx={350} cy={80} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={350} cy={80} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
        </motion.g>

        {/* ============ Q2 (50%) - RIGHT MARGIN TRACES (x > 340) ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 50 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Right side vertical with horizontal stubs */}
          <motion.path
            d="M 400 120 L 370 120 L 370 150 L 355 150"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          />
          
          <motion.path
            d="M 400 180 L 360 180 L 360 200 L 380 200 L 380 220 L 355 220"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          
          <motion.path
            d="M 400 280 L 370 280 L 370 250 L 355 250"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
          
          {/* Vias */}
          <motion.circle cx={355} cy={150} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }} />
          <motion.circle cx={355} cy={150} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
            
          <motion.circle cx={355} cy={250} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={355} cy={250} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
        </motion.g>

        {/* ============ Q3 (75%) - BOTTOM MARGIN TRACES (y > 300) ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 75 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Bottom-left corner - L-shaped trace */}
          <motion.path
            d="M 0 380 L 30 380 L 30 350 L 50 350 L 50 320"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          />
          
          {/* Bottom center trace with bend */}
          <motion.path
            d="M 180 400 L 180 370 L 200 370 L 200 340 L 220 340 L 220 370 L 240 370 L 240 400"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          
          {/* Bottom-right corner - L-shaped trace */}
          <motion.path
            d="M 400 380 L 370 380 L 370 350 L 350 350 L 350 320"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
          
          {/* Vias */}
          <motion.circle cx={50} cy={320} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }} />
          <motion.circle cx={50} cy={320} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
            
          <motion.circle cx={350} cy={320} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={350} cy={320} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
        </motion.g>

        {/* ============ Q4 (100%) - LEFT MARGIN TRACES (x < 60) ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 100 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left side vertical with horizontal stubs */}
          <motion.path
            d="M 0 120 L 30 120 L 30 150 L 45 150"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          />
          
          <motion.path
            d="M 0 180 L 40 180 L 40 200 L 20 200 L 20 220 L 45 220"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          
          <motion.path
            d="M 0 280 L 30 280 L 30 250 L 45 250"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="square"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
          
          {/* Vias */}
          <motion.circle cx={45} cy={150} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }} />
          <motion.circle cx={45} cy={150} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
            
          <motion.circle cx={45} cy={250} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={45} cy={250} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
        </motion.g>

        {/* ============ CHIP - ONLY AT 100% (after all 4 questions) ============ */}
        {showChip && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <defs>
              <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="30%" stopColor="#2d2d2d" />
                <stop offset="50%" stopColor="#1f1f1f" />
                <stop offset="70%" stopColor="#2a2a2a" />
                <stop offset="100%" stopColor="#151515" />
              </linearGradient>
            </defs>
            
            {/* Connecting traces from margins to chip */}
            <motion.path
              d="M 50 80 L 50 120 L 140 120 L 140 175"
              stroke="#B87333" strokeWidth={1.5} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
            <motion.path
              d="M 350 80 L 350 120 L 260 120 L 260 175"
              stroke="#B87333" strokeWidth={1.5} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.65 }}
            />
            <motion.path
              d="M 355 150 L 320 150 L 320 200 L 260 200"
              stroke="#B87333" strokeWidth={1.5} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            />
            <motion.path
              d="M 355 250 L 320 250 L 320 200 L 260 200"
              stroke="#B87333" strokeWidth={1.5} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.75 }}
            />
            <motion.path
              d="M 50 320 L 50 280 L 140 280 L 140 225"
              stroke="#B87333" strokeWidth={1.5} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            />
            <motion.path
              d="M 350 320 L 350 280 L 260 280 L 260 225"
              stroke="#B87333" strokeWidth={1.5} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.85 }}
            />
            <motion.path
              d="M 45 150 L 80 150 L 80 200 L 140 200"
              stroke="#B87333" strokeWidth={1.5} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            />
            <motion.path
              d="M 45 250 L 80 250 L 80 200 L 140 200"
              stroke="#B87333" strokeWidth={1.5} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.95 }}
            />
            
            {/* Main chip body - ONLY appears at 100% */}
            <motion.rect
              x={140}
              y={175}
              width={120}
              height={50}
              rx={2}
              fill="url(#chipGradient)"
              stroke="#B87333"
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
            />
            
            {/* Top pins */}
            {[150, 165, 180, 195, 210, 225, 240, 250].map((x, i) => (
              <motion.rect
                key={`top-pin-${i}`}
                x={x - 2} y={167} width={4} height={8}
                fill="#B87333"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.9, scaleY: 1 }}
                style={{ transformOrigin: `${x}px 175px` }}
                transition={{ duration: 0.2, delay: 1.05 + i * 0.02 }}
              />
            ))}
            
            {/* Bottom pins */}
            {[150, 165, 180, 195, 210, 225, 240, 250].map((x, i) => (
              <motion.rect
                key={`bottom-pin-${i}`}
                x={x - 2} y={225} width={4} height={8}
                fill="#B87333"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.9, scaleY: 1 }}
                style={{ transformOrigin: `${x}px 225px` }}
                transition={{ duration: 0.2, delay: 1.1 + i * 0.02 }}
              />
            ))}
            
            {/* Left pins */}
            {[185, 200, 215].map((y, i) => (
              <motion.rect
                key={`left-pin-${i}`}
                x={132} y={y - 2} width={8} height={4}
                fill="#B87333"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.9, scaleX: 1 }}
                style={{ transformOrigin: `140px ${y}px` }}
                transition={{ duration: 0.2, delay: 1.15 + i * 0.02 }}
              />
            ))}
            
            {/* Right pins */}
            {[185, 200, 215].map((y, i) => (
              <motion.rect
                key={`right-pin-${i}`}
                x={260} y={y - 2} width={8} height={4}
                fill="#B87333"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.9, scaleX: 1 }}
                style={{ transformOrigin: `260px ${y}px` }}
                transition={{ duration: 0.2, delay: 1.2 + i * 0.02 }}
              />
            ))}
            
            {/* Inner die and grid */}
            <motion.rect
              x={155} y={185} width={90} height={30} rx={1}
              fill="none" stroke="#B87333" strokeWidth={0.5} opacity={0.5}
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
              transition={{ delay: 1.25 }}
            />
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 1.3 }}>
              <line x1={165} y1={190} x2={235} y2={190} stroke="#B87333" strokeWidth={0.5} />
              <line x1={165} y1={200} x2={235} y2={200} stroke="#B87333" strokeWidth={0.5} />
              <line x1={165} y1={210} x2={235} y2={210} stroke="#B87333" strokeWidth={0.5} />
              <line x1={180} y1={187} x2={180} y2={213} stroke="#B87333" strokeWidth={0.5} />
              <line x1={200} y1={187} x2={200} y2={213} stroke="#B87333" strokeWidth={0.5} />
              <line x1={220} y1={187} x2={220} y2={213} stroke="#B87333" strokeWidth={0.5} />
            </motion.g>
            
            {/* Corner notch */}
            <motion.path
              d="M 143 178 L 150 178 L 143 185 Z"
              fill="#B87333" opacity={0.5}
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
              transition={{ delay: 1.25 }}
            />
            
            {/* Pulse effect when clickable */}
            {isClickable && (
              <>
                <motion.rect
                  x={137} y={172} width={126} height={56} rx={3}
                  fill="none" stroke="#B87333" strokeWidth={3}
                  animate={{ opacity: [0.4, 0.9, 0.4], strokeWidth: [2, 4, 2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.rect
                  x={140} y={175} width={120} height={50} rx={2}
                  fill="none" stroke="#B87333" strokeWidth={2}
                  animate={{ scale: [1, 1.15, 1.3], opacity: [0.6, 0.3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ transformOrigin: "200px 200px" }}
                />
              </>
            )}
          </motion.g>
        )}
      </svg>
      
      {/* Clickable overlay */}
      {isClickable && (
        <motion.button
          onClick={onChipClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute cursor-pointer z-50"
          style={{
            width: '140px',
            height: '70px',
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
