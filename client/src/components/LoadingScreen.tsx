import { useEffect, useRef, useState } from "react";

const G = 48;
const CH = "⟨⟩∆∇◊○●□■▪▫▬▮▯░▒▓╳╲╱⊕⊗⊙⊚≡∞∑Ω";
const C = "0,229,255";

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

    const cx = w / 2, cy = h / 2;
    const maxD = Math.hypot(cx, cy);
    const stub = G * 0.38;
    const t0 = performance.now();
    let prevNow = t0;

    const gc = Math.ceil(w / G) + 1;
    const gr = Math.ceil(h / G) + 1;
    const nodes: { x: number; y: number; d: number; s: number; c: string; sc: boolean; a: number; ph: number }[] = [];
    for (let r = 0; r < gr; r++) {
      for (let c = 0; c < gc; c++) {
        const x = c * G, y = r * G;
        nodes.push({
          x, y,
          d: Math.hypot(x - cx, y - cy),
          s: 1.2 + Math.random() * 1.8,
          c: CH[(Math.random() * CH.length) | 0],
          sc: Math.random() < 0.2,
          a: 0,
          ph: Math.random() * 6.28,
        });
      }
    }

    const COL_SP = 14;
    const nCols = Math.min(Math.ceil(w / COL_SP), 50);
    const nRows = Math.ceil(h / 15) + 6;
    const cols = Array.from({ length: nCols }, (_, i) => ({
      x: i * COL_SP + (COL_SP / 2) + (Math.random() - 0.5) * 4,
      offset: Math.random() * nRows,
      speed: 1.5 + Math.random() * 6,
      chars: Array.from({ length: nRows }, () => CH[(Math.random() * CH.length) | 0]),
      alpha: 0.03 + Math.random() * 0.15,
      headLen: 3 + Math.floor(Math.random() * 8),
    }));

    const sparks = Array.from({ length: 20 }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      life: Math.random(), max: 2 + Math.random() * 3,
      r: 1 + Math.random() * 2.5, ph: Math.random() * 6.28,
    }));

    let scanY = -10;

    const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxD * 0.6);
    glowGrad.addColorStop(0, `rgba(${C},0.06)`);
    glowGrad.addColorStop(1, `rgba(${C},0)`);

    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - prevNow) / 1000);
      prevNow = now;
      const t = (now - t0) / 1000;
      const breathe = 0.5 + 0.5 * Math.sin(t * 1.8);

      ctx.fillStyle = "#FFF";
      ctx.fillRect(0, 0, w, h);

      const reveal = Math.min(1, t / 1.0);
      const rR = reveal * reveal * (maxD + 100);

      ctx.lineWidth = 1;
      ctx.font = "bold 10px 'JetBrains Mono',monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (n.d > rR) continue;
        const raw = Math.min(1, (rR - n.d) / 120);
        n.a += (raw * raw - n.a) * 0.12;
        if (n.a < 0.01) continue;

        const ap = n.a * (0.7 + 0.3 * Math.sin(t * 2.2 + n.ph));

        ctx.globalAlpha = ap * 0.35;
        ctx.strokeStyle = `rgb(${C})`;
        ctx.beginPath();
        ctx.moveTo(n.x - stub, n.y);
        ctx.lineTo(n.x + stub, n.y);
        ctx.moveTo(n.x, n.y - stub);
        ctx.lineTo(n.x, n.y + stub);
        ctx.stroke();

        ctx.globalAlpha = ap * 0.55;
        ctx.fillStyle = `rgb(${C})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.s * ap, 0, 6.28);
        ctx.fill();

        if (n.sc && n.a > 0.4) {
          ctx.globalAlpha = ap * 0.35;
          ctx.fillText(n.c, n.x + 10, n.y - 10);
        }
      }
      ctx.globalAlpha = 1;

      const colFade = Math.min(1, t / 0.15);
      ctx.font = "11px 'JetBrains Mono',monospace";
      ctx.fillStyle = `rgb(${C})`;
      for (const col of cols) {
        col.offset += col.speed * dt;
        if (col.offset > 1) {
          col.offset -= 1;
          col.chars.pop();
          col.chars.unshift(CH[(Math.random() * CH.length) | 0]);
        }
        if (Math.random() < 0.03) {
          col.chars[(Math.random() * col.chars.length) | 0] = CH[(Math.random() * CH.length) | 0];
        }
        const oY = (col.offset % 1) * 15;
        const headIdx = Math.floor(col.offset * col.chars.length) % col.chars.length;
        for (let r = 0; r < col.chars.length; r++) {
          const py = oY + r * 15 - 15;
          if (py < -15 || py > h + 15) continue;
          const distFromHead = (r - headIdx + col.chars.length) % col.chars.length;
          const headGlow = distFromHead < col.headLen ? 1 - distFromHead / col.headLen : 0;
          const baseWave = 0.5 + 0.5 * Math.sin(t * 1.8 + r * 0.25 + col.x * 0.01);
          const wa = (col.alpha * baseWave + headGlow * 0.2) * colFade;
          if (wa < 0.01) continue;
          ctx.globalAlpha = wa;
          ctx.fillText(col.chars[r], col.x, py);
        }
      }
      ctx.globalAlpha = 1;

      if (t > 0.3) {
        ctx.globalAlpha = Math.min(0.06, (t - 0.3) * 0.03) * breathe;
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, w, h);
        ctx.globalAlpha = 1;
      }

      scanY += dt * 180;
      if (scanY > h + 40) scanY = -40;
      const scanA = 0.06 * breathe;
      ctx.globalAlpha = scanA;
      ctx.fillStyle = `rgb(${C})`;
      ctx.fillRect(0, scanY - 1, w, 2);
      ctx.globalAlpha = scanA * 0.3;
      ctx.fillRect(0, scanY - 15, w, 30);
      ctx.globalAlpha = 1;

      ctx.fillStyle = `rgb(${C})`;
      for (const s of sparks) {
        s.life -= dt / s.max;
        s.ph += dt * 5;
        if (s.life <= 0) {
          s.x = Math.random() * w;
          s.y = Math.random() * h;
          s.life = 1;
          s.max = 2 + Math.random() * 3;
          s.r = 1 + Math.random() * 2.5;
        }
        const b = (0.5 + 0.5 * Math.sin(s.ph)) * s.life * breathe;
        if (b < 0.03) continue;
        ctx.globalAlpha = b * 0.5;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * b, 0, 6.28);
        ctx.fill();
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
