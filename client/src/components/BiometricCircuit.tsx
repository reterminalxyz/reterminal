import { motion } from "framer-motion";

interface BiometricCircuitProps {
  revealProgress: number; // 0, 25, 50, 75, 100
  onChipClick?: () => void;
  isComplete?: boolean;
}

// PCB Component types
interface PCBTrace {
  d: string;  // SVG path - straight lines with 90° angles only
  delay: number;
}

interface PCBComponent {
  type: 'resistor' | 'capacitor' | 'via' | 'smd';
  x: number;
  y: number;
  rotation?: number; // 0 or 90 degrees
  delay: number;
}

export function BiometricCircuit({ revealProgress, onChipClick, isComplete = false }: BiometricCircuitProps) {
  const showChip = revealProgress >= 100;
  const isClickable = showChip && onChipClick;
  
  // MARGINS ONLY - Content safe zone: x=70-330, y=100-340
  // All PCB elements stay OUTSIDE this zone
  
  const animDuration = 0.5;
  
  // ============ Q1 COMPONENTS (25%) - TOP MARGIN (y < 100) ============
  const q1Traces: PCBTrace[] = [
    // Top-left corner L-trace
    { d: "M 0 30 L 40 30 L 40 0", delay: 0 },
    // Top edge horizontal with vertical drop
    { d: "M 80 0 L 80 25 L 120 25 L 120 0", delay: 0.1 },
    // Top-right corner L-trace
    { d: "M 400 30 L 360 30 L 360 0", delay: 0.15 },
    // Top edge T-junction
    { d: "M 280 0 L 280 40 M 260 25 L 300 25", delay: 0.2 },
  ];
  
  const q1Components: PCBComponent[] = [
    { type: 'resistor', x: 50, y: 15, rotation: 0, delay: 0.25 },
    { type: 'via', x: 40, y: 30, delay: 0.3 },
    { type: 'smd', x: 100, y: 40, delay: 0.35 },
    { type: 'via', x: 360, y: 30, delay: 0.4 },
  ];

  // ============ Q2 COMPONENTS (50%) - RIGHT MARGIN (x > 330) ============
  const q2Traces: PCBTrace[] = [
    // Right edge vertical with horizontal stub
    { d: "M 400 120 L 360 120 L 360 150", delay: 0 },
    // Right edge L-shape
    { d: "M 370 180 L 400 180 L 400 220", delay: 0.1 },
    // Right lower corner trace
    { d: "M 400 280 L 350 280 L 350 320", delay: 0.15 },
    // Right edge step pattern
    { d: "M 380 350 L 380 380 L 400 380", delay: 0.2 },
  ];
  
  const q2Components: PCBComponent[] = [
    { type: 'resistor', x: 375, y: 135, rotation: 90, delay: 0.25 },
    { type: 'via', x: 360, y: 120, delay: 0.3 },
    { type: 'capacitor', x: 365, y: 200, rotation: 90, delay: 0.35 },
    { type: 'smd', x: 360, y: 300, delay: 0.4 },
  ];

  // ============ Q3 COMPONENTS (75%) - BOTTOM MARGIN (y > 340) ============
  const q3Traces: PCBTrace[] = [
    // Bottom-left corner L-trace
    { d: "M 0 370 L 40 370 L 40 400", delay: 0 },
    // Bottom edge horizontal with vertical rise
    { d: "M 80 400 L 80 375 L 120 375 L 120 400", delay: 0.1 },
    // Bottom-right corner L-trace
    { d: "M 400 370 L 360 370 L 360 400", delay: 0.15 },
    // Bottom edge T-junction
    { d: "M 280 400 L 280 360 M 260 375 L 300 375", delay: 0.2 },
  ];
  
  const q3Components: PCBComponent[] = [
    { type: 'resistor', x: 50, y: 385, rotation: 0, delay: 0.25 },
    { type: 'via', x: 40, y: 370, delay: 0.3 },
    { type: 'smd', x: 100, y: 360, delay: 0.35 },
    { type: 'via', x: 360, y: 370, delay: 0.4 },
  ];

  // ============ Q4 COMPONENTS (100%) - LEFT MARGIN (x < 70) ============
  const q4Traces: PCBTrace[] = [
    // Left edge vertical with horizontal stub
    { d: "M 0 120 L 40 120 L 40 150", delay: 0 },
    // Left edge L-shape
    { d: "M 30 180 L 0 180 L 0 220", delay: 0.1 },
    // Left lower corner trace
    { d: "M 0 280 L 50 280 L 50 320", delay: 0.15 },
    // Left edge step pattern
    { d: "M 20 350 L 20 380 L 0 380", delay: 0.2 },
  ];
  
  const q4Components: PCBComponent[] = [
    { type: 'resistor', x: 25, y: 135, rotation: 90, delay: 0.25 },
    { type: 'via', x: 40, y: 120, delay: 0.3 },
    { type: 'capacitor', x: 35, y: 200, rotation: 90, delay: 0.35 },
    { type: 'smd', x: 40, y: 300, delay: 0.4 },
  ];

  // Render PCB traces (straight lines with 90° angles)
  const renderTraces = (traces: PCBTrace[], minProgress: number) => (
    traces.map((trace, i) => (
      <motion.path
        key={`trace-${minProgress}-${i}`}
        d={trace.d}
        stroke="#B87333"
        strokeWidth={2}
        strokeLinecap="square"
        strokeLinejoin="miter"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ 
          pathLength: revealProgress >= minProgress ? 1 : 0,
          opacity: revealProgress >= minProgress ? 0.8 : 0
        }}
        transition={{ 
          duration: animDuration,
          delay: revealProgress >= minProgress ? trace.delay : 0,
          ease: "easeOut"
        }}
      />
    ))
  );

  // Render SMD component (small rectangle)
  const renderSMD = (x: number, y: number, rotation: number, delay: number, minProgress: number, key: string) => (
    <motion.g
      key={key}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: revealProgress >= minProgress ? 0.9 : 0,
        scale: revealProgress >= minProgress ? 1 : 0
      }}
      transition={{ duration: 0.3, delay }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <rect
        x={x - 8}
        y={y - 4}
        width={16}
        height={8}
        fill="#1a1a1a"
        stroke="#B87333"
        strokeWidth={1}
        transform={`rotate(${rotation}, ${x}, ${y})`}
      />
      {/* Terminal pads */}
      <rect
        x={x - 10}
        y={y - 3}
        width={3}
        height={6}
        fill="#B87333"
        transform={`rotate(${rotation}, ${x}, ${y})`}
      />
      <rect
        x={x + 7}
        y={y - 3}
        width={3}
        height={6}
        fill="#B87333"
        transform={`rotate(${rotation}, ${x}, ${y})`}
      />
    </motion.g>
  );

  // Render resistor (rectangle with stripes)
  const renderResistor = (x: number, y: number, rotation: number, delay: number, minProgress: number, key: string) => (
    <motion.g
      key={key}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: revealProgress >= minProgress ? 0.9 : 0,
        scale: revealProgress >= minProgress ? 1 : 0
      }}
      transition={{ duration: 0.3, delay }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      <rect
        x={x - 10}
        y={y - 3}
        width={20}
        height={6}
        fill="#2a2a2a"
        stroke="#B87333"
        strokeWidth={0.5}
        transform={`rotate(${rotation}, ${x}, ${y})`}
      />
      {/* Resistor bands */}
      <rect x={x - 6} y={y - 3} width={2} height={6} fill="#B87333" opacity={0.7} transform={`rotate(${rotation}, ${x}, ${y})`} />
      <rect x={x - 1} y={y - 3} width={2} height={6} fill="#B87333" opacity={0.5} transform={`rotate(${rotation}, ${x}, ${y})`} />
      <rect x={x + 4} y={y - 3} width={2} height={6} fill="#B87333" opacity={0.7} transform={`rotate(${rotation}, ${x}, ${y})`} />
    </motion.g>
  );

  // Render capacitor (two parallel lines)
  const renderCapacitor = (x: number, y: number, rotation: number, delay: number, minProgress: number, key: string) => (
    <motion.g
      key={key}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: revealProgress >= minProgress ? 0.9 : 0,
        scale: revealProgress >= minProgress ? 1 : 0
      }}
      transition={{ duration: 0.3, delay }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    >
      {/* Lead wires */}
      <line x1={x - 8} y1={y} x2={x - 3} y2={y} stroke="#B87333" strokeWidth={1} transform={`rotate(${rotation}, ${x}, ${y})`} />
      <line x1={x + 3} y1={y} x2={x + 8} y2={y} stroke="#B87333" strokeWidth={1} transform={`rotate(${rotation}, ${x}, ${y})`} />
      {/* Capacitor plates */}
      <line x1={x - 3} y1={y - 5} x2={x - 3} y2={y + 5} stroke="#B87333" strokeWidth={2} transform={`rotate(${rotation}, ${x}, ${y})`} />
      <line x1={x + 3} y1={y - 5} x2={x + 3} y2={y + 5} stroke="#B87333" strokeWidth={2} transform={`rotate(${rotation}, ${x}, ${y})`} />
    </motion.g>
  );

  // Render via (small filled circle)
  const renderVia = (x: number, y: number, delay: number, minProgress: number, key: string) => (
    <motion.g key={key}>
      <motion.circle
        cx={x}
        cy={y}
        r={4}
        fill="none"
        stroke="#B87333"
        strokeWidth={1.5}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: revealProgress >= minProgress ? 0.8 : 0,
          scale: revealProgress >= minProgress ? 1 : 0
        }}
        transition={{ duration: 0.3, delay }}
      />
      <motion.circle
        cx={x}
        cy={y}
        r={2}
        fill="#B87333"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ 
          opacity: revealProgress >= minProgress ? 0.9 : 0,
          scale: revealProgress >= minProgress ? 1 : 0
        }}
        transition={{ duration: 0.3, delay: delay + 0.1 }}
      />
    </motion.g>
  );

  // Render components based on type
  const renderComponents = (components: PCBComponent[], minProgress: number) => (
    components.map((comp, i) => {
      const key = `comp-${minProgress}-${i}`;
      switch (comp.type) {
        case 'resistor':
          return renderResistor(comp.x, comp.y, comp.rotation || 0, comp.delay, minProgress, key);
        case 'capacitor':
          return renderCapacitor(comp.x, comp.y, comp.rotation || 0, comp.delay, minProgress, key);
        case 'via':
          return renderVia(comp.x, comp.y, comp.delay, minProgress, key);
        case 'smd':
          return renderSMD(comp.x, comp.y, comp.rotation || 0, comp.delay, minProgress, key);
        default:
          return null;
      }
    })
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Q1 elements - 25% - TOP margin */}
        {renderTraces(q1Traces, 25)}
        {renderComponents(q1Components, 25)}
        
        {/* Q2 elements - 50% - RIGHT margin */}
        {renderTraces(q2Traces, 50)}
        {renderComponents(q2Components, 50)}
        
        {/* Q3 elements - 75% - BOTTOM margin */}
        {renderTraces(q3Traces, 75)}
        {renderComponents(q3Components, 75)}
        
        {/* Q4 elements - 100% - LEFT margin */}
        {renderTraces(q4Traces, 100)}
        {renderComponents(q4Components, 100)}
        
        {/* Central chip - appears after all 4 questions answered */}
        {showChip && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
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
            
            {/* Connecting traces from margins to chip - straight 90° lines */}
            <motion.path
              d="M 40 120 L 40 200 L 155 200"
              stroke="#B87333"
              strokeWidth={1.5}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            />
            <motion.path
              d="M 360 120 L 360 200 L 245 200"
              stroke="#B87333"
              strokeWidth={1.5}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.65 }}
            />
            <motion.path
              d="M 100 40 L 100 170 L 155 170"
              stroke="#B87333"
              strokeWidth={1.5}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            />
            <motion.path
              d="M 100 360 L 100 230 L 155 230"
              stroke="#B87333"
              strokeWidth={1.5}
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.75 }}
            />
            
            {/* Outer glow */}
            <motion.rect
              x="148"
              y="163"
              width="104"
              height="74"
              rx="2"
              fill="none"
              stroke="#B87333"
              strokeWidth="2"
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scale: [1, 1.02, 1]
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
              rx="2"
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
              rx="2"
              fill="url(#chipHighlight)"
            />
            
            {/* Chip pins - top (8 pins) */}
            {[162, 172, 182, 192, 202, 212, 222, 232].map((x, i) => (
              <motion.rect
                key={`top-pin-${i}`}
                x={x} y="162" width="3" height="8"
                fill="#B87333"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.8 + i * 0.02 }}
              />
            ))}
            
            {/* Chip pins - bottom (8 pins) */}
            {[162, 172, 182, 192, 202, 212, 222, 232].map((x, i) => (
              <motion.rect
                key={`bottom-pin-${i}`}
                x={x} y="230" width="3" height="8"
                fill="#B87333"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.82 + i * 0.02 }}
              />
            ))}
            
            {/* Chip pins - left (4 pins) */}
            {[177, 187, 197, 207].map((y, i) => (
              <motion.rect
                key={`left-pin-${i}`}
                x="147" y={y} width="8" height="3"
                fill="#B87333"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.84 + i * 0.02 }}
              />
            ))}
            
            {/* Chip pins - right (4 pins) */}
            {[177, 187, 197, 207].map((y, i) => (
              <motion.rect
                key={`right-pin-${i}`}
                x="245" y={y} width="8" height="3"
                fill="#B87333"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                transition={{ delay: 0.86 + i * 0.02 }}
              />
            ))}
            
            {/* Inner die marker (corner notch) */}
            <motion.path
              d="M 160 175 L 170 175 L 160 185 Z"
              fill="#B87333"
              opacity={0.4}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 0.9 }}
            />
            
            {/* Inner die area */}
            <motion.rect
              x="170" y="182" width="60" height="36" rx="1"
              fill="none"
              stroke="#B87333"
              strokeWidth="0.5"
              opacity={0.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.95 }}
            />
            
            {/* Internal grid pattern */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1 }}
            >
              {/* Horizontal lines */}
              <line x1="175" y1="190" x2="225" y2="190" stroke="#B87333" strokeWidth="0.5" />
              <line x1="175" y1="200" x2="225" y2="200" stroke="#B87333" strokeWidth="0.5" />
              <line x1="175" y1="210" x2="225" y2="210" stroke="#B87333" strokeWidth="0.5" />
              {/* Vertical lines */}
              <line x1="185" y1="185" x2="185" y2="215" stroke="#B87333" strokeWidth="0.5" />
              <line x1="200" y1="185" x2="200" y2="215" stroke="#B87333" strokeWidth="0.5" />
              <line x1="215" y1="185" x2="215" y2="215" stroke="#B87333" strokeWidth="0.5" />
            </motion.g>
            
            {/* Pulse effect when clickable */}
            {isClickable && (
              <>
                <motion.rect
                  x="155" y="170" width="90" height="60" rx="2"
                  stroke="#B87333" strokeWidth="4" fill="none"
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                    strokeWidth: [3, 5, 3]
                  }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                />
                <motion.rect
                  x="155" y="170" width="90" height="60" rx="2"
                  stroke="#B87333" strokeWidth="2" fill="none"
                  animate={{ scale: [1, 1.2, 1.4], opacity: [0.8, 0.3, 0] }}
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
