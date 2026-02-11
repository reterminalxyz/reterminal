import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiometricCircuit } from "@/components/BiometricCircuit";
import { GridBackground } from "@/components/GridBackground";
import { IndependenceBar } from "@/components/IndependenceBar";
import { BackButton } from "@/components/BackButton";
import { TerminalChat } from "@/components/TerminalChat";
import { BootScreen } from "@/components/BootScreen";
import { useCreateSession, useUpdateSession, useSession } from "@/hooks/use-sessions";
import { useGrantSkill } from "@/hooks/use-skills";
import { Loader2 } from "lucide-react";
import { playClick, playError, playPhaseComplete, playTransition } from "@/lib/sounds";

function getOrCreateToken(): string {
  let token = localStorage.getItem('liberta_token');
  if (!token) {
    token = crypto.randomUUID();
    localStorage.setItem('liberta_token', token);
  }
  return token;
}

function isInStandaloneMode(): boolean {
  return (
    ("standalone" in window.navigator && (window.navigator as any).standalone) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

type Phase = "boot" | "loading" | "phase_1" | "phase_1_complete" | "phase_2";
type QuestionId = 1 | 2 | 3 | 4;

const PROGRESS_PER_QUESTION = [5, 10, 15, 20];
const SATS_PER_QUESTION = 50;

const QUESTIONS = [
  { id: 1, title: "Хочешь стать свободнее?", options: [{ label: "ДА", correct: true }, { label: "НЕТ", correct: false }] },
  { id: 2, title: "Как думаешь, государства и корпорации хотят забрать свободу людей?", options: [{ label: "ДА", correct: true }, { label: "НЕТ", correct: false }] },
  { id: 3, title: "Можно ли с этим что-то сделать?", options: [{ label: "ДА", correct: true }, { label: "НЕТ", correct: false }] },
  { id: 4, title: "Готов узнать что с этим можно сделать?", options: [{ label: "ДА", correct: true }, { label: "ПОКА НЕТ", correct: false }] },
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
  const [progress, setProgress] = useState(() => hasWalletRestore.current ? 27 : 0);
  const [shakeScreen, setShakeScreen] = useState(false);
  const [showError, setShowError] = useState(false);
  const [terminalKey, setTerminalKey] = useState(0);
  const [skipTypewriter, setSkipTypewriter] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<QuestionId>>(new Set());
  const [userStats, setUserStats] = useState<{ level: number; xp: number } | null>(null);
  const { grantSkill, pendingSkill, dismissPopup } = useGrantSkill();
  const handleSatsUpdate = useCallback((sats: number) => setTotalSats(Math.min(sats, 1000)), []);
  const handleProgressUpdate = useCallback((p: number) => setProgress(Math.min(p, 27)), []);
  const isAnsweringRef = useRef(false);
  const mountedRef = useRef(true);
  const pendingTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  
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
    const token = getOrCreateToken();
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

  useEffect(() => {
    if (phase === "boot") return;
    if (!sessionId) {
      createSession.mutate({ nodeId: "#RE_CHAIN_" + Math.floor(Math.random() * 9999) }, {
        onSuccess: (data) => {
          setSessionId(data.id);
          if (hasWalletRestore.current) {
            hasWalletRestore.current = false;
            setPhase("phase_2");
          } else {
            setPhase("phase_1");
          }
        }
      });
    }
  }, [phase]);

  const handleQuestionAnswer = (questionId: QuestionId, isCorrect: boolean) => {
    // Synchronous ref check prevents any race conditions
    if (isAnsweringRef.current) return;
    // Check if this question was already answered
    if (answeredQuestions.has(questionId)) return;
    
    isAnsweringRef.current = true; // Lock immediately (synchronous)
    
    if (isCorrect) {
      playClick();
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
    // Reset answering lock in case it got stuck
    isAnsweringRef.current = false;
    
    if (phase === "phase_1" && currentQuestion > 1) {
      const prevQ = (currentQuestion - 1) as QuestionId;
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
      setTerminalKey(prev => prev + 1);
      setPhase("phase_2");
    }
  };

  const handleTerminalBack = () => {
    try { localStorage.removeItem("liberta_wallet_state"); } catch (_) {}
    setSkipTypewriter(true);
    setTotalSats(200);
    setProgress(20);
    setPhase("phase_1_complete");
  };



  // Boot screen (install gateway)
  if (phase === "boot") {
    return (
      <BootScreen onDismiss={() => {
        try { localStorage.setItem("liberta_boot_dismissed", "1"); } catch (_) {}
        setPhase("loading");
      }} />
    );
  }

  // Loading state
  if (phase === "loading" || !sessionId || isSessionLoading) {
    return (
      <div className="fixed inset-0 bg-[#F5F5F5] flex items-center justify-center">
        <GridBackground intensity="high" />
        <div className="flex flex-col items-center gap-4 z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-[#B87333]" />
          </motion.div>
          <motion.div 
            className="text-xs tracking-[0.3em] text-[#B87333]/70 font-mono"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ИНИЦИАЛИЗАЦИЯ...
          </motion.div>
        </div>
      </div>
    );
  }

  // Phase 1: Questions
  if (phase === "phase_1") {
    const question = QUESTIONS[currentQuestion - 1];
    // First question gets high intensity background, rest get low
    const bgIntensity = currentQuestion === 1 ? "high" : "low";
    
    return (
      <motion.div 
        className="fixed inset-0 bg-[#F5F5F5] overflow-hidden"
        animate={shakeScreen ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <GridBackground intensity={bgIntensity} />
        <BiometricCircuit revealProgress={circuitReveal} />
        
        {/* Error notification - dark terminal style, TOP toast, properly centered */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-0 right-0 z-50 pointer-events-none flex justify-center"
            >
              <div className="bg-[#1E1E1E] text-[#B87333] px-6 py-3 
                            text-[13px] tracking-[3px] font-mono font-bold
                            border border-[#B87333]/60 shadow-lg">
                ПОПРОБУЙ ЕЩЁ
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Back button on all questions except first */}
        {currentQuestion > 1 && (
          <BackButton onClick={handleBack} isDark={false} />
        )}
        
        {/* Header - background only on Q2+ */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center gap-0.5 px-4 py-2 ${currentQuestion > 1 ? 'bg-[#F5F5F5]/90 border border-[#B87333]/20' : ''}`}
          >
            <span className="text-[8px] text-[#B87333]/60 tracking-[2px] font-mono font-bold">
              DIGITAL RESISTANCE
            </span>
            <span className="text-[11px] text-[#B87333] tracking-[3px] font-mono font-bold">
              СБОРКА ПРОТОКОЛА
            </span>
          </motion.div>
        </div>

        {/* Question - centered, only TITLE moved slightly higher */}
        <div className="h-full flex flex-col items-center justify-center relative z-10 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              {/* Title - background only on Q2+ */}
              <motion.h1 
                className={`text-[14px] text-[#B87333] tracking-[2px] font-bold mb-16 -mt-32 px-6 py-2 text-center max-w-[340px] leading-relaxed ${currentQuestion > 1 ? 'bg-[#F5F5F5]/90 border border-[#B87333]/20' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {question.title}
              </motion.h1>
              
              <div className="flex gap-3">
                {question.options.map((option, idx) => (
                  <motion.button
                    type="button"
                    key={option.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuestionAnswer(question.id as QuestionId, option.correct); }}
                    className={`w-36 h-12 border-2 border-[#B87333] text-[#3E3129] 
                             text-[13px] font-bold tracking-wider font-mono
                             hover:bg-[#B87333] hover:text-[#F5F5F5] 
                             active:scale-95 transition-all duration-200
                             ${currentQuestion > 1 ? 'bg-[#F5F5F5]/90' : 'bg-[#F5F5F5]'}`}
                    data-testid={`button-q${question.id}-${idx === 0 ? 'a' : 'b'}`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <IndependenceBar progress={progress} phase="phase_1" showBackground={currentQuestion > 1} />
      </motion.div>
    );
  }

  // Phase 1 Complete - NO animated background on chip screen
  if (phase === "phase_1_complete") {
    return (
      <div className="fixed inset-0 bg-[#F5F5F5] overflow-hidden flex flex-col items-center justify-center">
        {/* Simple static aluminum background - no animated orbs */}
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
        
        {/* Back button */}
        <BackButton onClick={handleBack} isDark={false} />
        
        {/* Label under chip - with background, no subtitle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-36 left-1/2 -translate-x-1/2 text-center z-10 bg-[#F5F5F5]/90 px-6 py-3 border border-[#B87333]/20"
        >
          <p className="text-[22px] text-[#B87333] tracking-[3px] font-mono font-bold">
            Жми на чип
          </p>
        </motion.div>

        <IndependenceBar progress={progress} phase="phase_1" showBackground={true} />
      </div>
    );
  }

  // Phase 2 - Terminal Chat with Satoshi (final screen)
  if (phase === "phase_2") {
    return (
      <div className="fixed inset-0 bg-[#0D0D0D] flex flex-col overflow-hidden">
        {/* Terminal fills screen above independence bar */}
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
          />
        </div>
        
        {/* Independence bar at very bottom */}
        <div className="flex-shrink-0">
          <IndependenceBar progress={progress} phase="phase_2" showBackground={false} />
        </div>
      </div>
    );
  }

  return null;
}
