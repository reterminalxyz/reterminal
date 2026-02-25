import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";

function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.15, ...options });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

const REVEAL_STYLE = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(32px)",
  transition: `opacity 0.9s cubic-bezier(0.19, 1, 0.22, 1) ${delay}s, transform 0.9s cubic-bezier(0.19, 1, 0.22, 1) ${delay}s`,
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

function HeroSection() {
  const obs = useInView();

  return (
    <section
      ref={obs.ref}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      data-testid="section-hero"
    >
      <div style={REVEAL_STYLE(obs.visible, 0)}>
        <h1
          className="font-mono font-bold tracking-[0.15em] text-center"
          style={{ fontSize: "clamp(28px, 8vw, 48px)", color: "#000" }}
          data-testid="text-hero-title"
        >
          re_terminal
        </h1>
      </div>

      <div style={REVEAL_STYLE(obs.visible, 0.15)}>
        <p
          className="mt-3 text-center"
          style={{ fontSize: "clamp(14px, 3.5vw, 18px)", color: "#333", fontFamily: "Inter, system-ui, sans-serif" }}
          data-testid="text-hero-subtitle"
        >
          digital resistance starts here.
        </p>
      </div>

      <div
        className="mt-10 w-full"
        style={{ maxWidth: 560, ...REVEAL_STYLE(obs.visible, 0.3) }}
      >
        <div
          className="relative w-full overflow-hidden"
          style={{ paddingBottom: "56.25%", border: "1px solid #000" }}
          data-testid="video-container"
        >
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

      <div style={REVEAL_STYLE(obs.visible, 0.5)}>
        <p
          className="mt-6 text-center font-mono"
          style={{ fontSize: "clamp(11px, 2.8vw, 14px)", color: "#333", letterSpacing: "0.03em" }}
          data-testid="text-hero-oneliner"
        >
          Gamified phygital terminal for digital resistance education.
        </p>
      </div>
    </section>
  );
}

function ProblemSection() {
  const s1 = useInView();
  const s2 = useInView();
  const s3 = useInView();
  const s3b = useInView();
  const s4 = useInView();

  return (
    <section className="px-6 py-20 max-w-[640px] mx-auto" data-testid="section-problem">
      <div ref={s1.ref} style={REVEAL_STYLE(s1.visible)}>
        <h2
          className="font-mono font-bold tracking-[0.08em] mb-16"
          style={{ fontSize: "clamp(18px, 5vw, 28px)", color: "#000" }}
          data-testid="text-problem-title"
        >
          The Surveillance Trap
        </h2>
      </div>

      <div ref={s2.ref} className="mb-10" style={REVEAL_STYLE(s2.visible)}>
        <p
          className="font-bold leading-snug"
          style={{ fontSize: "clamp(20px, 5.5vw, 32px)", color: "#000" }}
          data-testid="text-problem-stat"
        >
          &gt; 60 countries actively censor the internet.
        </p>
      </div>

      <div ref={s3.ref} className="mb-6 ml-4" style={REVEAL_STYLE(s3.visible)}>
        <p
          className="font-mono"
          style={{ fontSize: "clamp(14px, 3.5vw, 20px)", color: "#333" }}
          data-testid="text-problem-step2"
        >
          → Total surveillance
        </p>
      </div>

      <div ref={s3b.ref} className="mb-16 ml-4" style={REVEAL_STYLE(s3b.visible)}>
        <p
          className="font-mono"
          style={{ fontSize: "clamp(14px, 3.5vw, 20px)", color: "#333" }}
          data-testid="text-problem-step3"
        >
          → Financial control
        </p>
      </div>

      <div ref={s4.ref} style={REVEAL_STYLE(s4.visible)}>
        <p
          className="font-mono italic"
          style={{
            fontSize: "clamp(13px, 3.2vw, 17px)",
            color: "#000",
            borderLeft: "2px solid #E0E0E0",
            paddingLeft: 16,
          }}
          data-testid="text-problem-conclusion"
        >
          Education must be holistic, not piecemeal.
        </p>
      </div>
    </section>
  );
}

function ModulesSection() {
  const obs = useInView();

  return (
    <section className="py-20" data-testid="section-modules">
      <div ref={obs.ref} className="px-6 max-w-[640px] mx-auto mb-8" style={REVEAL_STYLE(obs.visible)}>
        <h2
          className="font-mono font-bold tracking-[0.08em]"
          style={{ fontSize: "clamp(18px, 5vw, 28px)", color: "#000" }}
          data-testid="text-modules-title"
        >
          Curriculum_
        </h2>
      </div>

      <div
        className="landing-no-scrollbar flex gap-4 px-6 pb-4 overflow-x-auto"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
        data-testid="modules-carousel"
      >
        {MODULES.map((mod, i) => (
          <div
            key={mod.title}
            className="flex-shrink-0 flex flex-col justify-between p-5"
            style={{
              width: "clamp(200px, 45vw, 240px)",
              height: "clamp(200px, 45vw, 240px)",
              border: "1px solid #E0E0E0",
              scrollSnapAlign: "start",
              ...REVEAL_STYLE(obs.visible, 0.08 * i),
            }}
            data-testid={`card-module-${i}`}
          >
            <span
              className="font-mono text-[10px] tracking-[0.1em] px-2 py-1 self-start"
              style={mod.done
                ? { background: "#000", color: "#fff" }
                : { background: "#F5F5F5", color: "#999", border: "1px solid #E0E0E0" }
              }
              data-testid={`badge-module-${i}`}
            >
              {mod.badge}
            </span>
            <p
              className="font-mono font-bold"
              style={{ fontSize: "clamp(13px, 3.2vw, 16px)", color: "#000" }}
            >
              {mod.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const obs = useInView();

  const steps = [
    { title: "Tap Physical Object", sub: "Card / Figure / Sticker", icon: "tap" },
    { title: "Learn & Earn", sub: "Gamified modules → Earn Sats", icon: "learn" },
    { title: "Peer-to-Peer Growth", sub: "Share cards → Network expands", icon: "share" },
  ];

  return (
    <section className="px-6 py-20 max-w-[640px] mx-auto" data-testid="section-howitworks">
      <div ref={obs.ref} style={REVEAL_STYLE(obs.visible)}>
        <h2
          className="font-mono font-bold tracking-[0.08em] mb-16"
          style={{ fontSize: "clamp(18px, 5vw, 28px)", color: "#000" }}
          data-testid="text-hiw-title"
        >
          Deployment Mechanics
        </h2>
      </div>

      <div className="flex flex-col md:flex-row md:items-start md:gap-0 gap-0 relative">
        <div
          className="hidden md:block absolute top-[28px] left-[16.66%] right-[16.66%]"
          style={{ height: 1, background: "#E0E0E0" }}
        />
        <div
          className="md:hidden absolute top-0 bottom-0 left-[20px]"
          style={{ width: 1, background: "#E0E0E0" }}
        />

        {steps.map((step, i) => (
          <div
            key={step.title}
            className="flex-1 relative pl-12 md:pl-0 pb-12 md:pb-0 md:text-center md:px-4"
            style={REVEAL_STYLE(obs.visible, 0.15 * i)}
            data-testid={`step-hiw-${i}`}
          >
            <div
              className="absolute md:relative left-[12px] md:left-auto top-0 md:mx-auto w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center z-10"
              style={{ borderColor: "#000", background: "#fff" }}
            >
              <div className="w-[6px] h-[6px] rounded-full" style={{ background: "#000" }} />
            </div>

            <h3
              className="font-mono font-bold mt-0 md:mt-4"
              style={{ fontSize: "clamp(13px, 3.2vw, 16px)", color: "#000" }}
            >
              {step.title}
            </h3>
            <p
              className="mt-1"
              style={{ fontSize: "clamp(11px, 2.8vw, 13px)", color: "#333" }}
            >
              {step.sub}
            </p>
          </div>
        ))}
      </div>

      <div
        className="mt-16 py-6 text-center font-mono font-bold"
        style={{
          fontSize: "clamp(16px, 4.5vw, 24px)",
          color: "#000",
          border: "1px solid #000",
          letterSpacing: "0.03em",
          ...REVEAL_STYLE(obs.visible, 0.5),
        }}
        data-testid="text-cost-highlight"
      >
        Cost of onboarding: $1.50 per user
      </div>
    </section>
  );
}

function FooterSection() {
  const obs = useInView();
  const [, setLocation] = useLocation();

  const handleEnter = useCallback(() => {
    setLocation("/activation");
  }, [setLocation]);

  return (
    <footer className="px-6 py-20 flex flex-col items-center" data-testid="section-footer">
      <div ref={obs.ref} style={REVEAL_STYLE(obs.visible)}>
        <p
          className="text-center mb-10"
          style={{ fontSize: "clamp(13px, 3.2vw, 16px)", color: "#333", fontFamily: "Inter, system-ui, sans-serif" }}
          data-testid="text-footer-tagline"
        >
          Built by an activist, for activists.
        </p>
      </div>

      <div style={REVEAL_STYLE(obs.visible, 0.15)}>
        <button
          onClick={handleEnter}
          className="landing-enter-btn font-mono font-bold tracking-[0.15em] px-10 py-4 transition-all duration-200"
          style={{ fontSize: "clamp(13px, 3.2vw, 16px)" }}
          data-testid="button-enter"
        >
          [ ENTER ]
        </button>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#FFFFFF" }}
      data-testid="landing-page"
    >
      <style>{`
        .landing-no-scrollbar::-webkit-scrollbar { display: none; }
        .landing-enter-btn {
          background: #000;
          color: #fff;
          border: 2px solid #000;
        }
        .landing-enter-btn:hover,
        .landing-enter-btn:focus-visible {
          background: #fff;
          color: #000;
        }
        .landing-enter-btn:active {
          transform: scale(0.97);
        }
      `}</style>
      <HeroSection />
      <ProblemSection />
      <ModulesSection />
      <HowItWorksSection />
      <FooterSection />
    </div>
  );
}
