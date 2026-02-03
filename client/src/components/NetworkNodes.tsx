import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function NetworkNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    interface Ripple {
      x: number;
      y: number;
      radius: number;
      maxRadius: number;
      alpha: number;
    }

    const ripples: Ripple[] = [];
    let centerX = 0;
    let centerY = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
      centerX = canvas.offsetWidth / 2;
      centerY = canvas.offsetHeight / 2;
    };
    
    window.addEventListener("resize", resize);
    resize();

    const createRipple = () => {
      ripples.push({
        x: centerX,
        y: centerY,
        radius: 10,
        maxRadius: Math.max(canvas.offsetWidth, canvas.offsetHeight) * 0.8,
        alpha: 0.6
      });
    };

    createRipple();
    const rippleInterval = setInterval(createRipple, 2000);

    let animationFrameId: number;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw ripples - copper color
      ripples.forEach((ripple, index) => {
        ripple.radius += 1.5;
        ripple.alpha = 0.5 * (1 - ripple.radius / ripple.maxRadius);

        if (ripple.alpha <= 0) {
          ripples.splice(index, 1);
          return;
        }

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(184, 115, 51, ${ripple.alpha * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius * 0.7, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(184, 115, 51, ${ripple.alpha * 0.25})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Center node with copper gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
      gradient.addColorStop(0, "rgba(184, 115, 51, 0.6)");
      gradient.addColorStop(0.5, "rgba(184, 115, 51, 0.15)");
      gradient.addColorStop(1, "rgba(184, 115, 51, 0)");
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#B87333";
      ctx.fill();

      // Orbiting dots
      const time = Date.now() / 1000;
      for (let i = 0; i < 3; i++) {
        const angle = (time * 0.4 + (i * Math.PI * 2) / 3);
        const orbitRadius = 45 + i * 18;
        const x = centerX + Math.cos(angle) * orbitRadius;
        const y = centerY + Math.sin(angle) * orbitRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(184, 115, 51, ${0.4 - i * 0.08})`;
        ctx.fill();
        
        // Connection line
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(184, 115, 51, ${0.12 - i * 0.02})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
      clearInterval(rippleInterval);
    };
  }, []);

  return (
    <div className="relative w-full h-44 md:h-52">
      <div className="absolute inset-0 glass-panel rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ background: 'transparent' }}
        />
      </div>
      
      <div className="absolute top-2 left-3 text-[8px] text-[#B87333]/50 tracking-widest eink-text">SIGNAL</div>
      <div className="absolute top-2 right-3 text-[8px] text-[#B87333]/50 tracking-widest eink-text">ACTIVE</div>
      
      <motion.div 
        className="absolute bottom-2 right-3 flex items-center gap-1"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-1 h-1 rounded-full bg-[#B87333]" />
        <span className="text-[8px] text-[#B87333]/60 eink-text">TRANSMITTING</span>
      </motion.div>
    </div>
  );
}
