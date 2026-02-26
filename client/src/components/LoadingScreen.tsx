import { useEffect, useRef, useState } from "react";

const GRID_SIZE = 48;
const GLITCH_CHARS = "!@#$%^&*_+-=[]{}|;:',.<>?/\\~`01";

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const completedRef = useRef(false);
  const titleShownRef = useRef(false);
  const [showTitle, setShowTitle] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const cx = w / 2;
    const cy = h / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);

    const cols = Math.ceil(w / GRID_SIZE) + 2;
    const rows = Math.ceil(h / GRID_SIZE) + 2;

    interface GridNode {
      gx: number;
      gy: number;
      dist: number;
      alpha: number;
      ch: string;
      dotSize: number;
    }

    const nodes: GridNode[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const gx = c * GRID_SIZE;
        const gy = r * GRID_SIZE;
        const dx = gx - cx;
        const dy = gy - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        nodes.push({
          gx, gy, dist, alpha: 0,
          ch: GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)],
          dotSize: 1.5 + Math.random() * 3,
        });
      }
    }

    const startTime = Date.now();
    const SPREAD_DURATION = 1600;
    const SHOW_TITLE_AT = 1800;
    const STUB = GRID_SIZE * 0.4;

    const draw = () => {
      const elapsed = Date.now() - startTime;
      const spreadProgress = Math.min(1, elapsed / SPREAD_DURATION);
      const revealRadius = spreadProgress * spreadProgress * (maxDist + 60);

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const targetAlpha = n.dist < revealRadius ? Math.min(1, (revealRadius - n.dist) / 80) : 0;
        n.alpha += (targetAlpha - n.alpha) * 0.08;

        if (n.alpha < 0.01) continue;
        const a = n.alpha;

        ctx.strokeStyle = `rgba(0, 229, 255, ${a * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(n.gx - STUB, n.gy);
        ctx.lineTo(n.gx + STUB, n.gy);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(n.gx, n.gy - STUB);
        ctx.lineTo(n.gx, n.gy + STUB);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(n.gx, n.gy, n.dotSize * a, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${a * 0.7})`;
        ctx.fill();

        if (a > 0.3) {
          ctx.font = "bold 12px 'JetBrains Mono', monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = `rgba(0, 229, 255, ${a * 0.5})`;
          ctx.fillText(n.ch, n.gx + 10, n.gy - 10);
        }
      }

      if (spreadProgress > 0.15) {
        const ringAlpha = Math.min(0.15, spreadProgress * 0.15);
        ctx.strokeStyle = `rgba(0, 229, 255, ${ringAlpha})`;
        ctx.lineWidth = 1;
        const ringR = revealRadius * 0.85;
        ctx.beginPath();
        ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (elapsed >= SHOW_TITLE_AT && !titleShownRef.current) {
        titleShownRef.current = true;
        setShowTitle(true);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    if (showTitle && !completedRef.current) {
      const t = setTimeout(() => {
        completedRef.current = true;
        onComplete();
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [showTitle, onComplete]);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ background: "#FFFFFF", zIndex: 9999, width: "100vw", height: "100vh" }}
      data-testid="loading-screen"
    >
      <canvas
        ref={canvasRef}
        className="absolute"
        style={{ top: 0, left: 0, width: "100%", height: "100%" }}
      />

      {showTitle && (
        <div
          className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
          data-testid="loading-screen-final"
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(22px, 7vw, 36px)",
              fontWeight: 400,
              letterSpacing: "0.06em",
              color: "#000",
              background: "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 50%, transparent 80%)",
              padding: "24px 48px",
              animation: "lsTitleIn 0.6s ease-out both",
            }}
          >
            <span>re</span>
            <span style={{ color: "#00e5ff", textShadow: "0 0 6px #00e5ff" }}>_</span>
            <span>terminal</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes lsTitleIn {
          0% { opacity: 0; transform: scale(0.92); filter: blur(4px); }
          60% { opacity: 1; transform: scale(1.02); filter: blur(0px); }
          100% { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
      `}</style>
    </div>
  );
}
