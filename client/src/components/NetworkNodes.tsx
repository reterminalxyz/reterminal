import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
}

export function NetworkNodes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const nodes: Node[] = [];
    const nodeCount = 30;
    const connectionDistance = 100;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Initialize nodes
      nodes.length = 0;
      // Center node
      nodes.push({ 
        x: canvas.width / 2, 
        y: canvas.height / 2, 
        vx: 0, 
        vy: 0, 
        active: true 
      });
      
      // Random nodes
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          active: false
        });
      }
    };
    
    window.addEventListener("resize", resize);
    resize();

    let animationFrameId: number;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update positions
      nodes.forEach((node, i) => {
        if (i === 0) return; // Skip center static node
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
      });

      // Draw connections
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = 1 - dist / connectionDistance;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 87, 34, ${alpha * 0.6})`;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((node, i) => {
        ctx.beginPath();
        ctx.fillStyle = i === 0 ? "#FF5722" : "rgba(224, 224, 224, 0.5)";
        ctx.arc(node.x, node.y, i === 0 ? 5 : 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow for center node
        if (i === 0) {
          ctx.shadowBlur = 15;
          ctx.shadowColor = "#FF5722";
          ctx.stroke();
          ctx.shadowBlur = 0;
        }
      });

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
      className="w-full h-48 md:h-64 rounded border border-primary/20 bg-black/40"
    />
  );
}
