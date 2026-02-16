import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiometricCircuit } from "@/components/BiometricCircuit";
import { GridBackground } from "@/components/GridBackground";
import { IndependenceBar } from "@/components/IndependenceBar";
import { BackButton } from "@/components/BackButton";
import { TerminalChat } from "@/components/TerminalChat";
import { BootScreen, LangToggle } from "@/components/BootScreen";
import type { Lang } from "@/components/BootScreen";
import { RU_PHASE1_QUESTIONS } from "@/lib/ru-texts";
import { useCreateSession, useUpdateSession, useSession } from "@/hooks/use-sessions";
import { useGrantSkill } from "@/hooks/use-skills";
import { Loader2 } from "lucide-react";
import { playClick, playError, playPhaseComplete, playTransition } from "@/lib/sounds";
import { trackEvent, getOrCreateSession } from "@/lib/analytics";

function isInStandaloneMode(): boolean {
  return (
    ("standalone" in window.navigator && (window.navigator as any).standalone) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

type Phase = "boot" | "loading" | "phase_1" | "phase_1_complete" | "chip_exit" | "phase_2";
type QuestionId = 1 | 2 | 3 | 4;

const PROGRESS_PER_QUESTION = [5, 10, 15, 20];
const SATS_PER_QUESTION = 50;

const Q_TRANSLATIONS: Record<string, { titles: string[]; yes: string; no: string; notYet: string; tryAgain: string }> = {
  RU: RU_PHASE1_QUESTIONS,
  EN: {
    titles: [
      "Want to be freer?",
      "Think states and corporations want to strip people of their freedom?",
      "Can anything be done about it?",
      "Ready to learn what can be done?",
    ],
    yes: "YES",
    no: "NO",
    notYet: "NOT YET",
    tryAgain: "TRY AGAIN",
  },
  IT: {
    titles: [
      "Vuoi essere pi\u00f9 libero?",
      "Pensi che stati e corporation vogliano togliere la libert\u00e0 alle persone?",
      "Si pu\u00f2 fare qualcosa?",
      "Sei pronto a scoprire cosa si pu\u00f2 fare?",
    ],
    yes: "S\u00cc",
    no: "NO",
    notYet: "NON ANCORA",
    tryAgain: "RIPROVA",
  },
};

const QUESTIONS = [
  { id: 1, options: [{ correct: true }, { correct: false }] },
  { id: 2, options: [{ correct: true }, { correct: false }] },
  { id: 3, options: [{ correct: true }, { correct: false }] },
  { id: 4, options: [{ correct: true }, { correct: false }] },
];


function hasSavedWalletState(): boolean {
  try {
    const raw = localStorage.getItem("liberta_wallet_state");
    if (raw) {
      const data = JSON.parse(raw);
      return data?.walletMode === true;
    }
  } catch (_) {}
  return false;
}

function isBootDismissed(): boolean {
  try { return localStorage.getItem("liberta_boot_dismissed") === "1"; } catch (_) { return false; }
}

export default function Home() {
  const hasWalletRestore = useRef(hasSavedWalletState());
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>(() => {
    if (hasWalletRestore.current) return "loading";
    if (isInStandaloneMode() || isBootDismissed()) return "loading";
    return "boot";
  });
  const [currentQuestion, setCurrentQuestion] = useState<QuestionId>(1);
  const [circuitReveal, setCircuitReveal] = useState(() => hasWalletRestore.current ? 100 : 0);
  const [totalSats, setTotalSats] = useState(() => hasWalletRestore.current ? 1000 : 0);
  const [progress, setProgress] = useState(() => hasWalletRestore.current ? 100 : 0);
  const [labelMode, setLabelMode] = useState<"initiation" | "independence">(() => hasWalletRestore.current ? "independence" : "initiation");
  const [shakeScreen, setShakeScreen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [terminalKey, setTerminalKey] = useState(0);
  const [skipTypewriter, setSkipTypewriter] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<QuestionId>>(new Set());
  const [langHidden, setLangHidden] = useState(false);
  const [userStats, setUserStats] = useState<{ level: number; xp: number } | null>(null);
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const stored = localStorage.getItem("liberta_lang");
      if (stored === "EN" || stored === "IT" || stored === "RU") return stored;
    } catch (_) {}
    try {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith("it")) return "IT";
      if (browserLang.startsWith("ru")) return "RU";
    } catch (_) {}
    return "EN";
  });
  const { grantSkill, pendingSkill, dismissPopup } = useGrantSkill();
  const handleSatsUpdate = useCallback((sats: number) => setTotalSats(Math.min(sats, 1000)), []);
  const labelModeRef = useRef(labelMode);
  labelModeRef.current = labelMode;
  const handleProgressUpdate = useCallback((p: number) => {
    if (labelModeRef.current === "independence") return;
    setProgress(Math.min(p, 100));
  }, []);
  const handleLabelSwitch = useCallback(() => {
    setLabelMode("independence");
    setProgress(11);
  }, []);
  const isAnsweringRef = useRef(false);
  const mountedRef = useRef(true);
  const pendingTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleLangChange = (l: string) => {
    const newLang = l as Lang;
    setLang(newLang);
    try { localStorage.setItem("liberta_lang", newLang); } catch (_) {}
  };

  const qt = Q_TRANSLATIONS[lang] || Q_TRANSLATIONS.IT;
  
  useEffect(() => {
    const bgColor = phase === "boot" ? '#000000' : phase === "phase_2" ? '#0A0A0A' : '#F5F5F5';
    document.documentElement.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;
    const root = document.getElementById('root');
    if (root) root.style.backgroundColor = bgColor;
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute('content', bgColor);
  }, [phase]);

  useEffect(() => {
    trackEvent('page_view');
    const token = getOrCreateSession();
    fetch('/api/sync-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(r => r.json())
      .then(data => {
        setUserStats({ level: data.level, xp: data.xp });
        if (data.totalSats > 0 || data.independenceProgress > 0) {
          const localProgress = localStorage.getItem("liberta_terminal_progress");
          if (!localProgress) {
            localStorage.setItem("liberta_terminal_progress", JSON.stringify({
              blockIndex: data.currentStepIndex || 0,
              sats: data.totalSats || 0,
              progress: data.independenceProgress || 0,
              walletMode: data.currentModuleId?.startsWith("wallet_") || false,
              walletStepId: data.currentModuleId?.startsWith("wallet_") ? data.currentModuleId.replace("wallet_", "") : null,
              timestamp: Date.now(),
            }));
          }
        }
      })
      .catch(() => {});
  }, []);

  const safeTimeout = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      if (!mountedRef.current) return;
      pendingTimeoutsRef.current = pendingTimeoutsRef.current.filter(t => t !== id);
      fn();
    }, ms);
    pendingTimeoutsRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      pendingTimeoutsRef.current.forEach(t => clearTimeout(t));
      pendingTimeoutsRef.current = [];
    };
  }, []);

  const { data: session, isLoading: isSessionLoading } = useSession(sessionId);
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();

  const sessionCreatingRef = useRef(false);
  const [sessionRetry, setSessionRetry] = useState(0);

  useEffect(() => {
    if (phase === "boot") return;
    if (sessionId) return;
    if (sessionCreatingRef.current) return;

    sessionCreatingRef.current = true;
    createSession.mutate({ nodeId: "#RE_CHAIN_" + Math.floor(Math.random() * 9999) }, {
      onSuccess: (data) => {
        sessionCreatingRef.current = false;
        setSessionId(data.id);
        if (hasWalletRestore.current) {
          hasWalletRestore.current = false;
          setPhase("phase_2");
        } else {
          setPhase("phase_1");
        }
      },
      onError: () => {
        sessionCreatingRef.current = false;
        if (sessionRetry < 3) {
          const delay = 1000 * Math.pow(2, sessionRetry + 1);
          setTimeout(() => setSessionRetry(prev => prev + 1), delay);
        } else {
          setPhase("phase_1");
        }
      }
    });
  }, [phase, sessionRetry]);

  useEffect(() => {
    if (phase === "chip_exit") {
      trackEvent('phase_2_started');
      const fallback = setTimeout(() => setPhase("phase_2"), 1200);
      return () => clearTimeout(fallback);
    }
  }, [phase]);

  const handleQuestionAnswer = (questionId: QuestionId, isCorrect: boolean) => {
    if (isAnsweringRef.current) return;
    if (answeredQuestions.has(questionId)) return;
    
    isAnsweringRef.current = true;
    if (currentQuestion === 1) setLangHidden(true);
    
    if (isCorrect) {
      playClick();
      trackEvent(`q${questionId}_passed`);
      setAnsweredQuestions(prev => new Set(prev).add(questionId));
      
      const newProgress = PROGRESS_PER_QUESTION[answeredQuestions.size];
      setProgress(newProgress);
      setTotalSats(prev => prev + SATS_PER_QUESTION);
      
      if (questionId < 4) {
        setCircuitReveal(questionId * 25);
      }
      
      if (sessionId) {
        updateSession.mutate({
          id: sessionId,
          actionId: `q${questionId}_answer`,
          scoreDelta: 10,
          nextStepId: `phase_1_q${questionId}`
        });
      }

      safeTimeout(() => {
        if (questionId < 4) {
          setCurrentQuestion((questionId + 1) as QuestionId);
        } else {
          setCircuitReveal(100);
          setProgress(20);
          setPhase("phase_1_complete");
        }
        isAnsweringRef.current = false;
      }, 800);
    } else {
      playError();
      setShakeScreen(true);
      setShowError(true);
      safeTimeout(() => {
        setShakeScreen(false);
        isAnsweringRef.current = false;
      }, 500);
      safeTimeout(() => setShowError(false), 2000);
    }
  };

  const handleBack = () => {
    isAnsweringRef.current = false;
    
    if (phase === "phase_1" && currentQuestion > 1) {
      const prevQ = (currentQuestion - 1) as QuestionId;
      if (prevQ === 1) setLangHidden(false);
      setAnsweredQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(currentQuestion);
        newSet.delete(prevQ);
        return newSet;
      });
      setCurrentQuestion(prevQ);
      setProgress(prevQ > 1 ? PROGRESS_PER_QUESTION[prevQ - 2] : 0);
      setTotalSats(prev => Math.max(0, prev - SATS_PER_QUESTION));
      setCircuitReveal(Math.max(0, (prevQ - 1) * 25));
    } else if (phase === "phase_1_complete") {
      setPhase("phase_1");
      setCurrentQuestion(4 as QuestionId);
      setAnsweredQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(4 as QuestionId);
        return newSet;
      });
      setProgress(15);
      setTotalSats(prev => Math.max(0, prev - SATS_PER_QUESTION));
      setCircuitReveal(75);
    }
  };

  const handleChipClick = () => {
    if (circuitReveal >= 100) {
      playPhaseComplete();
      setTotalSats(200);
      try { localStorage.removeItem("liberta_terminal_progress"); } catch (_) {}
      setTerminalKey(prev => prev + 1);
      setPhase("chip_exit");
    }
  };

  const handleTerminalBack = () => {
    try { localStorage.removeItem("liberta_wallet_state"); } catch (_) {}
    try { localStorage.removeItem("liberta_terminal_progress"); } catch (_) {}
    setSkipTypewriter(true);
    setTotalSats(200);
    setProgress(20);
    setPhase("phase_1_complete");
  };



  if (phase === "boot") {
    return (
      <BootScreen
        onDismiss={() => {
          try { localStorage.setItem("liberta_boot_dismissed", "1"); } catch (_) {}
          setPhase("loading");
        }}
        lang={lang}
        onLangChange={handleLangChange}
      />
    );
  }

  if (phase === "loading" || !sessionId || isSessionLoading) {
    return (
      <div className="fixed inset-0 bg-[#F5F5F5] flex items-center justify-center">
        <GridBackground intensity="high" />
        <div className="flex flex-col items-center gap-4 z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8" style={{ color: "#B87333", filter: "drop-shadow(0 0 6px rgba(184, 115, 51, 0.5))" }} />
          </motion.div>
          <motion.div 
            className="text-xs tracking-[0.3em] font-mono"
            style={{ color: "#B87333", opacity: 0.8 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {lang === "RU" ? "ИНИЦИАЛИЗАЦИЯ..." : lang === "EN" ? "INITIALIZING..." : "INIZIALIZZAZIONE..."}
          </motion.div>
        </div>
      </div>
    );
  }

  if (phase === "phase_1") {
    const question = QUESTIONS[currentQuestion - 1];
    const questionTitle = qt.titles[currentQuestion - 1];
    const bgIntensity = currentQuestion === 1 ? "high" : "low";

    const getOptionLabel = (qIdx: number, optIdx: number) => {
      if (optIdx === 0) return qt.yes;
      if (qIdx === 3) return qt.notYet;
      return qt.no;
    };
    
    return (
      <motion.div 
        className="fixed inset-0 bg-[#F5F5F5] overflow-hidden"
        animate={shakeScreen ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <GridBackground intensity={bgIntensity} />
        <BiometricCircuit revealProgress={circuitReveal} />

        <div className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center px-4 pt-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 ${currentQuestion > 1 ? 'bg-[#F5F5F5]/90 border border-[#B87333]/20' : ''}`}
          >
            <span className="text-[8px] tracking-[2px] font-mono font-bold" style={{ color: "#B87333", opacity: 0.7 }}>
              DIGITAL RESISTANCE
            </span>
            <span className="text-[11px] tracking-[3px] font-mono font-bold" style={{ color: "#B87333" }}>
              re<span className="animate-blink">_</span>terminal
            </span>
          </motion.div>
          
          {currentQuestion === 1 && !langHidden && (
            <div className="mt-1">
              <LangToggle lang={lang} onLangChange={(l) => handleLangChange(l)} variant="light" />
            </div>
          )}
        </div>
        
        {currentQuestion > 1 && (
          <BackButton onClick={handleBack} isDark={false} />
        )}
        
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-0 right-0 z-50 pointer-events-none flex justify-center"
            >
              <div className="px-6 py-3 text-[13px] tracking-[3px] font-mono font-bold"
                style={{
                  background: "#1E1E1E",
                  border: "1px solid rgba(212, 149, 106, 0.6)",
                  boxShadow: "0 0 15px rgba(184, 115, 51, 0.3), 0 0 30px rgba(184, 115, 51, 0.1)",
                  color: "#D4956A",
                }}>
                {qt.tryAgain}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="h-full flex flex-col items-center justify-center relative z-10 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <motion.h1 
                className={`text-[14px] text-[#B87333] tracking-[2px] font-bold mb-16 -mt-32 px-6 py-2 text-center max-w-[340px] leading-relaxed ${currentQuestion > 1 ? 'bg-[#F5F5F5]/90 border border-[#B87333]/20' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {questionTitle}
              </motion.h1>
              
              <div className="flex gap-3">
                {question.options.map((option, idx) => (
                  <motion.button
                    type="button"
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuestionAnswer(question.id as QuestionId, option.correct); }}
                    className="w-36 h-12 text-[#F5F5F5] text-[13px] font-bold tracking-wider font-mono active:scale-95 transition-all duration-200"
                    style={{
                      background: "linear-gradient(135deg, #7A3B20 0%, #A0522D 20%, #B87333 40%, #D4956A 60%, #E8B89D 80%, #B87333 100%)",
                      boxShadow: "0 0 12px rgba(184, 115, 51, 0.4), 0 0 25px rgba(184, 115, 51, 0.15), inset 0 1px 1px rgba(232, 184, 157, 0.3)",
                      border: "1px solid rgba(212, 149, 106, 0.5)",
                    }}
                    data-testid={`button-q${question.id}-${idx === 0 ? 'a' : 'b'}`}
                  >
                    {getOptionLabel(currentQuestion - 1, idx)}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <IndependenceBar progress={progress} phase="phase_1" showBackground={currentQuestion > 1} lang={lang} labelMode={labelMode} />
      </motion.div>
    );
  }

  if (phase === "phase_1_complete") {
    return (
      <div className="fixed inset-0 bg-[#F5F5F5] overflow-hidden flex flex-col items-center justify-center">
        <div 
          className="fixed inset-0"
          style={{
            background: "linear-gradient(135deg, #F9F9F9 0%, #E6E6E6 50%, #F4F4F4 100%)"
          }}
        />
        <BiometricCircuit 
          revealProgress={100} 
          onChipClick={handleChipClick}
          isComplete={true}
          skipTraceAnimation={true}
        />
        
        <BackButton onClick={handleBack} isDark={false} />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-36 left-0 right-0 flex justify-center z-10"
        >
          <motion.div
            className="px-7 py-4 border-2 border-[#B87333]"
            style={{ background: "rgba(245,245,245,0.95)" }}
            animate={{
              boxShadow: [
                "0 0 12px rgba(184,115,51,0.3), 0 0 30px rgba(184,115,51,0.15)",
                "0 0 30px rgba(184,115,51,0.7), 0 0 60px rgba(184,115,51,0.35), 0 0 90px rgba(184,115,51,0.15)",
                "0 0 12px rgba(184,115,51,0.3), 0 0 30px rgba(184,115,51,0.15)",
              ],
              borderColor: [
                "rgba(184,115,51,0.6)",
                "rgba(184,115,51,1)",
                "rgba(184,115,51,0.6)",
              ],
              scale: [1, 1.05, 1],
            }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.p 
              className="text-[24px] tracking-[4px] font-mono font-bold"
              style={{ color: "#B87333" }}
              animate={{
                textShadow: [
                  "0 0 8px rgba(184,115,51,0.4)",
                  "0 0 24px rgba(184,115,51,0.9), 0 0 50px rgba(184,115,51,0.4)",
                  "0 0 8px rgba(184,115,51,0.4)",
                ],
                opacity: [1, 0.7, 1],
              }}
              transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
            >
              {lang === "RU" ? "Жми на чип" : lang === "EN" ? "Tap the chip" : "Tocca il chip"}
            </motion.p>
          </motion.div>
        </motion.div>

        <IndependenceBar progress={progress} phase="phase_1" showBackground={true} lang={lang} labelMode={labelMode} />
      </div>
    );
  }

  if (phase === "chip_exit") {
    return (
      <div className="fixed inset-0 bg-[#F5F5F5] overflow-hidden flex flex-col items-center justify-center"
        style={{ perspective: "800px" }}
      >
        <div 
          className="fixed inset-0"
          style={{
            background: "linear-gradient(135deg, #F9F9F9 0%, #E6E6E6 50%, #F4F4F4 100%)"
          }}
        />
        <motion.div
          className="relative z-10"
          initial={{ scale: 1, rotateX: 0, y: 0, opacity: 1 }}
          animate={{ 
            scale: [1, 1.3, 2.5, 4],
            rotateX: [0, -15, -35, -55],
            y: [0, -20, 40, 200],
            opacity: [1, 1, 0.8, 0],
          }}
          transition={{ 
            duration: 0.9,
            ease: [0.25, 0.1, 0.25, 1],
            times: [0, 0.3, 0.6, 1],
          }}
          onAnimationComplete={() => setPhase("phase_2")}
          style={{ transformStyle: "preserve-3d" }}
        >
          <BiometricCircuit 
            revealProgress={100}
            isComplete={true}
            skipTraceAnimation={true}
          />
        </motion.div>

        <motion.div
          className="fixed inset-0 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.6, 1] }}
          transition={{ duration: 0.9, times: [0, 0.4, 0.7, 1] }}
          style={{ background: "#0A0A0A" }}
        />
      </div>
    );
  }

  if (phase === "phase_2") {
    return (
      <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col overflow-hidden">
        <div className="flex-1 min-h-0">
          <TerminalChat 
            key={terminalKey} 
            onBack={handleTerminalBack}
            onProgressUpdate={handleProgressUpdate}
            onSatsUpdate={handleSatsUpdate}
            totalSats={totalSats}
            skipFirstTypewriter={skipTypewriter}
            userStats={userStats}
            userToken={localStorage.getItem("liberta_token") || undefined}
            onGrantSkill={grantSkill}
            levelUpSkill={pendingSkill}
            onDismissLevelUp={dismissPopup}
            lang={lang}
            onLabelSwitch={handleLabelSwitch}
          />
        </div>
        
        <div className="flex-shrink-0">
          <IndependenceBar progress={progress} phase="phase_2" showBackground={false} lang={lang} labelMode={labelMode} />
        </div>
      </div>
    );
  }

  return null;
}
