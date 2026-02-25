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
  const obs = useInView(0.2);
  return (
    <section style={{ padding: "3vh 0" }} data-testid="section-problem">
      <div ref={obs.ref} style={{ maxWidth: 1000, margin: "0 auto", padding: "0 5vw" }}>
        <div className={`trap-infographic${obs.visible ? " trap-visible" : ""}`}>
          <div className="trap-header" data-testid="text-problem-stat">
            <p style={{ fontFamily: FONT_MONO, fontSize: "clamp(22px, 5vw, 40px)", fontWeight: 400, color: "#000", lineHeight: 1.3 }}>
              &gt; 60 countries actively censor the internet.
            </p>
          </div>
          <div className="trap-tree">
            <div className="trap-trunk" />
            <div className="trap-branch trap-branch-1" data-testid="text-problem-step2">
              <span className="trap-connector">├─</span>
              <span className="trap-label">Total surveillance</span>
            </div>
            <div className="trap-trunk trap-trunk-2" />
            <div className="trap-branch trap-branch-2" data-testid="text-problem-step3">
              <span className="trap-connector">└─</span>
              <span className="trap-label trap-label-box">Financial control</span>
            </div>
          </div>
          <div className="trap-conclusion" data-testid="text-problem-conclusion">
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
                      <line x1="32" y1="10" x2="32" y2="54" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M40 20c0-5-3.5-8-8-8s-8 3-8 8c0 10 16 6 16 16 0 5-3.5 8-8 8s-8-3-8-8" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                    <g className="icon-bitcoin">
                      <path d="M24 14v36M28 14v-2M36 14v-2M28 50v2M36 50v2M24 14h10c4.5 0 8 2.5 8 7s-3.5 7-8 7M24 28h12c4.5 0 8 2.5 8 8s-3.5 8-8 8H24M24 28h0" fill="none" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
          backgroundImage: "linear-gradient(rgba(0,0,0,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.07) 1px, transparent 1px)",
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
        /* Trap Infographic */
        .trap-infographic { position: relative; }
        .trap-header { opacity: 0; transform: translateY(16px); transition: opacity 0.6s cubic-bezier(0.2,0.8,0.2,1), transform 0.6s cubic-bezier(0.2,0.8,0.2,1); }
        .trap-tree { padding-left: 20px; position: relative; }
        .trap-trunk { width: 1px; background: #000; margin-left: 0; height: 0; transition: height 0.4s cubic-bezier(0.2,0.8,0.2,1); }
        .trap-trunk-2 { transition-delay: 0.8s; }
        .trap-branch { display: flex; align-items: center; gap: 8px; opacity: 0; transform: translateX(-8px); transition: opacity 0.15s ease, transform 0.25s cubic-bezier(0.2,0.8,0.2,1); font-family: 'JetBrains Mono', monospace; font-size: clamp(14px, 3vw, 20px); color: #000; }
        .trap-branch-1 { transition-delay: 0.8s; }
        .trap-branch-2 { transition-delay: 1.6s; }
        .trap-connector { opacity: 0.4; white-space: pre; }
        .trap-label { display: inline-block; }
        .trap-label-box { padding: 4px 12px; border: 1px solid transparent; transition: border-color 0.15s ease 2.0s, background 0.1s ease 2.0s, color 0.1s ease 2.0s; }
        .trap-conclusion { opacity: 0; transform: translateY(12px); transition: opacity 0.6s cubic-bezier(0.2,0.8,0.2,1) 2.4s, transform 0.6s cubic-bezier(0.2,0.8,0.2,1) 2.4s; margin-top: 32px; border: 1px solid #E5E5E5; padding: 24px; }

        .trap-visible .trap-header { opacity: 1; transform: translateY(0); }
        .trap-visible .trap-trunk { height: 32px; transition-delay: 0.4s; }
        .trap-visible .trap-trunk-2 { height: 32px; transition-delay: 1.2s; }
        .trap-visible .trap-branch-1 { opacity: 1; transform: translateX(0); }
        .trap-visible .trap-branch-2 { opacity: 1; transform: translateX(0); }
        .trap-visible .trap-label-box { border-color: #000; animation: trap-flash 0.3s ease 2.0s 1; }
        .trap-visible .trap-conclusion { opacity: 1; transform: translateY(0); }

        @keyframes trap-flash {
          0% { background: transparent; color: #000; }
          33% { background: #000; color: #fff; }
          66% { background: #000; color: #fff; }
          100% { background: transparent; color: #000; }
        }

        .landing-scroll-arrow {
          animation: landing-arrow-bounce 1.5s ease-in-out infinite;
        }
        @keyframes landing-arrow-bounce {
          0%, 100% { transform: translateX(0); opacity: 0.5; }
          50% { transform: translateX(6px); opacity: 1; }
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

      {showFog && <FogOverlay onDone={handleFogDone} />}
    </div>
  );
}
