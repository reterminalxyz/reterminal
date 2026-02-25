import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

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
      <span style={{ color: "#B87333" }}>re</span>
      {showSep ? (
        <span style={{ color: "#00e5ff", textShadow: "0 0 6px #00e5ff, 0 0 15px rgba(0,229,255,0.3)" }}>{glyph}</span>
      ) : (
        <span className="landing-blink" style={{ color: "#B87333" }}>_</span>
      )}
      <span style={{ color: "#B87333" }}>terminal</span>
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
  const s1 = useInView();
  const s2 = useInView();
  const s3 = useInView();
  const s4 = useInView();
  return (
    <section style={{ padding: "3vh 0" }} data-testid="section-problem">
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 5vw" }}>
        <div ref={s1.ref} style={reveal(s1.visible)}>
          <p style={{ fontFamily: FONT_MONO, fontSize: "clamp(22px, 5vw, 40px)", fontWeight: 400, color: "#000", lineHeight: 1.3, marginBottom: 32 }} data-testid="text-problem-stat">
            &gt; 60 countries actively censor the internet.
          </p>
        </div>
        <div ref={s2.ref} className="mb-3" style={reveal(s2.visible)}>
          <p style={{ fontFamily: FONT_MONO, fontSize: "clamp(14px, 3vw, 20px)", color: "#000", paddingLeft: 16 }} data-testid="text-problem-step2">→ Total surveillance</p>
        </div>
        <div ref={s3.ref} className="mb-8" style={reveal(s3.visible)}>
          <p style={{ fontFamily: FONT_MONO, fontSize: "clamp(14px, 3vw, 20px)", color: "#000", paddingLeft: 16 }} data-testid="text-problem-step3">→ Financial control</p>
        </div>
        <div ref={s4.ref} style={reveal(s4.visible)}>
          <div style={{ border: BORDER, padding: 24 }} data-testid="text-problem-conclusion">
            <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(14px, 3vw, 18px)", color: "#000" }}>Education must be holistic, not piecemeal.</p>
          </div>
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
          Modules<span className="landing-blink" style={{ color: "#B87333" }}>_</span>
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
              className={i === 0 ? "module-card-first" : ""}
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
              {i === 0 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                  <svg viewBox="0 0 64 64" width="256" height="256" style={{ overflow: "visible" }}>
                    <g className="icon-dollar">
                      <path d="M32 8v48M24 18c0-4 3.5-7 8-7s8 3 8 7c0 5-8 5.5-8 11h0c0 5.5 8 6 8 11 0 4-3.5 7-8 7s-8-3-8-7" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <g className="icon-bitcoin">
                      <path d="M22 16h10c5 0 9 2 9 7s-3 6.5-3 6.5S42 31 42 36c0 5-4 8-9 8H22M22 16v28M22 30h10M26 12v4M34 12v4M26 44v4M34 44v4" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </svg>
                </div>
              )}
              <p style={{ fontFamily: FONT_MONO, fontSize: "clamp(16px, 4vw, 22px)", fontWeight: 400, color: "#000" }}>{mod.title}</p>
            </div>
          ))}
        </div>
        <div
          className="absolute right-0 top-0 bottom-4 pointer-events-none flex items-center"
          style={{ width: 70, background: "linear-gradient(to right, transparent, #FFFFFF 70%)" }}
        >
          <span className="landing-scroll-arrow" style={{ fontFamily: FONT_MONO, fontSize: 28, color: "#000", marginLeft: "auto", marginRight: 12 }}>→</span>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const obs = useInView();
  const steps = [
    { num: "01", title: "Tap Physical Object", sub: "Card / Figure / Sticker" },
    { num: "02", title: "Learn & Earn", sub: "Gamified modules → Earn Sats" },
    { num: "03", title: "Peer-to-Peer Growth", sub: "Share cards → Network expands" },
  ];
  return (
    <section style={{ padding: "2vh 0" }} data-testid="section-howitworks">
      <div ref={obs.ref} style={{ maxWidth: 1000, margin: "0 auto", padding: "0 5vw" }}>
        <h2 style={{ fontFamily: FONT_MONO, fontSize: "clamp(20px, 4vw, 32px)", fontWeight: 400, color: "#000", marginBottom: 32, ...reveal(obs.visible) }} data-testid="text-hiw-title">
          Deployment Mechanics
        </h2>
        <div className="landing-steps-grid" style={reveal(obs.visible, 0.15)}>
          {steps.map((step, i) => (
            <div key={step.num} data-testid={`step-hiw-${i}`}>
              <p style={{ fontFamily: FONT_MONO, fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 400, color: "#E5E5E5", marginBottom: 12 }}>{step.num} /</p>
              <h3 style={{ fontFamily: FONT_MONO, fontSize: "clamp(14px, 2.5vw, 18px)", fontWeight: 400, color: "#000", marginBottom: 6 }}>{step.title}</h3>
              <p style={{ fontFamily: FONT_BODY, fontSize: "clamp(12px, 2vw, 14px)", color: "#666" }}>{step.sub}</p>
            </div>
          ))}
        </div>
        <div style={{ border: BORDER, padding: "24px 20px", textAlign: "center", marginTop: 32, ...reveal(obs.visible, 0.3) }} data-testid="text-cost-highlight">
          <p style={{ fontFamily: FONT_MONO, fontSize: "clamp(18px, 4vw, 32px)", fontWeight: 400, color: "#000" }}>Cost of onboarding: $1.50 per user</p>
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

function DigitalFogCanvas({ onFirstTouch }: { onFirstTouch: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fogCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const clearedAreasRef = useRef<Array<{ x: number; y: number; radius: number; opacity: number; time: number }>>([]);
  const [hintVisible, setHintVisible] = useState(true);
  const touchedRef = useRef(false);

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
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fogCanvas.width = w * dpr; fogCanvas.height = h * dpr;
      fogCanvas.style.width = w + "px"; fogCanvas.style.height = h + "px";
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
      for (let i = 0; i < data.length; i += 12) {
        const noise = Math.random() * 55;
        data[i] = 26 + noise; data[i + 1] = 26 + noise; data[i + 2] = 26 + noise;
      }
      fogCtx.putImageData(imageData, 0, 0);

      const areas = clearedAreasRef.current;
      if (areas.length > 0) {
        fogCtx.globalCompositeOperation = "destination-out";
        for (const area of areas) {
          const age = time - area.time;
          let alpha = area.opacity;
          if (age > 4000) alpha = Math.max(0, area.opacity * (1 - (age - 4000) / 3000));
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
        clearedAreasRef.current = areas.filter(a => (time - a.time) < 7000);
      }
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(fogCanvas, 0, 0, w, h);
    };

    const animate = (time: number) => {
      if (time - lastTimeRef.current > 50) { drawNoise(time); lastTimeRef.current = time; }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize); };
  }, []);

  const triggerFirstTouch = useCallback(() => {
    if (!touchedRef.current) { touchedRef.current = true; setHintVisible(false); onFirstTouch(); }
  }, [onFirstTouch]);

  const addClear = useCallback((x: number, y: number) => {
    clearedAreasRef.current.push({ x, y, radius: 70, opacity: 0.95, time: performance.now() });
  }, []);

  return (
    <>
      <canvas ref={fogCanvasRef} className="hidden" />
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-[310]"
        style={{ touchAction: "none" }}
        onMouseMove={(e) => { if (touchedRef.current) addClear(e.clientX, e.clientY); }}
        onTouchMove={(e) => { const t = e.touches[0]; if (t) addClear(t.clientX, t.clientY); }}
        onTouchStart={(e) => { triggerFirstTouch(); const t = e.touches[0]; if (t) addClear(t.clientX, t.clientY); }}
        onClick={(e) => { triggerFirstTouch(); addClear(e.clientX, e.clientY); }}
        data-testid="fog-canvas"
      />
      {hintVisible && (
        <div className="fixed inset-0 z-[320] flex items-center justify-center pointer-events-none" data-testid="text-hint">
          <span className="font-mono text-[11px] tracking-[2px] landing-blink" style={{ color: "#D97D45", textShadow: "0 0 8px rgba(217,125,69,0.4)" }}>
            CLEAR THE FOG TO REVEAL THE SIGNAL<span className="landing-blink">_</span>
          </span>
        </div>
      )}
    </>
  );
}

const MANIFESTO = "The internet has become a digital panopticon. re_terminal is the breach. Post-privacy is our current reality. Offline hardware. Stateless money. Direct signal. Reclaim your digital sovereignty.";
const COPPER_START = MANIFESTO.indexOf("re_terminal");
const COPPER_END = MANIFESTO.indexOf("the breach.") + "the breach.".length;
const BLINK_POS = COPPER_START + 2;

function ManifestoTypewriter({ started, onComplete }: { started: boolean; onComplete?: () => void }) {
  const [charIndex, setCharIndex] = useState(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setCharIndex(i);
      if (i >= MANIFESTO.length) {
        clearInterval(interval);
        if (!completedRef.current) { completedRef.current = true; onComplete?.(); }
      }
    }, 12);
    return () => clearInterval(interval);
  }, [started, onComplete]);

  if (!started) return null;
  const len = charIndex;
  const done = len >= MANIFESTO.length;
  const before = MANIFESTO.slice(0, Math.min(len, COPPER_START));
  const copper = len > COPPER_START ? MANIFESTO.slice(COPPER_START, Math.min(len, COPPER_END)) : "";
  const after = len > COPPER_END ? MANIFESTO.slice(COPPER_END, len) : "";

  const renderCopper = (text: string) => {
    if (!text) return null;
    const bp = BLINK_POS - COPPER_START;
    if (text.length <= bp) return <span style={{ color: "#D97D45" }}>{text}</span>;
    return (
      <span style={{ color: "#D97D45" }}>
        {text.slice(0, bp)}<span className="landing-blink">{text[bp]}</span>{text.slice(bp + 1)}
      </span>
    );
  };

  return (
    <div className="font-mono text-center" style={{ fontSize: 13, lineHeight: 2.2, letterSpacing: "0.5px", color: "#999" }} data-testid="text-manifesto">
      {before}{renderCopper(copper)}{after}
      {!done && <span className="landing-blink" style={{ color: "#999" }}>|</span>}
    </div>
  );
}

function FullscreenGlitch({ onComplete }: { onComplete: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let frame = 0;
    const total = 25;
    let animId: number;
    const draw = () => {
      frame++;
      const p = frame / total;
      const v = Math.floor(245 * p + 13 * (1 - p));
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < 20 + Math.floor(p * 25); i++) {
        const y = Math.random() * canvas.height;
        const h = 1 + Math.random() * (5 + p * 10);
        const off = (Math.random() - 0.5) * (30 + p * 80);
        ctx.fillStyle = Math.random() > 0.6
          ? `rgba(0,229,255,${0.08 + Math.random() * 0.2})`
          : `rgba(184,115,51,${0.05 + Math.random() * 0.15})`;
        ctx.fillRect(off, y, canvas.width, h);
      }
      for (let i = 0; i < Math.floor(p * 40); i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillStyle = Math.random() > 0.5
          ? `rgba(0,229,255,${Math.random() * 0.3})`
          : `rgba(184,115,51,${Math.random() * 0.2})`;
        ctx.fillRect(x, y, 2 + Math.random() * 50, 1 + Math.random() * 4);
      }
      if (frame < total) animId = requestAnimationFrame(draw);
      else onComplete();
    };
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [onComplete]);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 z-[400]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: 1.0, times: [0, 0.1, 0.65, 1] }}
    />
  );
}

type OverlayPhase = "fog" | "glitch" | "done";

function FogOverlay({ onDone }: { onDone: () => void }) {
  const [typingStarted, setTypingStarted] = useState(false);
  const [phase, setPhase] = useState<OverlayPhase>("fog");

  const handleFirstTouch = useCallback(() => setTypingStarted(true), []);
  const handleManifestoComplete = useCallback(() => { setTimeout(() => setPhase("glitch"), 1000); }, []);
  const handleGlitchComplete = useCallback(() => { setPhase("done"); onDone(); }, [onDone]);

  return (
    <div className="fixed inset-0 z-[300]" data-testid="fog-overlay">
      <AnimatePresence>
        {phase === "glitch" && <FullscreenGlitch onComplete={handleGlitchComplete} />}
      </AnimatePresence>

      {phase !== "done" && (
        <>
          <div className="fixed inset-0 z-[300]" style={{ background: "linear-gradient(145deg, #2d1e12 0%, #241810 15%, #1a110a 35%, #110c07 60%, #0D0D0D 100%)" }}>
            <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(184,115,51,0.25) 0%, rgba(160,100,45,0.12) 30%, rgba(100,65,30,0.05) 55%, transparent 75%)" }} />
            <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(184,115,51,0.03) 1px, rgba(184,115,51,0.03) 2px)" }} />
          </div>

          <div className="fixed inset-0 z-[305] flex items-center justify-center px-8">
            <div className="w-full max-w-[400px]">
              <ManifestoTypewriter started={typingStarted} onComplete={handleManifestoComplete} />
            </div>
          </div>

          <DigitalFogCanvas onFirstTouch={handleFirstTouch} />
        </>
      )}
    </div>
  );
}

export default function Landing() {
  const [showFog, setShowFog] = useState(false);
  const [, setLocation] = useLocation();

  const handleEnter = useCallback(() => setShowFog(true), []);
  const handleFogDone = useCallback(() => setLocation("/activation"), [setLocation]);

  return (
    <div className="relative" style={{ background: "#FFFFFF", minHeight: "100vh" }} data-testid="landing-page">
      <div
        className="fixed inset-0 pointer-events-none landing-grid-bg"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          zIndex: 0,
        }}
      />
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
        .landing-hero-height { min-height: 100vh; min-height: 100dvh; }
        .landing-scroll-line {
          width: 2px; height: 60px; background: #000;
          animation: landing-scroll-pulse 2s ease-in-out infinite;
          transform-origin: top center;
        }
        @keyframes landing-scroll-pulse {
          0%, 100% { transform: scaleY(0.3); opacity: 0.3; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .landing-steps-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }
        @media (min-width: 640px) {
          .landing-steps-grid { grid-template-columns: repeat(3, 1fr); }
        }
        .landing-blink { animation: landing-blink-kf 1s step-end infinite; }
        @keyframes landing-blink-kf {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .landing-grid-bg {
          animation: landing-grid-pulse 4s ease-in-out infinite;
        }
        @keyframes landing-grid-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .landing-scroll-arrow {
          animation: landing-arrow-bounce 1.5s ease-in-out infinite;
        }
        @keyframes landing-arrow-bounce {
          0%, 100% { transform: translateX(0); opacity: 0.5; }
          50% { transform: translateX(6px); opacity: 1; }
        }

        .icon-dollar {
          opacity: 1;
          transition: opacity 0.1s;
        }
        .icon-bitcoin {
          opacity: 0;
          transform: scale(0.8);
          transform-origin: center;
          transition: opacity 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) 0.15s, filter 0.35s ease 0.15s;
        }
        .module-card-first:hover .icon-dollar {
          animation: icon-glitch-out 0.4s ease-out forwards;
        }
        .module-card-first:hover .icon-bitcoin {
          opacity: 1;
          transform: scale(1);
          filter: drop-shadow(0 0 4px rgba(255,255,255,0.8)) drop-shadow(0 0 8px rgba(0,0,0,0.15));
        }
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
      `}</style>

      <HeroSection />
      <ProblemSection />
      <ModulesSection />
      <HowItWorksSection />
      <FooterSection onEnter={handleEnter} />
      </div>

      {showFog && <FogOverlay onDone={handleFogDone} />}
    </div>
  );
}
