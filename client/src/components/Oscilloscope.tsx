import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function Oscilloscope() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let offset = 0;
    let animationFrameId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };

    window.addEventListener("resize", resize);
    resize();

    const draw = () => {
      if (!ctx || !canvas) return;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      
      ctx.clearRect(0, 0, width, height);
      
      // Draw grid
      ctx.strokeStyle = "rgba(255, 87, 34, 0.08)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      
      // Draw main wave
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 87, 34, 0.7)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "rgba(255, 87, 34, 0.5)";

      for (let x = 0; x <= width; x++) {
        const y = height / 2 + 
          Math.sin((x + offset) * 0.02) * 20 + 
          Math.sin((x + offset) * 0.05) * 10 +
          Math.sin((x + offset) * 0.01) * 15;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Draw secondary wave (ghost)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 87, 34, 0.2)";
      ctx.lineWidth = 1;

      for (let x = 0; x <= width; x++) {
        const y = height / 2 + 
          Math.sin((x + offset * 0.8) * 0.03) * 15 + 
          Math.cos((x + offset) * 0.02) * 12;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      offset += 2;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-24 md:h-28">
      <div className="absolute inset-0 glass-panel rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
        />
      </div>
      
      {/* Labels */}
      <div className="absolute top-1 left-2 text-[8px] text-primary/50 tracking-widest">FREQ: 440Hz</div>
      <div className="absolute top-1 right-2 text-[8px] text-primary/50 tracking-widest">AMP: 0.8</div>
      
      <motion.div 
        className="absolute bottom-1 left-2 flex items-center gap-1"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-1 h-1 rounded-full bg-green-500" />
        <span className="text-[8px] text-green-500/70">SYNC</span>
      </motion.div>
    </div>
  );
}
