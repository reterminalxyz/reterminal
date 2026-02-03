import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/Layout";
import { TactileButton } from "@/components/TactileButton";
import { TechnicalReadout } from "@/components/TechnicalReadout";
import { Oscilloscope } from "@/components/Oscilloscope";
import { NetworkNodes } from "@/components/NetworkNodes";
import { BackButton } from "@/components/BackButton";
import { useCreateSession, useUpdateSession, useSession } from "@/hooks/use-sessions";
import { Loader2, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type StepId = "step_0" | "step_1" | "step_2" | "step_3" | "step_4";

const STEP_ORDER: StepId[] = ["step_0", "step_1", "step_2", "step_3", "step_4"];

export default function Home() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<StepId>("step_0");
  const [localScore, setLocalScore] = useState(0);
  
  const { data: session, isLoading: isSessionLoading } = useSession(sessionId);
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const { toast } = useToast();

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

  useEffect(() => {
    if (session) {
      setCurrentStep(session.currentStepId as StepId);
      setLocalScore(session.independenceScore);
    }
  }, [session]);

  const handleTransition = (nextStep: StepId, actionId: string = "nav", scoreDelta: number = 0) => {
    if (!sessionId) return;
    
    setCurrentStep(nextStep);
    setLocalScore(prev => prev + scoreDelta);
    
    updateSession.mutate({
      id: sessionId,
      actionId,
      scoreDelta,
      nextStepId: nextStep
    });
  };

  const handleBack = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevStep = STEP_ORDER[currentIndex - 1];
      handleTransition(prevStep, "nav_back", 0);
    }
  };

  const canGoBack = STEP_ORDER.indexOf(currentStep) > 0;

  // --- Step Components ---

  const Step0_NFC = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center space-y-8 w-full h-full relative"
    >
      {/* NFC Card visualization */}
      <motion.div 
        className="relative w-72 h-44 glass-panel rounded-2xl flex items-center justify-center overflow-hidden"
        animate={{ rotateY: [0, 5, 0, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Scanning beam */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent"
          initial={{ top: "-100%" }}
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Card interior */}
        <div className="relative w-56 h-32 border border-primary/20 rounded-xl flex items-center justify-center bg-gradient-to-br from-white/5 to-transparent">
          <div className="text-[9px] text-primary/60 absolute top-2 right-2 tracking-widest">NFC</div>
          <div className="text-[9px] text-foreground/40 absolute bottom-2 left-2 tracking-wider">LIBERTÀ CARD</div>
          
          {/* NFC chip animation */}
          <motion.div 
            className="w-14 h-14 rounded-full border border-primary/40 flex items-center justify-center"
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(255,87,34,0)",
                "0 0 0 15px rgba(255,87,34,0.1)",
                "0 0 0 30px rgba(255,87,34,0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-8 h-8 rounded-full border border-primary/60"
              animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Technical log */}
      <div className="absolute bottom-16 left-6">
        <TechnicalReadout 
          lines={[
            "READING PHYSICAL LAYER...", 
            "PROTOCOL: LIBERTÀ ACTIVATED", 
            "NFC HANDSHAKE: OK"
          ]} 
          delay={500}
        />
      </div>

      {/* Hidden simulate button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-16">
        <TactileButton 
          onClick={() => handleTransition("step_1")}
          className="opacity-30 hover:opacity-100 transition-opacity text-xs"
          data-testid="button-simulate-nfc"
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
      {/* Glass card container */}
      <motion.div 
        className="glass-panel rounded-xl p-8 w-full"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-6">
          <motion.h2 
            className="text-xs text-primary tracking-[0.25em] font-medium"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ОПРЕДЕЛЕНИЕ КООРДИНАТ
          </motion.h2>
          <h1 className="text-xl md:text-2xl font-light leading-relaxed text-foreground/90">
            Свобода для тебя — это...
          </h1>
        </div>

        <div className="flex flex-col gap-4 w-full mt-10">
          <TactileButton 
            variant="primary" 
            fullWidth
            onClick={() => handleTransition("step_2", "action_1a", 10)}
            data-testid="button-choice-1a"
          >
            Право не спрашивать разрешения
          </TactileButton>
          <TactileButton 
            variant="secondary" 
            fullWidth
            onClick={() => handleTransition("step_2", "action_1b", 0)}
            data-testid="button-choice-1b"
          >
            Удобный сервис
          </TactileButton>
        </div>
      </motion.div>
    </motion.div>
  );

  const Step2_Money = () => {
    const [revealed, setRevealed] = useState(false);

    const handleChoice = (score: number, actionId: string) => {
      setRevealed(true);
      setLocalScore(prev => prev + score);
      
      if (sessionId) {
        updateSession.mutate({ id: sessionId, actionId, scoreDelta: score, nextStepId: "step_2" });
      }

      setTimeout(() => {
        handleTransition("step_3", "step_2_complete", 0);
      }, 6000);
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex flex-col items-center w-full max-w-lg space-y-6"
      >
        <Oscilloscope />

        <motion.div 
          className="glass-panel rounded-xl p-8 w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center space-y-4 mb-8">
            <motion.h2 
              className="text-xs text-primary tracking-[0.25em]"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ФИНАНСОВАЯ РЕАЛЬНОСТЬ
            </motion.h2>
            <h1 className="text-lg md:text-xl font-light leading-relaxed">
              Чьи деньги лежат на твоём банковском счету?
            </h1>
          </div>

          <AnimatePresence mode="wait">
            {!revealed ? (
              <motion.div 
                key="choices"
                className="flex flex-col gap-4 w-full"
                exit={{ opacity: 0, y: -20 }}
              >
                <TactileButton 
                  variant="primary" fullWidth
                  onClick={() => handleChoice(0, "action_2a")}
                  data-testid="button-choice-2a"
                >
                  Мои собственные
                </TactileButton>
                <TactileButton 
                  variant="secondary" fullWidth
                  onClick={() => handleChoice(10, "action_2b")}
                  data-testid="button-choice-2b"
                >
                  Собственность банка
                </TactileButton>
              </motion.div>
            ) : (
              <motion.div 
                key="reveal"
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="p-5 border-l-2 border-primary bg-primary/5 rounded-r-lg"
              >
                <p className="text-sm md:text-base leading-relaxed text-foreground/80">
                  Банк — лишь посредник. Он контролирует доступ к твоим средствам и может заморозить их в любой момент.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-primary mt-3 font-medium">
                  Ты не владеешь деньгами на счету — ты владеешь обещанием банка.
                </p>
                
                <motion.div 
                  className="mt-5 flex items-center gap-2 text-xs text-foreground/40"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="uppercase tracking-widest">Processing...</span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  };

  const Step3_Manifest = () => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col md:flex-row items-center w-full max-w-4xl gap-8 md:gap-12"
    >
      {/* Left Panel - Avatar */}
      <motion.div 
        className="w-32 h-32 md:w-48 md:h-48 flex-shrink-0 relative float"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="absolute inset-0 bg-primary/10 rounded-full blur-[60px] breathe-glow" />
        <div className="relative w-full h-full glass-panel rounded-full flex items-center justify-center overflow-hidden">
          <motion.div 
            className="w-3/4 h-3/4 bg-gradient-to-br from-primary/60 to-primary/20 rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="absolute inset-4 border border-primary/20 rounded-full" />
        </div>
      </motion.div>

      {/* Right Panel - Text */}
      <motion.div 
        className="flex-1 glass-panel rounded-xl p-6 md:p-8"
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.h2 
          className="text-xs text-primary tracking-[0.25em] mb-6"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ПРОТОКОЛ САТОШИ
        </motion.h2>
        
        <div className="space-y-4 text-sm md:text-base leading-relaxed text-foreground/80">
          <p>Карта в твоих руках — это не просто пластик.</p>
          <p>Это инструмент, позволяющий выйти из системы, где каждая транзакция требует одобрения.</p>
          <p>Система Lightning работает без посредников. Без разрешений. Без границ.</p>
          <p className="text-primary font-medium text-base md:text-lg">
            Ты больше не клиент. Ты — узел в сети свободы.
          </p>
        </div>

        <div className="mt-8">
          <TactileButton 
            variant="primary"
            onClick={() => handleTransition("step_4", "action_3_continue")}
            data-testid="button-continue"
          >
            ПРОДОЛЖИТЬ
          </TactileButton>
        </div>
      </motion.div>
    </motion.div>
  );

  const Step4_Activation = () => {
    const [rewardTriggered, setRewardTriggered] = useState(false);

    const handleAccept = () => {
      setRewardTriggered(true);
      setLocalScore(prev => prev + 15);
      
      if (sessionId) {
        updateSession.mutate({ id: sessionId, actionId: "action_4_accept", scoreDelta: 15, nextStepId: "step_4" });
      }
      
      toast({
        title: "SATS RECEIVED",
        description: "+500 SATS deposited to your node.",
        className: "glass-panel border-primary/30 text-foreground font-mono"
      });
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex flex-col items-center w-full max-w-lg space-y-6 text-center"
      >
        <NetworkNodes />

        <motion.div 
          className="glass-panel rounded-xl p-8 w-full"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h2 
            className="text-xs text-primary tracking-[0.25em] mb-4"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            АКТИВАЦИЯ УЗЛА
          </motion.h2>
          <h1 className="text-lg md:text-xl font-light leading-relaxed mb-8">
            Протокол готов. Твой первый узел в сети свободы активирован.
          </h1>

          <AnimatePresence mode="wait">
            {!rewardTriggered ? (
              <motion.div key="accept" exit={{ opacity: 0, scale: 0.9 }}>
                <TactileButton 
                  variant="primary"
                  onClick={handleAccept}
                  className="shadow-[0_0_30px_rgba(255,87,34,0.4)] font-bold"
                  data-testid="button-accept-sats"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    ПРИНЯТЬ САТОШИ
                  </span>
                </TactileButton>
              </motion.div>
            ) : (
              <motion.div 
                key="reward"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center space-y-4"
              >
                <motion.div 
                  className="flex items-baseline gap-1 text-primary"
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(255,87,34,0.5)",
                      "0 0 30px rgba(255,87,34,0.8)",
                      "0 0 10px rgba(255,87,34,0.5)"
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-5xl md:text-6xl font-bold">+500</span>
                  <span className="text-xl tracking-widest">SATS</span>
                </motion.div>
                
                <motion.div 
                  className="glass-panel px-4 py-2 rounded-md text-xs text-primary/70 tracking-wider"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  VERIFIED ON LIGHTNING NETWORK
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Technical readout */}
        <div className="absolute bottom-16 left-6 text-left">
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
        <div className="flex flex-col items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-primary" />
          </motion.div>
          <motion.div 
            className="text-xs tracking-[0.3em] text-primary/70"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            INITIALIZING SYSTEM...
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Back Button */}
      <AnimatePresence>
        {canGoBack && <BackButton onClick={handleBack} />}
      </AnimatePresence>

      {/* Score Indicator */}
      <motion.div 
        className="fixed top-6 right-6 z-40 glass-panel px-3 py-2 rounded-md"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[9px] tracking-wider text-foreground/50 uppercase">IND_SCORE</span>
          <motion.span 
            className="text-sm font-bold text-primary font-mono"
            key={localScore}
            initial={{ scale: 1.3 }}
            animate={{ scale: 1 }}
          >
            {String(localScore).padStart(2, '0')}
          </motion.span>
        </div>
      </motion.div>

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
