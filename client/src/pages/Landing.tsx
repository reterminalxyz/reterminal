import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";

function DigitalFogCanvas({ onRevealProgress }: { onRevealProgress?: (p: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fogCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const clearedAreasRef = useRef<Array<{ x: number; y: number; radius: number; opacity: number; time: number }>>([]);

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
          const fadeStart = 3000;
          let alpha = area.opacity;
          if (age > fadeStart) {
            alpha = Math.max(0, area.opacity * (1 - (age - fadeStart) / 2000));
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
          return age < 5000;
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
    const now = performance.now();
    clearedAreasRef.current.push({
      x: clientX,
      y: clientY,
      radius: 60,
      opacity: 0.9,
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
      <canvas
        ref={fogCanvasRef}
        className="hidden"
      />
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
        data-testid="fog-canvas"
      />
    </>
  );
}

export default function Landing() {
  const [, setLocation] = useLocation();
  const [signalId, setSignalId] = useState("");
  const [transmitted, setTransmitted] = useState(false);

  const handleTransmit = useCallback(() => {
    if (signalId.trim()) {
      setTransmitted(true);
      setTimeout(() => setTransmitted(false), 3000);
    }
  }, [signalId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTransmit();
    }
  }, [handleTransmit]);

  return (
    <div className="fixed inset-0 bg-[#0D0D0D] overflow-hidden" data-testid="landing-page">
      <div className="fixed inset-0 z-0 flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6 max-w-[400px]">
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-[10px] tracking-[4px] font-mono font-bold uppercase"
              style={{ color: "#666" }}
            >
              DIGITAL RESISTANCE
            </span>
            <h1
              className="text-[28px] tracking-[6px] font-mono font-bold"
              style={{
                background: "linear-gradient(180deg, #A65E2E, #D97D45, #FFB38A)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 40px rgba(214,125,69,0.6), 0 0 80px rgba(214,125,69,0.3), 0 0 120px rgba(166,94,46,0.2)",
                filter: "drop-shadow(0 0 20px rgba(214,125,69,0.5))",
              }}
              data-testid="text-logo"
            >
              re_terminal<span className="animate-blink">_</span>
            </h1>
            <span
              className="text-[9px] tracking-[6px] font-mono font-bold uppercase mt-1"
              style={{ color: "#D97D45", opacity: 0.7 }}
              data-testid="text-slogan"
            >
              REGAIN WHAT WAS LOST
            </span>
          </div>

          <div
            className="text-center font-mono leading-relaxed mt-4"
            style={{ color: "#777", fontSize: "11px", lineHeight: "1.8", letterSpacing: "0.5px" }}
            data-testid="text-manifesto"
          >
            <p>The global network has become a digital panopticon.</p>
            <p className="mt-2" style={{ color: "#D97D45", opacity: 0.8 }}>re_terminal is the breach.</p>
            <p className="mt-2">Post-privacy is our current reality.</p>
            <p className="mt-2">Offline hardware. Stateless money. Direct signal.</p>
            <p className="mt-3 font-bold" style={{ color: "#999", letterSpacing: "2px", fontSize: "10px" }}>
              Reclaim your digital sovereignty.
            </p>
          </div>
        </div>
      </div>

      <DigitalFogCanvas />

      <div className="fixed bottom-0 left-0 right-0 z-20 px-6 pb-8 pt-4" style={{ background: "linear-gradient(transparent, #0D0D0D 40%)" }}>
        <div className="max-w-[400px] mx-auto flex flex-col gap-3">
          <div
            className="flex items-center border font-mono"
            style={{
              borderColor: "#333",
              background: "rgba(26,26,26,0.95)",
            }}
            data-testid="signal-input-container"
          >
            <span
              className="pl-3 pr-1 py-2.5 select-none"
              style={{ color: "#D97D45", fontSize: "12px" }}
            >
              &gt;
            </span>
            <input
              type="text"
              value={signalId}
              onChange={(e) => setSignalId(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="SIGNAL_ID (Nostr Pubkey)"
              className="flex-1 bg-transparent border-0 outline-none py-2.5 pr-3 font-mono"
              style={{
                color: "#aaa",
                fontSize: "11px",
                letterSpacing: "1px",
                caretColor: "#D97D45",
              }}
              data-testid="input-signal-id"
            />
          </div>

          <button
            onClick={handleTransmit}
            className="w-full py-2.5 font-mono font-bold tracking-[4px] transition-all duration-200"
            style={{
              fontSize: "11px",
              color: transmitted ? "#0D0D0D" : "#D97D45",
              background: transmitted ? "#D97D45" : "transparent",
              border: `1px solid ${transmitted ? "#D97D45" : "#333"}`,
            }}
            data-testid="button-transmit"
          >
            {transmitted ? "SIGNAL RECEIVED" : "[ TRANSMIT ]"}
          </button>

          <button
            onClick={() => setLocation("/activation")}
            className="w-full py-2 font-mono tracking-[3px] transition-all duration-200"
            style={{
              fontSize: "9px",
              color: "#555",
              background: "transparent",
              border: "1px solid #222",
            }}
            data-testid="button-enter-terminal"
          >
            ENTER TERMINAL
          </button>
        </div>
      </div>
    </div>
  );
}
