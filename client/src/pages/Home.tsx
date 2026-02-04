import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiometricCircuit } from "@/components/BiometricCircuit";
import { GridBackground } from "@/components/GridBackground";
import { IndependenceBar } from "@/components/IndependenceBar";
import { BackButton } from "@/components/BackButton";
import { useCreateSession, useUpdateSession, useSession } from "@/hooks/use-sessions";
import { Loader2 } from "lucide-react";

type Phase = "loading" | "phase_1" | "phase_1_complete" | "complete";
type QuestionId = 1 | 2 | 3 | 4;

// 4 questions - each gives 5% independence (5→10→15→20%)
const QUESTIONS = [
  { id: 1, title: "Хочешь стать свободнее?", options: [{ label: "ДА", correct: true }, { label: "НЕТ", correct: false }] },
  { id: 2, title: "ВОПРОС 1", options: [{ label: "ОТВЕТ 1", correct: true }, { label: "ОТВЕТ 2", correct: false }] },
  { id: 3, title: "ВОПРОС 2", options: [{ label: "ОТВЕТ 1", correct: true }, { label: "ОТВЕТ 2", correct: false }] },
  { id: 4, title: "ВОПРОС 3", options: [{ label: "ОТВЕТ 1", correct: true }, { label: "ОТВЕТ 2", correct: false }] },
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
      // Go to previous question, keep progress earned so far
      const prevQ = (currentQuestion - 1) as QuestionId;
      setCurrentQuestion(prevQ);
      // Progress and circuit stay at what was earned for previous questions
      setProgress((prevQ - 1) * 5);
      setCircuitReveal((prevQ - 1) * 25);
    } else if (phase === "phase_1_complete") {
      // Go back to Q4
      setPhase("phase_1");
      setCurrentQuestion(4 as QuestionId);
      setProgress(15); // Q1-Q3 answered = 15%
      setCircuitReveal(75);
    }
  };

  const handleActivate = () => {
    setProgress(100);
    setTotalSats(prev => prev + 150);
    setPhase("complete");
  };

  const handleChipClick = () => {
    if (circuitReveal >= 100) {
      handleActivate();
    }
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
        <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4">
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
                className={`text-[16px] text-[#B87333] tracking-[4px] font-bold mb-16 -mt-24 px-6 py-2 ${currentQuestion > 1 ? 'bg-[#F5F5F5]/90 border border-[#B87333]/20' : ''}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {question.title}
              </motion.h1>
              
              <div className={`flex gap-3 p-3 ${currentQuestion > 1 ? 'bg-[#F5F5F5]/90 border border-[#B87333]/20' : ''}`}>
                {question.options.map((option, idx) => (
                  <motion.button
                    key={option.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    onClick={() => handleQuestionAnswer(question.id as QuestionId, option.correct)}
                    className="w-36 h-12 bg-[#F5F5F5] border-2 border-[#B87333] text-[#3E3129] 
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

        <IndependenceBar progress={progress} phase="phase_1" showBackground={currentQuestion > 1} />
      </motion.div>
    );
  }

  // Phase 1 Complete - NO animated background on chip screen
  if (phase === "phase_1_complete") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] relative overflow-hidden flex flex-col items-center justify-center">
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
            НАЖМИТЕ НА ЧИП
          </p>
        </motion.div>

        <IndependenceBar progress={progress} phase="phase_1" showBackground={true} />
      </div>
    );
  }

  // Complete
  if (phase === "complete") {
    return (
      <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center relative overflow-hidden">
        {/* Animated dark background with orbs */}
        <GridBackground intensity="low" variant="dark" />
        
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
        
        <IndependenceBar progress={progress} phase="complete" showBackground={true} />
      </div>
    );
  }

  return null;
}
