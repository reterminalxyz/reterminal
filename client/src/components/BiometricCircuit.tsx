import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // Traces flow FROM edges TO center chip
  // Each question reveals traces from ALL 4 directions equally
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 700"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ============ Q1 (25%) - First wave from ALL sides ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 25 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* TOP - first traces */}
          <motion.path
            d="M 150 0 L 150 50 L 180 50 L 180 120 L 200 120 L 200 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7 }}
          />
          <motion.path
            d="M 250 0 L 250 50 L 220 50 L 220 120 L 200 120"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          
          {/* RIGHT - first traces */}
          <motion.path
            d="M 400 300 L 350 300 L 350 340 L 280 340 L 280 350 L 245 350"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          />
          <motion.path
            d="M 400 400 L 350 400 L 350 360 L 280 360 L 280 350"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
          
          {/* BOTTOM - first traces */}
          <motion.path
            d="M 150 700 L 150 650 L 180 650 L 180 580 L 200 580 L 200 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          <motion.path
            d="M 250 700 L 250 650 L 220 650 L 220 580 L 200 580"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          
          {/* LEFT - first traces */}
          <motion.path
            d="M 0 300 L 50 300 L 50 340 L 120 340 L 120 350 L 155 350"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
          <motion.path
            d="M 0 400 L 50 400 L 50 360 L 120 360 L 120 350"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          />
          
          {/* Via nodes */}
          <motion.circle cx={180} cy={120} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={180} cy={120} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
          <motion.circle cx={350} cy={300} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={350} cy={300} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
          <motion.circle cx={180} cy={580} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={180} cy={580} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
          <motion.circle cx={50} cy={300} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={50} cy={300} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 25 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
        </motion.g>

        {/* ============ Q2 (50%) - Second wave from ALL sides ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 50 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* TOP - second traces */}
          <motion.path
            d="M 50 0 L 50 80 L 100 80 L 100 200 L 170 200 L 170 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.7 }}
          />
          <motion.path
            d="M 350 0 L 350 80 L 300 80 L 300 200 L 230 200 L 230 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          
          {/* RIGHT - second traces */}
          <motion.path
            d="M 400 200 L 320 200 L 320 320 L 260 320 L 260 340 L 245 340"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          />
          <motion.path
            d="M 400 500 L 320 500 L 320 380 L 260 380 L 260 360 L 245 360"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
          
          {/* BOTTOM - second traces */}
          <motion.path
            d="M 50 700 L 50 620 L 100 620 L 100 500 L 170 500 L 170 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          <motion.path
            d="M 350 700 L 350 620 L 300 620 L 300 500 L 230 500 L 230 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          
          {/* LEFT - second traces */}
          <motion.path
            d="M 0 200 L 80 200 L 80 320 L 140 320 L 140 340 L 155 340"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
          <motion.path
            d="M 0 500 L 80 500 L 80 380 L 140 380 L 140 360 L 155 360"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          />
          
          {/* Via nodes */}
          <motion.circle cx={100} cy={80} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={100} cy={80} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
          <motion.circle cx={300} cy={80} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={300} cy={80} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
          <motion.circle cx={320} cy={200} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={320} cy={200} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
          <motion.circle cx={80} cy={200} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={80} cy={200} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 50 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
        </motion.g>

        {/* ============ Q3 (75%) - Third wave from ALL sides ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 75 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* TOP - third traces (corners) */}
          <motion.path
            d="M 20 0 L 20 120 L 60 120 L 60 250 L 160 250 L 160 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7 }}
          />
          <motion.path
            d="M 380 0 L 380 120 L 340 120 L 340 250 L 240 250 L 240 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          
          {/* RIGHT - third traces */}
          <motion.path
            d="M 400 150 L 360 150 L 360 280 L 300 280 L 300 330 L 245 330"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.05 }}
          />
          <motion.path
            d="M 400 550 L 360 550 L 360 420 L 300 420 L 300 370 L 245 370"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
          
          {/* BOTTOM - third traces (corners) */}
          <motion.path
            d="M 20 700 L 20 580 L 60 580 L 60 450 L 160 450 L 160 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          <motion.path
            d="M 380 700 L 380 580 L 340 580 L 340 450 L 240 450 L 240 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          
          {/* LEFT - third traces */}
          <motion.path
            d="M 0 150 L 40 150 L 40 280 L 100 280 L 100 330 L 155 330"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          />
          <motion.path
            d="M 0 550 L 40 550 L 40 420 L 100 420 L 100 370 L 155 370"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          />
          
          {/* Via nodes */}
          <motion.circle cx={60} cy={120} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={60} cy={120} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
          <motion.circle cx={340} cy={120} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={340} cy={120} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
          <motion.circle cx={60} cy={580} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={60} cy={580} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
          <motion.circle cx={340} cy={580} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.5 }} />
          <motion.circle cx={340} cy={580} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 75 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.55 }} />
        </motion.g>

        {/* ============ Q4 (100%) - Fourth wave from ALL sides + CHIP ============ */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: revealProgress >= 100 ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* TOP - fourth traces */}
          <motion.path
            d="M 100 0 L 100 40 L 140 40 L 140 160 L 185 160 L 185 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          />
          <motion.path
            d="M 300 0 L 300 40 L 260 40 L 260 160 L 215 160 L 215 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          
          {/* RIGHT - fourth traces */}
          <motion.path
            d="M 400 250 L 340 250 L 340 310 L 280 310 L 280 345 L 245 345"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
          />
          <motion.path
            d="M 400 450 L 340 450 L 340 390 L 280 390 L 280 355 L 245 355"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          />
          
          {/* BOTTOM - fourth traces */}
          <motion.path
            d="M 100 700 L 100 660 L 140 660 L 140 540 L 185 540 L 185 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          />
          <motion.path
            d="M 300 700 L 300 660 L 260 660 L 260 540 L 215 540 L 215 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          
          {/* LEFT - fourth traces */}
          <motion.path
            d="M 0 250 L 60 250 L 60 310 L 120 310 L 120 345 L 155 345"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          />
          <motion.path
            d="M 0 450 L 60 450 L 60 390 L 120 390 L 120 355 L 155 355"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          />
          
          {/* Via nodes */}
          <motion.circle cx={140} cy={40} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={140} cy={40} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={260} cy={40} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={260} cy={40} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={140} cy={660} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={140} cy={660} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
          <motion.circle cx={260} cy={660} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.4 }} />
          <motion.circle cx={260} cy={660} r={1.5} fill="#B87333"
            initial={{ scale: 0 }} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: 0.2, delay: 0.45 }} />
        </motion.g>

        {/* ============ CHIP - ONLY AT 100% ============ */}
        {showChip && (
          <motion.g
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
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
              x={150}
              y={305}
              width={100}
              height={90}
              rx={4}
              fill="#B87333"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            />
            
            {/* Main chip body - centered */}
            <motion.rect
              x={155}
              y={310}
              width={90}
              height={80}
              rx={3}
              fill="url(#chipGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            />
            
            {/* Top pins */}
            {[165, 177, 189, 200, 211, 223, 235].map((x, i) => (
              <motion.rect
                key={`top-pin-${i}`}
                x={x - 2} y={290} width={4} height={15}
                fill="#B87333"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.9, scaleY: 1 }}
                style={{ transformOrigin: `${x}px 305px` }}
                transition={{ duration: 0.2, delay: 0.6 + i * 0.02 }}
              />
            ))}
            
            {/* Bottom pins */}
            {[165, 177, 189, 200, 211, 223, 235].map((x, i) => (
              <motion.rect
                key={`bottom-pin-${i}`}
                x={x - 2} y={395} width={4} height={15}
                fill="#B87333"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 0.9, scaleY: 1 }}
                style={{ transformOrigin: `${x}px 395px` }}
                transition={{ duration: 0.2, delay: 0.65 + i * 0.02 }}
              />
            ))}
            
            {/* Left pins */}
            {[320, 332, 345, 358, 370, 382].map((y, i) => (
              <motion.rect
                key={`left-pin-${i}`}
                x={135} y={y - 2} width={15} height={4}
                fill="#B87333"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.9, scaleX: 1 }}
                style={{ transformOrigin: `150px ${y}px` }}
                transition={{ duration: 0.2, delay: 0.7 + i * 0.02 }}
              />
            ))}
            
            {/* Right pins */}
            {[320, 332, 345, 358, 370, 382].map((y, i) => (
              <motion.rect
                key={`right-pin-${i}`}
                x={250} y={y - 2} width={15} height={4}
                fill="#B87333"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 0.9, scaleX: 1 }}
                style={{ transformOrigin: `250px ${y}px` }}
                transition={{ duration: 0.2, delay: 0.75 + i * 0.02 }}
              />
            ))}
            
            {/* Inner die frame */}
            <motion.rect
              x={165} y={320} width={70} height={60} rx={2}
              fill="none" stroke="#B87333" strokeWidth={1} opacity={0.6}
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
              transition={{ delay: 0.8 }}
            />
            
            {/* Inner grid lines (IC die pattern) */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ delay: 0.85 }}>
              <line x1={172} y1={335} x2={228} y2={335} stroke="#B87333" strokeWidth={0.5} />
              <line x1={172} y1={350} x2={228} y2={350} stroke="#B87333" strokeWidth={0.5} />
              <line x1={172} y1={365} x2={228} y2={365} stroke="#B87333" strokeWidth={0.5} />
              <line x1={185} y1={325} x2={185} y2={375} stroke="#B87333" strokeWidth={0.5} />
              <line x1={200} y1={325} x2={200} y2={375} stroke="#B87333" strokeWidth={0.5} />
              <line x1={215} y1={325} x2={215} y2={375} stroke="#B87333" strokeWidth={0.5} />
            </motion.g>
            
            {/* FREEDOM text - flickering */}
            <motion.text
              x={200}
              y={355}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#B87333"
              fontSize={14}
              fontFamily="monospace"
              fontWeight="bold"
              letterSpacing={2}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 1, 0.4, 0.8, 1, 0.5, 1] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                delay: 0.9
              }}
            >
              FREEDOM
            </motion.text>
            
            {/* Pulse effect when clickable */}
            {isClickable && (
              <>
                <motion.rect
                  x={147} y={302} width={106} height={96} rx={5}
                  fill="none" stroke="#B87333" strokeWidth={3}
                  animate={{ opacity: [0.4, 0.9, 0.4], strokeWidth: [2, 4, 2] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <motion.rect
                  x={150} y={305} width={100} height={90} rx={4}
                  fill="none" stroke="#B87333" strokeWidth={2}
                  animate={{ scale: [1, 1.08, 1.15], opacity: [0.6, 0.3, 0] }}
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
            width: '130px',
            height: '120px',
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
