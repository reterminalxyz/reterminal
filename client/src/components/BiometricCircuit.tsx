import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // PCB-style traces: straight lines with 90° angles
  // Layout: traces flow from edges toward center in margins
  // SAFE ZONE: x=50-350, y=120-520 - no traces here (content area)
  // Traces stay in margins only
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 700"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ============ Q1 (25%) - TOP LEFT & TOP RIGHT traces ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 25 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Top-left corner PCB traces */}
          <motion.path
            d="M 0 30 L 30 30 L 30 60 L 15 60 L 15 90"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M 50 0 L 50 40 L 35 40 L 35 80"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          />
          <motion.path
            d="M 0 70 L 20 70 L 20 100 L 40 100"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
          
          {/* Top-right corner PCB traces */}
          <motion.path
            d="M 400 30 L 370 30 L 370 60 L 385 60 L 385 90"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.path
            d="M 350 0 L 350 40 L 365 40 L 365 80"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
          <motion.path
            d="M 400 70 L 380 70 L 380 100 L 360 100"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
          
          {/* Via points */}
          <motion.circle cx={15} cy={90} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }} />
          <motion.circle cx={15} cy={90} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={385} cy={90} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }} />
          <motion.circle cx={385} cy={90} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
        </motion.g>

        {/* ============ Q2 (50%) - RIGHT SIDE traces ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 50 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Right side upper */}
          <motion.path
            d="M 400 150 L 370 150 L 370 180 L 385 180 L 385 210"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M 400 200 L 360 200 L 360 170 L 375 170"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          />
          
          {/* Right side middle */}
          <motion.path
            d="M 400 280 L 365 280 L 365 310 L 380 310 L 380 340"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.path
            d="M 400 330 L 370 330 L 370 300 L 355 300"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          />
          
          {/* Right side lower */}
          <motion.path
            d="M 400 400 L 375 400 L 375 430 L 360 430"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
          
          {/* Via points */}
          <motion.circle cx={385} cy={210} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }} />
          <motion.circle cx={385} cy={210} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={380} cy={340} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={380} cy={340} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
        </motion.g>

        {/* ============ Q3 (75%) - BOTTOM traces ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 75 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Bottom-left corner */}
          <motion.path
            d="M 0 650 L 30 650 L 30 620 L 15 620 L 15 590"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M 50 700 L 50 660 L 35 660 L 35 620"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          />
          <motion.path
            d="M 0 600 L 25 600 L 25 570 L 40 570"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          />
          
          {/* Bottom-right corner */}
          <motion.path
            d="M 400 650 L 370 650 L 370 620 L 385 620 L 385 590"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.path
            d="M 350 700 L 350 660 L 365 660 L 365 620"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          />
          <motion.path
            d="M 400 600 L 375 600 L 375 570 L 360 570"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
          
          {/* Via points */}
          <motion.circle cx={15} cy={590} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }} />
          <motion.circle cx={15} cy={590} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={385} cy={590} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }} />
          <motion.circle cx={385} cy={590} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
        </motion.g>

        {/* ============ Q4 (100%) - LEFT SIDE traces ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 100 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left side upper */}
          <motion.path
            d="M 0 150 L 30 150 L 30 180 L 15 180 L 15 210"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M 0 200 L 40 200 L 40 170 L 25 170"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          />
          
          {/* Left side middle */}
          <motion.path
            d="M 0 280 L 35 280 L 35 310 L 20 310 L 20 340"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          />
          <motion.path
            d="M 0 330 L 30 330 L 30 300 L 45 300"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          />
          
          {/* Left side lower */}
          <motion.path
            d="M 0 400 L 25 400 L 25 430 L 40 430"
            stroke="#B87333" strokeWidth={2} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          />
          
          {/* Via points */}
          <motion.circle cx={15} cy={210} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.3 }} />
          <motion.circle cx={15} cy={210} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={20} cy={340} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={20} cy={340} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
        </motion.g>

        {/* ============ CHIP - ONLY AT 100% ============ */}
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
            
            {/* Main chip body - centered */}
            <motion.rect
              x={160}
              y={320}
              width={80}
              height={60}
              rx={3}
              fill="url(#chipGradient)"
              stroke="#B87333"
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
            
            {/* Top pins */}
            {[170, 185, 200, 215, 230].map((x, i) => (
              <motion.rect
                key={`top-pin-${i}`}
                x={x - 2} y={312} width={4} height={8}
                fill="#B87333"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.9, scaleY: 1 }}
                style={{ transformOrigin: `${x}px 320px` }}
                transition={{ duration: 0.2, delay: 0.7 + i * 0.02 }}
              />
            ))}
            
            {/* Bottom pins */}
            {[170, 185, 200, 215, 230].map((x, i) => (
              <motion.rect
                key={`bottom-pin-${i}`}
                x={x - 2} y={380} width={4} height={8}
                fill="#B87333"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.9, scaleY: 1 }}
                style={{ transformOrigin: `${x}px 380px` }}
                transition={{ duration: 0.2, delay: 0.75 + i * 0.02 }}
              />
            ))}
            
            {/* Left pins */}
            {[335, 350, 365].map((y, i) => (
              <motion.rect
                key={`left-pin-${i}`}
                x={152} y={y - 2} width={8} height={4}
                fill="#B87333"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.9, scaleX: 1 }}
                style={{ transformOrigin: `160px ${y}px` }}
                transition={{ duration: 0.2, delay: 0.8 + i * 0.02 }}
              />
            ))}
            
            {/* Right pins */}
            {[335, 350, 365].map((y, i) => (
              <motion.rect
                key={`right-pin-${i}`}
                x={240} y={y - 2} width={8} height={4}
                fill="#B87333"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.9, scaleX: 1 }}
                style={{ transformOrigin: `240px ${y}px` }}
                transition={{ duration: 0.2, delay: 0.85 + i * 0.02 }}
              />
            ))}
            
            {/* Inner die */}
            <motion.rect
              x={170} y={330} width={60} height={40} rx={1}
              fill="none" stroke="#B87333" strokeWidth={0.5} opacity={0.5}
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
              transition={{ delay: 0.9 }}
            />
            
            {/* Inner grid lines */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 0.95 }}>
              <line x1={180} y1={335} x2={220} y2={335} stroke="#B87333" strokeWidth={0.5} />
              <line x1={180} y1={350} x2={220} y2={350} stroke="#B87333" strokeWidth={0.5} />
              <line x1={180} y1={365} x2={220} y2={365} stroke="#B87333" strokeWidth={0.5} />
              <line x1={190} y1={332} x2={190} y2={368} stroke="#B87333" strokeWidth={0.5} />
              <line x1={200} y1={332} x2={200} y2={368} stroke="#B87333" strokeWidth={0.5} />
              <line x1={210} y1={332} x2={210} y2={368} stroke="#B87333" strokeWidth={0.5} />
            </motion.g>
            
            {/* Pulse effect when clickable */}
            {isClickable && (
              <>
                <motion.rect
                  x={157} y={317} width={86} height={66} rx={4}
                  fill="none" stroke="#B87333" strokeWidth={3}
                  animate={{ opacity: [0.4, 0.9, 0.4], strokeWidth: [2, 4, 2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.rect
                  x={160} y={320} width={80} height={60} rx={3}
                  fill="none" stroke="#B87333" strokeWidth={2}
                  animate={{ scale: [1, 1.15, 1.3], opacity: [0.6, 0.3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ transformOrigin: "200px 350px" }}
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
          transition={{ delay: 1 }}
          className="absolute cursor-pointer z-50"
          style={{
            width: '100px',
            height: '80px',
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
