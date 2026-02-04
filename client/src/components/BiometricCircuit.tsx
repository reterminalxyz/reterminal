import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // Center point where chip will be (200, 350 in 400x700 viewport)
  const cx = 200;
  const cy = 350;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 700"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ============ Q1 (25%) - TOP traces radiating upward ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 25 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Main vertical traces going up */}
          <motion.path
            d="M 200 310 L 200 180 L 180 180 L 180 50 L 150 50 L 150 0"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M 190 310 L 190 200 L 160 200 L 160 80 L 120 80 L 120 0"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          />
          <motion.path
            d="M 210 310 L 210 200 L 240 200 L 240 80 L 280 80 L 280 0"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          <motion.path
            d="M 200 310 L 200 160 L 220 160 L 220 50 L 250 50 L 250 0"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          />
          
          {/* Diagonal-ish traces to corners (still 90° angles) */}
          <motion.path
            d="M 175 310 L 175 250 L 100 250 L 100 120 L 50 120 L 50 0"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          <motion.path
            d="M 225 310 L 225 250 L 300 250 L 300 120 L 350 120 L 350 0"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
          <motion.path
            d="M 165 310 L 165 270 L 60 270 L 60 150 L 20 150 L 20 0"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          <motion.path
            d="M 235 310 L 235 270 L 340 270 L 340 150 L 380 150 L 380 0"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          />
          
          {/* Via nodes */}
          <motion.circle cx={180} cy={180} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={180} cy={180} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={160} cy={200} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={160} cy={200} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={240} cy={200} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={240} cy={200} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={100} cy={250} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={100} cy={250} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
          <motion.circle cx={300} cy={250} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={300} cy={250} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
        </motion.g>

        {/* ============ Q2 (50%) - RIGHT traces radiating outward ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 50 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Horizontal traces going right */}
          <motion.path
            d="M 245 350 L 320 350 L 320 300 L 400 300"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M 245 340 L 300 340 L 300 280 L 360 280 L 360 220 L 400 220"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          />
          <motion.path
            d="M 245 360 L 340 360 L 340 400 L 400 400"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          <motion.path
            d="M 245 370 L 280 370 L 280 450 L 350 450 L 350 500 L 400 500"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
          <motion.path
            d="M 245 330 L 290 330 L 290 250 L 340 250 L 340 180 L 400 180"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          <motion.path
            d="M 235 390 L 260 390 L 260 480 L 320 480 L 320 550 L 370 550 L 370 600 L 400 600"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          />
          
          {/* Via nodes */}
          <motion.circle cx={320} cy={350} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={320} cy={350} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={300} cy={340} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={300} cy={340} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={340} cy={360} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={340} cy={360} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={280} cy={370} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={280} cy={370} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
        </motion.g>

        {/* ============ Q3 (75%) - BOTTOM traces radiating downward ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 75 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Vertical traces going down */}
          <motion.path
            d="M 200 390 L 200 520 L 180 520 L 180 650 L 150 650 L 150 700"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M 190 390 L 190 500 L 160 500 L 160 620 L 120 620 L 120 700"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          />
          <motion.path
            d="M 210 390 L 210 500 L 240 500 L 240 620 L 280 620 L 280 700"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          <motion.path
            d="M 200 390 L 200 540 L 220 540 L 220 650 L 250 650 L 250 700"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          />
          
          {/* Diagonal traces to bottom corners */}
          <motion.path
            d="M 175 390 L 175 450 L 100 450 L 100 580 L 50 580 L 50 700"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          <motion.path
            d="M 225 390 L 225 450 L 300 450 L 300 580 L 350 580 L 350 700"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
          <motion.path
            d="M 165 390 L 165 430 L 60 430 L 60 550 L 20 550 L 20 700"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          <motion.path
            d="M 235 390 L 235 430 L 340 430 L 340 550 L 380 550 L 380 700"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          />
          
          {/* Via nodes */}
          <motion.circle cx={180} cy={520} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={180} cy={520} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={160} cy={500} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={160} cy={500} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={240} cy={500} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={240} cy={500} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={100} cy={450} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={100} cy={450} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
          <motion.circle cx={300} cy={450} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={300} cy={450} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
        </motion.g>

        {/* ============ Q4 (100%) - LEFT traces radiating outward ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 100 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Horizontal traces going left */}
          <motion.path
            d="M 155 350 L 80 350 L 80 300 L 0 300"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M 155 340 L 100 340 L 100 280 L 40 280 L 40 220 L 0 220"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          />
          <motion.path
            d="M 155 360 L 60 360 L 60 400 L 0 400"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          <motion.path
            d="M 155 370 L 120 370 L 120 450 L 50 450 L 50 500 L 0 500"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
          <motion.path
            d="M 155 330 L 110 330 L 110 250 L 60 250 L 60 180 L 0 180"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          <motion.path
            d="M 165 390 L 140 390 L 140 480 L 80 480 L 80 550 L 30 550 L 30 600 L 0 600"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
          />
          
          {/* Via nodes */}
          <motion.circle cx={80} cy={350} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={80} cy={350} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={100} cy={340} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.35 }} />
          <motion.circle cx={100} cy={340} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={60} cy={360} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={60} cy={360} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={120} cy={370} r={4} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={120} cy={370} r={2} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
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
            
            {/* Copper frame around chip */}
            <motion.rect
              x={155}
              y={315}
              width={90}
              height={70}
              rx={4}
              fill="#B87333"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
            
            {/* Main chip body - centered */}
            <motion.rect
              x={160}
              y={320}
              width={80}
              height={60}
              rx={3}
              fill="url(#chipGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            />
            
            {/* Top pins */}
            {[170, 180, 190, 200, 210, 220, 230].map((x, i) => (
              <motion.rect
                key={`top-pin-${i}`}
                x={x - 2} y={300} width={4} height={15}
                fill="#B87333"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.9, scaleY: 1 }}
                style={{ transformOrigin: `${x}px 315px` }}
                transition={{ duration: 0.2, delay: 0.7 + i * 0.02 }}
              />
            ))}
            
            {/* Bottom pins */}
            {[170, 180, 190, 200, 210, 220, 230].map((x, i) => (
              <motion.rect
                key={`bottom-pin-${i}`}
                x={x - 2} y={385} width={4} height={15}
                fill="#B87333"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.9, scaleY: 1 }}
                style={{ transformOrigin: `${x}px 385px` }}
                transition={{ duration: 0.2, delay: 0.75 + i * 0.02 }}
              />
            ))}
            
            {/* Left pins */}
            {[330, 340, 350, 360, 370].map((y, i) => (
              <motion.rect
                key={`left-pin-${i}`}
                x={140} y={y - 2} width={15} height={4}
                fill="#B87333"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.9, scaleX: 1 }}
                style={{ transformOrigin: `155px ${y}px` }}
                transition={{ duration: 0.2, delay: 0.8 + i * 0.02 }}
              />
            ))}
            
            {/* Right pins */}
            {[330, 340, 350, 360, 370].map((y, i) => (
              <motion.rect
                key={`right-pin-${i}`}
                x={245} y={y - 2} width={15} height={4}
                fill="#B87333"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.9, scaleX: 1 }}
                style={{ transformOrigin: `245px ${y}px` }}
                transition={{ duration: 0.2, delay: 0.85 + i * 0.02 }}
              />
            ))}
            
            {/* Inner die frame */}
            <motion.rect
              x={168} y={328} width={64} height={44} rx={2}
              fill="none" stroke="#B87333" strokeWidth={1} opacity={0.6}
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              transition={{ delay: 0.9 }}
            />
            
            {/* Inner grid lines (IC die pattern) */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.95 }}>
              <line x1={175} y1={340} x2={225} y2={340} stroke="#B87333" strokeWidth={0.5} />
              <line x1={175} y1={350} x2={225} y2={350} stroke="#B87333" strokeWidth={0.5} />
              <line x1={175} y1={360} x2={225} y2={360} stroke="#B87333" strokeWidth={0.5} />
              <line x1={185} y1={333} x2={185} y2={367} stroke="#B87333" strokeWidth={0.5} />
              <line x1={200} y1={333} x2={200} y2={367} stroke="#B87333" strokeWidth={0.5} />
              <line x1={215} y1={333} x2={215} y2={367} stroke="#B87333" strokeWidth={0.5} />
            </motion.g>
            
            {/* Pulse effect when clickable */}
            {isClickable && (
              <>
                <motion.rect
                  x={152} y={312} width={96} height={76} rx={5}
                  fill="none" stroke="#B87333" strokeWidth={3}
                  animate={{ opacity: [0.4, 0.9, 0.4], strokeWidth: [2, 4, 2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.rect
                  x={155} y={315} width={90} height={70} rx={4}
                  fill="none" stroke="#B87333" strokeWidth={2}
                  animate={{ scale: [1, 1.1, 1.2], opacity: [0.6, 0.3, 0] }}
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
            width: '120px',
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
