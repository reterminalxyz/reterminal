import { useEffect, useRef, useState } from "react";

const GRID = 48;
const CYAN = [0, 229, 255];
const GLITCH = "!@#$%^&*_+-=[]{}|;:.<>?/\\~01≡∆∑Ω";

interface Props {
  onComplete: () => void;
}

interface Column {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  baseAlpha: number;
}

interface Drip {
  x: number;
  y: number;
  vy: number;
  r: number;
  life: number;
}

interface Spark {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  pulse: number;
}

interface ScanLine {
  y: number;
  speed: number;
  alpha: number;
}

function rch() {
  return GLITCH[Math.floor(Math.random() * GLITCH.length)];
}

function rgba(a: number) {
  return `rgba(${CYAN[0]},${CYAN[1]},${CYAN[2]},${a})`;
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
    const STUB = GRID * 0.4;
    const startTime = performance.now();

    const gridCols = Math.ceil(w / GRID) + 1;
    const gridRows = Math.ceil(h / GRID) + 1;
    const gridNodes = new Array(gridCols * gridRows);
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        const gx = c * GRID;
        const gy = r * GRID;
        gridNodes[r * gridCols + c] = {
          gx, gy,
          dist: Math.sqrt((gx - cx) ** 2 + (gy - cy) ** 2),
          dotSize: 1.5 + Math.random() * 1.5,
          ch: rch(),
          showChar: Math.random() < 0.15,
        };
      }
    }

    const colCount = Math.ceil(w / 16) + 2;
    const rowCount = Math.ceil(h / 14) + 5;
    const columns: Column[] = Array.from({ length: colCount }, (_, i) => ({
      x: i * 16,
      y: -Math.random() * h * 0.5,
      speed: 80 + Math.random() * 200,
      chars: Array.from({ length: rowCount }, () => rch()),
      baseAlpha: 0.08 + Math.random() * 0.25,
    }));

    const drips: Drip[] = [];
    const sparks: Spark[] = [];
    const scanLines: ScanLine[] = [
      { y: -20, speed: 300 + Math.random() * 200, alpha: 0.12 },
      { y: h * 0.3, speed: 250 + Math.random() * 150, alpha: 0.08 },
    ];

    let pulseRing = 0;
    let pulseRing2 = -maxDist * 0.3;
    let lastTime = startTime;

    for (let i = 0; i < 30; i++) {
      sparks.push({
        x: Math.random() * w,
        y: Math.random() * h,
        life: Math.random(),
        maxLife: 1.5 + Math.random() * 2,
        size: 1 + Math.random() * 3,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, w, h);

      const gridReveal = Math.min(1, elapsed / 1.2);
      const revealR = gridReveal * gridReveal * (maxDist + 80);

      for (let i = 0; i < gridNodes.length; i++) {
        const n = gridNodes[i];
        if (n.dist > revealR) continue;
        const intensity = Math.min(1, (revealR - n.dist) / 100);
        const a = intensity * intensity;

        ctx.strokeStyle = rgba(a * 0.4);
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
        ctx.fillStyle = rgba(a * 0.6);
        ctx.fill();

        if (a > 0.5 && n.showChar) {
          ctx.font = "bold 11px 'JetBrains Mono',monospace";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = rgba(a * 0.4);
          ctx.fillText(n.ch, n.gx + 9, n.gy - 9);
        }
      }

      ctx.font = "12px 'JetBrains Mono','Courier New',monospace";
      ctx.textAlign = "center";
      const fadeInCols = Math.min(1, elapsed / 0.3);
      for (const col of columns) {
        col.y += col.speed * dt;
        if (col.y > 14) {
          col.y -= 14;
          col.chars.pop();
          col.chars.unshift(rch());
        }
        if (Math.random() < 0.06) {
          col.chars[Math.floor(Math.random() * col.chars.length)] = rch();
        }
        const baseY = col.y % 14;
        for (let r = 0; r < col.chars.length; r++) {
          const cy2 = baseY + r * 14 - 14;
          if (cy2 < -14 || cy2 > h + 14) continue;
          const rowFade = 0.3 + (r / col.chars.length) * 0.7;
          const a = col.baseAlpha * rowFade * fadeInCols;
          if (a < 0.01) continue;
          ctx.fillStyle = rgba(a);
          ctx.fillText(col.chars[r], col.x, cy2);
        }
      }

      pulseRing += dt * 250;
      pulseRing2 += dt * 180;
      if (pulseRing > maxDist + 100) pulseRing = 0;
      if (pulseRing2 > maxDist + 100) pulseRing2 = -maxDist * 0.2;
      if (pulseRing > 0) {
        const ringA = Math.max(0, 0.2 - (pulseRing / maxDist) * 0.2);
        ctx.strokeStyle = rgba(ringA);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, pulseRing, 0, Math.PI * 2);
        ctx.stroke();
      }
      if (pulseRing2 > 0) {
        const ringA = Math.max(0, 0.15 - (pulseRing2 / maxDist) * 0.15);
        ctx.strokeStyle = rgba(ringA);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, pulseRing2, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const sl of scanLines) {
        sl.y += sl.speed * dt;
        if (sl.y > h + 20) sl.y = -20;
        ctx.strokeStyle = rgba(sl.alpha);
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, sl.y);
        ctx.lineTo(w, sl.y);
        ctx.stroke();
        const grad = ctx.createLinearGradient(0, sl.y - 8, 0, sl.y + 8);
        grad.addColorStop(0, rgba(0));
        grad.addColorStop(0.5, rgba(sl.alpha * 0.5));
        grad.addColorStop(1, rgba(0));
        ctx.fillStyle = grad;
        ctx.fillRect(0, sl.y - 8, w, 16);
      }

      if (elapsed > 0.2 && drips.length < 40) {
        if (Math.random() < 0.3) {
          drips.push({
            x: Math.random() * w,
            y: Math.random() * h * 0.3,
            vy: 40 + Math.random() * 100,
            r: 1 + Math.random() * 3,
            life: 1,
          });
        }
      }
      for (let i = drips.length - 1; i >= 0; i--) {
        const d = drips[i];
        d.life -= dt * 0.3;
        d.y += d.vy * dt;
        d.vy += 50 * dt;
        d.r *= 0.998;
        if (d.life <= 0 || d.r < 0.3 || d.y > h + 20) {
          drips.splice(i, 1);
          continue;
        }
        const a = d.life * d.life * 0.5;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = rgba(a);
        ctx.fill();
        if (d.r > 1.5) {
          ctx.beginPath();
          ctx.arc(d.x, d.y + d.r * 2, d.r * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = rgba(a * 0.3);
          ctx.fill();
        }
      }

      for (const s of sparks) {
        s.life -= dt / s.maxLife;
        s.pulse += dt * 4;
        if (s.life <= 0) {
          s.x = Math.random() * w;
          s.y = Math.random() * h;
          s.life = 1;
          s.maxLife = 1.5 + Math.random() * 2;
          s.size = 1 + Math.random() * 3;
        }
        const brightness = (0.5 + 0.5 * Math.sin(s.pulse)) * s.life;
        const a = brightness * 0.6;
        if (a < 0.02) continue;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * brightness, 0, Math.PI * 2);
        ctx.fillStyle = rgba(a);
        ctx.fill();
      }

      if (elapsed >= 1.8 && !titleShownRef.current) {
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
