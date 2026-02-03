import { useEffect, useRef } from "react";

export function Oscilloscope() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      if (!ctx || !canvas) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      ctx.strokeStyle = "#FF5722";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#FF5722";

      // Draw sine wave
      for (let x = 0; x < width; x++) {
        // Complex wave combining multiple sines
        const y = height / 2 + 
                  (Math.sin((x * 0.02) + phase) * 30) + 
                  (Math.sin((x * 0.05) + phase * 2) * 10);
        
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.stroke();
      
      phase += 0.1;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-32 md:h-48 rounded border border-primary/20 bg-black/40"
    />
  );
}
