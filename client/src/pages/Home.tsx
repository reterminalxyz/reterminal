import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiometricCircuit } from "@/components/BiometricCircuit";
import { GridBackground } from "@/components/GridBackground";
import { IndependenceBar } from "@/components/IndependenceBar";
import { TerminalChat } from "@/components/TerminalChat";
import { BackButton } from "@/components/BackButton";
import { useCreateSession, useUpdateSession, useSession } from "@/hooks/use-sessions";
import { Loader2 } from "lucide-react";

type Phase = "loading" | "phase_1" | "phase_1_complete" | "transition" | "phase_2" | "complete";
type QuestionId = 1 | 2 | 3 | 4;

// 4 questions - each gives 5% independence (5→10→15→20%)
const QUESTIONS = [
  { id: 1, title: "СВОБОДА", options: [{ label: "ПРАВО", correct: true }, { label: "СЕРВИС", correct: false }] },
  { id: 2, title: "СОБСТВЕННОСТЬ", options: [{ label: "БАНК", correct: false }, { label: "Я", correct: true }] },
  { id: 3, title: "СУВЕРЕНИТЕТ", options: [{ label: "ИНСТРУМЕНТ", correct: true }, { label: "РИСК", correct: false }] },
  { id: 4, title: "КОНТРОЛЬ", options: [{ label: "СИСТЕМА", correct: false }, { label: "ТЫ", correct: true }] },
];

const DIALOGUES = [
  { id: "dialogue_1", speaker: "satoshi" as const, message: "Протокол активирован. Ты собрал схему, теперь пора понять, как она работает.", reward: 50 },
  { id: "dialogue_2", speaker: "satoshi" as const, message: "Банк — это чёрный ящик. Ты не знаешь, что внутри. Ты доверяешь обещанию, записанному в их базе данных.", reward: 50 },
  { id: "dialogue_3", speaker: "satoshi" as const, message: "Bitcoin работает иначе. Каждая транзакция видна. Каждый блок проверен тысячами узлов. Никаких обещаний — только математика.", reward: 50, options: [
    { id: "d3_opt1", label: "Но это сложно", next: "dialogue_4a" },
    { id: "d3_opt2", label: "Это честно", next: "dialogue_4b" }
  ]},
  { id: "dialogue_4a", speaker: "satoshi" as const, message: "Сложность — это цена свободы. Но тебе не нужно знать всё. Достаточно понять принцип: никто не контролирует твои деньги, кроме тебя.", reward: 50 },
  { id: "dialogue_4b", speaker: "satoshi" as const, message: "Именно. Честность — это фундамент. Когда правила прозрачны и неизменны, доверие становится не нужным. Система работает без него.", reward: 50 },
  { id: "dialogue_5", speaker: "satoshi" as const, message: "Lightning Network — это второй уровень. Мгновенные транзакции. Минимальные комиссии. Карта в твоих руках подключена к этой сети.", reward: 50 },
  { id: "dialogue_6", speaker: "satoshi" as const, message: "Ты не клиент. Ты — участник сети. Каждая транзакция укрепляет протокол. Каждый узел делает систему устойчивее.", reward: 50 },
  { id: "dialogue_7", speaker: "satoshi" as const, message: "Суверенитет начинается с выбора. Ты уже сделал первый шаг. Остальное — вопрос практики.", reward: 50, options: [
    { id: "d7_opt1", label: "Я готов", action: "complete_phase_2" }
  ]},
];

export default function Home() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("loading");
  const [currentQuestion, setCurrentQuestion] = useState<QuestionId>(1);
  const [circuitReveal, setCircuitReveal] = useState(0); // 0, 25, 50, 75, 100
  const [totalSats, setTotalSats] = useState(0);
  const [progress, setProgress] = useState(0); // Independence % (5 per answer)
  const [shakeScreen, setShakeScreen] = useState(false);
  const [showError, setShowError] = useState(false);
  
  const { data: session, isLoading: isSessionLoading } = useSession(sessionId);
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();

  useEffect(() => {
    if (!sessionId) {
      createSession.mutate({ nodeId: "#RE_CHAIN_" + Math.floor(Math.random() * 9999) }, {
        onSuccess: (data) => {
          setSessionId(data.id);
          setPhase("phase_1");
        }
      });
    }
  }, []);

  const handleQuestionAnswer = (questionId: QuestionId, isCorrect: boolean) => {
    if (isCorrect) {
      // Each correct answer: +5% independence, +25% circuit reveal
      setProgress(prev => prev + 5);
      setCircuitReveal(questionId * 25);
      
      if (sessionId) {
        updateSession.mutate({
          id: sessionId,
          actionId: `q${questionId}_answer`,
          scoreDelta: 10,
          nextStepId: `phase_1_q${questionId}`
        });
      }

      setTimeout(() => {
        if (questionId < 4) {
          setCurrentQuestion((questionId + 1) as QuestionId);
        } else {
          // All 4 questions done - progress should be 20%
          setTotalSats(prev => prev + 150);
          setPhase("phase_1_complete");
        }
      }, 800);
    } else {
      // Wrong answer - shake screen and show error notification
      setShakeScreen(true);
      setShowError(true);
      setTimeout(() => setShakeScreen(false), 500);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const handleBack = () => {
    if (phase === "phase_1" && currentQuestion > 1) {
      setCurrentQuestion((currentQuestion - 1) as QuestionId);
      setCircuitReveal((currentQuestion - 2) * 25);
      setProgress(prev => Math.max(0, prev - 5));
    } else if (phase === "phase_1_complete") {
      setPhase("phase_1");
      setCurrentQuestion(4);
    } else if (phase === "phase_2") {
      setPhase("phase_1_complete");
    }
  };

  const handleActivate = () => {
    setPhase("transition");
    setTimeout(() => {
      setPhase("phase_2");
    }, 1500);
  };

  const handleChipClick = () => {
    if (circuitReveal >= 100) {
      handleActivate();
    }
  };

  const handleDialogueReward = (reward: number) => {
    setTotalSats(prev => prev + reward);
  };

  const handlePhase2Complete = () => {
    setProgress(100);
    setPhase("complete");
    if (sessionId) {
      updateSession.mutate({
        id: sessionId,
        actionId: "complete",
        scoreDelta: 0,
        nextStepId: "complete"
      });
    }
  };

  const handleCloseChat = () => {
    setPhase("phase_1_complete");
  };

  // Loading state
  if (phase === "loading" || !sessionId || isSessionLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
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
        className="min-h-screen bg-[#F5F5F5] relative overflow-hidden"
        animate={shakeScreen ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <GridBackground intensity={bgIntensity} />
        <BiometricCircuit revealProgress={circuitReveal} />
        
        {/* Error notification */}
        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 left-1/2 -translate-x-1/2 z-50 
                       bg-red-500/90 text-white px-6 py-3 
                       text-[12px] tracking-[2px] font-mono font-bold
                       border border-red-400"
            >
              ПОПРОБУЙ ЕЩЁ
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Back button on all questions except first */}
        {currentQuestion > 1 && (
          <BackButton onClick={handleBack} isDark={false} />
        )}
        
        {/* Header */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-0.5"
          >
            <span className="text-[8px] text-[#B87333]/60 tracking-[2px] font-mono font-bold">
              DIGITAL RESISTANCE
            </span>
            <span className="text-[11px] text-[#B87333] tracking-[3px] font-mono font-bold">
              СБОРКА ПРОТОКОЛА
            </span>
          </motion.div>
        </div>

        {/* Question - moved HIGHER (top-1/3 instead of center) */}
        <div className="min-h-screen flex flex-col items-center justify-start pt-32 relative z-10 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <motion.h1 
                className="text-[16px] text-[#B87333] tracking-[4px] font-bold mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {question.title}
              </motion.h1>
              
              <div className="flex gap-3">
                {question.options.map((option, idx) => (
                  <motion.button
                    key={option.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    onClick={() => handleQuestionAnswer(question.id as QuestionId, option.correct)}
                    className="w-36 h-12 bg-transparent border-2 border-[#B87333] text-[#3E3129] 
                             text-[13px] font-bold tracking-wider font-mono
                             hover:bg-[#B87333] hover:text-[#F5F5F5] 
                             active:scale-95 transition-all duration-200"
                    data-testid={`button-q${question.id}-${idx === 0 ? 'a' : 'b'}`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <IndependenceBar progress={progress} phase="phase_1" />
      </motion.div>
    );
  }

  // Phase 1 Complete
  if (phase === "phase_1_complete") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] relative overflow-hidden flex flex-col items-center justify-center">
        <GridBackground intensity="low" />
        <BiometricCircuit 
          revealProgress={100} 
          onChipClick={handleChipClick}
          isComplete={true}
        />
        
        {/* Back button */}
        <BackButton onClick={handleBack} isDark={false} />
        
        {/* Label under chip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center z-10"
        >
          <motion.p
            className="text-[12px] text-[#B87333] tracking-[3px] font-mono font-bold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            НАЖМИТЕ НА ЧИП
          </motion.p>
          <p className="text-[9px] text-[#3E3129]/60 tracking-wider font-mono mt-1 font-medium">
            для активации суверенитета
          </p>
        </motion.div>

        <IndependenceBar progress={progress} phase="phase_1" />
      </div>
    );
  }

  // Transition
  if (phase === "transition") {
    return (
      <div className="min-h-screen bg-[#2A2A2A] relative overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[#2A2A2A] z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Top panel */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 bg-[#F5F5F5] z-20"
          initial={{ y: 0 }}
          animate={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        >
          <div className="w-full h-full border-b-2 border-[#B87333]/40" />
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-[#B87333]/60"
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.3, repeat: 3 }}
          />
        </motion.div>
        
        {/* Bottom panel */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[#F5F5F5] z-20"
          initial={{ y: 0 }}
          animate={{ y: "100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        >
          <div className="w-full h-full border-t-2 border-[#B87333]/40" />
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-[#B87333]/60"
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.3, repeat: 3 }}
          />
        </motion.div>
        
        {/* Center flash */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="w-full h-[2px] bg-[#B87333]" />
        </motion.div>
        
        {/* Loading text */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center z-25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.span 
            className="text-[11px] text-[#B87333] tracking-[4px] font-mono font-bold"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ПОДКЛЮЧЕНИЕ К САТОШИ...
          </motion.span>
        </motion.div>
      </div>
    );
  }

  // Phase 2: Chat
  if (phase === "phase_2") {
    return (
      <div className="min-h-screen bg-[#2A2A2A] relative">
        {/* Back button in phase 2 */}
        <BackButton onClick={handleBack} isDark={true} />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-screen pb-20 pt-14"
        >
          <TerminalChat 
            dialogues={DIALOGUES}
            onDialogueComplete={handleDialogueReward}
            onComplete={handlePhase2Complete}
            onClose={handleCloseChat}
          />
        </motion.div>
        
        <IndependenceBar progress={progress} phase="phase_2" />
      </div>
    );
  }

  // Complete
  if (phase === "complete") {
    return (
      <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center relative overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.06]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gridDark" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#B87333" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gridDark)" />
          </svg>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center px-4 z-10"
        >
          <motion.div
            className="text-[9px] text-[#B87333]/60 tracking-[3px] font-mono font-bold mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            DIGITAL RESISTANCE // COMPLETE
          </motion.div>
          
          <motion.h1 
            className="text-[18px] text-[#B87333] tracking-[3px] font-bold mb-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ПРОТОКОЛ ЗАВЕРШЁН
          </motion.h1>
          
          <motion.p className="text-[#E8E8E8]/70 text-[13px] mb-6 font-mono tracking-wider font-bold">
            ТЫ АКТИВИРОВАН
          </motion.p>
          
          <motion.div
            className="text-[36px] text-[#B87333] font-bold font-mono"
            animate={{ 
              textShadow: [
                "0 0 10px rgba(184,115,51,0.3)",
                "0 0 25px rgba(184,115,51,0.6)",
                "0 0 10px rgba(184,115,51,0.3)"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            +{totalSats} SATS
          </motion.div>
          
          <motion.div
            className="mt-6 px-5 py-2.5 border-2 border-[#B87333]/60 text-[#B87333] text-[11px] tracking-wider font-mono font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            INDEPENDENCE: {progress}%
          </motion.div>
          
          <motion.p
            className="mt-5 text-[10px] text-[#E8E8E8]/50 tracking-wider font-mono max-w-[280px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Твоя карта теперь полностью активирована. Добро пожаловать в сеть.
          </motion.p>
        </motion.div>
        
        <IndependenceBar progress={progress} phase="complete" />
      </div>
    );
  }

  return null;
}
