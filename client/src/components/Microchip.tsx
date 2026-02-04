import { motion } from "framer-motion";

interface MicrochipProps {
  completedLayers: number; // 0-3, each adds 4 elements
  onChipClick?: () => void;
  showOnly?: boolean; // For last screen - only show chip, no background elements
}

export function Microchip({ completedLayers, onChipClick, showOnly = false }: MicrochipProps) {
  const allComplete = completedLayers >= 3;
  const isClickable = allComplete && onChipClick;
  
  // 12 circuit elements total, 4 per question
  // Q1: elements from top (0-3)
  // Q2: elements from sides (4-7)  
  // Q3: elements from bottom (8-11)
  
  return (
    <div className={`${showOnly ? 'relative' : 'fixed inset-0'} flex items-center justify-center pointer-events-none z-0`}>
      <div className={`relative ${showOnly ? 'w-48 h-48' : 'w-64 h-64 md:w-80 md:h-80'}`}>
        {/* Q1 Elements - from TOP (4 elements) */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-[#B87333]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: completedLayers >= 1 ? 0 : -50, opacity: completedLayers >= 1 ? 0.6 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.div
          className="absolute top-0 left-1/4 w-[2px] h-8 bg-[#B87333]"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: completedLayers >= 1 ? 0 : -40, opacity: completedLayers >= 1 ? 0.5 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />
        <motion.div
          className="absolute top-0 right-1/4 w-[2px] h-8 bg-[#B87333]"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: completedLayers >= 1 ? 0 : -40, opacity: completedLayers >= 1 ? 0.5 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        />
        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-[#B87333]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: completedLayers >= 1 ? 1 : 0, opacity: completedLayers >= 1 ? 0.5 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        />

        {/* Q2 Elements - from SIDES (4 elements) */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-[2px] bg-[#B87333]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: completedLayers >= 2 ? 0 : -50, opacity: completedLayers >= 2 ? 0.6 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-[2px] bg-[#B87333]"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: completedLayers >= 2 ? 0 : 50, opacity: completedLayers >= 2 ? 0.6 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />
        <motion.div
          className="absolute left-0 top-1/3 w-6 h-[2px] bg-[#B87333]"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: completedLayers >= 2 ? 0 : -40, opacity: completedLayers >= 2 ? 0.4 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        />
        <motion.div
          className="absolute right-0 top-2/3 w-6 h-[2px] bg-[#B87333]"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: completedLayers >= 2 ? 0 : 40, opacity: completedLayers >= 2 ? 0.4 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        />

        {/* Q3 Elements - from BOTTOM (4 elements) */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-12 bg-[#B87333]"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: completedLayers >= 3 ? 0 : 50, opacity: completedLayers >= 3 ? 0.6 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/4 w-[2px] h-8 bg-[#B87333]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: completedLayers >= 3 ? 0 : 40, opacity: completedLayers >= 3 ? 0.5 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[2px] h-8 bg-[#B87333]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: completedLayers >= 3 ? 0 : 40, opacity: completedLayers >= 3 ? 0.5 : 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        />
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-[#B87333]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: completedLayers >= 3 ? 1 : 0, opacity: completedLayers >= 3 ? 0.5 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        />

        {/* Central Microchip - appears and becomes clickable when complete */}
        <motion.div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     ${showOnly ? 'w-24 h-16' : 'w-28 h-20 md:w-32 md:h-24'}
                     border-2 border-[#B87333] bg-[#F5F5F5]
                     ${isClickable ? 'pointer-events-auto cursor-pointer' : ''}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: completedLayers >= 2 ? 1 : 0, 
            opacity: completedLayers >= 2 ? 1 : 0,
            borderColor: allComplete ? "#B87333" : "rgba(184,115,51,0.5)"
          }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={isClickable ? onChipClick : undefined}
          whileHover={isClickable ? { scale: 1.05 } : {}}
          whileTap={isClickable ? { scale: 0.98 } : {}}
        >
          {/* Chip internal pattern */}
          <div className="absolute inset-2 flex flex-col justify-center gap-1">
            <motion.div 
              className="h-1 bg-[#B87333]/30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: completedLayers >= 3 ? 1 : 0 }}
              transition={{ delay: 0.5 }}
            />
            <motion.div 
              className="h-2 bg-[#B87333]/20 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: completedLayers >= 3 ? 1 : 0 }}
              transition={{ delay: 0.6 }}
            >
              {allComplete && (
                <motion.div
                  className="w-4 h-4 border border-[#B87333]/50 rounded-sm"
                  animate={{ 
                    borderColor: ["rgba(184,115,51,0.5)", "rgba(184,115,51,1)", "rgba(184,115,51,0.5)"]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
            </motion.div>
            <motion.div 
              className="h-1 bg-[#B87333]/30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: completedLayers >= 3 ? 1 : 0 }}
              transition={{ delay: 0.55 }}
            />
          </div>

          {/* Chip pins - left */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full flex flex-col gap-1"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: completedLayers >= 3 ? 1 : 0, x: completedLayers >= 3 ? 0 : 10 }}
            transition={{ delay: 0.4 }}
          >
            {[0,1,2,3].map(i => (
              <div key={i} className="w-2 h-[3px] bg-[#B87333]" />
            ))}
          </motion.div>

          {/* Chip pins - right */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full flex flex-col gap-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: completedLayers >= 3 ? 1 : 0, x: completedLayers >= 3 ? 0 : -10 }}
            transition={{ delay: 0.45 }}
          >
            {[0,1,2,3].map(i => (
              <div key={i} className="w-2 h-[3px] bg-[#B87333]" />
            ))}
          </motion.div>
        </motion.div>

        {/* Pulse effect when complete */}
        {allComplete && (
          <>
            <motion.div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         ${showOnly ? 'w-24 h-16' : 'w-28 h-20 md:w-32 md:h-24'}
                         border border-[#B87333]`}
              animate={{ 
                scale: [1, 1.2, 1.4],
                opacity: [0.6, 0.2, 0]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         ${showOnly ? 'w-24 h-16' : 'w-28 h-20 md:w-32 md:h-24'}
                         border border-[#B87333]`}
              animate={{ 
                scale: [1, 1.3, 1.6],
                opacity: [0.4, 0.1, 0]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
          </>
        )}
      </div>
    </div>
  );
}
