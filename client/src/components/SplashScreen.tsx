import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onContinue: () => void;
  lang: "RU" | "EN" | "IT";
  youtubeVideoId?: string;
}

const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:',.<>?/\\~`01";

function GlitchText() {
  const [showUnderscore, setShowUnderscore] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchChars, setGlitchChars] = useState("_");

  useEffect(() => {
    const interval = setInterval(() => {
      const willGlitch = Math.random() > 0.5;
      if (willGlitch) {
        setGlitchActive(true);
        const flickers = 2 + Math.floor(Math.random() * 4);
        let count = 0;
        const flickerInterval = setInterval(() => {
          setGlitchChars(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
          setShowUnderscore(prev => !prev);
          count++;
          if (count >= flickers) {
            clearInterval(flickerInterval);
            setGlitchActive(false);
            setShowUnderscore(prev => !prev);
            setGlitchChars("_");
          }
        }, 50 + Math.random() * 40);
      } else {
        setShowUnderscore(prev => !prev);
      }
    }, 1200 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="font-mono text-[28px] sm:text-[32px] tracking-[3px] font-bold select-none">
      <span style={{ color: "#B87333" }}>re</span>
      <span
        style={{
          color: glitchActive ? "#00e5ff" : "#B87333",
          opacity: showUnderscore ? 1 : 0,
          display: "inline-block",
          width: "0.6em",
          textAlign: "center",
          transition: glitchActive ? "none" : "opacity 0.1s",
          textShadow: glitchActive ? "0 0 8px #00e5ff, 0 0 20px rgba(0,229,255,0.3)" : "none",
        }}
      >
        {glitchActive ? glitchChars : "_"}
      </span>
      <span style={{ color: "#B87333" }}>terminal</span>
      <span style={{ color: "#B87333", opacity: 0.4 }}>.xyz</span>
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

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const sliceCount = 15 + Math.floor(progress * 20);
      for (let i = 0; i < sliceCount; i++) {
        const y = Math.random() * canvas.height;
        const h = 1 + Math.random() * (4 + progress * 8);
        const offset = (Math.random() - 0.5) * (20 + progress * 60);
        ctx.fillStyle = Math.random() > 0.7
          ? `rgba(0, 229, 255, ${0.1 + Math.random() * 0.3})`
          : `rgba(184, 115, 51, ${0.05 + Math.random() * 0.15})`;
        ctx.fillRect(offset, y, canvas.width, h);
      }

      const blockCount = Math.floor(progress * 30);
      for (let i = 0; i < blockCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const w = 2 + Math.random() * 40;
        const h = 1 + Math.random() * 3;
        ctx.fillStyle = Math.random() > 0.5
          ? `rgba(0, 229, 255, ${Math.random() * 0.5})`
          : `rgba(184, 115, 51, ${Math.random() * 0.3})`;
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

export function SplashScreen({ onContinue, lang, youtubeVideoId }: SplashScreenProps) {
  const [showGlitch, setShowGlitch] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);

  const handleGlitchComplete = useCallback(() => {
    setShowGlitch(false);
    setContentVisible(true);
  }, []);

  const continueText = lang === "RU" ? "ПРОДОЛЖИТЬ" : lang === "EN" ? "CONTINUE" : "CONTINUA";

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] overflow-hidden flex flex-col">
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center gap-3 z-10"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-[8px] tracking-[4px] font-mono" style={{ color: "#B87333", opacity: 0.4 }}>
                DIGITAL RESISTANCE
              </span>
            </motion.div>

            <GlitchText />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-2"
            >
              <span className="text-[10px] tracking-[3px] font-mono" style={{ color: "#666" }}>
                {lang === "RU" ? "ПРОТОКОЛ СВОБОДЫ" : lang === "EN" ? "FREEDOM PROTOCOL" : "PROTOCOLLO LIBERT\u00c0"}
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-12 z-10 w-full max-w-[360px] px-6"
          >
            {youtubeVideoId ? (
              <div className="w-full aspect-video bg-[#111] border border-[#222] overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                  title="Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div
                className="w-full aspect-video flex items-center justify-center border border-dashed border-[#333]"
                style={{ background: "rgba(17,17,17,0.5)" }}
                data-testid="video-placeholder"
              >
                <span className="text-[10px] tracking-[2px] font-mono" style={{ color: "#444" }}>
                  VIDEO
                </span>
              </div>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            onClick={onContinue}
            className="mt-8 px-8 py-3 text-[11px] font-mono font-bold tracking-[3px] z-10
                     border border-[#B87333]/40 bg-[#B87333]/10 text-[#B87333]
                     hover:bg-[#B87333]/20 active:scale-95 transition-all duration-200"
            data-testid="button-splash-continue"
          >
            {continueText}
          </motion.button>
        </div>
      )}
    </div>
  );
}
