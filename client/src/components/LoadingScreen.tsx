import { useEffect, useRef, useState, useMemo } from "react";

const CHARS = ">/≡$#[]_XYZ01{}|\\~@!%^&*+=<>?;≠±∆∑∫Ω".split("");

interface Props {
  onComplete: () => void;
}

function rndChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

export function LoadingScreen({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const completedRef = useRef(false);
  const phaseRef = useRef<1 | 2 | 3>(1);
  const [showTitle, setShowTitle] = useState(false);
  const [zooming, setZooming] = useState(false);

  const colCount = useMemo(() => {
    if (typeof window === "undefined") return 30;
    return Math.max(25, Math.floor(window.innerWidth / 15));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = Math.max(window.innerHeight, document.documentElement.clientHeight, screen.height || 0);
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const fontSize = Math.max(14, Math.floor(w / colCount));
    const rowsNeeded = Math.ceil(h / fontSize) + 10;
    const colW = w / colCount;

    const columns = Array.from({ length: colCount }, () => ({
      y: Math.random() * h * 1.5,
      speed: 1.5 + Math.random() * 5,
      chars: Array.from({ length: rowsNeeded }, () => rndChar()),
      baseOpacity: 0.25 + Math.random() * 0.65,
    }));

    const startTime = Date.now();
    const SHOW_TITLE_AT = 1800;

    const draw = () => {
      const elapsed = Date.now() - startTime;

      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(0, 0, w, h);

      ctx.font = `bold ${fontSize}px 'Roboto Mono','Courier New',monospace`;
      ctx.textAlign = "center";

      for (let i = 0; i < colCount; i++) {
        const col = columns[i];

        col.y += col.speed;
        if (col.y > fontSize * 2) {
          col.y -= fontSize;
          col.chars.pop();
          col.chars.unshift(rndChar());
        }

        if (Math.random() < 0.04) {
          col.chars[Math.floor(Math.random() * col.chars.length)] = rndChar();
        }

        const x = colW * i + colW / 2;
        const baseY = col.y % fontSize;

        for (let r = 0; r < col.chars.length; r++) {
          const cy = baseY + r * fontSize - fontSize;
          if (cy < -fontSize || cy > h + fontSize) continue;

          const alpha = col.baseOpacity * (0.2 + (r / col.chars.length) * 0.8);
          if (alpha < 0.02) continue;

          ctx.fillStyle = `rgba(0,0,0,${alpha})`;
          ctx.fillText(col.chars[r], x, cy);
        }
      }

      if (elapsed >= SHOW_TITLE_AT && phaseRef.current === 1) {
        phaseRef.current = 2;
        setShowTitle(true);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => cancelAnimationFrame(animRef.current);
  }, [colCount]);

  useEffect(() => {
    if (showTitle && phaseRef.current === 2) {
      const zoomTimer = setTimeout(() => {
        phaseRef.current = 3;
        setZooming(true);
      }, 700);
      return () => clearTimeout(zoomTimer);
    }
  }, [showTitle]);

  useEffect(() => {
    if (zooming && !completedRef.current) {
      const t = setTimeout(() => {
        completedRef.current = true;
        onComplete();
      }, 700);
      return () => clearTimeout(t);
    }
  }, [zooming, onComplete]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#000", zIndex: 9999, height: "100dvh" }}
      data-testid="loading-screen"
    >
      <div
        className="absolute inset-0"
        style={{ background: "#FFFFFF", height: "calc(100% + 60px)", top: "-30px" }}
      >
        <canvas
          ref={canvasRef}
          className="absolute"
          style={{ width: "100%", height: "calc(100% + 60px)", top: "-30px", left: 0 }}
        />
      </div>

      {showTitle && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          data-testid="loading-screen-final"
        >
          <div
            className={zooming ? "ls-zoom-out" : "ls-title-in"}
            style={{
              fontFamily: "'Roboto Mono','Courier New',monospace",
              fontSize: "clamp(22px, 7vw, 36px)",
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: "#000",
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.75) 45%, transparent 75%)",
              padding: "24px 48px",
              transformOrigin: "center center",
            }}
          >
            <span>RE</span>
            <span className={zooming ? "" : "ls-blink"}>_</span>
            <span>TERMINAL</span>
          </div>
        </div>
      )}

      {zooming && (
        <div
          className="absolute inset-0 z-20 pointer-events-none ls-black-fade"
          style={{ background: "#000" }}
        />
      )}

      <style>{`
        .ls-title-in {
          animation: lsTitleIn 0.5s ease-out both;
        }
        .ls-zoom-out {
          animation: lsZoomExpand 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        .ls-blink {
          animation: lsBlink 800ms step-end infinite;
        }
        .ls-black-fade {
          animation: lsBlackFade 0.7s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        @keyframes lsTitleIn {
          0% { opacity: 0; transform: scale(0.92); filter: blur(3px); }
          60% { opacity: 1; transform: scale(1.01); filter: blur(0px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
        @keyframes lsZoomExpand {
          0% { transform: scale(1); opacity: 1; }
          40% { transform: scale(3); opacity: 1; }
          70% { transform: scale(12); opacity: 0.9; }
          100% { transform: scale(25); opacity: 0; }
        }
        @keyframes lsBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes lsBlackFade {
          0% { opacity: 0; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
