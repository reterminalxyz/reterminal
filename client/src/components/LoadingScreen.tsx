import { useEffect, useState, useRef, useCallback } from "react";

const CASCADE_CHARS = "> / $ # [ ] _ X Y Z 0 1 { } | \\ ~ @ ! % ^ & * + = < > ? ;".split(" ");
const GLITCH_CHARS = "!@#$%^&*()_+-=[]{}|;':\",./<>?\\~`0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const FREEDOM_TEXT = "INITIALIZING FREEDOM";
const COLUMN_COUNT = 22;
const ROWS_PER_COLUMN = 40;

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

function CascadeColumn({ index, baseSpeed, baseOpacity, dimming, frozen }: {
  index: number;
  baseSpeed: number;
  baseOpacity: number;
  dimming: number;
  frozen: boolean;
}) {
  const [chars, setChars] = useState<string[]>(() =>
    Array.from({ length: ROWS_PER_COLUMN }, () => randomChar())
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    if (frozen) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      frameRef.current++;
      setChars(prev => {
        const next = [...prev];
        next.pop();
        next.unshift(randomChar());
        return next;
      });
    }, baseSpeed);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [baseSpeed, frozen]);

  const vibrate = frozen ? 0 : Math.sin(index * 2.3 + Date.now() * 0.002) * 2;
  const skew = frozen ? 0 : Math.sin(index * 1.7) * 1.2;
  const effectiveOpacity = baseOpacity * (1 - dimming);

  return (
    <div
      className="absolute top-0 bottom-0 flex flex-col items-center select-none overflow-hidden"
      style={{
        left: `${(index / COLUMN_COUNT) * 100}%`,
        width: `${100 / COLUMN_COUNT}%`,
        opacity: effectiveOpacity,
        transform: `skewX(${skew}deg) translateX(${vibrate}px)`,
        transition: dimming > 0 ? "opacity 0.6s ease-out, transform 0.5s ease-out" : "none",
        fontFamily: "'Roboto Mono', 'Courier New', monospace",
        fontSize: "clamp(11px, 2.5vw, 15px)",
        lineHeight: "1.4",
        color: "#000",
        letterSpacing: "0.02em",
        willChange: "transform, opacity",
      }}
    >
      {chars.map((c, i) => (
        <span
          key={i}
          style={{
            opacity: 0.08 + (i / ROWS_PER_COLUMN) * 0.7,
            display: "block",
            textAlign: "center",
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
          next[i] = text[i] === " " ? " " : randomGlitch();
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
        next[currentIdx] = 1.2;
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
      className="flex justify-center items-center flex-wrap"
      style={{
        fontFamily: "'Roboto Mono', 'Courier New', monospace",
        fontSize: "clamp(14px, 4.5vw, 22px)",
        fontWeight: 700,
        letterSpacing: "0.18em",
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
            minWidth: c === " " ? "0.5em" : undefined,
            textShadow: scales[i] > 1 ? "0 0 8px rgba(0,0,0,0.3)" : "none",
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
  const [cascadeDimming, setCascadeDimming] = useState(0);
  const [cascadeFrozen, setCascadeFrozen] = useState(false);
  const completedRef = useRef(false);

  const columns = useRef(
    Array.from({ length: COLUMN_COUNT }, (_, i) => ({
      baseSpeed: 40 + Math.random() * 70,
      baseOpacity: 0.25 + Math.random() * 0.65,
      index: i,
    }))
  ).current;

  useEffect(() => {
    const t1 = setTimeout(() => {
      setCascadeDimming(0.55);
      setTimeout(() => {
        setPhase(2);
      }, 200);
    }, PHASE1_DURATION);

    return () => clearTimeout(t1);
  }, []);

  const handlePhase2Done = useCallback(() => {
    setCascadeDimming(0.85);
    setTimeout(() => {
      setCascadeFrozen(true);
      setCascadeDimming(1);
      setPhase(3);
    }, 200);
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
      className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ background: "#FFFFFF", zIndex: 9999 }}
      data-testid="loading-screen"
    >
      <div className="absolute inset-0">
        {columns.map((col) => (
          <CascadeColumn
            key={col.index}
            index={col.index}
            baseSpeed={col.baseSpeed}
            baseOpacity={col.baseOpacity}
            dimming={cascadeDimming}
            frozen={cascadeFrozen}
          />
        ))}
      </div>

      {phase >= 2 && phase < 3 && (
        <div
          className="relative z-10 flex items-center justify-center px-6"
          style={{ animation: "lsResolveIn 0.25s ease-out" }}
        >
          <div
            className="px-6 py-4"
            style={{
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(6px)",
              boxShadow: "0 0 60px rgba(255,255,255,0.9), 0 0 120px rgba(255,255,255,0.5)",
            }}
          >
            <MechanicalText text={FREEDOM_TEXT} onDone={handlePhase2Done} />
          </div>
        </div>
      )}

      {phase === 3 && (
        <div
          className="relative z-10 flex items-center justify-center"
          style={{
            fontFamily: "'Roboto Mono', 'Courier New', monospace",
            fontSize: "clamp(20px, 6vw, 32px)",
            fontWeight: 700,
            letterSpacing: "0.25em",
            color: "#000",
            animation: "lsTerminalIn 0.2s ease-out",
          }}
          data-testid="loading-screen-final"
        >
          <span>RE</span>
          <span style={{ animation: "lsCursorBlink 800ms step-end infinite" }}>_</span>
          <span>TERMINAL</span>
        </div>
      )}

      <style>{`
        @keyframes lsResolveIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes lsTerminalIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes lsCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
