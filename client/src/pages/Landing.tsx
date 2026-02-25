import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";

const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const BORDER = "1px solid #E5E5E5";
const EASE = "cubic-bezier(0.19, 1, 0.22, 1)";

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(24px)",
  transition: `opacity 0.8s ${EASE} ${delay}s, transform 0.8s ${EASE} ${delay}s`,
});

const MODULES = [
  { title: "Financial freedom", badge: "MVP DONE", done: true },
  { title: "Privacy", badge: "SOON", done: false },
  { title: "Surveillance evasion", badge: "SOON", done: false },
  { title: "Secure communication", badge: "SOON", done: false },
  { title: "Censorship bypass", badge: "SOON", done: false },
  { title: "Techno-philosophy", badge: "SOON", done: false },
  { title: "Offline survival tools", badge: "SOON", done: false },
];

const GLITCH_CHARS = "!@#$%^&*_+-=[]{}|;:',.<>?/\\~`01";

const GRID_SIZE = 48;
const GLOW_COLOR = "#00e5ff";
const GLOW_RADIUS = 180;

interface Spark {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  size: number;
  vx: number;
  vy: number;
}

function GridGlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999 });
  const sparks = useRef<Spark[]>([]);
  const lastSpawn = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let raf: number;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.current.x = e.touches[0].clientX;
        mouse.current.y = e.touches[0].clientY;
      }
    };
    const onLeave = () => {
      mouse.current.x = -9999;
      mouse.current.y = -9999;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    const draw = (now: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) { raf = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mx = mouse.current.x;
      const my = mouse.current.y;

      if (mx > -999) {
        const scrollY = window.scrollY;
        const absY = my + scrollY;

        const startCol = Math.floor((mx - GLOW_RADIUS) / GRID_SIZE);
        const endCol = Math.ceil((mx + GLOW_RADIUS) / GRID_SIZE);
        const startRow = Math.floor((absY - GLOW_RADIUS) / GRID_SIZE);
        const endRow = Math.ceil((absY + GLOW_RADIUS) / GRID_SIZE);

        for (let row = startRow; row <= endRow; row++) {
          for (let col = startCol; col <= endCol; col++) {
            const gx = col * GRID_SIZE;
            const gy = row * GRID_SIZE - scrollY;
            const dx = gx - mx;
            const dy = gy - my;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < GLOW_RADIUS) {
              const intensity = 1 - dist / GLOW_RADIUS;
              const alpha = intensity * intensity * 0.7;
              const size = 1.5 + intensity * 3;

              ctx.beginPath();
              ctx.arc(gx, gy, size, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`;
              ctx.fill();

              if (intensity > 0.6) {
                ctx.beginPath();
                ctx.arc(gx, gy, size + 4, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 229, 255, ${alpha * 0.2})`;
                ctx.fill();
              }
            }
          }
        }

        if (now - lastSpawn.current > 60) {
          lastSpawn.current = now;
          const nearCol = Math.round(mx / GRID_SIZE);
          const nearRow = Math.round(absY / GRID_SIZE);
          const sx = nearCol * GRID_SIZE;
          const sy = nearRow * GRID_SIZE - scrollY;
          const d = Math.sqrt((sx - mx) ** 2 + (sy - my) ** 2);
          if (d < GLOW_RADIUS * 0.5 && sparks.current.length < 30) {
            sparks.current.push({
              x: sx, y: sy,
              life: 1, maxLife: 0.4 + Math.random() * 0.4,
              size: 1 + Math.random() * 2,
              vx: (Math.random() - 0.5) * 20,
              vy: (Math.random() - 0.5) * 20,
            });
          }
        }
      }

      const dt = 1 / 60;
      sparks.current = sparks.current.filter(s => {
        s.life -= dt / s.maxLife;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.96;
        s.vy *= 0.96;
        if (s.life <= 0) return false;
        const a = s.life * 0.8;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * s.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 229, 255, ${a})`;
        ctx.fill();
        return true;
      });

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}

function GlitchTitle() {
  const [showSep, setShowSep] = useState(false);
  const [glyph, setGlyph] = useState("_");

  useEffect(() => {
    let flickerTimer: ReturnType<typeof setInterval> | null = null;
    const interval = setInterval(() => {
      setShowSep(true);
      const flicks = 2 + Math.floor(Math.random() * 5);
      let count = 0;
      flickerTimer = setInterval(() => {
        setGlyph(GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]);
        count++;
        if (count >= flicks) {
          if (flickerTimer) clearInterval(flickerTimer);
          flickerTimer = null;
          setTimeout(() => setShowSep(false), 80 + Math.random() * 150);
        }
      }, 40 + Math.random() * 30);
    }, 600 + Math.random() * 1200);
    return () => { clearInterval(interval); if (flickerTimer) clearInterval(flickerTimer); };
  }, []);

  return (
    <h1
      className="text-center select-none"
      style={{
        fontFamily: FONT_MONO,
        fontSize: "clamp(32px, 8vw, 64px)",
        fontWeight: 400,
        letterSpacing: "0.06em",
        color: "#000",
      }}
      data-testid="text-hero-title"
    >
      <span style={{ color: "#000" }}>re</span>
      {showSep ? (
        <span style={{ color: "#00e5ff", textShadow: "0 0 6px #00e5ff, 0 0 15px rgba(0,229,255,0.3)" }}>{glyph}</span>
      ) : (
        <span className="landing-blink" style={{ color: "#000" }}>_</span>
      )}
      <span style={{ color: "#000" }}>terminal</span>
    </h1>
  );
}

function HeroSection() {
  const obs = useInView();
  return (
    <section
      ref={obs.ref}
      className="relative flex flex-col items-center justify-center landing-hero-height"
      data-testid="section-hero"
    >
      <div className="w-full" style={{ maxWidth: 1000, margin: "0 auto", padding: "0 5vw" }}>
        <div className="flex flex-col items-center">
          <div style={reveal(obs.visible, 0)}>
            <GlitchTitle />
          </div>
          <div style={reveal(obs.visible, 0.15)}>
            <p className="mt-3 text-center" style={{ fontFamily: FONT_BODY, fontSize: "clamp(13px, 3vw, 17px)", color: "#333" }} data-testid="text-hero-subtitle">
              digital resistance starts here.
            </p>
          </div>
          <div className="mt-8 w-full" style={{ maxWidth: 800, ...reveal(obs.visible, 0.3) }}>
            <div className="relative w-full" style={{ paddingBottom: "56.25%", border: BORDER }} data-testid="video-container">
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/05LWu5BJUTA?rel=0&modestbranding=1"
                title="re_terminal"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="video-embed"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className="absolute bottom-6 left-1/2 flex flex-col items-center"
        style={{ transform: "translateX(-50%)", ...reveal(obs.visible, 0.6) }}
        data-testid="scroll-indicator"
      >
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, letterSpacing: "0.25em", color: "#000", marginBottom: 10, fontWeight: 500 }}>
          SCROLL
        </span>
        <div className="landing-scroll-line" />
      </div>
    </section>
  );
}

function ProblemSection() {
  const obs = useInView(0.2);
  return (
    <section style={{ padding: "4vh 0" }} data-testid="section-problem">
      <div ref={obs.ref} style={{ maxWidth: 900, margin: "0 auto", padding: "0 5vw" }}>
        <div style={reveal(obs.visible)}>
          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: "clamp(28px, 6vw, 56px)",
              fontWeight: 400,
              color: "#000",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
            data-testid="text-problem-stat"
          >
            guerrilla-style gamified educational phygital terminal.
          </p>
        </div>
        <div style={reveal(obs.visible, 0.3)}>
          <p
            style={{
              fontFamily: FONT_BODY,
              fontSize: "clamp(14px, 3vw, 20px)",
              color: "#666",
              lineHeight: 1.5,
              marginTop: 24,
              maxWidth: 600,
            }}
            data-testid="text-problem-conclusion"
          >
            It teaches users BTC and anti-authoritarian digital tools through interactive guides and tasks.
          </p>
        </div>
      </div>
    </section>
  );
}

function ModulesSection() {
  const obs = useInView();
  return (
    <section style={{ padding: "2vh 0" }} data-testid="section-modules">
      <div ref={obs.ref} style={{ maxWidth: 1000, margin: "0 auto", padding: "0 5vw", marginBottom: 20, ...reveal(obs.visible) }}>
        <h2 className="text-center" style={{ fontFamily: FONT_MONO, fontSize: "clamp(28px, 7vw, 48px)", fontWeight: 400, color: "#000", letterSpacing: "0.04em" }} data-testid="text-modules-title">
          Modules
        </h2>
      </div>
      <div className="relative">
        <div
          className="landing-no-scrollbar"
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            paddingLeft: "5vw",
            paddingRight: 80,
            paddingBottom: 16,
            scrollSnapType: "x mandatory",
            scrollbarWidth: "none",
          }}
          data-testid="modules-carousel"
        >
          {MODULES.map((mod, i) => (
            <div
              key={mod.title}
              className={`module-card module-card-${i}`}
              style={{
                flexShrink: 0,
                width: "min(75vw, 400px)",
                aspectRatio: "1",
                border: BORDER,
                padding: 28,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                scrollSnapAlign: "start",
                background: "#fff",
                position: "relative",
                overflow: "hidden",
                ...reveal(obs.visible, 0.06 * i),
              }}
              data-testid={`card-module-${i}`}
            >
              <span
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  padding: "5px 10px",
                  alignSelf: "flex-start",
                  ...(mod.done ? { background: "#000", color: "#fff" } : { border: BORDER, color: "#999" }),
                }}
                data-testid={`badge-module-${i}`}
              >
                {mod.badge}
              </span>
              <div className={`module-icon module-icon-${i}`} style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                {i === 0 && (
                  <svg viewBox="0 0 64 64" width="200" height="200" style={{ overflow: "visible" }}>
                    <g className="icon-dollar">
                      <line x1="32" y1="8" x2="32" y2="56" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M40 22c0-6-3.5-9-8-9s-8 3-8 9c0 10 16 6 16 16 0 6-3.5 9-8 9s-8-3-8-9" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <g className="icon-bitcoin">
                      <line x1="28" y1="10" x2="28" y2="54" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="36" y1="10" x2="36" y2="54" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M24 16h14c4 0 7 3 7 7s-3 7-7 7H24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M24 30h16c4 0 7 3 7 8s-3 8-7 8H24" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </svg>
                )}
                {i === 1 && (
                  <svg viewBox="0 0 64 64" width="200" height="200" style={{ overflow: "visible" }}>
                    <g className="icon-eye-outer">
                      <path d="M4 32s12-18 28-18 28 18 28 18-12 18-28 18S4 32 4 32z" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <circle className="icon-eye-pupil" cx="32" cy="32" r="6" fill="none" stroke="#000" strokeWidth="1.5" />
                  </svg>
                )}
                {i === 2 && (
                  <svg viewBox="0 0 64 64" width="200" height="200" style={{ overflow: "visible" }}>
                    <g className="icon-camera">
                      <rect x="6" y="8" width="14" height="10" rx="2" fill="none" stroke="#000" strokeWidth="1.5" />
                      <path d="M20 14L44 40M20 14L44 8" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                    </g>
                    <circle className="icon-target-dot" cx="34" cy="30" r="3" fill="#000" />
                  </svg>
                )}
                {i === 3 && (
                  <svg viewBox="0 0 64 64" width="200" height="200" style={{ overflow: "visible" }}>
                    <circle className="icon-node-a" cx="10" cy="32" r="4" fill="#000" />
                    <circle className="icon-node-b" cx="54" cy="32" r="4" fill="#000" />
                    <line className="icon-dashed-line" x1="14" y1="32" x2="50" y2="32" stroke="#000" strokeWidth="1.5" strokeDasharray="4 4" />
                    <rect className="icon-packet" x="14" y="29" width="8" height="6" fill="#000" opacity="0" />
                  </svg>
                )}
                {i === 4 && (
                  <svg viewBox="0 0 64 64" width="200" height="200" style={{ overflow: "visible" }}>
                    <line className="icon-wall" x1="44" y1="8" x2="44" y2="56" stroke="#000" strokeWidth="3" strokeLinecap="round" />
                    <g className="icon-arrow-group">
                      <line x1="8" y1="32" x2="28" y2="32" stroke="#000" strokeWidth="1.5" />
                      <path d="M24 26l8 6-8 6" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </svg>
                )}
                {i === 5 && (
                  <svg viewBox="0 0 64 64" width="200" height="200" style={{ overflow: "visible" }}>
                    <circle className="icon-dot-1" cx="16" cy="16" r="3" fill="#000" />
                    <circle className="icon-dot-2" cx="48" cy="16" r="3" fill="#000" />
                    <circle className="icon-dot-3" cx="48" cy="48" r="3" fill="#000" />
                    <circle className="icon-dot-4" cx="16" cy="48" r="3" fill="#000" />
                    <line className="icon-line-a" x1="16" y1="16" x2="48" y2="16" stroke="#000" strokeWidth="1.5" />
                    <line className="icon-line-b" x1="48" y1="16" x2="48" y2="48" stroke="#000" strokeWidth="1.5" />
                    <line className="icon-line-c" x1="48" y1="48" x2="16" y2="48" stroke="#000" strokeWidth="1.5" />
                    <line className="icon-line-d" x1="16" y1="48" x2="16" y2="16" stroke="#000" strokeWidth="1.5" />
                    <line className="icon-line-e" x1="16" y1="16" x2="48" y2="48" stroke="#000" strokeWidth="1.5" />
                    <line className="icon-line-f" x1="48" y1="16" x2="16" y2="48" stroke="#000" strokeWidth="1.5" />
                  </svg>
                )}
                {i === 6 && (
                  <svg viewBox="0 0 64 64" width="200" height="200" style={{ overflow: "visible" }}>
                    <g className="icon-wifi">
                      <path d="M12 24c5.5-5.5 14.5-5.5 20 0" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M16 30c3.3-3.3 8.7-3.3 12 0" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                      <circle cx="22" cy="36" r="2" fill="#000" />
                      <line x1="12" y1="20" x2="32" y2="40" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                    </g>
                    <g className="icon-nfc-card">
                      <rect x="26" y="28" width="20" height="14" rx="2" fill="none" stroke="#000" strokeWidth="1.5" />
                      <rect x="30" y="32" width="6" height="4" rx="1" fill="none" stroke="#000" strokeWidth="1" />
                    </g>
                  </svg>
                )}
              </div>
              <p style={{ fontFamily: FONT_MONO, fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 400, color: "#000" }}>{mod.title}</p>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 16, ...reveal(obs.visible, 0.3) }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="landing-scroll-line-h" style={{ width: 32, height: 1, background: "#000" }} />
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, letterSpacing: "0.15em", color: "#999" }}>SCROLL</span>
          <div className="landing-scroll-line-h" style={{ width: 32, height: 1, background: "#000" }} />
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const costRef = useRef<HTMLDivElement>(null);
  const obs = useInView();

  const steps = [
    { num: "01", title: "Tap physical object", sub: "Card / Figure / Sticker" },
    { num: "02", title: "Learn and earn", sub: "Gamified modules → Earn $SATS" },
    { num: "03", title: "Peer-to-peer growth", sub: "Share cards → Network expands" },
  ];

  useEffect(() => {
    let raf: number;
    const onScroll = () => {
      raf = requestAnimationFrame(() => {
        const container = containerRef.current;
        const fill = fillRef.current;
        const cost = costRef.current;
        if (!container || !fill) return;

        const viewH = window.innerHeight;
        const trigger = viewH * 0.75;

        const containerRect = container.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerH = containerRect.height;

        if (containerH <= 0) return;

        stepRefs.current.forEach((el) => {
          if (!el) return;
          const elRect = el.getBoundingClientRect();
          const elMid = elRect.top + elRect.height / 2;
          if (elMid < trigger) {
            el.classList.add("tl-active");
          } else {
            el.classList.remove("tl-active");
          }
        });

        const fillProgress = Math.min(100, Math.max(0, ((trigger - containerTop) / containerH) * 100));
        fill.style.height = fillProgress + "%";

        if (cost && !cost.classList.contains("tl-cost-active")) {
          const costRect = cost.getBoundingClientRect();
          if (costRect.top < trigger) {
            cost.classList.add("tl-cost-active");
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section style={{ padding: "2vh 0" }} data-testid="section-howitworks">
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 5vw" }}>
        <div ref={obs.ref}>
          <h2 style={{ fontFamily: FONT_MONO, fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 400, color: "#000", marginBottom: 0, ...reveal(obs.visible) }} data-testid="text-hiw-title">
            Deployment Mechanics
          </h2>
        </div>
        <div ref={containerRef} className="tl-container">
          <div className="tl-track">
            <div ref={fillRef} className="tl-fill" />
          </div>
          {steps.map((step, i) => (
            <div
              key={step.num}
              ref={(el) => { stepRefs.current[i] = el; }}
              className="tl-step"
              data-testid={`step-hiw-${i}`}
            >
              <div style={{ fontFamily: FONT_MONO, fontSize: "clamp(28px, 5vw, 2rem)", fontWeight: 400, color: "inherit", opacity: 0.3 }}>{step.num} /</div>
              <div>
                <h3 style={{ fontFamily: FONT_BODY, fontSize: "clamp(14px, 2.5vw, 18px)", fontWeight: 500, color: "inherit", marginBottom: 4 }}>{step.title}</h3>
                <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(12px, 2vw, 14px)", color: "#999", transition: "color 0.6s ease" }}>{step.sub}</p>
              </div>
            </div>
          ))}
          <div ref={costRef} className="tl-cost" data-testid="text-cost-highlight">
            <p style={{ fontFamily: FONT_MONO, fontSize: "clamp(18px, 4vw, 32px)", fontWeight: 400 }}>Cost of onboarding: $1.50 per user</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterSection({ onEnter }: { onEnter: () => void }) {
  const obs = useInView();
  return (
    <footer className="flex flex-col items-center" style={{ padding: "3vh 5vw 4vh" }} data-testid="section-footer">
      <div ref={obs.ref} style={reveal(obs.visible)}>
        <p className="text-center" style={{ fontFamily: FONT_BODY, fontSize: "clamp(14px, 3vw, 18px)", color: "#000", marginBottom: 24 }} data-testid="text-footer-tagline">
          Built by an activist, for activists.
        </p>
      </div>
      <div style={reveal(obs.visible, 0.15)}>
        <button
          onClick={onEnter}
          className="landing-enter-btn"
          style={{ fontFamily: FONT_MONO, fontSize: "clamp(14px, 3vw, 16px)", fontWeight: 400, letterSpacing: "0.1em", padding: "16px 32px" }}
          data-testid="button-enter"
        >
          [ ENTER ]
        </button>
      </div>
    </footer>
  );
}

export default function Landing() {
  const [, setLocation] = useLocation();

  const handleEnter = useCallback(() => setLocation("/activation"), [setLocation]);

  return (
    <div className="relative" style={{ background: "#FFFFFF", minHeight: "100vh" }} data-testid="landing-page">
      <div
        className="fixed inset-0 pointer-events-none landing-grid-bg"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      />
      <GridGlow />
      <div className="relative" style={{ zIndex: 1 }}>
      <style>{`
        .landing-no-scrollbar::-webkit-scrollbar { display: none; }
        .landing-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .landing-enter-btn {
          background: #000; color: #fff; border: 1px solid #000; cursor: pointer; transition: all 0.2s ease;
        }
        .landing-enter-btn:hover, .landing-enter-btn:focus-visible {
          background: #fff; color: #000;
        }
        .landing-enter-btn:active { transform: scale(0.97); }
        .landing-hero-height { min-height: 70vh; min-height: 70dvh; }
        .landing-scroll-line {
          width: 2px; height: 60px; background: #000;
          animation: landing-scroll-pulse 2s ease-in-out infinite;
          transform-origin: top center;
        }
        @keyframes landing-scroll-pulse {
          0%, 100% { transform: scaleY(0.3); opacity: 0.3; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .tl-container {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 4rem;
          padding-left: 3rem;
          margin: 3rem 0 2rem;
        }
        .tl-track {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background: #E5E5E5;
        }
        .tl-fill {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 0%;
          background: #000;
          transition: height 0.1s linear;
        }
        .tl-step {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
          color: #ccc;
          transform: translateX(-10px);
          transition: all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .tl-step.tl-active {
          color: #000;
          transform: translateX(0);
        }
        .tl-step.tl-active p { color: #666 !important; }
        .tl-cost {
          border: 1px solid #E5E5E5;
          padding: 24px 20px;
          text-align: center;
          color: #000;
          background: #fff;
          transition: background 0.5s ease, color 0.5s ease, border-color 0.5s ease;
        }
        .tl-cost.tl-cost-active {
          background: #000 !important;
          color: #fff !important;
          border-color: #000 !important;
        }
        .tl-cost.tl-cost-active p {
          color: #fff !important;
        }
        .landing-blink { animation: landing-blink-kf 1s step-end infinite; }
        @keyframes landing-blink-kf {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .landing-grid-bg {
          animation: landing-grid-pulse 6s ease-in-out infinite;
        }
        @keyframes landing-grid-pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .landing-grid-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.03) 50%, transparent 100%);
          background-size: 100% 200px;
          animation: landing-grid-scan 8s linear infinite;
        }
        @keyframes landing-grid-scan {
          0% { background-position: 0 -200px; }
          100% { background-position: 0 calc(100vh + 200px); }
        }
        .landing-scroll-line-h {
          animation: landing-line-pulse 2.5s ease-in-out infinite;
        }
        @keyframes landing-line-pulse {
          0%, 100% { opacity: 0.3; transform: scaleX(0.6); transform-origin: left; }
          50% { opacity: 1; transform: scaleX(1); transform-origin: left; }
        }

        /* Card 0: Dollar → Bitcoin */
        .icon-dollar { opacity: 1; transition: opacity 0.1s; }
        .icon-bitcoin { opacity: 0; transform: scale(0.8); transform-origin: center; transition: opacity 0.35s cubic-bezier(0.2,0.8,0.2,1) 0.15s, transform 0.35s cubic-bezier(0.2,0.8,0.2,1) 0.15s, filter 0.35s ease 0.15s; }
        .module-card-0:hover .icon-dollar { animation: icon-glitch-out 0.4s ease-out forwards; }
        .module-card-0:hover .icon-bitcoin { opacity: 1; transform: scale(1); filter: drop-shadow(0 0 4px rgba(255,255,255,0.8)) drop-shadow(0 0 8px rgba(0,0,0,0.15)); }
        @keyframes icon-glitch-out {
          0% { opacity: 1; transform: translateX(0); }
          10% { opacity: 1; transform: translateX(-3px); }
          20% { opacity: 0.7; transform: translateX(4px); }
          30% { opacity: 1; transform: translateX(-2px); }
          40% { opacity: 0.4; transform: translateX(3px); }
          50% { opacity: 0.8; transform: translateX(-4px); }
          60% { opacity: 0.2; transform: translateX(2px); }
          70% { opacity: 0.5; transform: translateX(-1px); }
          80% { opacity: 0.1; transform: translateX(3px); }
          100% { opacity: 0; transform: translateX(0); }
        }

        /* Card 1: Eye → Stealth (erase eye) */
        .icon-eye-outer path { stroke-dasharray: 200; stroke-dashoffset: 0; transition: stroke-dashoffset 0.5s ease-out; }
        .icon-eye-pupil { transform-origin: center; transition: transform 0.5s ease-out, opacity 0.5s ease-out; }
        .module-card-1:hover .icon-eye-outer path { stroke-dashoffset: 200; }
        .module-card-1:hover .icon-eye-pupil { transform: scale(0.15); opacity: 0.2; }

        /* Card 2: Camera → Dot escapes */
        .icon-camera { transition: opacity 0.3s ease; }
        .icon-target-dot { transition: transform 0.35s cubic-bezier(0.2,0.8,0.2,1); }
        .module-card-2:hover .icon-camera { opacity: 0.15; animation: icon-jitter 0.15s linear 3; }
        .module-card-2:hover .icon-target-dot { transform: translate(20px, 15px); }
        @keyframes icon-jitter {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          75% { transform: translateX(2px); }
        }

        /* Card 3: Dashed → Solid + Packet */
        .icon-dashed-line { transition: stroke-dasharray 0.15s ease, stroke-width 0.15s ease; }
        .icon-packet { transition: transform 0.4s cubic-bezier(0.2,0.8,0.2,1) 0.1s, opacity 0.1s ease; }
        .module-card-3:hover .icon-dashed-line { stroke-dasharray: 100; stroke-width: 2; }
        .module-card-3:hover .icon-packet { opacity: 1; transform: translateX(28px); }

        /* Card 4: Arrow breaks wall */
        .icon-arrow-group { transition: transform 0.3s cubic-bezier(0.2,0.8,0.2,1); }
        .icon-wall { stroke-dasharray: none; transition: stroke-dasharray 0.15s ease 0.2s, stroke-dashoffset 0.15s ease 0.2s; }
        .module-card-4:hover .icon-arrow-group { transform: translateX(24px); }
        .module-card-4:hover .icon-wall { stroke-dasharray: 16 10 16; stroke-dashoffset: -14; }

        /* Card 5: Dots → Constellation */
        .module-icon-5 line { stroke-dasharray: 50; stroke-dashoffset: 50; transition: stroke-dashoffset 0.5s cubic-bezier(0.2,0.8,0.2,1); }
        .icon-line-b { transition-delay: 0.05s !important; }
        .icon-line-c { transition-delay: 0.1s !important; }
        .icon-line-d { transition-delay: 0.15s !important; }
        .icon-line-e { transition-delay: 0.2s !important; }
        .icon-line-f { transition-delay: 0.25s !important; }
        .module-card-5:hover .module-icon-5 line { stroke-dashoffset: 0; }

        /* Card 6: WiFi → NFC card */
        .icon-wifi { transition: opacity 0.25s ease, transform 0.25s ease; }
        .icon-nfc-card { opacity: 0; transform: translateY(16px); transition: opacity 0.3s cubic-bezier(0.2,0.8,0.2,1) 0.15s, transform 0.3s cubic-bezier(0.2,0.8,0.2,1) 0.15s; }
        .module-card-6:hover .icon-wifi { opacity: 0; transform: translateY(10px); }
        .module-card-6:hover .icon-nfc-card { opacity: 1; transform: translateY(0); }
      `}</style>

      <HeroSection />
      <ProblemSection />
      <ModulesSection />
      <HowItWorksSection />
      <FooterSection onEnter={handleEnter} />
      </div>

    </div>
  );
}
