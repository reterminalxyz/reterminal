import { useEffect, useState, useRef, useCallback } from "react";

const CASCADE_CHARS = ">/$/# [ ] _ X Y Z 0 1 { } | \\ ~ @ ! % ^ & * + = < > ? ;".split(" ");
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?\\~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FREEDOM_TEXT = "INITIALIZING FREEDOM";
const COLUMN_COUNT = 18;
const ROWS_PER_COLUMN = 28;

const PHASE1_DURATION = 1500;
const PHASE2_DURATION = 700;
const PHASE3_DELAY = 800;

interface LoadingScreenProps {
  onComplete: () => void;
}

function randomChar() {
  return CASCADE_CHARS[Math.floor(Math.random() * CASCADE_CHARS.length)];
}

function randomGlitch() {
  return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
}

function CascadeColumn({ index, speed, opacity, stopped }: { index: number; speed: number; opacity: number; stopped: boolean }) {
  const [chars, setChars] = useState<string[]>(() =>
    Array.from({ length: ROWS_PER_COLUMN }, () => randomChar())
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (stopped) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setChars(prev => {
        const next = [...prev];
        next.pop();
        next.unshift(randomChar());
        return next;
      });
    }, speed);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [speed, stopped]);

  const skewDeg = stopped ? 0 : (Math.sin(index * 1.7) * 0.8);
  const translateX = stopped ? 0 : (Math.sin(index * 2.3 + Date.now() * 0.001) * 1.5);

  return (
    <div
      className="flex flex-col items-center select-none"
      style={{
        opacity,
        transform: `skewX(${skewDeg}deg) translateX(${translateX}px)`,
        transition: stopped ? "opacity 0.3s ease-out, transform 0.4s ease-out" : "none",
        fontFamily: "'Roboto Mono', 'Courier New', monospace",
        fontSize: "13px",
        lineHeight: "18px",
        color: "#000",
        letterSpacing: "0.05em",
        willChange: "transform",
      }}
    >
      {chars.map((c, i) => (
        <span
          key={i}
          style={{
            opacity: stopped ? 0 : (0.15 + (i / ROWS_PER_COLUMN) * 0.55),
            transition: stopped ? `opacity 0.2s ease-out ${i * 10}ms` : "none",
          }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

function MechanicalText({ text, onDone }: { text: string; onDone: () => void }) {
  const [revealed, setRevealed] = useState<string[]>(Array(text.length).fill(""));
  const [scales, setScales] = useState<number[]>(Array(text.length).fill(1));
  const doneRef = useRef(false);

  useEffect(() => {
    const perChar = Math.floor(PHASE2_DURATION / text.length);
    let idx = 0;

    const glitchInterval = setInterval(() => {
      setRevealed(prev => {
        const next = [...prev];
        for (let i = idx; i < text.length; i++) {
          if (text[i] === " ") {
            next[i] = " ";
          } else {
            next[i] = randomGlitch();
          }
        }
        return next;
      });
    }, 40);

    const revealInterval = setInterval(() => {
      if (idx >= text.length) {
        clearInterval(revealInterval);
        clearInterval(glitchInterval);
        setRevealed(text.split(""));
        if (!doneRef.current) {
          doneRef.current = true;
          onDone();
        }
        return;
      }
      const currentIdx = idx;
      setRevealed(prev => {
        const next = [...prev];
        next[currentIdx] = text[currentIdx];
        return next;
      });
      setScales(prev => {
        const next = [...prev];
        next[currentIdx] = 1.15;
        return next;
      });
      setTimeout(() => {
        setScales(prev => {
          const next = [...prev];
          next[currentIdx] = 1;
          return next;
        });
      }, 80);
      idx++;
    }, perChar);

    return () => {
      clearInterval(revealInterval);
      clearInterval(glitchInterval);
    };
  }, [text, onDone]);

  return (
    <div
      className="flex justify-center items-center"
      style={{
        fontFamily: "'Roboto Mono', 'Courier New', monospace",
        fontSize: "clamp(14px, 4vw, 20px)",
        fontWeight: 700,
        letterSpacing: "0.15em",
        color: "#000",
      }}
    >
      {revealed.map((c, i) => (
        <span
          key={i}
          style={{
            display: "inline-block",
            transform: `scale(${scales[i]})`,
            transition: "transform 0.08s ease-out",
            minWidth: c === " " ? "0.4em" : undefined,
          }}
        >
          {c}
        </span>
      ))}
    </div>
  );
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [cascadeStopped, setCascadeStopped] = useState(false);
  const completedRef = useRef(false);

  const columns = useRef(
    Array.from({ length: COLUMN_COUNT }, (_, i) => ({
      speed: 50 + Math.random() * 60,
      opacity: 0.2 + Math.random() * 0.6,
      index: i,
    }))
  ).current;

  useEffect(() => {
    const t1 = setTimeout(() => {
      setCascadeStopped(true);
      setTimeout(() => setPhase(2), 300);
    }, PHASE1_DURATION);

    return () => clearTimeout(t1);
  }, []);

  const handlePhase2Done = useCallback(() => {
    setTimeout(() => setPhase(3), 150);
  }, []);

  useEffect(() => {
    if (phase === 3 && !completedRef.current) {
      const t = setTimeout(() => {
        completedRef.current = true;
        onComplete();
      }, PHASE3_DELAY);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "#FFFFFF", zIndex: 9999 }}
      data-testid="loading-screen"
    >
      {phase === 1 && (
        <div
          className="absolute inset-0 flex justify-around items-stretch"
          style={{
            opacity: cascadeStopped ? 0 : 1,
            transition: "opacity 0.3s ease-out",
          }}
        >
          {columns.map((col) => (
            <CascadeColumn
              key={col.index}
              index={col.index}
              speed={col.speed}
              opacity={col.opacity}
              stopped={cascadeStopped}
            />
          ))}
        </div>
      )}

      {phase === 2 && (
        <div
          className="flex items-center justify-center px-4"
          style={{
            animation: "mechanicalFadeIn 0.2s ease-out",
          }}
        >
          <MechanicalText text={FREEDOM_TEXT} onDone={handlePhase2Done} />
        </div>
      )}

      {phase === 3 && (
        <div
          className="flex items-center justify-center"
          style={{
            fontFamily: "'Roboto Mono', 'Courier New', monospace",
            fontSize: "clamp(18px, 5vw, 28px)",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "#000",
            animation: "terminalFadeIn 0.15s ease-out",
          }}
          data-testid="loading-screen-final"
        >
          <span>RE</span>
          <span
            style={{
              animation: "cursorBlink 800ms step-end infinite",
            }}
          >
            _
          </span>
          <span>TERMINAL</span>
        </div>
      )}

      <style>{`
        @keyframes mechanicalFadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes terminalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
