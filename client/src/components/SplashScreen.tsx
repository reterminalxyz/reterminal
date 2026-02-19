import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onContinue: () => void;
  lang: "RU" | "EN" | "IT";
}

const GLITCH_CHARS = "!@#$%^&*_+-=[]{}|;:',.<>?/\\~`01";

function GlitchText() {
  const [showSeparator, setShowSeparator] = useState(false);
  const [glitchChar, setGlitchChar] = useState("_");

  useEffect(() => {
    let flickerTimer: ReturnType<typeof setInterval> | null = null;

    const interval = setInterval(() => {
      setShowSeparator(true);
      const flickers = 2 + Math.floor(Math.random() * 5);
      let count = 0;
      flickerTimer = setInterval(() => {
        setGlitchChar(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
        count++;
        if (count >= flickers) {
          if (flickerTimer) clearInterval(flickerTimer);
          flickerTimer = null;
          setTimeout(() => setShowSeparator(false), 80 + Math.random() * 150);
        }
      }, 40 + Math.random() * 30);
    }, 600 + Math.random() * 1200);

    return () => {
      clearInterval(interval);
      if (flickerTimer) clearInterval(flickerTimer);
    };
  }, []);

  return (
    <span className="font-mono text-[28px] sm:text-[32px] tracking-[2px] font-bold select-none">
      <span style={{ color: "#B87333" }}>re</span>
      {showSeparator && (
        <span
          style={{
            color: "#00e5ff",
            display: "inline",
            textShadow: "0 0 6px #00e5ff, 0 0 15px rgba(0,229,255,0.3)",
            transition: "none",
          }}
        >
          {glitchChar}
        </span>
      )}
      <span style={{ color: "#B87333" }}>terminal</span>
      <span style={{ color: "#B87333", opacity: 0.35 }}>.xyz</span>
    </span>
  );
}

function GlitchTransition({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let frame = 0;
    const totalFrames = 20;
    let animId: number;

    const draw = () => {
      frame++;
      const progress = frame / totalFrames;

      ctx.fillStyle = "#F5F5F5";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const sliceCount = 15 + Math.floor(progress * 20);
      for (let i = 0; i < sliceCount; i++) {
        const y = Math.random() * canvas.height;
        const h = 1 + Math.random() * (4 + progress * 8);
        const offset = (Math.random() - 0.5) * (20 + progress * 60);
        ctx.fillStyle = Math.random() > 0.7
          ? `rgba(0, 229, 255, ${0.05 + Math.random() * 0.15})`
          : `rgba(184, 115, 51, ${0.03 + Math.random() * 0.1})`;
        ctx.fillRect(offset, y, canvas.width, h);
      }

      const blockCount = Math.floor(progress * 30);
      for (let i = 0; i < blockCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const w = 2 + Math.random() * 40;
        const h = 1 + Math.random() * 3;
        ctx.fillStyle = Math.random() > 0.5
          ? `rgba(0, 229, 255, ${Math.random() * 0.25})`
          : `rgba(184, 115, 51, ${Math.random() * 0.15})`;
        ctx.fillRect(x, y, w, h);
      }

      if (frame < totalFrames) {
        animId = requestAnimationFrame(draw);
      } else {
        onComplete();
      }
    };

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 0.8, times: [0, 0.15, 0.7, 1] }}
    />
  );
}

export function SplashScreen({ onContinue, lang }: SplashScreenProps) {
  const [showGlitch, setShowGlitch] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  const handleGlitchComplete = useCallback(() => {
    setShowGlitch(false);
    setContentVisible(true);
  }, []);

  const continueText = lang === "RU" ? "ПРОДОЛЖИТЬ" : lang === "EN" ? "CONTINUE" : "CONTINUA";

  return (
    <div className="fixed inset-0 bg-[#F5F5F5] overflow-hidden flex flex-col">
      <AnimatePresence>
        {showGlitch && <GlitchTransition onComplete={handleGlitchComplete} />}
      </AnimatePresence>

      {contentVisible && (
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(184,115,51,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(184,115,51,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="z-10"
          >
            <GlitchText />
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            onClick={onContinue}
            className="mt-10 px-8 py-3 text-[11px] font-mono font-bold tracking-[3px] z-10
                     border border-[#B87333]/30 bg-[#B87333]/8 text-[#B87333]
                     hover:bg-[#B87333]/15 active:scale-95 transition-all duration-200"
            data-testid="button-splash-continue"
          >
            {continueText}
          </motion.button>
        </div>
      )}
    </div>
  );
}
