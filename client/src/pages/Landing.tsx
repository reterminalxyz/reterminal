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

function BlinkingUnderscore() {
  return <span className="animate-blink">_</span>;
}

export default function Landing() {
  return (
    <div className="fixed inset-0 overflow-hidden" data-testid="landing-page">
      <div
        className="fixed inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at center, #2a1a0a 0%, #1a0f05 30%, #0D0D0D 70%)",
        }}
        data-testid="bronze-bg"
      >
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at 50% 40%, rgba(184,115,51,0.15) 0%, rgba(184,115,51,0.05) 40%, transparent 70%)",
          }}
        />
      </div>

      <div className="fixed inset-0 z-5 flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center max-w-[380px]">
          <div
            className="text-center font-mono leading-loose"
            style={{
              color: "#999",
              fontSize: "11px",
              lineHeight: "2.2",
              letterSpacing: "0.5px",
            }}
            data-testid="text-manifesto"
          >
            <p>The internet has become a digital panopticon.</p>
            <p className="mt-3" style={{ color: "#D97D45" }}>
              re<BlinkingUnderscore />terminal is the breach.
            </p>
            <p className="mt-3">Post-privacy is our current reality.</p>
            <p className="mt-3">Offline hardware. Stateless money. Direct signal.</p>
            <p
              className="mt-4 font-bold"
              style={{ color: "#bbb", letterSpacing: "1.5px", fontSize: "11px" }}
            >
              Reclaim your digital sovereignty.
            </p>
          </div>
        </div>
      </div>

      <DigitalFogCanvas />
    </div>
  );
}
