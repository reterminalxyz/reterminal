import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircuitBoard } from "@/components/CircuitBoard";
import { IndependenceBar } from "@/components/IndependenceBar";
import { TerminalChat } from "@/components/TerminalChat";
import { useCreateSession, useUpdateSession, useSession } from "@/hooks/use-sessions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Phase = "loading" | "phase_1" | "phase_1_complete" | "transition" | "phase_2" | "complete";
type QuestionId = 1 | 2 | 3;

const QUESTIONS = [
  { id: 1, title: "СВОБОДА", options: [{ label: "ПРАВО", score: 10 }, { label: "СЕРВИС", score: 0 }] },
  { id: 2, title: "СОБСТВЕННОСТЬ", options: [{ label: "БАНК", score: 10 }, { label: "Я", score: 0 }] },
  { id: 3, title: "СУВЕРЕНИТЕТ", options: [{ label: "ИНСТРУМЕНТ", score: 10 }, { label: "РИСК", score: 0 }] },
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
  const [score, setScore] = useState(0);
  const [totalSats, setTotalSats] = useState(0);
  
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

  const handleQuestionAnswer = (questionId: QuestionId, scoreValue: number) => {
    setScore(prev => prev + scoreValue);
    setCompletedLayers(questionId);
    
    if (sessionId) {
      updateSession.mutate({
        id: sessionId,
        actionId: `q${questionId}_answer`,
        scoreDelta: scoreValue,
        nextStepId: `phase_1_q${questionId}`
      });
    }

    setTimeout(() => {
      if (questionId < 3) {
        setCurrentQuestion((questionId + 1) as QuestionId);
      } else {
        setTotalSats(prev => prev + 150);
        setPhase("phase_1_complete");
        toast({
          title: "+150 SATS",
          description: "Фаза 1 завершена",
          className: "bg-[#2A2A2A] border-[#B87333] text-[#B87333] font-mono"
        });
      }
    }, 800);
  };

  const handleActivate = () => {
    setPhase("transition");
    setTimeout(() => {
      setPhase("phase_2");
    }, 1200);
  };

  const handleDialogueReward = (reward: number) => {
    setTotalSats(prev => prev + reward);
  };

  const handlePhase2Complete = () => {
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
        <div className="flex flex-col items-center gap-4">
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
            INITIALIZING...
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
        <CircuitBoard completedLayers={completedLayers} />
        
        {/* Header */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
          <span className="text-[10px] text-[#B87333]/60 tracking-[3px] font-mono">
            СБОРКА ПРОТОКОЛА
          </span>
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
                className="text-[14px] text-[#B87333] tracking-[3px] font-semibold mb-12"
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
                    onClick={() => handleQuestionAnswer(question.id as QuestionId, option.score)}
                    className="w-40 h-14 bg-transparent border-2 border-[#B87333] text-[#2A2A2A] 
                             text-[14px] font-medium tracking-wider
                             hover:bg-[#B87333] hover:text-[#F5F5F5] 
                             transition-all duration-200 font-mono"
                    data-testid={`button-q${question.id}-${idx === 0 ? 'a' : 'b'}`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
              
              {/* Progress dots */}
              <div className="flex gap-2 mt-12">
                {[1, 2, 3].map((q) => (
                  <div
                    key={q}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      q < currentQuestion ? 'bg-[#B87333]' : 
                      q === currentQuestion ? 'bg-[#B87333]/50' : 
                      'bg-[#E8E8E8]'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <IndependenceBar score={score} maxScore={30} />
      </div>
    );
  }

  // Phase 1 Complete
  if (phase === "phase_1_complete") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] relative overflow-hidden">
        <CircuitBoard completedLayers={3} />
        
        <div className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center"
          >
            <motion.h1 
              className="text-[18px] text-[#B87333] tracking-[2px] font-semibold mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              ПРОТОКОЛ СОБРАН
            </motion.h1>
            
            <motion.div
              className="text-[28px] text-[#B87333] font-bold mb-12 font-mono"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              +150 SATS
            </motion.div>
            
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={handleActivate}
              className="w-80 h-16 bg-[#B87333] text-[#F5F5F5] 
                       text-[14px] font-semibold tracking-[2px]
                       hover:bg-[#A66829] hover:-translate-y-0.5
                       hover:shadow-lg hover:shadow-[#B87333]/30
                       transition-all duration-300 font-mono"
              data-testid="button-activate"
            >
              АКТИВИРОВАТЬ СУВЕРЕНИТЕТ
            </motion.button>
          </motion.div>
        </div>

        <IndependenceBar score={score} maxScore={30} />
      </div>
    );
  }

  // Transition animation
  if (phase === "transition") {
    return (
      <div className="min-h-screen bg-[#F5F5F5] relative overflow-hidden">
        <CircuitBoard completedLayers={3} />
        
        {/* Left panel sliding out */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/2 bg-[#F5F5F5] z-20"
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <div className="w-full h-full border-r border-[#B87333]/30" />
        </motion.div>
        
        {/* Right panel sliding out */}
        <motion.div
          className="absolute inset-y-0 right-0 w-1/2 bg-[#F5F5F5] z-20"
          initial={{ x: 0 }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <div className="w-full h-full border-l border-[#B87333]/30" />
        </motion.div>
        
        {/* Terminal revealed underneath */}
        <motion.div 
          className="absolute inset-0 bg-[#2A2A2A] z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
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
        
        <IndependenceBar score={score} maxScore={30} />
      </div>
    );
  }

  // Complete
  if (phase === "complete") {
    return (
      <div className="min-h-screen bg-[#2A2A2A] flex items-center justify-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center px-4"
        >
          <motion.h1 
            className="text-[18px] text-[#B87333] tracking-[2px] font-semibold mb-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ПРОТОКОЛ ЗАВЕРШЁН
          </motion.h1>
          
          <motion.p className="text-[#E8E8E8]/70 text-sm mb-8 font-mono">
            ТЫ АКТИВИРОВАН
          </motion.p>
          
          <motion.div
            className="text-[32px] text-[#B87333] font-bold font-mono"
            animate={{ 
              textShadow: [
                "0 0 10px rgba(184,115,51,0.3)",
                "0 0 30px rgba(184,115,51,0.5)",
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
            INDEPENDENCE SCORE: {score}/30
          </motion.div>
        </motion.div>
        
        <IndependenceBar score={score} maxScore={30} />
      </div>
    );
  }

  return null;
}
