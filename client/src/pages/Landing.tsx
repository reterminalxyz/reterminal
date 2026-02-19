import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function DigitalFogCanvas({ onFirstTouch }: { onFirstTouch: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const clearedAreasRef = useRef<Array<{ x: number; y: number; radius: number; opacity: number; time: number }>>([]);
  const [hintVisible, setHintVisible] = useState(true);
  const touchedRef = useRef(false);
  const noiseOffsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let w = window.innerWidth;
    let h = window.innerHeight;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };
    resize();
    window.addEventListener("resize", resize);

    const noiseCanvas = document.createElement("canvas");
    const nw = 128;
    const nh = 128;
    noiseCanvas.width = nw;
    noiseCanvas.height = nh;
    const noiseCtx = noiseCanvas.getContext("2d")!;
    const noiseImageData = noiseCtx.createImageData(nw, nh);
    const noiseData = noiseImageData.data;

    const regenerateNoise = () => {
      for (let i = 0; i < noiseData.length; i += 4) {
        const v = 26 + Math.random() * 45;
        noiseData[i] = v;
        noiseData[i + 1] = v;
        noiseData[i + 2] = v;
        noiseData[i + 3] = 255;
      }
      noiseCtx.putImageData(noiseImageData, 0, 0);
    };
    regenerateNoise();

    const draw = (time: number) => {
      noiseOffsetRef.current = (noiseOffsetRef.current + 7) % nw;

      if (time - lastTimeRef.current > 150) {
        regenerateNoise();
        lastTimeRef.current = time;
      }

      ctx.fillStyle = "#1A1A1A";
      ctx.fillRect(0, 0, w, h);

      const ox = noiseOffsetRef.current;
      const pattern = ctx.createPattern(noiseCanvas, "repeat");
      if (pattern) {
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.translate(ox, ox * 0.7);
        ctx.fillStyle = pattern;
        ctx.fillRect(-ox, -ox * 0.7, w + nw, h + nh);
        ctx.restore();
      }

      const areas = clearedAreasRef.current;
      if (areas.length > 0) {
        ctx.globalCompositeOperation = "destination-out";
        for (const area of areas) {
          const age = time - area.time;
          let alpha = area.opacity;
          if (age > 3000) {
            alpha = Math.max(0, area.opacity * (1 - (age - 3000) / 2500));
          }
          if (alpha <= 0) continue;
          const gradient = ctx.createRadialGradient(area.x, area.y, 0, area.x, area.y, area.radius);
          gradient.addColorStop(0, `rgba(0,0,0,${alpha})`);
          gradient.addColorStop(0.6, `rgba(0,0,0,${alpha * 0.5})`);
          gradient.addColorStop(1, "rgba(0,0,0,0)");
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(area.x, area.y, area.radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalCompositeOperation = "source-over";

        clearedAreasRef.current = areas.filter(a => time - a.time < 5500);
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);

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
    clearedAreasRef.current.push({
      x: clientX,
      y: clientY,
      radius: 70,
      opacity: 0.95,
      time: performance.now(),
    });
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-10"
        style={{ touchAction: "none" }}
        onMouseMove={(e) => { if (touchedRef.current) addClearArea(e.clientX, e.clientY); }}
        onTouchMove={(e) => { const t = e.touches[0]; if (t) addClearArea(t.clientX, t.clientY); }}
        onTouchStart={(e) => {
          triggerFirstTouch();
          const t = e.touches[0];
          if (t) addClearArea(t.clientX, t.clientY);
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
    }, 19);
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
      <div className="fixed inset-0 bg-[#F5F5F5] overflow-hidden flex flex-col" data-testid="splash-screen">
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

        <div className="flex-1 flex flex-col items-center justify-center relative">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="z-10"
          >
            <GlitchText />
          </motion.div>

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
