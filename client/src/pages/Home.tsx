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

  const Step0_NFC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanComplete, setScanComplete] = useState(false);

    const handleScan = () => {
      setIsScanning(true);
      setTimeout(() => {
        setScanComplete(true);
        setTimeout(() => {
          handleTransition("step_1");
        }, 800);
      }, 2500);
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex flex-col items-center justify-center space-y-8 w-full h-full relative"
      >
        {/* NFC Card with Light Scan */}
        <motion.div 
          className="relative w-80 h-52 glass-panel rounded-xl flex items-center justify-center overflow-hidden floating-shadow"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Vertical Light Scan Beam */}
          {isScanning && (
            <motion.div 
              className="absolute left-0 top-0 w-1 h-full z-20"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(184,115,51,0.4) 30%, rgba(184,115,51,0.9) 50%, rgba(184,115,51,0.4) 70%, transparent 100%)",
                boxShadow: "0 0 40px rgba(184,115,51,0.6), 0 0 80px rgba(184,115,51,0.3)",
                width: "8px"
              }}
              initial={{ left: "-10px" }}
              animate={{ left: "calc(100% + 10px)" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
            />
          )}
          
          {/* Antenna Schematic - Revealed by scan */}
          <div className={`absolute inset-4 transition-opacity duration-500 ${isScanning || scanComplete ? 'opacity-100' : 'opacity-10'}`}>
            {/* Circuit traces */}
            <svg className="w-full h-full" viewBox="0 0 280 160" fill="none">
              {/* NFC Coil */}
              <rect x="90" y="40" width="100" height="80" rx="8" stroke="#B87333" strokeWidth="0.5" strokeDasharray={isScanning ? "none" : "4 4"} className={scanComplete ? "opacity-100" : "opacity-60"} />
              <rect x="100" y="50" width="80" height="60" rx="6" stroke="#B87333" strokeWidth="0.5" strokeDasharray={isScanning ? "none" : "4 4"} className={scanComplete ? "opacity-100" : "opacity-60"} />
              <rect x="110" y="60" width="60" height="40" rx="4" stroke="#B87333" strokeWidth="0.5" strokeDasharray={isScanning ? "none" : "4 4"} className={scanComplete ? "opacity-100" : "opacity-60"} />
              
              {/* Connection lines */}
              <line x1="40" y1="80" x2="90" y2="80" stroke="#B87333" strokeWidth="0.5" className={scanComplete ? "opacity-100" : "opacity-40"} />
              <line x1="190" y1="80" x2="240" y2="80" stroke="#B87333" strokeWidth="0.5" className={scanComplete ? "opacity-100" : "opacity-40"} />
              
              {/* Chip */}
              <rect x="125" y="70" width="30" height="20" fill="rgba(184,115,51,0.1)" stroke="#B87333" strokeWidth="0.5" className={scanComplete ? "opacity-100" : "opacity-60"} />
              <line x1="130" y1="75" x2="150" y2="75" stroke="#B87333" strokeWidth="0.3" />
              <line x1="130" y1="80" x2="150" y2="80" stroke="#B87333" strokeWidth="0.3" />
              <line x1="130" y1="85" x2="150" y2="85" stroke="#B87333" strokeWidth="0.3" />
              
              {/* Corner markers */}
              <path d="M20 20 L20 35 M20 20 L35 20" stroke="#B87333" strokeWidth="0.5" />
              <path d="M260 20 L260 35 M260 20 L245 20" stroke="#B87333" strokeWidth="0.5" />
              <path d="M20 140 L20 125 M20 140 L35 140" stroke="#B87333" strokeWidth="0.5" />
              <path d="M260 140 L260 125 M260 140 L245 140" stroke="#B87333" strokeWidth="0.5" />
            </svg>
          </div>
          
          {/* Labels */}
          <div className="absolute top-3 left-4 text-[9px] text-[#B87333]/70 tracking-[0.2em] eink-text">NFC-A</div>
          <div className="absolute top-3 right-4 text-[9px] text-[#B87333]/70 tracking-[0.2em] eink-text">13.56MHz</div>
          <div className="absolute bottom-3 left-4 text-[9px] text-[#3E3129]/60 tracking-wider eink-text">LIBERTÀ CARD</div>
          <div className="absolute bottom-3 right-4 text-[9px] text-[#3E3129]/40 tracking-wider eink-text">v2.1</div>
          
          {/* Scan complete indicator */}
          {scanComplete && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center bg-[#B87333]/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="text-[#B87333] text-sm tracking-[0.3em] font-semibold eink-text"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                VERIFIED
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Technical log */}
        <div className="absolute bottom-20 left-8">
          <TechnicalReadout 
            lines={
              isScanning 
                ? ["SCANNING PHYSICAL LAYER...", "PROTOCOL: LIBERTÀ", "HANDSHAKE: PENDING..."]
                : scanComplete 
                  ? ["SCAN COMPLETE", "PROTOCOL: LIBERTÀ ACTIVATED", "NFC HANDSHAKE: OK"]
                  : ["AWAITING NFC CARD...", "PROTOCOL: STANDBY"]
            } 
            delay={300}
          />
        </div>

        {/* Simulate button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-24">
          <TactileButton 
            onClick={handleScan}
            disabled={isScanning || scanComplete}
            className={`text-xs ${isScanning || scanComplete ? 'opacity-30' : ''}`}
            data-testid="button-simulate-nfc"
          >
            {isScanning ? "SCANNING..." : scanComplete ? "COMPLETE" : "SIMULATE NFC"}
          </TactileButton>
        </div>
      </motion.div>
    );
  };

  const Step1_Freedom = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center w-full max-w-lg text-center space-y-12"
    >
      {/* Glass card container */}
      <motion.div 
        className="glass-panel rounded-xl p-8 w-full floating-shadow"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="space-y-6">
          <motion.h2 
            className="text-xs text-[#B87333] tracking-[0.25em] font-medium eink-text"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            ОПРЕДЕЛЕНИЕ КООРДИНАТ
          </motion.h2>
          <h1 className="text-xl md:text-2xl font-light leading-relaxed text-[#3E3129] eink-text">
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
          className="glass-panel rounded-xl p-8 w-full floating-shadow"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center space-y-4 mb-8">
            <motion.h2 
              className="text-xs text-[#B87333] tracking-[0.25em] eink-text"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ФИНАНСОВАЯ РЕАЛЬНОСТЬ
            </motion.h2>
            <h1 className="text-lg md:text-xl font-light leading-relaxed text-[#3E3129] eink-text">
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
                className="p-5 border-l-2 border-[#B87333] bg-[#B87333]/5 rounded-r-lg"
              >
                <p className="text-sm md:text-base leading-relaxed text-[#3E3129]/80 eink-text">
                  Банк — лишь посредник. Он контролирует доступ к твоим средствам и может заморозить их в любой момент.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-[#B87333] mt-3 font-medium eink-text">
                  Ты не владеешь деньгами на счету — ты владеешь обещанием банка.
                </p>
                
                <motion.div 
                  className="mt-5 flex items-center gap-2 text-xs text-[#3E3129]/40 eink-text"
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#B87333]" />
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
        <div className="absolute inset-0 bg-[#B87333]/10 rounded-full blur-[60px]" />
        <div className="relative w-full h-full glass-panel rounded-full flex items-center justify-center overflow-hidden floating-shadow">
          <motion.div 
            className="w-3/4 h-3/4 bg-gradient-to-br from-[#B87333]/60 to-[#B87333]/20 rounded-full"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <div className="absolute inset-4 border-[0.5px] border-[#B87333]/30 rounded-full" />
        </div>
      </motion.div>

      {/* Right Panel - Text */}
      <motion.div 
        className="flex-1 glass-panel rounded-xl p-6 md:p-8 floating-shadow"
        initial={{ x: 30, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <motion.h2 
          className="text-xs text-[#B87333] tracking-[0.25em] mb-6 eink-text"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ПРОТОКОЛ САТОШИ
        </motion.h2>
        
        <div className="space-y-4 text-sm md:text-base leading-relaxed text-[#3E3129]/80 eink-text">
          <p>Карта в твоих руках — это не просто пластик.</p>
          <p>Это инструмент, позволяющий выйти из системы, где каждая транзакция требует одобрения.</p>
          <p>Система Lightning работает без посредников. Без разрешений. Без границ.</p>
          <p className="text-[#B87333] font-medium text-base md:text-lg">
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
        className: "glass-panel border-[#B87333]/30 text-[#3E3129] font-mono"
      });
    };

    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="flex flex-col items-center w-full max-w-lg space-y-6 text-center"
      >
        <NetworkNodes />

        <motion.div 
          className="glass-panel rounded-xl p-8 w-full floating-shadow"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <motion.h2 
            className="text-xs text-[#B87333] tracking-[0.25em] mb-4 eink-text"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            АКТИВАЦИЯ УЗЛА
          </motion.h2>
          <h1 className="text-lg md:text-xl font-light leading-relaxed mb-8 text-[#3E3129] eink-text">
            Протокол готов. Твой первый узел в сети свободы активирован.
          </h1>

          <AnimatePresence mode="wait">
            {!rewardTriggered ? (
              <motion.div key="accept" exit={{ opacity: 0, scale: 0.9 }}>
                <TactileButton 
                  variant="primary"
                  onClick={handleAccept}
                  className="font-bold"
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
                  className="flex items-baseline gap-1 text-[#B87333]"
                  animate={{ 
                    textShadow: [
                      "0 0 10px rgba(184,115,51,0.3)",
                      "0 0 30px rgba(184,115,51,0.5)",
                      "0 0 10px rgba(184,115,51,0.3)"
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-5xl md:text-6xl font-bold eink-text">+500</span>
                  <span className="text-xl tracking-widest eink-text">SATS</span>
                </motion.div>
                
                <motion.div 
                  className="glass-panel px-4 py-2 rounded-md text-xs text-[#B87333]/70 tracking-wider eink-text"
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
        <div className="absolute bottom-20 left-8 text-left">
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
            <Loader2 className="w-8 h-8 text-[#B87333]" />
          </motion.div>
          <motion.div 
            className="text-xs tracking-[0.3em] text-[#B87333]/70 eink-text"
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
        className="fixed top-6 right-24 z-40 glass-panel px-3 py-2 rounded-md floating-shadow"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[9px] tracking-wider text-[#3E3129]/50 uppercase eink-text">IND_SCORE</span>
          <motion.span 
            className="text-sm font-bold text-[#B87333] font-mono eink-text"
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
