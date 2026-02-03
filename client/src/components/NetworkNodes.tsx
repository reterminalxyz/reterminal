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

    // Create initial ripple
    const createRipple = () => {
      ripples.push({
        x: centerX,
        y: centerY,
        radius: 10,
        maxRadius: Math.max(canvas.offsetWidth, canvas.offsetHeight) * 0.8,
        alpha: 0.6
      });
    };

    // Start with a ripple
    createRipple();
    const rippleInterval = setInterval(createRipple, 2000);

    let animationFrameId: number;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw ripples
      ripples.forEach((ripple, index) => {
        ripple.radius += 2;
        ripple.alpha = 0.6 * (1 - ripple.radius / ripple.maxRadius);

        if (ripple.alpha <= 0) {
          ripples.splice(index, 1);
          return;
        }

        // Outer ring
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 87, 34, ${ripple.alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Inner glow ring
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius * 0.8, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 87, 34, ${ripple.alpha * 0.3})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Draw center node with glow
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30);
      gradient.addColorStop(0, "rgba(255, 87, 34, 0.8)");
      gradient.addColorStop(0.5, "rgba(255, 87, 34, 0.2)");
      gradient.addColorStop(1, "rgba(255, 87, 34, 0)");
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Core dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#FF5722";
      ctx.fill();

      // Small orbiting dots
      const time = Date.now() / 1000;
      for (let i = 0; i < 3; i++) {
        const angle = (time * 0.5 + (i * Math.PI * 2) / 3);
        const orbitRadius = 50 + i * 20;
        const x = centerX + Math.cos(angle) * orbitRadius;
        const y = centerY + Math.sin(angle) * orbitRadius;
        
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 87, 34, ${0.5 - i * 0.1})`;
        ctx.fill();
        
        // Connection line to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(255, 87, 34, ${0.15 - i * 0.03})`;
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
    <div className="relative w-full h-48 md:h-56">
      {/* Glass container */}
      <div className="absolute inset-0 glass-panel rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ background: 'transparent' }}
        />
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-2 left-2 text-[8px] text-primary/40 tracking-widest">SIGNAL</div>
      <div className="absolute top-2 right-2 text-[8px] text-primary/40 tracking-widest">ACTIVE</div>
      
      {/* Pulsing indicator */}
      <motion.div 
        className="absolute bottom-2 right-2 flex items-center gap-1"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-1 h-1 rounded-full bg-primary" />
        <span className="text-[8px] text-primary/60">TRANSMITTING</span>
      </motion.div>
    </div>
  );
}
