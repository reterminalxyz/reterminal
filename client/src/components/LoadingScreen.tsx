import { useEffect, useRef } from "react";

const CH = "!@#$%^&*_+-=[]{}|;:',.<>?/\\~`01";
const COL_SP = 10;
const LH = 15;
const DURATION = 3;
const CYAN = [0, 229, 255] as const;

interface Drip {
  x: number;
  y: number;
  vy: number;
  alpha: number;
  length: number;
}

interface Spark {
  x: number;
  y: number;
  alpha: number;
  decay: number;
  radius: number;
}

interface Ring {
  r: number;
  alpha: number;
  speed: number;
}

let cachedCols: { x: number; speed: number; chars: string[]; alpha: number; scroll: number }[] | null = null;
let cachedW = 0;
let cachedH = 0;
let cachedNVisible = 0;
let cachedNChars = 0;
let globalT0 = 0;

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    cvs.width = w * dpr;
    cvs.height = h * dpr;
    const ctx = cvs.getContext("2d", { alpha: false });
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const needsInit = !cachedCols || cachedW !== w || cachedH !== h;
    if (needsInit) {
      const nCols = Math.ceil(w / COL_SP) + 1;
      cachedNVisible = Math.ceil(h / LH) + 2;
      cachedNChars = cachedNVisible + 1;
      cachedW = w;
      cachedH = h;
      cachedCols = Array.from({ length: nCols }, (_, i) => ({
        x: i * COL_SP,
        speed: 120 + Math.random() * 380,
        chars: Array.from({ length: cachedNChars }, () => CH[(Math.random() * CH.length) | 0]),
        alpha: 0.15 + Math.random() * 0.5,
        scroll: 0,
      }));
      globalT0 = performance.now();
    }

    const cols = cachedCols!;
    const nVis = cachedNVisible;
    const nCh = cachedNChars;
    let prevNow = performance.now();

    const drips: Drip[] = [];
    const sparks: Spark[] = [];
    const rings: Ring[] = [{ r: 0, alpha: 0.4, speed: 180 }];
    let scanY = -20;
    let nextDripTime = 0;
    let nextSparkTime = 0;
    let nextRingTime = 1.2;

    const cx = w / 2;
    const cy = h / 2;
    const maxRing = Math.sqrt(cx * cx + cy * cy);

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - prevNow) / 1000);
      prevNow = now;
      const t = (now - globalT0) / 1000;

      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, w, h);

      ctx.font = "bold 14px 'JetBrains Mono',monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = `rgb(${CYAN[0]},${CYAN[1]},${CYAN[2]})`;

      for (let c = 0; c < cols.length; c++) {
        const col = cols[c];
        col.scroll += col.speed * dt;
        const pixOff = col.scroll % LH;
        const charShift = Math.floor(col.scroll / LH);

        ctx.globalAlpha = col.alpha;
        for (let r = 0; r <= nVis; r++) {
          const py = r * LH + pixOff - LH;
          const ci = ((r - charShift) % nCh + nCh) % nCh;
          ctx.fillText(col.chars[ci], col.x, py);
        }
      }

      if (t > nextDripTime) {
        nextDripTime = t + 0.03 + Math.random() * 0.06;
        drips.push({
          x: Math.random() * w,
          y: 0,
          vy: 200 + Math.random() * 400,
          alpha: 0.3 + Math.random() * 0.5,
          length: 8 + Math.random() * 25,
        });
      }

      for (let i = drips.length - 1; i >= 0; i--) {
        const d = drips[i];
        d.y += d.vy * dt;
        d.vy += 600 * dt;
        d.alpha -= 0.3 * dt;
        if (d.y > h + 40 || d.alpha <= 0) { drips.splice(i, 1); continue; }
        ctx.globalAlpha = d.alpha;
        const grad = ctx.createLinearGradient(d.x, d.y - d.length, d.x, d.y);
        grad.addColorStop(0, `rgba(${CYAN[0]},${CYAN[1]},${CYAN[2]},0)`);
        grad.addColorStop(1, `rgba(${CYAN[0]},${CYAN[1]},${CYAN[2]},1)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y - d.length);
        ctx.lineTo(d.x, d.y);
        ctx.stroke();
      }

      if (t > nextSparkTime) {
        nextSparkTime = t + 0.04 + Math.random() * 0.08;
        sparks.push({
          x: Math.random() * w,
          y: Math.random() * h,
          alpha: 0.5 + Math.random() * 0.5,
          decay: 1.5 + Math.random() * 2,
          radius: 1 + Math.random() * 2.5,
        });
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.alpha -= s.decay * dt;
        if (s.alpha <= 0) { sparks.splice(i, 1); continue; }
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = `rgb(${CYAN[0]},${CYAN[1]},${CYAN[2]})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, 6.2832);
        ctx.fill();
        ctx.globalAlpha = s.alpha * 0.4;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 3, 0, 6.2832);
        ctx.fill();
      }

      scanY += 220 * dt;
      if (scanY > h + 20) scanY = -20;
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = `rgb(${CYAN[0]},${CYAN[1]},${CYAN[2]})`;
      ctx.fillRect(0, scanY - 1, w, 2);
      ctx.globalAlpha = 0.04;
      ctx.fillRect(0, scanY - 6, w, 12);

      if (t > nextRingTime) {
        nextRingTime = t + 0.8 + Math.random() * 0.6;
        rings.push({ r: 0, alpha: 0.25, speed: 150 + Math.random() * 100 });
      }

      for (let i = rings.length - 1; i >= 0; i--) {
        const ring = rings[i];
        ring.r += ring.speed * dt;
        ring.alpha -= 0.15 * dt;
        if (ring.r > maxRing || ring.alpha <= 0) { rings.splice(i, 1); continue; }
        ctx.globalAlpha = ring.alpha;
        ctx.strokeStyle = `rgb(${CYAN[0]},${CYAN[1]},${CYAN[2]})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, ring.r, 0, 6.2832);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;

      if (t >= DURATION && !doneRef.current) {
        doneRef.current = true;
        onComplete();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "#FFF", zIndex: 9999 }} data-testid="loading-screen">
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

export function resetLoadingScreen() {
  cachedCols = null;
  globalT0 = 0;
}
