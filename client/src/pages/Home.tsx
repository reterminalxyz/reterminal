import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircuitBoard } from "@/components/CircuitBoard";
import { GridBackground } from "@/components/GridBackground";
import { IndependenceBar } from "@/components/IndependenceBar";
import { TerminalChat } from "@/components/TerminalChat";
import { BackButton } from "@/components/BackButton";
import { useCreateSession, useUpdateSession, useSession } from "@/hooks/use-sessions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Phase = "loading" | "phase_1" | "phase_1_complete" | "transition" | "phase_2" | "complete";
type QuestionId = 1 | 2 | 3;

const QUESTIONS = [
  { id: 1, title: "СВОБОДА", options: [{ label: "ПРАВО", correct: true }, { label: "СЕРВИС", correct: false }] },
  { id: 2, title: "СОБСТВЕННОСТЬ", options: [{ label: "БАНК", correct: false }, { label: "Я", correct: true }] },
  { id: 3, title: "СУВЕРЕНИТЕТ", options: [{ label: "ИНСТРУМЕНТ", correct: true }, { label: "РИСК", correct: false }] },
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
  const [completedLayers, setCompletedLayers] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalSats, setTotalSats] = useState(0);
  const [progress, setProgress] = useState(0); // 0-100
  
  const { data: session, isLoading: isSessionLoading } = useSession(sessionId);
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const { toast } = useToast();

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
      setCorrectAnswers(prev => prev + 1);
      setCompletedLayers(questionId);
    }
    
    if (sessionId) {
      updateSession.mutate({
        id: sessionId,
        actionId: `q${questionId}_answer`,
        scoreDelta: isCorrect ? 10 : 0,
        nextStepId: `phase_1_q${questionId}`
      });
    }

    setTimeout(() => {
      if (questionId < 3) {
        setCurrentQuestion((questionId + 1) as QuestionId);
      } else {
        setTotalSats(prev => prev + 150);
        setProgress(20); // Phase 1 = 20%
        setPhase("phase_1_complete");
        toast({
          title: "+150 SATS",
          description: "Протокол собран",
          className: "bg-[#2A2A2A] border-[#B87333] text-[#B87333] font-mono"
        });
      }
    }, 800);
  };

  const handleBack = () => {
    if (phase === "phase_1" && currentQuestion > 1) {
      setCurrentQuestion((currentQuestion - 1) as QuestionId);
      if (completedLayers >= currentQuestion - 1) {
        setCompletedLayers(currentQuestion - 2);
      }
    } else if (phase === "phase_1_complete") {
      setPhase("phase_1");
      setCurrentQuestion(3);
    }
  };

  const handleActivate = () => {
    setPhase("transition");
    setTimeout(() => {
      setPhase("phase_2");
    }, 1500);
  };

  const handleChipClick = () => {
    if (completedLayers >= 3) {
      handleActivate();
    }
  };

  const handleDialogueReward = (reward: number) => {
    setTotalSats(prev => prev + reward);
    // Each dialogue adds ~10% (7 dialogues = 70%, but we start at 20%)
    setProgress(prev => Math.min(prev + 10, 90));
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
    toast({
      title: "ПРОТОКОЛ ЗАВЕРШЁН",
      description: `Всего заработано: ${totalSats} SATS`,
      className: "bg-[#2A2A2A] border-[#B87333] text-[#B87333] font-mono"
    });
  };

  // Loading state
  if (phase === "loading" || !sessionId || isSessionLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <GridBackground />
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
            ИНИЦИАЛИЗАЦИЯ ПРОТОКОЛА...
          </motion.div>
        </div>
      </div>
    );
  }

  // Phase 1: Questions
  if (phase === "phase_1") {
    const question = QUESTIONS[currentQuestion - 1];
    
    return (
      <div className="min-h-screen bg-[#F5F5F5] relative overflow-hidden">
        <GridBackground />
        <CircuitBoard completedLayers={completedLayers} />
        
        {/* Back button */}
        {currentQuestion > 1 && (
          <BackButton onClick={handleBack} isDark={false} />
        )}
        
        {/* Header */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-1"
          >
            <span className="text-[9px] text-[#B87333]/50 tracking-[3px] font-mono">
              DIGITAL RESISTANCE
            </span>
            <span className="text-[11px] text-[#B87333] tracking-[3px] font-mono">
              СБОРКА ПРОТОКОЛА
            </span>
          </motion.div>
        </div>

        {/* Question */}
        <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              <motion.h1 
                className="text-[16px] text-[#B87333] tracking-[4px] font-semibold mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {question.title}
              </motion.h1>
              
              <div className="flex gap-4">
                {question.options.map((option, idx) => (
                  <motion.button
                    key={option.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.1 }}
                    onClick={() => handleQuestionAnswer(question.id as QuestionId, option.correct)}
                    className="w-40 h-14 bg-transparent border-2 border-[#B87333] text-[#3E3129] 
                             text-[14px] font-medium tracking-wider font-mono
                             hover:bg-[#B87333] hover:text-[#F5F5F5] 
                             transition-all duration-200"
                    data-testid={`button-q${question.id}-${idx === 0 ? 'a' : 'b'}`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
              
              {/* Progress dots */}
              <div className="flex gap-3 mt-12">
                {[1, 2, 3].map((q) => (
                  <motion.div
                    key={q}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      q < currentQuestion ? 'bg-[#B87333]' : 
                      q === currentQuestion ? 'bg-[#B87333]/50' : 
                      'bg-[#D4956A]/30'
                    }`}
                    animate={q === currentQuestion ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <IndependenceBar progress={progress} phase="phase_1" />
      </div>
    );
  }

  // Phase 1 Complete - chip becomes the CTA
  if (phase === "phase_1_complete") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] relative overflow-hidden">
        <GridBackground />
        <CircuitBoard completedLayers={3} onChipClick={handleChipClick} />
        
        <BackButton onClick={handleBack} isDark={false} />
        
        <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              className="text-[9px] text-[#B87333]/50 tracking-[3px] font-mono mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              DIGITAL RESISTANCE
            </motion.div>
            
            <motion.h1 
              className="text-[18px] text-[#B87333] tracking-[3px] font-semibold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ПРОТОКОЛ СОБРАН
            </motion.h1>
            
            <motion.div
              className="text-[28px] text-[#B87333] font-bold mb-8 font-mono"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              +150 SATS
            </motion.div>
            
            <motion.p
              className="text-[12px] text-[#3E3129]/60 tracking-wider mb-8 max-w-xs font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Нажмите на чип в центре схемы для активации суверенитета
            </motion.p>
            
            {/* Alternative button for mobile / accessibility */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              onClick={handleActivate}
              className="w-72 h-14 bg-[#B87333] text-[#F5F5F5] 
                       text-[13px] font-semibold tracking-[2px]
                       hover:bg-[#A66829] 
                       transition-all duration-300 font-mono"
              data-testid="button-activate"
            >
              АКТИВИРОВАТЬ СУВЕРЕНИТЕТ
            </motion.button>
          </motion.div>
        </div>

        <IndependenceBar progress={progress} phase="phase_1" />
      </div>
    );
  }

  // Vertical transition animation (center to down)
  if (phase === "transition") {
    return (
      <div className="min-h-screen bg-[#2A2A2A] relative overflow-hidden">
        {/* Dark terminal is revealed behind */}
        <motion.div 
          className="absolute inset-0 bg-[#2A2A2A] z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Top panel sliding up */}
        <motion.div
          className="absolute inset-x-0 top-0 h-1/2 bg-[#F5F5F5] z-20"
          initial={{ y: 0 }}
          animate={{ y: "-100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        >
          <div className="w-full h-full border-b-2 border-[#B87333]/40" />
          {/* Glitch lines */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-1 bg-[#B87333]/60"
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.3, repeat: 3 }}
          />
        </motion.div>
        
        {/* Bottom panel sliding down */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-[#F5F5F5] z-20"
          initial={{ y: 0 }}
          animate={{ y: "100%" }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
        >
          <div className="w-full h-full border-t-2 border-[#B87333]/40" />
          {/* Glitch lines */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-1 bg-[#B87333]/60"
            animate={{ opacity: [0, 1, 0, 1, 0] }}
            transition={{ duration: 0.3, repeat: 3 }}
          />
        </motion.div>
        
        {/* Center flash effect */}
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
            className="text-[11px] text-[#B87333] tracking-[4px] font-mono"
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="h-screen pb-16"
        >
          <TerminalChat 
            dialogues={DIALOGUES}
            onDialogueComplete={handleDialogueReward}
            onComplete={handlePhase2Complete}
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
        {/* Subtle grid for dark mode */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gridDark" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B87333" strokeWidth="0.3" />
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
            className="text-[9px] text-[#B87333]/50 tracking-[3px] font-mono mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            DIGITAL RESISTANCE // COMPLETE
          </motion.div>
          
          <motion.h1 
            className="text-[18px] text-[#B87333] tracking-[3px] font-semibold mb-3"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ПРОТОКОЛ ЗАВЕРШЁН
          </motion.h1>
          
          <motion.p className="text-[#E8E8E8]/70 text-sm mb-8 font-mono tracking-wider">
            ТЫ АКТИВИРОВАН
          </motion.p>
          
          <motion.div
            className="text-[36px] text-[#B87333] font-bold font-mono"
            animate={{ 
              textShadow: [
                "0 0 10px rgba(184,115,51,0.3)",
                "0 0 30px rgba(184,115,51,0.6)",
                "0 0 10px rgba(184,115,51,0.3)"
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            +{totalSats} SATS
          </motion.div>
          
          <motion.div
            className="mt-8 px-6 py-3 border border-[#B87333]/50 text-[#B87333] text-xs tracking-wider font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            INDEPENDENCE: {progress}%
          </motion.div>
          
          <motion.p
            className="mt-6 text-[10px] text-[#E8E8E8]/40 tracking-wider font-mono max-w-xs"
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
