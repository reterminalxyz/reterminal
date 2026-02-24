import { useEffect, useState, useRef, useCallback, useMemo } from "react";

const CHARS = ">/≡$#[]_XYZ01{}|\\~@!%^&*+=<>?;≠±∆∑∫Ω".split("");
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;:<>?/\\~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FREEDOM_TEXT = "INITIALIZING FREEDOM";

const PHASE1_MS = 1500;
const PHASE2_MS = 700;
const PHASE3_WAIT = 800;

interface Props {
  onComplete: () => void;
}

function rndChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}
function rndGlitch() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

export function LoadingScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [dim, setDim] = useState(0);
  const completedRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const columnsRef = useRef<{ y: number; speed: number; chars: string[]; opacity: number }[]>([]);
  const startRef = useRef(Date.now());

  const colCount = useMemo(() => {
    if (typeof window === "undefined") return 30;
    return Math.max(25, Math.floor(window.innerWidth / 16));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const fontSize = Math.max(14, Math.floor(w / colCount));
    const rowsNeeded = Math.ceil(h / fontSize) + 5;

    columnsRef.current = Array.from({ length: colCount }, () => ({
      y: Math.random() * h,
      speed: 2 + Math.random() * 6,
      chars: Array.from({ length: rowsNeeded }, () => rndChar()),
      opacity: 0.3 + Math.random() * 0.7,
    }));

    let dimVal = 0;
    let frozen = false;

    const draw = () => {
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `bold ${fontSize}px 'Roboto Mono', 'Courier New', monospace`;
      ctx.textAlign = "center";

      const colW = w / colCount;

      for (let i = 0; i < colCount; i++) {
        const col = columnsRef.current[i];
        if (!frozen) {
          col.y += col.speed;
          if (col.y > fontSize * 2) {
            col.y -= fontSize;
            col.chars.pop();
            col.chars.unshift(rndChar());
          }
        }

        if (Math.random() < 0.03) {
          const ri = Math.floor(Math.random() * col.chars.length);
          col.chars[ri] = rndChar();
        }

        const effectiveOpacity = col.opacity * (1 - dimVal);
        if (effectiveOpacity < 0.01) continue;

        const x = colW * i + colW / 2;
        const baseY = col.y % fontSize;

        for (let r = 0; r < col.chars.length; r++) {
          const cy = baseY + r * fontSize - fontSize;
          if (cy < -fontSize || cy > h + fontSize) continue;

          const distFromCenter = Math.abs(cy - h / 2) / (h / 2);
          const vertFade = 1 - distFromCenter * 0.4;
          const alpha = effectiveOpacity * vertFade * (0.3 + (r / col.chars.length) * 0.7);

          if (alpha < 0.02) continue;

          ctx.fillStyle = `rgba(0,0,0,${alpha})`;
          ctx.fillText(col.chars[r], x, cy);
        }
      }

      const skewAmount = frozen ? 0 : Math.sin(Date.now() * 0.003) * 0.5;
      if (skewAmount !== 0) {
        ctx.save();
        ctx.setTransform(1, 0, skewAmount * 0.01, 1, 0, 0);
        ctx.restore();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    const dimInterval = setInterval(() => {
      dimVal = dim;
      if (dim >= 0.95) frozen = true;
    }, 50);

    return () => {
      cancelAnimationFrame(animRef.current);
      clearInterval(dimInterval);
    };
  }, [colCount, dim]);

  useEffect(() => {
    const t = setTimeout(() => {
      setDim(0.5);
      setTimeout(() => setPhase(2), 250);
    }, PHASE1_MS);
    return () => clearTimeout(t);
  }, []);

  const handlePhase2Done = useCallback(() => {
    setDim(0.92);
    setTimeout(() => {
      setDim(1);
      setPhase(3);
    }, 200);
  }, []);

  useEffect(() => {
    if (phase === 3 && !completedRef.current) {
      const t = setTimeout(() => {
        completedRef.current = true;
        onComplete();
      }, PHASE3_WAIT);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#FFFFFF", zIndex: 9999 }}
      data-testid="loading-screen"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
      />

      {phase >= 2 && phase < 3 && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ animation: "lsResolveIn 0.3s ease-out" }}
        >
          <div
            style={{
              padding: "16px 28px",
              background: "rgba(255,255,255,0.85)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 0 80px 40px rgba(255,255,255,0.9)",
            }}
          >
            <MechanicalReveal text={FREEDOM_TEXT} onDone={handlePhase2Done} />
          </div>
        </div>
      )}

      {phase === 3 && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{ animation: "lsTerminalIn 0.2s ease-out" }}
          data-testid="loading-screen-final"
        >
          <div
            style={{
              fontFamily: "'Roboto Mono', 'Courier New', monospace",
              fontSize: "clamp(22px, 7vw, 36px)",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "#000",
            }}
          >
            <span>RE</span>
            <span style={{ animation: "lsBlink 800ms step-end infinite" }}>_</span>
            <span>TERMINAL</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes lsResolveIn {
          from { opacity: 0; transform: scale(0.94); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes lsTerminalIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes lsBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function MechanicalReveal({ text, onDone }: { text: string; onDone: () => void }) {
  const [revealed, setRevealed] = useState<string[]>(Array(text.length).fill(""));
  const [scales, setScales] = useState<number[]>(Array(text.length).fill(1));
  const doneRef = useRef(false);

  useEffect(() => {
    const perChar = Math.floor(PHASE2_MS / text.length);
    let idx = 0;

    const glitchLoop = setInterval(() => {
      setRevealed(prev => {
        const next = [...prev];
        for (let i = idx; i < text.length; i++) {
          next[i] = text[i] === " " ? " " : rndGlitch();
        }
        return next;
      });
    }, 35);

    const revealLoop = setInterval(() => {
      if (idx >= text.length) {
        clearInterval(revealLoop);
        clearInterval(glitchLoop);
        setRevealed(text.split(""));
        if (!doneRef.current) {
          doneRef.current = true;
          onDone();
        }
        return;
      }
      const ci = idx;
      setRevealed(prev => { const n = [...prev]; n[ci] = text[ci]; return n; });
      setScales(prev => { const n = [...prev]; n[ci] = 1.25; return n; });
      setTimeout(() => {
        setScales(prev => { const n = [...prev]; n[ci] = 1; return n; });
      }, 70);
      idx++;
    }, perChar);

    return () => { clearInterval(revealLoop); clearInterval(glitchLoop); };
  }, [text, onDone]);

  return (
    <div
      className="flex justify-center items-center flex-wrap"
      style={{
        fontFamily: "'Roboto Mono', 'Courier New', monospace",
        fontSize: "clamp(15px, 5vw, 24px)",
        fontWeight: 700,
        letterSpacing: "0.2em",
        color: "#000",
      }}
    >
      {revealed.map((c, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            transform: `scale(${scales[i]})`,
            transition: "transform 0.07s ease-out",
            minWidth: c === " " ? "0.5em" : undefined,
            textShadow: scales[i] > 1 ? "0 0 12px rgba(0,0,0,0.4)" : "none",
          }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}
