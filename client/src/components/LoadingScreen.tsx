import { useEffect, useRef } from "react";

const CH = "!@#$%^&*_+-=[]{}|;:',.<>?/\\~`01";
const COL_SP = 10;
const LH = 15;
const DURATION = 3;

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
        speed: 100 + Math.random() * 350,
        chars: Array.from({ length: cachedNChars }, () => CH[(Math.random() * CH.length) | 0]),
        alpha: 0.2 + Math.random() * 0.45,
        scroll: 0,
      }));
      globalT0 = performance.now();
    }

    const cols = cachedCols!;
    const nVis = cachedNVisible;
    const nCh = cachedNChars;
    let prevNow = performance.now();

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - prevNow) / 1000);
      prevNow = now;
      const t = (now - globalT0) / 1000;

      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, w, h);

      ctx.font = "bold 14px 'JetBrains Mono',monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgb(0,229,255)";

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
