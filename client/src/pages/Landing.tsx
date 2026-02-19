import { useEffect, useRef, useCallback, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

function DigitalFogCanvas({ onFirstTouch }: { onFirstTouch: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fogCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const clearedAreasRef = useRef<Array<{ x: number; y: number; radius: number; opacity: number; time: number }>>([]);
  const [hintVisible, setHintVisible] = useState(true);
  const touchedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const fogCanvas = fogCanvasRef.current;
    if (!canvas || !fogCanvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });
    const fogCtx = fogCanvas.getContext("2d", { willReadFrequently: false });
    if (!ctx || !fogCtx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fogCanvas.width = w * dpr;
      fogCanvas.height = h * dpr;
      fogCanvas.style.width = w + "px";
      fogCanvas.style.height = h + "px";
      fogCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawNoise = (time: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      fogCtx.fillStyle = "#1A1A1A";
      fogCtx.fillRect(0, 0, w, h);

      const imageData = fogCtx.getImageData(0, 0, fogCanvas.width, fogCanvas.height);
      const data = imageData.data;
      const step = 3;
      for (let i = 0; i < data.length; i += step * 4) {
        const noise = Math.random() * 55;
        data[i] = 26 + noise;
        data[i + 1] = 26 + noise;
        data[i + 2] = 26 + noise;
      }
      fogCtx.putImageData(imageData, 0, 0);

      const areas = clearedAreasRef.current;
      if (areas.length > 0) {
        fogCtx.globalCompositeOperation = "destination-out";
        for (const area of areas) {
          const age = time - area.time;
          const fadeStart = 4000;
          let alpha = area.opacity;
          if (age > fadeStart) {
            alpha = Math.max(0, area.opacity * (1 - (age - fadeStart) / 3000));
          }
          if (alpha <= 0) continue;

          const gradient = fogCtx.createRadialGradient(area.x, area.y, 0, area.x, area.y, area.radius);
          gradient.addColorStop(0, `rgba(0,0,0,${alpha})`);
          gradient.addColorStop(0.5, `rgba(0,0,0,${alpha * 0.6})`);
          gradient.addColorStop(1, "rgba(0,0,0,0)");
          fogCtx.fillStyle = gradient;
          fogCtx.beginPath();
          fogCtx.arc(area.x, area.y, area.radius, 0, Math.PI * 2);
          fogCtx.fill();
        }
        fogCtx.globalCompositeOperation = "source-over";

        clearedAreasRef.current = areas.filter(a => {
          const age = time - a.time;
          return age < 7000;
        });
      }

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(fogCanvas, 0, 0, w, h);
    };

    const animate = (time: number) => {
      if (time - lastTimeRef.current > 50) {
        drawNoise(time);
        lastTimeRef.current = time;
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  const triggerFirstTouch = useCallback(() => {
    if (!touchedRef.current) {
      touchedRef.current = true;
      setHintVisible(false);
      onFirstTouch();
    }
  }, [onFirstTouch]);

  const addClearArea = useCallback((clientX: number, clientY: number) => {
    const now = performance.now();
    clearedAreasRef.current.push({
      x: clientX,
      y: clientY,
      radius: 70,
      opacity: 0.95,
      time: now,
    });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (touchedRef.current) {
      addClearArea(e.clientX, e.clientY);
    }
  }, [addClearArea]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      addClearArea(touch.clientX, touch.clientY);
    }
  }, [addClearArea]);

  return (
    <>
      <canvas ref={fogCanvasRef} className="hidden" />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10"
        style={{ touchAction: "none" }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchStart={(e) => {
          triggerFirstTouch();
          const touch = e.touches[0];
          if (touch) addClearArea(touch.clientX, touch.clientY);
        }}
        onClick={(e) => {
          triggerFirstTouch();
          addClearArea(e.clientX, e.clientY);
        }}
        data-testid="fog-canvas"
      />
      {hintVisible && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
          data-testid="text-hint"
        >
          <div className="relative">
            <span
              className="font-mono text-[11px] tracking-[2px] animate-blink relative"
              style={{
                color: "#D97D45",
                textShadow: "0 0 8px rgba(217,125,69,0.4), 0 0 20px rgba(184,115,51,0.2), 0 0 40px rgba(184,115,51,0.1)",
              }}
            >
              CLEAR THE FOG TO REVEAL THE SIGNAL<span className="animate-blink">_</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
}

const MANIFESTO_FULL = "The internet has become a digital panopticon. re_terminal is the breach. Post-privacy is our current reality. Offline hardware. Stateless money. Direct signal. Reclaim your digital sovereignty.";

const COPPER_START = MANIFESTO_FULL.indexOf("re_terminal");
const COPPER_END = MANIFESTO_FULL.indexOf("the breach.") + "the breach.".length;
const BLINK_POS = COPPER_START + 2;

function ManifestoTypewriter({ started, onComplete }: { started: boolean; onComplete?: () => void }) {
  const [charIndex, setCharIndex] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCharIndex(i);
      if (i >= MANIFESTO_FULL.length) {
        clearInterval(interval);
        if (!completedRef.current) {
          completedRef.current = true;
          onComplete?.();
        }
      }
    }, 12);
    return () => clearInterval(interval);
  }, [started, onComplete]);

  if (!started) return null;

  const len = charIndex;
  const done = len >= MANIFESTO_FULL.length;

  const beforeCopper = MANIFESTO_FULL.slice(0, Math.min(len, COPPER_START));
  const copperPart = len > COPPER_START ? MANIFESTO_FULL.slice(COPPER_START, Math.min(len, COPPER_END)) : "";
  const afterCopper = len > COPPER_END ? MANIFESTO_FULL.slice(COPPER_END, len) : "";

  const renderCopper = (text: string) => {
    if (!text) return null;
    const localBlinkPos = BLINK_POS - COPPER_START;
    if (text.length <= localBlinkPos) {
      return <span style={{ color: "#D97D45" }}>{text}</span>;
    }
    return (
      <span style={{ color: "#D97D45" }}>
        {text.slice(0, localBlinkPos)}
        <span className="animate-blink">{text[localBlinkPos]}</span>
        {text.slice(localBlinkPos + 1)}
      </span>
    );
  };

  return (
    <div
      className="font-mono text-left"
      style={{
        fontSize: "13px",
        lineHeight: "2.2",
        letterSpacing: "0.5px",
        color: "#999",
      }}
      data-testid="text-manifesto"
    >
      {beforeCopper}
      {renderCopper(copperPart)}
      {afterCopper}
      {!done && <span className="animate-blink" style={{ color: "#999" }}>|</span>}
    </div>
  );
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

function FullscreenGlitch({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let frame = 0;
    const totalFrames = 25;
    let animId: number;

    const draw = () => {
      frame++;
      const progress = frame / totalFrames;

      const r = Math.floor(245 * progress + 13 * (1 - progress));
      const g = Math.floor(245 * progress + 13 * (1 - progress));
      const b = Math.floor(245 * progress + 13 * (1 - progress));
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const sliceCount = 20 + Math.floor(progress * 25);
      for (let i = 0; i < sliceCount; i++) {
        const y = Math.random() * canvas.height;
        const h = 1 + Math.random() * (5 + progress * 10);
        const offset = (Math.random() - 0.5) * (30 + progress * 80);
        ctx.fillStyle = Math.random() > 0.6
          ? `rgba(0, 229, 255, ${0.08 + Math.random() * 0.2})`
          : `rgba(184, 115, 51, ${0.05 + Math.random() * 0.15})`;
        ctx.fillRect(offset, y, canvas.width, h);
      }

      const blockCount = Math.floor(progress * 40);
      for (let i = 0; i < blockCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const w = 2 + Math.random() * 50;
        const h = 1 + Math.random() * 4;
        ctx.fillStyle = Math.random() > 0.5
          ? `rgba(0, 229, 255, ${Math.random() * 0.3})`
          : `rgba(184, 115, 51, ${Math.random() * 0.2})`;
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
      className="fixed inset-0 z-[200]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.0, times: [0, 0.1, 0.65, 1] }}
    />
  );
}

type LandingPhase = "fog" | "glitch" | "splash";

export default function Landing() {
  const [typingStarted, setTypingStarted] = useState(false);
  const [landingPhase, setLandingPhase] = useState<LandingPhase>("fog");
  const [, setLocation] = useLocation();

  const handleContinue = useCallback(() => {
    setLocation("/activation");
  }, [setLocation]);

  const handleFirstTouch = useCallback(() => {
    setTypingStarted(true);
  }, []);

  const handleManifestoComplete = useCallback(() => {
    setTimeout(() => {
      setLandingPhase("glitch");
    }, 1000);
  }, []);

  const handleGlitchComplete = useCallback(() => {
    setLandingPhase("splash");
  }, []);

  if (landingPhase === "splash") {
    return (
      <div className="fixed inset-0 bg-[#F5F5F5] overflow-y-auto flex flex-col" data-testid="splash-screen">
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

        <div className="min-h-full flex flex-col items-center justify-center relative px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="z-10"
          >
            <GlitchText />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="z-10 mt-8 w-full max-w-[360px]"
          >
            <div
              className="relative w-full overflow-hidden"
              style={{
                paddingBottom: "56.25%",
                border: "1px solid rgba(184,115,51,0.15)",
              }}
              data-testid="video-container"
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/EXwYrShsnyY?rel=0&modestbranding=1"
                title="re_terminal"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="video-embed"
              />
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            onClick={handleContinue}
            className="mt-8 px-8 py-3 text-[11px] font-mono font-bold tracking-[3px] z-10
                     border border-[#B87333]/30 bg-[#B87333]/8 text-[#B87333]
                     hover:bg-[#B87333]/15 active:scale-95 transition-all duration-200"
            data-testid="button-splash-continue"
          >
            ENTER
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden" data-testid="landing-page">
      <AnimatePresence>
        {landingPhase === "glitch" && <FullscreenGlitch onComplete={handleGlitchComplete} />}
      </AnimatePresence>

      <div
        className="fixed inset-0 z-0"
        style={{
          background: "linear-gradient(145deg, #2d1e12 0%, #241810 15%, #1a110a 35%, #110c07 60%, #0D0D0D 100%)",
        }}
        data-testid="bronze-bg"
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 50% 45%, rgba(184,115,51,0.25) 0%, rgba(160,100,45,0.12) 30%, rgba(100,65,30,0.05) 55%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 1px,
              rgba(184,115,51,0.03) 1px,
              rgba(184,115,51,0.03) 2px
            )`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(184,115,51,0.08) 0%, transparent 25%, rgba(160,100,45,0.06) 50%, transparent 75%, rgba(140,85,35,0.04) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 40% 35%, rgba(217,125,69,0.1) 0%, transparent 40%), radial-gradient(circle at 65% 55%, rgba(184,115,51,0.08) 0%, transparent 35%)",
          }}
        />
      </div>

      <div className="fixed inset-0 z-[5] flex items-start justify-center pt-[25vh] px-8">
        <div className="w-full max-w-[400px]">
          <ManifestoTypewriter started={typingStarted} onComplete={handleManifestoComplete} />
        </div>
      </div>

      <DigitalFogCanvas onFirstTouch={handleFirstTouch} />
    </div>
  );
}
