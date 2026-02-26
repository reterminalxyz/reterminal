import { useEffect, useRef, useState } from "react";

const CH = "!@#$%^&*_+-=[]{}|;:',.<>?/\\~`01";

interface Props {
  onComplete: () => void;
}

export function LoadingScreen({ onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const doneRef = useRef(false);
  const titleRef = useRef(false);
  const [showTitle, setShowTitle] = useState(false);

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

    const t0 = performance.now();
    let prevNow = t0;

    const COL_SP = 13;
    const LH = 15;
    const nCols = Math.ceil(w / COL_SP) + 1;
    const nVisible = Math.ceil(h / LH) + 2;
    const nChars = nVisible + 1;

    const cols = Array.from({ length: nCols }, (_, i) => {
      const chars = Array.from({ length: nChars }, () => CH[(Math.random() * CH.length) | 0]);
      return {
        x: i * COL_SP,
        speed: 40 + Math.random() * 200,
        chars,
        alpha: 0.2 + Math.random() * 0.45,
        scroll: 0,
        waveOff: Math.random() * 6.28,
      };
    });

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - prevNow) / 1000);
      prevNow = now;
      const t = (now - t0) / 1000;

      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, w, h);

      ctx.font = "bold 14px 'JetBrains Mono',monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "rgb(0,229,255)";

      for (let c = 0; c < nCols; c++) {
        const col = cols[c];
        col.scroll += col.speed * dt;
        const pixOff = col.scroll % LH;
        const charShift = Math.floor(col.scroll / LH);

        for (let r = 0; r <= nVisible; r++) {
          const py = r * LH + pixOff - LH;
          const ci = ((r - charShift) % nChars + nChars) % nChars;
          const wave = 0.55 + 0.45 * Math.sin(t * 2.0 + r * 0.2 + col.waveOff);
          ctx.globalAlpha = col.alpha * wave;
          ctx.fillText(col.chars[ci], col.x, py);
        }
      }
      ctx.globalAlpha = 1;

      if (t >= 1.8 && !titleRef.current) {
        titleRef.current = true;
        setShowTitle(true);
      }

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  useEffect(() => {
    if (showTitle && !doneRef.current) {
      const tm = setTimeout(() => { doneRef.current = true; onComplete(); }, 1200);
      return () => clearTimeout(tm);
    }
  }, [showTitle, onComplete]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: "#FFF", zIndex: 9999 }} data-testid="loading-screen">
      <canvas ref={canvasRef} className="absolute inset-0" style={{ width: "100%", height: "100%" }} />
      {showTitle && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" data-testid="loading-screen-final">
          <div style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: "clamp(22px,7vw,36px)",
            fontWeight: 400,
            letterSpacing: "0.06em",
            color: "#000",
            background: "radial-gradient(ellipse at center,rgba(255,255,255,.95) 0%,rgba(255,255,255,.7) 50%,transparent 80%)",
            padding: "24px 48px",
            animation: "lsTitleIn .6s ease-out both",
          }}>
            <span>re</span>
            <span style={{ color: "#00e5ff", textShadow: "0 0 8px #00e5ff" }}>_</span>
            <span>terminal</span>
          </div>
        </div>
      )}
      <style>{`@keyframes lsTitleIn{0%{opacity:0;transform:scale(.92);filter:blur(4px)}60%{opacity:1;transform:scale(1.02);filter:blur(0)}to{opacity:1;transform:scale(1);filter:blur(0)}}`}</style>
    </div>
  );
}
