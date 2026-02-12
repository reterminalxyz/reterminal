import { useEffect, useRef, useCallback, useState } from "react";

function DigitalFogCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fogCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const clearedAreasRef = useRef<Array<{ x: number; y: number; radius: number; opacity: number; time: number }>>([]);
  const [hintVisible, setHintVisible] = useState(true);

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
      const step = 4;
      for (let i = 0; i < data.length; i += step * 4) {
        const noise = Math.random() * 30;
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

  const addClearArea = useCallback((clientX: number, clientY: number) => {
    setHintVisible(false);
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
    addClearArea(e.clientX, e.clientY);
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
          const touch = e.touches[0];
          if (touch) addClearArea(touch.clientX, touch.clientY);
        }}
        onClick={(e) => addClearArea(e.clientX, e.clientY)}
        data-testid="fog-canvas"
      />
      {hintVisible && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
          data-testid="text-hint"
        >
          <span
            className="font-mono text-[11px] tracking-[2px] animate-blink"
            style={{ color: "#D97D45", opacity: 0.8 }}
          >
            CLEAR THE FOG TO REVEAL THE SIGNAL<span className="animate-blink">_</span>
          </span>
        </div>
      )}
    </>
  );
}

const MANIFESTO_LINES = [
  { text: "The internet has become a digital panopticon.", color: "#999", delay: 0 },
  { text: "re_terminal is the breach.", color: "#D97D45", delay: 1800, hasBlinkUnderscore: true },
  { text: "Post-privacy is our current reality.", color: "#999", delay: 3400 },
  { text: "Offline hardware. Stateless money. Direct signal.", color: "#999", delay: 5000 },
  { text: "Reclaim your digital sovereignty.", color: "#ccc", delay: 7000, bold: true },
];

function TypewriterLine({ text, color, delay, bold, hasBlinkUnderscore }: {
  text: string;
  color: string;
  delay: number;
  bold?: boolean;
  hasBlinkUnderscore?: boolean;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 35);
    return () => clearInterval(interval);
  }, [started, text]);

  if (!started) return <p className="mt-3 invisible">&nbsp;</p>;

  if (hasBlinkUnderscore && displayedText.length > 0) {
    const idx = 2;
    let content;
    if (displayedText.length <= idx) {
      content = <>{displayedText}<span className="animate-blink">_</span></>;
    } else if (displayedText.length <= idx + 1) {
      content = <>{displayedText.slice(0, idx)}<span className="animate-blink">_</span>{displayedText.slice(idx + 1)}</>;
    } else {
      content = <>{displayedText.slice(0, idx)}<span className="animate-blink">_</span>{displayedText.slice(idx + 1)}{!done && <span className="animate-blink">|</span>}</>;
    }

    return (
      <p className="mt-3" style={{ color }}>
        {content}
      </p>
    );
  }

  return (
    <p
      className={`mt-3 ${bold ? "font-bold" : ""}`}
      style={{ color, letterSpacing: bold ? "1.5px" : undefined }}
    >
      {displayedText}
      {!done && <span className="animate-blink">|</span>}
    </p>
  );
}

export default function Landing() {
  return (
    <div className="fixed inset-0 overflow-hidden" data-testid="landing-page">
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at center, #3d2212 0%, #2a1508 25%, #1a0c03 50%, #0D0D0D 80%)",
        }}
        data-testid="bronze-bg"
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 40%, rgba(184,115,51,0.3) 0%, rgba(217,125,69,0.15) 30%, rgba(184,115,51,0.05) 55%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 30% 60%, rgba(166,94,46,0.12) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255,179,138,0.08) 0%, transparent 40%)",
          }}
        />
      </div>

      <div className="fixed inset-0 z-5 flex flex-col items-center justify-center px-8">
        <div className="flex flex-col items-center max-w-[380px]">
          <div
            className="text-center font-mono leading-loose"
            style={{
              fontSize: "13px",
              lineHeight: "2.4",
              letterSpacing: "0.5px",
            }}
            data-testid="text-manifesto"
          >
            {MANIFESTO_LINES.map((line, i) => (
              <TypewriterLine
                key={i}
                text={line.text}
                color={line.color}
                delay={line.delay}
                bold={line.bold}
                hasBlinkUnderscore={line.hasBlinkUnderscore}
              />
            ))}
          </div>
        </div>
      </div>

      <DigitalFogCanvas />
    </div>
  );
}
