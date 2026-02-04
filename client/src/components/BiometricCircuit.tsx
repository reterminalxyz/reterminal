import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // Central microchip assembly - builds up piece by piece
  // Chip centered at approximately (200, 200)
  // Each answer reveals a QUARTER of the microchip
  
  const chipCenterX = 200;
  const chipCenterY = 200;
  const chipWidth = 120;
  const chipHeight = 80;
  const chipLeft = chipCenterX - chipWidth / 2; // 140
  const chipRight = chipCenterX + chipWidth / 2; // 260
  const chipTop = chipCenterY - chipHeight / 2; // 160
  const chipBottom = chipCenterY + chipHeight / 2; // 240

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
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
            <stop offset="0%" stopColor="rgba(255,255,255,0.12)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.2)" />
          </linearGradient>
          <clipPath id="topQuarter">
            <rect x={chipLeft - 50} y={chipTop - 60} width={chipWidth + 100} height={(chipHeight / 2) + 60} />
          </clipPath>
          <clipPath id="rightQuarter">
            <rect x={chipCenterX} y={chipTop - 20} width={(chipWidth / 2) + 50} height={chipHeight + 40} />
          </clipPath>
          <clipPath id="bottomQuarter">
            <rect x={chipLeft - 50} y={chipCenterY} width={chipWidth + 100} height={(chipHeight / 2) + 60} />
          </clipPath>
          <clipPath id="leftQuarter">
            <rect x={chipLeft - 50} y={chipTop - 20} width={(chipWidth / 2) + 50} height={chipHeight + 40} />
          </clipPath>
        </defs>
        
        {/* ============ Q1 (25%) - TOP QUARTER ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 25 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Incoming traces from top */}
          <motion.path
            d="M 160 60 L 160 120 L 160 160"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          />
          <motion.path
            d="M 200 40 L 200 100 L 200 160"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.path
            d="M 240 60 L 240 120 L 240 160"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          {/* Top edge of chip body */}
          <motion.rect
            x={chipLeft}
            y={chipTop}
            width={chipWidth}
            height={chipHeight / 2}
            fill="url(#chipGradient)"
            stroke="#B87333"
            strokeWidth={1.5}
            clipPath="url(#topQuarter)"
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ 
              opacity: revealProgress >= 25 ? 1 : 0,
              scaleY: revealProgress >= 25 ? 1 : 0
            }}
            style={{ transformOrigin: `${chipCenterX}px ${chipTop}px` }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
          
          {/* Top pins (10 pins) */}
          {[148, 160, 172, 184, 196, 208, 220, 232, 244].map((x, i) => (
            <motion.rect
              key={`top-pin-${i}`}
              x={x - 2}
              y={chipTop - 12}
              width={4}
              height={12}
              fill="#B87333"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ 
                opacity: revealProgress >= 25 ? 0.9 : 0,
                scaleY: revealProgress >= 25 ? 1 : 0
              }}
              style={{ transformOrigin: `${x}px ${chipTop}px` }}
              transition={{ duration: 0.3, delay: 0.35 + i * 0.02 }}
            />
          ))}
          
          {/* Top internal die section */}
          <motion.rect
            x={chipLeft + 20}
            y={chipTop + 10}
            width={chipWidth - 40}
            height={(chipHeight / 2) - 15}
            fill="none"
            stroke="#B87333"
            strokeWidth={0.5}
            opacity={0.4}
            initial={{ opacity: 0 }}
            animate={{ opacity: revealProgress >= 25 ? 0.4 : 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          />
          
          {/* Top horizontal traces inside */}
          <motion.line
            x1={chipLeft + 25}
            y1={chipTop + 18}
            x2={chipRight - 25}
            y2={chipTop + 18}
            stroke="#B87333"
            strokeWidth={0.5}
            opacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.55 }}
          />
          <motion.line
            x1={chipLeft + 25}
            y1={chipTop + 28}
            x2={chipRight - 25}
            y2={chipTop + 28}
            stroke="#B87333"
            strokeWidth={0.5}
            opacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />
          
          {/* Vias at trace ends */}
          <motion.circle cx={160} cy={120} r={3} fill="#B87333" opacity={0.7}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={200} cy={100} r={3} fill="#B87333" opacity={0.7}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={240} cy={120} r={3} fill="#B87333" opacity={0.7}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
        </motion.g>

        {/* ============ Q2 (50%) - RIGHT QUARTER ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 50 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Incoming traces from right */}
          <motion.path
            d="M 340 175 L 290 175 L 260 175"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          />
          <motion.path
            d="M 360 200 L 300 200 L 260 200"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.path
            d="M 340 225 L 290 225 L 260 225"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          {/* Right pins (6 pins) */}
          {[168, 180, 192, 204, 216, 228].map((y, i) => (
            <motion.rect
              key={`right-pin-${i}`}
              x={chipRight}
              y={y - 2}
              width={12}
              height={4}
              fill="#B87333"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ 
                opacity: revealProgress >= 50 ? 0.9 : 0,
                scaleX: revealProgress >= 50 ? 1 : 0
              }}
              style={{ transformOrigin: `${chipRight}px ${y}px` }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.03 }}
            />
          ))}
          
          {/* Right internal traces */}
          <motion.line
            x1={chipCenterX + 10}
            y1={chipTop + 15}
            x2={chipCenterX + 10}
            y2={chipBottom - 15}
            stroke="#B87333"
            strokeWidth={0.5}
            opacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          />
          <motion.line
            x1={chipCenterX + 25}
            y1={chipTop + 15}
            x2={chipCenterX + 25}
            y2={chipBottom - 15}
            stroke="#B87333"
            strokeWidth={0.5}
            opacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.55 }}
          />
          
          {/* SMD component on right trace */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: revealProgress >= 50 ? 1 : 0,
              scale: revealProgress >= 50 ? 1 : 0
            }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <rect x={295} y={195} width={16} height={10} fill="#1a1a1a" stroke="#B87333" strokeWidth={0.5} />
            <rect x={293} y={197} width={3} height={6} fill="#B87333" />
            <rect x={310} y={197} width={3} height={6} fill="#B87333" />
          </motion.g>
          
          {/* Vias */}
          <motion.circle cx={290} cy={175} r={3} fill="#B87333" opacity={0.7}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={290} cy={225} r={3} fill="#B87333" opacity={0.7}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
        </motion.g>

        {/* ============ Q3 (75%) - BOTTOM QUARTER ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 75 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Incoming traces from bottom */}
          <motion.path
            d="M 160 340 L 160 280 L 160 240"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          />
          <motion.path
            d="M 200 360 L 200 300 L 200 240"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.path
            d="M 240 340 L 240 280 L 240 240"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          {/* Bottom edge completes chip body */}
          <motion.rect
            x={chipLeft}
            y={chipCenterY}
            width={chipWidth}
            height={chipHeight / 2}
            fill="url(#chipGradient)"
            stroke="#B87333"
            strokeWidth={1.5}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{ 
              opacity: revealProgress >= 75 ? 1 : 0,
              scaleY: revealProgress >= 75 ? 1 : 0
            }}
            style={{ transformOrigin: `${chipCenterX}px ${chipCenterY}px` }}
            transition={{ duration: 0.4, delay: 0.3 }}
          />
          
          {/* Bottom pins (10 pins) */}
          {[148, 160, 172, 184, 196, 208, 220, 232, 244].map((x, i) => (
            <motion.rect
              key={`bottom-pin-${i}`}
              x={x - 2}
              y={chipBottom}
              width={4}
              height={12}
              fill="#B87333"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ 
                opacity: revealProgress >= 75 ? 0.9 : 0,
                scaleY: revealProgress >= 75 ? 1 : 0
              }}
              style={{ transformOrigin: `${x}px ${chipBottom}px` }}
              transition={{ duration: 0.3, delay: 0.35 + i * 0.02 }}
            />
          ))}
          
          {/* Bottom internal traces */}
          <motion.line
            x1={chipLeft + 25}
            y1={chipBottom - 18}
            x2={chipRight - 25}
            y2={chipBottom - 18}
            stroke="#B87333"
            strokeWidth={0.5}
            opacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.55 }}
          />
          <motion.line
            x1={chipLeft + 25}
            y1={chipBottom - 28}
            x2={chipRight - 25}
            y2={chipBottom - 28}
            stroke="#B87333"
            strokeWidth={0.5}
            opacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />
          
          {/* Resistor on bottom trace */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: revealProgress >= 75 ? 1 : 0,
              scale: revealProgress >= 75 ? 1 : 0
            }}
            transition={{ duration: 0.3, delay: 0.45 }}
          >
            <rect x={190} y={295} width={20} height={8} fill="#2a2a2a" stroke="#B87333" strokeWidth={0.5} />
            <rect x={194} y={295} width={2} height={8} fill="#B87333" opacity={0.6} />
            <rect x={199} y={295} width={2} height={8} fill="#B87333" opacity={0.4} />
            <rect x={204} y={295} width={2} height={8} fill="#B87333" opacity={0.6} />
          </motion.g>
          
          {/* Vias */}
          <motion.circle cx={160} cy={280} r={3} fill="#B87333" opacity={0.7}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={200} cy={300} r={3} fill="#B87333" opacity={0.7}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={240} cy={280} r={3} fill="#B87333" opacity={0.7}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
        </motion.g>

        {/* ============ Q4 (100%) - LEFT QUARTER (completes chip) ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 100 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Incoming traces from left */}
          <motion.path
            d="M 60 175 L 110 175 L 140 175"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          />
          <motion.path
            d="M 40 200 L 100 200 L 140 200"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.path
            d="M 60 225 L 110 225 L 140 225"
            stroke="#B87333"
            strokeWidth={2}
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          
          {/* Left pins (6 pins) */}
          {[168, 180, 192, 204, 216, 228].map((y, i) => (
            <motion.rect
              key={`left-pin-${i}`}
              x={chipLeft - 12}
              y={y - 2}
              width={12}
              height={4}
              fill="#B87333"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ 
                opacity: revealProgress >= 100 ? 0.9 : 0,
                scaleX: revealProgress >= 100 ? 1 : 0
              }}
              style={{ transformOrigin: `${chipLeft}px ${y}px` }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.03 }}
            />
          ))}
          
          {/* Left internal traces */}
          <motion.line
            x1={chipCenterX - 10}
            y1={chipTop + 15}
            x2={chipCenterX - 10}
            y2={chipBottom - 15}
            stroke="#B87333"
            strokeWidth={0.5}
            opacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          />
          <motion.line
            x1={chipCenterX - 25}
            y1={chipTop + 15}
            x2={chipCenterX - 25}
            y2={chipBottom - 15}
            stroke="#B87333"
            strokeWidth={0.5}
            opacity={0.3}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.55 }}
          />
          
          {/* Capacitor on left trace */}
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: revealProgress >= 100 ? 1 : 0,
              scale: revealProgress >= 100 ? 1 : 0
            }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <line x1={95} y1={200} x2={103} y2={200} stroke="#B87333" strokeWidth={1} />
            <line x1={117} y1={200} x2={125} y2={200} stroke="#B87333" strokeWidth={1} />
            <line x1={103} y1={193} x2={103} y2={207} stroke="#B87333" strokeWidth={2} />
            <line x1={117} y1={193} x2={117} y2={207} stroke="#B87333" strokeWidth={2} />
          </motion.g>
          
          {/* Corner notch (orientation mark) */}
          <motion.path
            d="M 145 165 L 155 165 L 145 175 Z"
            fill="#B87333"
            opacity={0.5}
            initial={{ opacity: 0 }}
            animate={{ opacity: revealProgress >= 100 ? 0.5 : 0 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          />
          
          {/* Vias */}
          <motion.circle cx={110} cy={175} r={3} fill="#B87333" opacity={0.7}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={110} cy={225} r={3} fill="#B87333" opacity={0.7}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
        </motion.g>

        {/* ============ COMPLETE CHIP OVERLAY (only at 100%) ============ */}
        {showChip && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {/* Full chip body overlay */}
            <rect
              x={chipLeft}
              y={chipTop}
              width={chipWidth}
              height={chipHeight}
              fill="url(#chipHighlight)"
              rx={2}
            />
            
            {/* Central die with grid pattern */}
            <motion.rect
              x={chipLeft + 25}
              y={chipTop + 15}
              width={chipWidth - 50}
              height={chipHeight - 30}
              fill="none"
              stroke="#B87333"
              strokeWidth={1}
              opacity={0.6}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
            />
            
            {/* Grid lines inside die */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 0.9 }}
            >
              {/* Horizontal */}
              <line x1={chipLeft + 30} y1={chipTop + 25} x2={chipRight - 30} y2={chipTop + 25} stroke="#B87333" strokeWidth={0.5} />
              <line x1={chipLeft + 30} y1={chipCenterY - 5} x2={chipRight - 30} y2={chipCenterY - 5} stroke="#B87333" strokeWidth={0.5} />
              <line x1={chipLeft + 30} y1={chipCenterY + 5} x2={chipRight - 30} y2={chipCenterY + 5} stroke="#B87333" strokeWidth={0.5} />
              <line x1={chipLeft + 30} y1={chipBottom - 25} x2={chipRight - 30} y2={chipBottom - 25} stroke="#B87333" strokeWidth={0.5} />
              {/* Vertical */}
              <line x1={chipLeft + 40} y1={chipTop + 20} x2={chipLeft + 40} y2={chipBottom - 20} stroke="#B87333" strokeWidth={0.5} />
              <line x1={chipCenterX - 15} y1={chipTop + 20} x2={chipCenterX - 15} y2={chipBottom - 20} stroke="#B87333" strokeWidth={0.5} />
              <line x1={chipCenterX + 15} y1={chipTop + 20} x2={chipCenterX + 15} y2={chipBottom - 20} stroke="#B87333" strokeWidth={0.5} />
              <line x1={chipRight - 40} y1={chipTop + 20} x2={chipRight - 40} y2={chipBottom - 20} stroke="#B87333" strokeWidth={0.5} />
            </motion.g>
            
            {/* Glow/pulse effect when clickable */}
            {isClickable && (
              <>
                <motion.rect
                  x={chipLeft - 3}
                  y={chipTop - 3}
                  width={chipWidth + 6}
                  height={chipHeight + 6}
                  rx={3}
                  fill="none"
                  stroke="#B87333"
                  strokeWidth={3}
                  animate={{ 
                    opacity: [0.4, 0.9, 0.4],
                    strokeWidth: [2, 4, 2]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.rect
                  x={chipLeft}
                  y={chipTop}
                  width={chipWidth}
                  height={chipHeight}
                  rx={2}
                  fill="none"
                  stroke="#B87333"
                  strokeWidth={2}
                  animate={{ 
                    scale: [1, 1.15, 1.3],
                    opacity: [0.6, 0.3, 0]
                  }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ transformOrigin: `${chipCenterX}px ${chipCenterY}px` }}
                />
              </>
            )}
          </motion.g>
        )}
      </svg>
      
      {/* Clickable overlay button */}
      {isClickable && (
        <motion.button
          onClick={onChipClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="absolute cursor-pointer z-50"
          style={{
            width: '140px',
            height: '100px',
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
