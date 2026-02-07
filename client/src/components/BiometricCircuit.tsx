import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 33, 66, 100
  onChipClick?: () => void;
  isComplete?: boolean;
  skipTraceAnimation?: boolean; // Skip trace animation if already revealed
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false, skipTraceAnimation = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // When skipTraceAnimation is true, traces appear instantly
  const traceInitial = skipTraceAnimation ? { pathLength: 1 } : { pathLength: 0 };
  const viaInitial = skipTraceAnimation ? { scale: 1 } : { scale: 0 };
  const traceDuration = skipTraceAnimation ? 0 : 0.7;
  const viaDuration = skipTraceAnimation ? 0 : 0.2;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 700"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* ============ Q1 (25%) - First wave - ASYMMETRIC ============ */}
        <motion.g
          initial={{ opacity: skipTraceAnimation ? 1 : 0 }}
          animate={{ opacity: revealProgress >= 33 ? 1 : 0 }}
          transition={{ duration: skipTraceAnimation ? 0 : 0.5 }}
        >
          {/* TOP - varied positions */}
          <motion.path
            d="M 130 0 L 130 65 L 175 65 L 175 140 L 195 140 L 195 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: traceDuration }}
          />
          <motion.path
            d="M 270 0 L 270 45 L 235 45 L 235 115 L 210 115 L 210 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.1 }}
          />
          
          {/* RIGHT - different Y positions */}
          <motion.path
            d="M 400 280 L 355 280 L 355 325 L 290 325 L 290 345 L 245 345"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.05 }}
          />
          <motion.path
            d="M 400 420 L 340 420 L 340 375 L 285 375 L 285 355 L 245 355"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.15 }}
          />
          
          {/* BOTTOM - asymmetric to top */}
          <motion.path
            d="M 165 700 L 165 640 L 190 640 L 190 560 L 205 560 L 205 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.1 }}
          />
          <motion.path
            d="M 240 700 L 240 665 L 215 665 L 215 575 L 195 575 L 195 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.2 }}
          />
          
          {/* LEFT - different from right */}
          <motion.path
            d="M 0 320 L 45 320 L 45 350 L 115 350 L 115 345 L 155 345"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.15 }}
          />
          <motion.path
            d="M 0 380 L 60 380 L 60 360 L 125 360 L 125 355 L 155 355"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.25 }}
          />
          
          {/* Via nodes - asymmetric positions */}
          <motion.circle cx={175} cy={140} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={175} cy={140} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
          <motion.circle cx={355} cy={280} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={355} cy={280} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
          <motion.circle cx={190} cy={560} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={190} cy={560} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
          <motion.circle cx={45} cy={320} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={45} cy={320} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 33 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
        </motion.g>

        {/* ============ Q2 (50%) - Second wave - ASYMMETRIC ============ */}
        <motion.g
          initial={{ opacity: skipTraceAnimation ? 1 : 0 }}
          animate={{ opacity: revealProgress >= 66 ? 1 : 0 }}
          transition={{ duration: skipTraceAnimation ? 0 : 0.5 }}
        >
          {/* TOP - varied */}
          <motion.path
            d="M 45 0 L 45 90 L 95 90 L 95 210 L 165 210 L 165 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration }}
          />
          <motion.path
            d="M 340 0 L 340 70 L 305 70 L 305 185 L 235 185 L 235 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.1 }}
          />
          
          {/* RIGHT */}
          <motion.path
            d="M 400 185 L 325 185 L 325 305 L 265 305 L 265 335 L 245 335"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.05 }}
          />
          <motion.path
            d="M 400 515 L 315 515 L 315 395 L 270 395 L 270 365 L 245 365"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.15 }}
          />
          
          {/* BOTTOM - different from top */}
          <motion.path
            d="M 70 700 L 70 610 L 110 610 L 110 490 L 175 490 L 175 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.1 }}
          />
          <motion.path
            d="M 330 700 L 330 635 L 290 635 L 290 515 L 225 515 L 225 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.2 }}
          />
          
          {/* LEFT - different from right */}
          <motion.path
            d="M 0 215 L 75 215 L 75 335 L 135 335 L 135 340 L 155 340"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.15 }}
          />
          <motion.path
            d="M 0 485 L 90 485 L 90 385 L 145 385 L 145 360 L 155 360"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.25 }}
          />
          
          {/* Via nodes */}
          <motion.circle cx={95} cy={90} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={95} cy={90} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
          <motion.circle cx={305} cy={70} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={305} cy={70} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
          <motion.circle cx={325} cy={185} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={325} cy={185} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
          <motion.circle cx={75} cy={215} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={75} cy={215} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
        </motion.g>

        {/* ============ Q3 (75%) - Third wave - ASYMMETRIC ============ */}
        <motion.g
          initial={{ opacity: skipTraceAnimation ? 1 : 0 }}
          animate={{ opacity: revealProgress >= 66 ? 1 : 0 }}
          transition={{ duration: skipTraceAnimation ? 0 : 0.5 }}
        >
          {/* TOP - varied corners */}
          <motion.path
            d="M 15 0 L 15 135 L 55 135 L 55 265 L 155 265 L 155 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration }}
          />
          <motion.path
            d="M 375 0 L 375 105 L 345 105 L 345 235 L 245 235 L 245 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.1 }}
          />
          
          {/* RIGHT */}
          <motion.path
            d="M 400 135 L 365 135 L 365 290 L 305 290 L 305 330 L 245 330"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.05 }}
          />
          <motion.path
            d="M 400 565 L 355 565 L 355 430 L 295 430 L 295 375 L 245 375"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.15 }}
          />
          
          {/* BOTTOM - different */}
          <motion.path
            d="M 30 700 L 30 570 L 70 570 L 70 440 L 165 440 L 165 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.1 }}
          />
          <motion.path
            d="M 365 700 L 365 595 L 330 595 L 330 465 L 235 465 L 235 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.2 }}
          />
          
          {/* LEFT */}
          <motion.path
            d="M 0 165 L 35 165 L 35 295 L 95 295 L 95 335 L 155 335"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.15 }}
          />
          <motion.path
            d="M 0 540 L 50 540 L 50 410 L 110 410 L 110 365 L 155 365"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: traceDuration, delay: skipTraceAnimation ? 0 : 0.25 }}
          />
          
          {/* Via nodes */}
          <motion.circle cx={55} cy={135} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={55} cy={135} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
          <motion.circle cx={345} cy={105} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={345} cy={105} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
          <motion.circle cx={70} cy={570} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={70} cy={570} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
          <motion.circle cx={330} cy={595} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.5 }} />
          <motion.circle cx={330} cy={595} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 66 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.55 }} />
        </motion.g>

        {/* ============ Q4 (100%) - Fourth wave - ASYMMETRIC ============ */}
        <motion.g
          initial={{ opacity: skipTraceAnimation ? 1 : 0 }}
          animate={{ opacity: revealProgress >= 100 ? 1 : 0 }}
          transition={{ duration: skipTraceAnimation ? 0 : 0.5 }}
        >
          {/* TOP */}
          <motion.path
            d="M 90 0 L 90 55 L 135 55 L 135 175 L 180 175 L 180 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: skipTraceAnimation ? 0 : 0.6 }}
          />
          <motion.path
            d="M 310 0 L 310 35 L 265 35 L 265 150 L 220 150 L 220 310"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: skipTraceAnimation ? 0 : 0.6, delay: skipTraceAnimation ? 0 : 0.1 }}
          />
          
          {/* RIGHT */}
          <motion.path
            d="M 400 235 L 345 235 L 345 300 L 285 300 L 285 340 L 245 340"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: skipTraceAnimation ? 0 : 0.6, delay: skipTraceAnimation ? 0 : 0.05 }}
          />
          <motion.path
            d="M 400 465 L 335 465 L 335 400 L 275 400 L 275 360 L 245 360"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: skipTraceAnimation ? 0 : 0.6, delay: skipTraceAnimation ? 0 : 0.15 }}
          />
          
          {/* BOTTOM */}
          <motion.path
            d="M 115 700 L 115 650 L 150 650 L 150 530 L 190 530 L 190 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: skipTraceAnimation ? 0 : 0.6, delay: skipTraceAnimation ? 0 : 0.1 }}
          />
          <motion.path
            d="M 285 700 L 285 670 L 250 670 L 250 550 L 210 550 L 210 390"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: skipTraceAnimation ? 0 : 0.6, delay: skipTraceAnimation ? 0 : 0.2 }}
          />
          
          {/* LEFT */}
          <motion.path
            d="M 0 265 L 55 265 L 55 320 L 115 320 L 115 350 L 155 350"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: skipTraceAnimation ? 0 : 0.6, delay: skipTraceAnimation ? 0 : 0.15 }}
          />
          <motion.path
            d="M 0 435 L 70 435 L 70 380 L 125 380 L 125 350 L 155 350"
            stroke="#B87333" strokeWidth={1.5} strokeLinecap="square" fill="none"
            initial={traceInitial} animate={{ pathLength: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: skipTraceAnimation ? 0 : 0.6, delay: skipTraceAnimation ? 0 : 0.25 }}
          />
          
          {/* Via nodes */}
          <motion.circle cx={135} cy={55} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.4 }} />
          <motion.circle cx={135} cy={55} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.45 }} />
          <motion.circle cx={265} cy={35} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.4 }} />
          <motion.circle cx={265} cy={35} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.45 }} />
          <motion.circle cx={150} cy={650} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.4 }} />
          <motion.circle cx={150} cy={650} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.45 }} />
          <motion.circle cx={250} cy={670} r={3} fill="none" stroke="#B87333" strokeWidth={1.5}
            initial={viaInitial} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.4 }} />
          <motion.circle cx={250} cy={670} r={1.5} fill="#B87333"
            initial={viaInitial} animate={{ scale: revealProgress >= 100 ? 1 : 0 }}
            transition={{ duration: viaDuration, delay: skipTraceAnimation ? 0 : 0.45 }} />
        </motion.g>

        {/* ============ CHIP - appears at 100% with "stick" animation ============ */}
        {showChip && (
          <motion.g
            initial={{ opacity: 0, scale: 0.5, y: -30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: skipTraceAnimation ? 0 : 0.3,
              type: "spring",
              stiffness: 300,
              damping: 20
            }}
          >
            <defs>
              <linearGradient id="chipGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4a4a4a" />
                <stop offset="15%" stopColor="#6a6a6a" />
                <stop offset="30%" stopColor="#3d3d3d" />
                <stop offset="50%" stopColor="#5a5a5a" />
                <stop offset="70%" stopColor="#404040" />
                <stop offset="85%" stopColor="#555555" />
                <stop offset="100%" stopColor="#3a3a3a" />
              </linearGradient>
              <linearGradient id="chipShine" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.1)" />
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
              transition={{ duration: 0.2 }}
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
              transition={{ duration: 0.2, delay: 0.1 }}
            />
            {/* Metallic shine overlay */}
            <motion.rect
              x={155}
              y={310}
              width={90}
              height={80}
              rx={3}
              fill="url(#chipShine)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.15 }}
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
                transition={{ duration: 0.15, delay: 0.2 + i * 0.02 }}
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
                transition={{ duration: 0.15, delay: 0.25 + i * 0.02 }}
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
                transition={{ duration: 0.15, delay: 0.3 + i * 0.02 }}
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
                transition={{ duration: 0.15, delay: 0.35 + i * 0.02 }}
              />
            ))}
            
            {/* Chip grid pattern */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.2, delay: 0.4 }}
            >
              <line x1={172} y1={320} x2={228} y2={320} stroke="#B87333" strokeWidth={0.5} />
              <line x1={172} y1={335} x2={228} y2={335} stroke="#B87333" strokeWidth={0.5} />
              <line x1={172} y1={350} x2={228} y2={350} stroke="#B87333" strokeWidth={0.5} />
              <line x1={172} y1={365} x2={228} y2={365} stroke="#B87333" strokeWidth={0.5} />
              <line x1={172} y1={380} x2={228} y2={380} stroke="#B87333" strokeWidth={0.5} />
              <line x1={172} y1={320} x2={172} y2={380} stroke="#B87333" strokeWidth={0.5} />
              <line x1={186} y1={320} x2={186} y2={380} stroke="#B87333" strokeWidth={0.5} />
              <line x1={200} y1={320} x2={200} y2={380} stroke="#B87333" strokeWidth={0.5} />
              <line x1={214} y1={320} x2={214} y2={380} stroke="#B87333" strokeWidth={0.5} />
              <line x1={228} y1={320} x2={228} y2={380} stroke="#B87333" strokeWidth={0.5} />
            </motion.g>
            
            {/* "FREEDOM" text - flickering */}
            <motion.text
              x={200}
              y={355}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#B87333"
              fontSize={10}
              fontWeight="bold"
              fontFamily="monospace"
              letterSpacing={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3, 0.8, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              FREEDOM
            </motion.text>
          </motion.g>
        )}
        
        {/* ============ PULSING RINGS - start immediately after chip appears ============ */}
        {showChip && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {/* Inner glow - fast pulse */}
            <motion.circle
              cx={200}
              cy={350}
              r={55}
              fill="none"
              stroke="#B87333"
              strokeWidth={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.7 }}
            />
            
            {/* Expanding ring 1 - faster */}
            <motion.circle
              cx={200}
              cy={350}
              r={55}
              fill="none"
              stroke="#B87333"
              strokeWidth={2}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ 
                opacity: [0.7, 0],
                scale: [1, 1.6]
              }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.8 }}
            />
            
            {/* Expanding ring 2 - faster */}
            <motion.circle
              cx={200}
              cy={350}
              r={55}
              fill="none"
              stroke="#B87333"
              strokeWidth={1.5}
              initial={{ opacity: 0, scale: 1 }}
              animate={{ 
                opacity: [0.5, 0],
                scale: [1, 2]
              }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 1.2 }}
            />
          </motion.g>
        )}
      </svg>
      
      {/* Clickable overlay for chip */}
      {isClickable && (
        <motion.button
          onClick={onChipClick}
          className="absolute pointer-events-auto cursor-pointer z-50"
          style={{
            width: 120,
            height: 100,
            left: "calc(50% - 60px)",
            top: "calc(50% - 50px)",
            background: "transparent",
            border: "none"
          }}
          data-testid="button-chip"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        />
      )}
    </div>
  );
}
