import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // Curved organic traces flowing from edges toward center
  // Each question reveals 25% of total traces
  // After all 4 questions: chip appears in center
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 700"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ============ Q1 (25%) - TOP curves flowing down ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 25 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Top-left flowing curve */}
          <motion.path
            d="M 40 0 
               C 40 40, 20 60, 30 100 
               C 40 140, 80 120, 70 180
               C 60 220, 100 200, 90 250"
            stroke="#B87333"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0 }}
          />
          
          {/* Top-center curve with loops */}
          <motion.path
            d="M 200 0
               C 200 30, 180 50, 200 80
               C 220 110, 160 100, 180 130
               Q 200 150, 180 170"
            stroke="#B87333"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          
          {/* Top-right flowing curve */}
          <motion.path
            d="M 360 0
               C 360 50, 380 80, 370 120
               C 360 160, 320 140, 330 200
               C 340 240, 300 220, 310 260"
            stroke="#B87333"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          />
          
          {/* Small accent curve top-left */}
          <motion.path
            d="M 80 30 C 100 50, 60 80, 80 100"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.g>

        {/* ============ Q2 (50%) - RIGHT curves flowing left ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 50 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Right-top flowing curve */}
          <motion.path
            d="M 400 180
               C 360 180, 380 220, 340 230
               C 300 240, 350 280, 300 290
               Q 270 300, 280 320"
            stroke="#B87333"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0 }}
          />
          
          {/* Right-center large curve */}
          <motion.path
            d="M 400 300
               C 350 310, 380 350, 330 360
               C 280 370, 340 400, 290 410
               C 260 420, 280 390, 260 400"
            stroke="#B87333"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          />
          
          {/* Right accent with loop */}
          <motion.path
            d="M 400 400
               C 370 410, 390 440, 350 450
               Q 320 460, 340 480"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          />
        </motion.g>

        {/* ============ Q3 (75%) - BOTTOM curves flowing up ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 75 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Bottom-left flowing curve */}
          <motion.path
            d="M 50 700
               C 50 660, 30 640, 60 600
               C 90 560, 40 540, 80 500
               C 100 480, 70 460, 100 440"
            stroke="#B87333"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0 }}
          />
          
          {/* Bottom-center curve */}
          <motion.path
            d="M 200 700
               C 200 660, 220 640, 190 600
               C 160 560, 230 550, 200 520
               Q 180 500, 200 480"
            stroke="#B87333"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          
          {/* Bottom-right flowing curve */}
          <motion.path
            d="M 350 700
               C 350 650, 370 620, 340 580
               C 310 540, 360 520, 320 490
               C 300 470, 330 450, 300 430"
            stroke="#B87333"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
          />
          
          {/* Small accent bottom */}
          <motion.path
            d="M 130 680 C 150 650, 110 630, 140 600"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
        </motion.g>

        {/* ============ Q4 (100%) - LEFT curves flowing right ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 100 ? 1 : 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left-top flowing curve */}
          <motion.path
            d="M 0 200
               C 40 210, 20 250, 70 260
               C 100 270, 50 300, 100 310
               Q 130 320, 120 340"
            stroke="#B87333"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0 }}
          />
          
          {/* Left-center large curve */}
          <motion.path
            d="M 0 350
               C 50 360, 20 400, 80 410
               C 120 420, 60 450, 120 460
               C 150 470, 120 440, 150 450"
            stroke="#B87333"
            strokeWidth={2.5}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.9, delay: 0.1 }}
          />
          
          {/* Left accent with loop */}
          <motion.path
            d="M 0 480
               C 40 490, 20 520, 70 530
               Q 100 540, 80 560"
            stroke="#B87333"
            strokeWidth={2}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          />
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
            
            {/* Connecting curves from all sides to chip */}
            <motion.path
              d="M 90 250 C 120 280, 140 300, 160 330"
              stroke="#B87333" strokeWidth={2} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
            <motion.path
              d="M 310 260 C 280 290, 260 310, 240 330"
              stroke="#B87333" strokeWidth={2} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.65 }}
            />
            <motion.path
              d="M 280 320 C 260 340, 250 350, 240 360"
              stroke="#B87333" strokeWidth={2} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.7 }}
            />
            <motion.path
              d="M 100 440 C 130 420, 150 400, 165 380"
              stroke="#B87333" strokeWidth={2} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.75 }}
            />
            <motion.path
              d="M 300 430 C 270 410, 250 390, 235 380"
              stroke="#B87333" strokeWidth={2} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            />
            <motion.path
              d="M 120 340 C 140 350, 155 355, 165 360"
              stroke="#B87333" strokeWidth={2} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.85 }}
            />
            <motion.path
              d="M 150 450 C 165 430, 180 400, 185 385"
              stroke="#B87333" strokeWidth={2} fill="none"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
            />
            
            {/* Main chip body - center of screen */}
            <motion.rect
              x={160}
              y={330}
              width={80}
              height={50}
              rx={3}
              fill="url(#chipGradient)"
              stroke="#B87333"
              strokeWidth={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
            />
            
            {/* Top pins */}
            {[170, 185, 200, 215, 230].map((x, i) => (
              <motion.rect
                key={`top-pin-${i}`}
                x={x - 2} y={322} width={4} height={8}
                fill="#B87333"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.9, scaleY: 1 }}
                style={{ transformOrigin: `${x}px 330px` }}
                transition={{ duration: 0.2, delay: 1.05 + i * 0.02 }}
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
                transition={{ duration: 0.2, delay: 1.1 + i * 0.02 }}
              />
            ))}
            
            {/* Left pins */}
            {[345, 355, 365].map((y, i) => (
              <motion.rect
                key={`left-pin-${i}`}
                x={152} y={y - 2} width={8} height={4}
                fill="#B87333"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.9, scaleX: 1 }}
                style={{ transformOrigin: `160px ${y}px` }}
                transition={{ duration: 0.2, delay: 1.15 + i * 0.02 }}
              />
            ))}
            
            {/* Right pins */}
            {[345, 355, 365].map((y, i) => (
              <motion.rect
                key={`right-pin-${i}`}
                x={240} y={y - 2} width={8} height={4}
                fill="#B87333"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.9, scaleX: 1 }}
                style={{ transformOrigin: `240px ${y}px` }}
                transition={{ duration: 0.2, delay: 1.2 + i * 0.02 }}
              />
            ))}
            
            {/* Inner die */}
            <motion.rect
              x={170} y={340} width={60} height={30} rx={1}
              fill="none" stroke="#B87333" strokeWidth={0.5} opacity={0.5}
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
              transition={{ delay: 1.25 }}
            />
            
            {/* Pulse effect when clickable */}
            {isClickable && (
              <>
                <motion.rect
                  x={157} y={327} width={86} height={56} rx={4}
                  fill="none" stroke="#B87333" strokeWidth={3}
                  animate={{ opacity: [0.4, 0.9, 0.4], strokeWidth: [2, 4, 2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.rect
                  x={160} y={330} width={80} height={50} rx={3}
                  fill="none" stroke="#B87333" strokeWidth={2}
                  animate={{ scale: [1, 1.15, 1.3], opacity: [0.6, 0.3, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                  style={{ transformOrigin: "200px 355px" }}
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
            width: '100px',
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
