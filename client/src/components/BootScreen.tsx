import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share, ArrowDown } from "lucide-react";

interface BootScreenProps {
  onDismiss: () => void;
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

export function BootScreen({ onDismiss }: BootScreenProps) {
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const deferredPromptRef = useRef<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS()) {
      setShowIOSInstructions(true);
      return;
    }

    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      const result = await deferredPromptRef.current.userChoice;
      if (result.outcome === "accepted") {
        onDismiss();
      }
      deferredPromptRef.current = null;
    } else {
      onDismiss();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
    >
      <div className="boot-scanlines absolute inset-0 pointer-events-none" />

      <div className="boot-noise absolute inset-0 pointer-events-none" />

      <div className="boot-flicker absolute inset-0 pointer-events-none" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="boot-glitch-bar" />
        <div className="boot-glitch-bar" />
        <div className="boot-glitch-bar" />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-0 right-0 h-[60px] bg-gradient-to-b from-[#B87333]/15 to-transparent"
          animate={{ top: ['-60px', '110%'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
        />
        <motion.div
          className="absolute left-0 right-0 h-[30px] bg-gradient-to-b from-[#B87333]/10 to-transparent"
          animate={{ top: ['-30px', '110%'] }}
          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: 'linear', delay: 1.5 }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full bg-[#B87333]"
            style={{
              top: `${3 + i * 8}%`,
              height: i % 4 === 0 ? '3px' : i % 2 === 0 ? '2px' : '1px',
              boxShadow: i % 4 === 0
                ? '0 0 15px rgba(184, 115, 51, 0.6), 0 0 30px rgba(184, 115, 51, 0.2)'
                : '0 0 8px rgba(184, 115, 51, 0.3)',
            }}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: "100%", opacity: [0, 0.7, 0.5, 0] }}
            transition={{
              duration: 0.15 + (i % 3) * 0.05,
              delay: 0.5 + i * 1.8,
              repeat: Infinity,
              repeatDelay: 4 + (i % 3) * 2,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(184, 115, 51, 0.12) 0%, rgba(184, 115, 51, 0.04) 40%, transparent 70%)',
            top: '10%',
            left: '-15%',
          }}
          animate={{
            x: ['0%', '180%', '0%'],
            y: ['0%', '50%', '0%'],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[250px] h-[250px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(184, 115, 51, 0.1) 0%, rgba(184, 115, 51, 0.03) 40%, transparent 70%)',
            bottom: '15%',
            right: '-10%',
          }}
          animate={{
            x: ['0%', '-150%', '0%'],
            y: ['0%', '-60%', '0%'],
            scale: [1.2, 0.8, 1.2],
          }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute w-[180px] h-[180px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(184, 115, 51, 0.08) 0%, transparent 60%)',
            top: '50%',
            left: '30%',
          }}
          animate={{
            x: ['0%', '80%', '-60%', '0%'],
            y: ['-50%', '20%', '-30%', '-50%'],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="boot-vignette absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center px-8 max-w-[380px] w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="text-[#B87333] font-mono text-[11px] tracking-[4px] mb-4 opacity-60">
            LIBERTA TERMINAL v0.1
          </div>
          <h1 className="text-[#B87333] font-mono text-[18px] font-bold leading-tight tracking-wide">
            Ты активировал карту свободы
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-[#888] font-mono text-[12px] text-center leading-relaxed mb-10 max-w-[300px]"
        >
          Для постоянного доступа и устойчивости к цензуре, установи терминал на телефон
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col items-center gap-3 w-full"
        >
          <button
            type="button"
            onClick={onDismiss}
            className="relative w-full py-4 border-2 border-[#555] bg-[#555]/10 text-[#999] font-mono text-[13px] font-bold tracking-[3px] uppercase transition-all duration-200 active:scale-[0.97] hover:border-[#777] hover:text-[#bbb]"
            data-testid="button-stay-browser"
          >
            Остаться в браузере
          </button>

          <button
            type="button"
            onClick={handleInstall}
            className="install-btn-glitch relative w-full py-4 border-2 border-[#B87333] bg-[#B87333]/10 text-[#B87333] font-mono text-[13px] font-bold tracking-[3px] uppercase transition-all duration-200 active:scale-[0.97]"
            data-testid="button-install-terminal"
            data-text="Установить терминал"
          >
            <span className="relative z-10">Установить терминал</span>
            <div className="absolute inset-0 bg-[#B87333]/5 animate-pulse" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 1.2 }}
          className="mt-12 text-[#444] font-mono text-[9px] tracking-[2px] text-center"
        >
          DECENTRALIZED / CENSORSHIP-RESISTANT / OPEN
        </motion.div>
      </div>

      <AnimatePresence>
        {showIOSInstructions && (
          <motion.div
            initial={{ y: 300, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 300, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[10001] p-4"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
          >
            <div
              className="relative mx-auto max-w-[380px] rounded-2xl border border-[#333] bg-[#1A1A1A] p-5"
              style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.8)" }}
            >
              <button
                type="button"
                onClick={() => setShowIOSInstructions(false)}
                className="absolute top-3 right-3 text-[#666] font-mono text-sm"
                data-testid="button-close-ios-instructions"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <h3 className="text-[#E8E8E8] font-mono text-[12px] font-bold tracking-wider mb-4">
                INSTALL ON iOS
              </h3>

              <div className="flex items-center gap-4 bg-[#111] rounded-xl p-4 border border-[#222]">
                <div className="flex flex-col gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#B87333] font-mono text-[11px] font-bold">1.</span>
                    <span className="text-[#999] font-mono text-[11px]">Tap</span>
                    <Share className="w-4 h-4 text-[#B87333]" />
                    <span className="text-[#999] font-mono text-[11px]">below</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#B87333] font-mono text-[11px] font-bold">2.</span>
                    <span className="text-[#999] font-mono text-[11px]">Add to Home Screen</span>
                  </div>
                </div>

                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="flex-shrink-0"
                >
                  <ArrowDown className="w-6 h-6 text-[#B87333]" strokeWidth={2.5} />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
