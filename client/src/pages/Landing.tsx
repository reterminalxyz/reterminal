import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation } from "wouter";

const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_BODY = "'Inter', system-ui, sans-serif";
const BORDER = "1px solid #E5E5E5";
const EASE = "cubic-bezier(0.19, 1, 0.22, 1)";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

const reveal = (visible: boolean, delay = 0): React.CSSProperties => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(28px)",
  transition: `opacity 0.9s ${EASE} ${delay}s, transform 0.9s ${EASE} ${delay}s`,
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
      className="relative flex flex-col items-center justify-center landing-hero-height"
      data-testid="section-hero"
    >
      <div className="w-full" style={{ maxWidth: 1000, margin: "0 auto", padding: "0 5vw" }}>
        <div className="flex flex-col items-center">
          <div style={reveal(obs.visible, 0)}>
            <h1
              className="text-center"
              style={{
                fontFamily: FONT_MONO,
                fontSize: "clamp(32px, 8vw, 64px)",
                fontWeight: 400,
                letterSpacing: "0.08em",
                color: "#000",
              }}
              data-testid="text-hero-title"
            >
              re_terminal
            </h1>
          </div>

          <div style={reveal(obs.visible, 0.15)}>
            <p
              className="mt-4 text-center"
              style={{
                fontFamily: FONT_BODY,
                fontSize: "clamp(14px, 3vw, 18px)",
                fontWeight: 400,
                color: "#000",
              }}
              data-testid="text-hero-subtitle"
            >
              digital resistance starts here.
            </p>
          </div>

          <div
            className="mt-10 w-full"
            style={{ maxWidth: 800, ...reveal(obs.visible, 0.3) }}
          >
            <div
              className="relative w-full"
              style={{ paddingBottom: "56.25%", border: BORDER }}
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
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 flex flex-col items-center"
        style={{ transform: "translateX(-50%)", ...reveal(obs.visible, 0.6) }}
        data-testid="scroll-indicator"
      >
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 10,
            letterSpacing: "0.2em",
            color: "#000",
            marginBottom: 8,
          }}
        >
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
    <section style={{ padding: "15vh 0" }} data-testid="section-problem">
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 5vw" }}>
        <div ref={s1.ref} style={reveal(s1.visible)}>
          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: "clamp(22px, 5vw, 40px)",
              fontWeight: 400,
              color: "#000",
              lineHeight: 1.3,
              marginBottom: 48,
            }}
            data-testid="text-problem-stat"
          >
            &gt; 60 countries actively censor the internet.
          </p>
        </div>

        <div ref={s2.ref} className="mb-4" style={reveal(s2.visible)}>
          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: "clamp(14px, 3vw, 20px)",
              color: "#000",
              paddingLeft: 16,
            }}
            data-testid="text-problem-step2"
          >
            → Total surveillance
          </p>
        </div>

        <div ref={s3.ref} className="mb-12" style={reveal(s3.visible)}>
          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: "clamp(14px, 3vw, 20px)",
              color: "#000",
              paddingLeft: 16,
            }}
            data-testid="text-problem-step3"
          >
            → Financial control
          </p>
        </div>

        <div ref={s4.ref} style={reveal(s4.visible)}>
          <div
            style={{
              border: BORDER,
              padding: 24,
            }}
            data-testid="text-problem-conclusion"
          >
            <p
              style={{
                fontFamily: FONT_BODY,
                fontSize: "clamp(14px, 3vw, 18px)",
                fontWeight: 400,
                color: "#000",
              }}
            >
              Education must be holistic, not piecemeal.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ModulesSection() {
  const obs = useInView();

  return (
    <section style={{ padding: "10vh 0" }} data-testid="section-modules">
      <div
        ref={obs.ref}
        style={{ maxWidth: 1000, margin: "0 auto", padding: "0 5vw", marginBottom: 32, ...reveal(obs.visible) }}
      >
        <h2
          style={{
            fontFamily: FONT_MONO,
            fontSize: "clamp(20px, 4vw, 32px)",
            fontWeight: 400,
            color: "#000",
          }}
          data-testid="text-modules-title"
        >
          Curriculum_
        </h2>
      </div>

      <div
        className="landing-no-scrollbar"
        style={{
          display: "flex",
          gap: 24,
          overflowX: "auto",
          paddingLeft: "5vw",
          paddingRight: "20vw",
          paddingBottom: 16,
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
        }}
        data-testid="modules-carousel"
      >
        {MODULES.map((mod, i) => (
          <div
            key={mod.title}
            style={{
              flexShrink: 0,
              width: 300,
              height: 300,
              border: BORDER,
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              scrollSnapAlign: "start",
              background: "#fff",
              ...reveal(obs.visible, 0.06 * i),
            }}
            data-testid={`card-module-${i}`}
          >
            <span
              style={{
                fontFamily: FONT_MONO,
                fontSize: 10,
                letterSpacing: "0.1em",
                padding: "4px 8px",
                alignSelf: "flex-start",
                ...(mod.done
                  ? { background: "#000", color: "#fff" }
                  : { border: BORDER, color: "#999" }),
              }}
              data-testid={`badge-module-${i}`}
            >
              {mod.badge}
            </span>
            <p
              style={{
                fontFamily: FONT_MONO,
                fontSize: 16,
                fontWeight: 400,
                color: "#000",
              }}
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
    { num: "01", title: "Tap Physical Object", sub: "Card / Figure / Sticker" },
    { num: "02", title: "Learn & Earn", sub: "Gamified modules → Earn Sats" },
    { num: "03", title: "Peer-to-Peer Growth", sub: "Share cards → Network expands" },
  ];

  return (
    <section style={{ padding: "12vh 0" }} data-testid="section-howitworks">
      <div ref={obs.ref} style={{ maxWidth: 1000, margin: "0 auto", padding: "0 5vw" }}>
        <h2
          style={{
            fontFamily: FONT_MONO,
            fontSize: "clamp(20px, 4vw, 32px)",
            fontWeight: 400,
            color: "#000",
            marginBottom: 64,
            ...reveal(obs.visible),
          }}
          data-testid="text-hiw-title"
        >
          Deployment Mechanics
        </h2>

        <div
          className="landing-steps-grid"
          style={reveal(obs.visible, 0.15)}
        >
          {steps.map((step, i) => (
            <div key={step.num} data-testid={`step-hiw-${i}`}>
              <p
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "clamp(28px, 5vw, 48px)",
                  fontWeight: 400,
                  color: "#E5E5E5",
                  marginBottom: 16,
                }}
              >
                {step.num} /
              </p>
              <h3
                style={{
                  fontFamily: FONT_MONO,
                  fontSize: "clamp(14px, 2.5vw, 18px)",
                  fontWeight: 400,
                  color: "#000",
                  marginBottom: 8,
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: "clamp(12px, 2vw, 14px)",
                  color: "#666",
                }}
              >
                {step.sub}
              </p>
            </div>
          ))}
        </div>

        <div
          style={{
            border: BORDER,
            padding: "28px 24px",
            textAlign: "center",
            marginTop: 64,
            ...reveal(obs.visible, 0.3),
          }}
          data-testid="text-cost-highlight"
        >
          <p
            style={{
              fontFamily: FONT_MONO,
              fontSize: "clamp(18px, 4vw, 32px)",
              fontWeight: 400,
              color: "#000",
            }}
          >
            Cost of onboarding: $1.50 per user
          </p>
        </div>
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
    <footer
      className="flex flex-col items-center"
      style={{ padding: "15vh 5vw 8vh" }}
      data-testid="section-footer"
    >
      <div ref={obs.ref} style={reveal(obs.visible)}>
        <p
          className="text-center"
          style={{
            fontFamily: FONT_BODY,
            fontSize: "clamp(14px, 3vw, 18px)",
            fontWeight: 400,
            color: "#000",
            marginBottom: 48,
          }}
          data-testid="text-footer-tagline"
        >
          Built by an activist, for activists.
        </p>
      </div>

      <div style={reveal(obs.visible, 0.15)}>
        <button
          onClick={handleEnter}
          className="landing-enter-btn"
          style={{
            fontFamily: FONT_MONO,
            fontSize: "clamp(14px, 3vw, 16px)",
            fontWeight: 400,
            letterSpacing: "0.1em",
            padding: "16px 32px",
          }}
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
      style={{ background: "#FFFFFF", minHeight: "100vh" }}
      data-testid="landing-page"
    >
      <style>{`
        .landing-no-scrollbar::-webkit-scrollbar { display: none; }
        .landing-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        .landing-enter-btn {
          background: #000;
          color: #fff;
          border: 1px solid #000;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .landing-enter-btn:hover,
        .landing-enter-btn:focus-visible {
          background: #fff;
          color: #000;
        }
        .landing-enter-btn:active {
          transform: scale(0.97);
        }

        .landing-hero-height {
          min-height: 100vh;
          min-height: 100dvh;
        }
        .landing-scroll-line {
          width: 1px;
          height: 40px;
          background: #000;
          animation: landing-scroll-pulse 2s ease-in-out infinite;
          transform-origin: top center;
        }
        @keyframes landing-scroll-pulse {
          0%, 100% { transform: scaleY(0.3); opacity: 0.3; }
          50% { transform: scaleY(1); opacity: 1; }
        }

        .landing-steps-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
        }
        @media (min-width: 640px) {
          .landing-steps-grid {
            grid-template-columns: repeat(3, 1fr);
          }
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
