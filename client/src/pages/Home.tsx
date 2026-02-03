import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { TactileButton } from "@/components/TactileButton";
import { TechnicalReadout } from "@/components/TechnicalReadout";
import { Oscilloscope } from "@/components/Oscilloscope";
import { NetworkNodes } from "@/components/NetworkNodes";
import { useCreateSession, useUpdateSession, useSession } from "@/hooks/use-sessions";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StepId = "step_0" | "step_1" | "step_2" | "step_3" | "step_4";

export default function Home() {
  // State
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<StepId>("step_0");
  const [stepData, setStepData] = useState<any>(null); // To store temporary UI state like revealed truths
  
  // Queries & Mutations
  const { data: session, isLoading: isSessionLoading } = useSession(sessionId);
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const { toast } = useToast();

  // Create session on mount if not exists
  useEffect(() => {
    if (!sessionId) {
      createSession.mutate({ nodeId: "#RE_CHAIN_" + Math.floor(Math.random() * 9999) }, {
        onSuccess: (data) => {
          setSessionId(data.id);
          setCurrentStep("step_0");
        }
      });
    }
  }, []);

  // Sync step with backend session if available
  useEffect(() => {
    if (session) {
      setCurrentStep(session.currentStepId as StepId);
    }
  }, [session]);

  const handleTransition = (nextStep: StepId, actionId: string = "nav", scoreDelta: number = 0) => {
    if (!sessionId) return;
    
    // Optimistic update for UI responsiveness
    setCurrentStep(nextStep);
    
    // Background sync
    updateSession.mutate({
      id: sessionId,
      actionId,
      scoreDelta,
      nextStepId: nextStep
    });
  };

  // --- Step Components ---

  const Step0_NFC = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center space-y-8 w-full h-full relative"
    >
      <div className="relative w-64 h-40 border-2 border-primary/30 rounded-xl flex items-center justify-center overflow-hidden">
        {/* X-Ray Scan Animation */}
        <motion.div 
          className="absolute inset-0 bg-primary/10"
          initial={{ top: "-100%" }}
          animate={{ top: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <div className="border border-primary/50 w-48 h-28 rounded-lg flex items-center justify-center relative">
          <div className="text-[10px] text-primary absolute top-2 right-2">NFC</div>
          <motion.div 
            className="w-12 h-12 rounded-full border-2 border-primary"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </div>

      <div className="absolute bottom-12 left-0">
        <TechnicalReadout 
          lines={[
            "READING PHYSICAL LAYER...", 
            "PROTOCOL: LIBERTÀ ACTIVATED", 
            "NFC HANDSHAKE: OK"
          ]} 
          delay={500}
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <TactileButton 
          onClick={() => handleTransition("step_1")}
          className="opacity-0 hover:opacity-100 transition-opacity"
          aria-label="Simulate NFC Tap"
        >
          SIMULATE NFC
        </TactileButton>
      </div>
    </motion.div>
  );

  const Step1_Freedom = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center w-full max-w-lg text-center space-y-12"
    >
      <div className="space-y-4">
        <h2 className="text-sm text-primary tracking-[0.2em]">ОПРЕДЕЛЕНИЕ КООРДИНАТ</h2>
        <h1 className="text-2xl md:text-3xl font-light leading-snug">
          Свобода для тебя — это...
        </h1>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <TactileButton 
          variant="primary" 
          fullWidth
          onClick={() => handleTransition("step_2", "action_1a", 10)}
        >
          Право не спрашивать разрешения
        </TactileButton>
        <TactileButton 
          variant="secondary" 
          fullWidth
          onClick={() => handleTransition("step_2", "action_1b", 0)}
        >
          Удобный сервис
        </TactileButton>
      </div>
    </motion.div>
  );

  const Step2_Money = () => {
    const [revealed, setRevealed] = useState(false);
    const [choice, setChoice] = useState<"a" | "b" | null>(null);

    const handleChoice = (selected: "a" | "b", score: number, actionId: string) => {
      setRevealed(true);
      setChoice(selected);
      // Wait to read the reveal, then auto-advance or show continue button?
      // Scenario implies immediate reveal, then maybe user clicks continue or auto advances.
      // Let's perform mutation but stay on screen for reveal duration.
      if (sessionId) {
        updateSession.mutate({ id: sessionId, actionId, scoreDelta: score, nextStepId: "step_2" }); // Keep step_2 locally for now
      }

      // Auto advance after reading time (e.g. 6s)
      setTimeout(() => {
        handleTransition("step_3", "step_2_complete", 0);
      }, 7000);
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex flex-col items-center w-full max-w-lg space-y-8"
      >
        <div className="w-full">
          <Oscilloscope />
        </div>

        <div className="text-center space-y-4">
          <h2 className="text-sm text-primary tracking-[0.2em]">ФИНАНСОВАЯ РЕАЛЬНОСТЬ</h2>
          <h1 className="text-xl md:text-2xl font-light leading-snug">
            Чьи деньги лежат на твоём банковском счету?
          </h1>
        </div>

        {!revealed ? (
          <div className="flex flex-col gap-4 w-full">
            <TactileButton 
              variant="primary" fullWidth
              onClick={() => handleChoice("a", 0, "action_2a")}
            >
              Мои собственные
            </TactileButton>
            <TactileButton 
              variant="secondary" fullWidth
              onClick={() => handleChoice("b", 10, "action_2b")}
            >
              Собственность банка
            </TactileButton>
          </div>
        ) : (
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-full p-6 border-l-4 border-primary bg-primary/5 text-primary-foreground/90 text-sm md:text-base leading-relaxed mt-4"
          >
            Банк — лишь посредник. Он контролирует доступ к твоим средствам и может заморозить их в любой момент. 
            <br/><br/>
            Ты не владеешь деньгами на счету — ты владеешь обещанием банка.
            
            <div className="mt-4 text-xs opacity-50 uppercase tracking-widest">
              CONTINUING SEQUENCE...
            </div>
          </motion.div>
        )}
      </motion.div>
    );
  };

  const Step3_Manifest = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col md:flex-row items-center w-full max-w-4xl gap-8 md:gap-12"
    >
      {/* Left Panel - Avatar */}
      <div className="w-32 h-32 md:w-64 md:h-64 flex-shrink-0 relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative w-full h-full border-2 border-primary/50 rounded-full flex items-center justify-center bg-black/50 overflow-hidden">
          <div className="w-3/4 h-3/4 bg-primary rounded-full opacity-80 blur-sm" />
          <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        </div>
      </div>

      {/* Right Panel - Text */}
      <div className="flex-1 space-y-8">
        <h2 className="text-sm text-primary tracking-[0.2em]">ПРОТОКОЛ САТОШИ</h2>
        <div className="space-y-4 text-sm md:text-lg leading-relaxed text-[#E0E0E0]/90">
          <p>Карта в твоих руках — это не просто пластик.</p>
          <p>Это инструмент, позволяющий выйти из системы, где каждая транзакция требует одобрения.</p>
          <p>Система Lightning работает без посредников. Без разрешений. Без границ.</p>
          <p className="text-primary font-bold">Ты больше не клиент. Ты — узел в сети свободы.</p>
        </div>

        <TactileButton 
          variant="primary"
          onClick={() => handleTransition("step_4", "action_3_continue")}
          className="mt-4"
        >
          ПРОДОЛЖИТЬ
        </TactileButton>
      </div>
    </motion.div>
  );

  const Step4_Activation = () => {
    const [rewardTriggered, setRewardTriggered] = useState(false);

    const handleAccept = () => {
      setRewardTriggered(true);
      if (sessionId) {
        updateSession.mutate({ id: sessionId, actionId: "action_4_accept", scoreDelta: 15, nextStepId: "step_4" }); // Stay on step 4
      }
      
      // Play sound effect logic here if we had sounds
      toast({
        title: "SATS RECEIVED",
        description: "+500 SATS deposited to your node.",
        className: "border-primary text-primary bg-black font-mono"
      });
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex flex-col items-center w-full max-w-lg space-y-8 text-center"
      >
        <div className="w-full">
          <NetworkNodes />
        </div>

        <div className="space-y-4">
          <h2 className="text-sm text-primary tracking-[0.2em]">АКТИВАЦИЯ УЗЛА</h2>
          <h1 className="text-xl md:text-2xl font-light leading-snug">
            Протокол готов. Твой первый узел в сети свободы активирован.
          </h1>
        </div>

        {!rewardTriggered ? (
          <TactileButton 
            variant="primary"
            onClick={handleAccept}
            className="shadow-[0_0_20px_rgba(255,87,34,0.3)] hover:shadow-[0_0_40px_rgba(255,87,34,0.6)] font-bold text-lg py-6"
          >
            ПРИНЯТЬ САТОШИ
          </TactileButton>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center space-y-2"
          >
            <div className="text-6xl md:text-8xl font-bold text-primary animate-pulse font-mono">
              +500
            </div>
            <div className="text-xl tracking-widest text-[#E0E0E0]">SATS</div>
            <div className="mt-8 text-xs text-primary/60 border border-primary/30 px-4 py-2 rounded">
              TRANSACTION VERIFIED ON LIGHTNING NETWORK
            </div>
          </motion.div>
        )}

        <div className="absolute bottom-12 left-6 text-left">
           <TechnicalReadout 
            lines={[
              `NODE_ID: ${session?.nodeId || "CONNECTING..."}`,
              "STATUS: ACTIVE",
              "NETWORK: LIGHTNING",
              "PEERS: CONNECTED (8)"
            ]} 
          />
        </div>
      </motion.div>
    );
  };

  if (!sessionId || isSessionLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center gap-4 text-primary">
          <Loader2 className="w-8 h-8 animate-spin" />
          <div className="text-xs tracking-[0.3em] animate-pulse">INITIALIZING SYSTEM...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Session Score Indicator */}
      <div className="fixed top-6 right-6 font-mono text-xs text-primary/50 border border-primary/20 px-2 py-1 z-40">
        IND_SCORE: {String(session?.independenceScore || 0).padStart(2, '0')}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === "step_0" && <Step0_NFC key="step0" />}
        {currentStep === "step_1" && <Step1_Freedom key="step1" />}
        {currentStep === "step_2" && <Step2_Money key="step2" />}
        {currentStep === "step_3" && <Step3_Manifest key="step3" />}
        {currentStep === "step_4" && <Step4_Activation key="step4" />}
      </AnimatePresence>
    </Layout>
  );
}
