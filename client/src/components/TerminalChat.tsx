import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, EyeOff } from "lucide-react";
import { playClick, playTypeTick, playSatsChime, playTransition } from "@/lib/sounds";
import { SKILL_META, type SkillKey } from "@shared/schema";
import ProfileOverlay from "./ProfileOverlay";
import { getLearningBlocks, getWalletSteps, getSatoshiWisdom, getUITexts, type LearningBlock, type WalletStep, type WalletStepButton, type BlockOption } from "@/lib/terminal-i18n";
import { trackEvent } from "@/lib/analytics";
import { triggerInstallPrompt, isPromptAvailable, isIOS as checkIsIOS, isAndroid as checkIsAndroid } from "@/lib/pwa-install";

interface Message {
  id: number;
  text: string;
  sender: "satoshi" | "user" | "system";
}

interface TerminalChatProps {
  onBack: () => void;
  onProgressUpdate: (progress: number) => void;
  onSatsUpdate: (sats: number) => void;
  totalSats: number;
  skipFirstTypewriter?: boolean;
  userStats?: { level: number; xp: number } | null;
  userToken?: string;
  onGrantSkill?: (skillKey: SkillKey, showNotification?: boolean) => void;
  levelUpSkill?: SkillKey | null;
  onDismissLevelUp?: () => void;
  lang?: string;
  onLabelSwitch?: () => void;
}

const PixelSendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
    <rect x="7" y="2" width="2" height="2" />
    <rect x="5" y="4" width="2" height="2" />
    <rect x="9" y="4" width="2" height="2" />
    <rect x="3" y="6" width="2" height="2" />
    <rect x="11" y="6" width="2" height="2" />
    <rect x="7" y="4" width="2" height="2" />
    <rect x="7" y="6" width="2" height="2" />
    <rect x="7" y="8" width="2" height="2" />
    <rect x="7" y="10" width="2" height="2" />
    <rect x="7" y="12" width="2" height="2" />
  </svg>
);

const PixelThumbsUp = ({ size = 40, color = "#FFD700" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill={color} style={{ imageRendering: 'pixelated', shapeRendering: 'crispEdges' }}>
    <rect x="6" y="0" width="2" height="2" />
    <rect x="6" y="2" width="2" height="2" />
    <rect x="6" y="4" width="2" height="2" />
    <rect x="4" y="6" width="2" height="2" />
    <rect x="6" y="6" width="2" height="2" />
    <rect x="8" y="6" width="2" height="2" />
    <rect x="10" y="6" width="2" height="2" />
    <rect x="2" y="8" width="2" height="2" />
    <rect x="4" y="8" width="2" height="2" />
    <rect x="6" y="8" width="2" height="2" />
    <rect x="8" y="8" width="2" height="2" />
    <rect x="10" y="8" width="2" height="2" />
    <rect x="12" y="8" width="2" height="2" />
    <rect x="2" y="10" width="2" height="2" />
    <rect x="4" y="10" width="2" height="2" />
    <rect x="6" y="10" width="2" height="2" />
    <rect x="8" y="10" width="2" height="2" />
    <rect x="10" y="10" width="2" height="2" />
    <rect x="12" y="10" width="2" height="2" />
    <rect x="2" y="12" width="2" height="2" />
    <rect x="4" y="12" width="2" height="2" />
    <rect x="6" y="12" width="2" height="2" />
    <rect x="8" y="12" width="2" height="2" />
    <rect x="10" y="12" width="2" height="2" />
    <rect x="12" y="12" width="2" height="2" />
    <rect x="4" y="14" width="2" height="2" />
    <rect x="6" y="14" width="2" height="2" />
    <rect x="8" y="14" width="2" height="2" />
    <rect x="10" y="14" width="2" height="2" />
  </svg>
);

const CELEBRATION_PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 1.5,
  duration: 2 + Math.random() * 2,
  size: 28 + Math.floor(Math.random() * 24),
  rotation: -30 + Math.random() * 60,
  color: ["#FFD700", "#E8A317", "#B87333", "#FFD700", "#D4943D"][i % 5],
}));

const CelebrationOverlay = () => (
  <motion.div
    className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    {CELEBRATION_PARTICLES.map((p) => (
      <motion.div
        key={p.id}
        className="absolute"
        style={{ left: `${p.x}%` }}
        initial={{ y: "110vh", rotate: 0, opacity: 0.9 }}
        animate={{
          y: "-20vh",
          rotate: p.rotation,
          opacity: [0, 1, 1, 0.8, 0],
        }}
        transition={{
          duration: p.duration,
          delay: p.delay,
          ease: "easeOut",
        }}
      >
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.9, 1.1, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "mirror" }}
        >
          <PixelThumbsUp size={p.size} color={p.color} />
        </motion.div>
      </motion.div>
    ))}
    <motion.div
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.15, 0.05, 0.1, 0] }}
      transition={{ duration: 3, times: [0, 0.2, 0.4, 0.6, 1] }}
      style={{
        background: "radial-gradient(circle at center, rgba(255,215,0,0.3) 0%, transparent 70%)",
      }}
    />
  </motion.div>
);

const PixelCoin = ({ animating }: { animating: boolean }) => (
  <div className="relative">
    <motion.div
      className="absolute inset-[-6px] rounded-full"
      style={{ background: "radial-gradient(circle, rgba(184,115,51,0.5) 0%, transparent 70%)" }}
      animate={{ opacity: [0.4, 0.9, 0.4], scale: [0.9, 1.15, 0.9] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.svg
      width="22" height="22" viewBox="0 0 16 16"
      style={{ imageRendering: 'pixelated', position: 'relative', zIndex: 1 }}
      animate={animating
        ? { rotate: [0, 360], scale: [1, 1.6, 1], filter: ["brightness(1)", "brightness(2.5)", "brightness(1)"] }
        : { filter: ["brightness(1)", "brightness(1.5)", "brightness(1)"], scale: [1, 1.05, 1] }
      }
      transition={animating
        ? { duration: 0.6 }
        : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
      }
    >
      <rect x="5" y="1" width="6" height="2" fill="#B87333" />
      <rect x="3" y="3" width="2" height="2" fill="#B87333" />
      <rect x="11" y="3" width="2" height="2" fill="#B87333" />
      <rect x="1" y="5" width="2" height="6" fill="#B87333" />
      <rect x="13" y="5" width="2" height="6" fill="#B87333" />
      <rect x="3" y="11" width="2" height="2" fill="#B87333" />
      <rect x="11" y="11" width="2" height="2" fill="#B87333" />
      <rect x="5" y="13" width="6" height="2" fill="#B87333" />
      <rect x="3" y="5" width="10" height="6" fill="#D4943D" />
      <rect x="5" y="3" width="6" height="2" fill="#D4943D" />
      <rect x="5" y="11" width="6" height="2" fill="#D4943D" />
      <rect x="7" y="4" width="2" height="2" fill="#B87333" />
      <rect x="6" y="6" width="4" height="2" fill="#B87333" />
      <rect x="7" y="8" width="2" height="2" fill="#B87333" />
      <rect x="7" y="10" width="2" height="1" fill="#B87333" />
    </motion.svg>
  </div>
);

type BlockPhase = 
  | "typing_speech"
  | "waiting_intermediate"
  | "typing_speech_continued"
  | "waiting_options"
  | "typing_conditional"
  | "waiting_conditional_options"
  | "completed";

function saveWalletState(data: { walletMode: boolean; stepId: string | null; blockIndex: number; sats: number; progress: number }) {
  try { localStorage.setItem("liberta_wallet_state", JSON.stringify(data)); } catch (_) {}
}
function loadWalletState(): { walletMode: boolean; stepId: string | null; blockIndex: number; sats: number; progress: number } | null {
  try {
    const raw = localStorage.getItem("liberta_wallet_state");
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return null;
}
function clearWalletState() {
  try { localStorage.removeItem("liberta_wallet_state"); } catch (_) {}
}

function SkillNotificationBanner({ onClose, iconRect, skillText = "+SKILL" }: { onClose: () => void; iconRect?: { x: number; y: number } | null; skillText?: string }) {
  const [phase, setPhase] = useState<"show" | "fly">("show");

  useEffect(() => {
    const showTimer = setTimeout(() => setPhase("fly"), 1500);
    return () => clearTimeout(showTimer);
  }, []);

  const flyToX = iconRect ? iconRect.x - window.innerWidth / 2 : 0;
  const flyToY = iconRect ? iconRect.y - 60 : -40;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0, scale: 0.7 }}
      animate={phase === "show"
        ? { opacity: [0, 1, 1, 1], y: [0, 60, 60, 60], scale: [0.7, 1.15, 1, 1] }
        : { opacity: 0, y: flyToY, x: flyToX, scale: 0.2 }
      }
      transition={phase === "show"
        ? { duration: 1.2, times: [0, 0.15, 0.5, 1], ease: "easeInOut" }
        : { duration: 0.35, ease: "easeIn" }
      }
      onAnimationComplete={() => { if (phase === "fly") onClose(); }}
      className="fixed top-12 left-0 right-0 z-[100] pointer-events-none flex justify-center"
      data-testid="popup-level-up"
    >
      <motion.div
        className="flex items-center gap-3 px-5 py-2 border-2 border-[#B87333]"
        style={{
          imageRendering: 'pixelated',
          background: '#0A0A0A',
          boxShadow: '0 0 20px rgba(184,115,51,0.5), 0 0 40px rgba(255,215,0,0.2)',
        }}
        animate={{
          boxShadow: [
            "0 0 10px rgba(184,115,51,0.3), 0 0 20px rgba(255,215,0,0.1)",
            "0 0 30px rgba(184,115,51,0.7), 0 0 50px rgba(255,215,0,0.4)",
            "0 0 10px rgba(184,115,51,0.3), 0 0 20px rgba(255,215,0,0.1)"
          ]
        }}
        transition={{ duration: 0.6, repeat: 2 }}
      >
        <EyeOff className="w-[18px] h-[18px] flex-shrink-0" style={{ color: "#00e5ff", filter: "drop-shadow(0 0 6px rgba(0,229,255,0.6))" }} />
        <span
          className="text-[13px] tracking-[3px] font-mono font-bold uppercase"
          style={{
            color: '#FFD700',
            textShadow: '0 0 8px #FFD700, 0 0 16px #B87333',
          }}
        >
          {skillText}
        </span>
      </motion.div>
    </motion.div>
  );
}

function saveTerminalMessages(msgs: Message[]) {
  try {
    const slim = msgs.map(m => ({ t: m.text, s: m.sender }));
    localStorage.setItem("liberta_terminal_messages", JSON.stringify(slim));
  } catch (_) {}
}

function loadTerminalMessages(): Message[] {
  try {
    const raw = localStorage.getItem("liberta_terminal_messages");
    if (!raw) return [];
    const parsed = JSON.parse(raw) as { t: string; s: "satoshi" | "user" | "system" }[];
    return parsed.map(m => ({ id: nextMsgId(), text: m.t, sender: m.s }));
  } catch (_) {
    return [];
  }
}

function saveTerminalProgress(data: { blockIndex: number; sats: number; progress: number; walletMode?: boolean; walletStepId?: string | null; messages?: Message[] }) {
  try {
    localStorage.setItem("liberta_terminal_progress", JSON.stringify({
      blockIndex: data.blockIndex,
      sats: data.sats,
      progress: data.progress,
      walletMode: data.walletMode || false,
      walletStepId: data.walletStepId || null,
      timestamp: Date.now(),
    }));
  } catch (_) {}
  if (data.messages) {
    saveTerminalMessages(data.messages);
  }

  const token = localStorage.getItem("liberta_token");
  if (token) {
    fetch("/api/save-progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        currentModuleId: data.walletMode ? `wallet_${data.walletStepId}` : `block_${data.blockIndex}`,
        currentStepIndex: data.blockIndex,
        totalSats: data.sats,
        independenceProgress: data.progress,
      }),
    }).catch(() => {});
  }
}

function loadTerminalProgress(): { blockIndex: number; sats: number; progress: number; walletMode: boolean; walletStepId: string | null } | null {
  try {
    const raw = localStorage.getItem("liberta_terminal_progress");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

let msgIdCounter = 0;
function nextMsgId() { return ++msgIdCounter; }

export function TerminalChat({ onBack, onProgressUpdate, onSatsUpdate, totalSats, skipFirstTypewriter, userStats, userToken, onGrantSkill, levelUpSkill, onDismissLevelUp, lang = "IT", onLabelSwitch }: TerminalChatProps) {
  const LEARNING_BLOCKS_LOCAL = getLearningBlocks(lang);
  const WALLET_STEPS_LOCAL = getWalletSteps(lang);
  const SATOSHI_WISDOM_LOCAL = getSatoshiWisdom(lang);
  const uiTexts = getUITexts(lang);

  const [showProfile, setShowProfile] = useState(false);
  const [iconBlinking, setIconBlinking] = useState(false);
  const dosierIconRef = useRef<HTMLButtonElement>(null);
  const savedState = useRef(loadWalletState());
  const savedProgress = useRef(loadTerminalProgress());

  const messagesRef = useRef<Message[]>([]);
  const [messages, _setMessages] = useState<Message[]>([]);
  const setMessages = useCallback((updater: Message[] | ((prev: Message[]) => Message[])) => {
    _setMessages(prev => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      messagesRef.current = next;
      saveTerminalMessages(next);
      return next;
    });
  }, []);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(() => savedState.current?.blockIndex ?? 0);
  const [completedBlockCount, setCompletedBlockCount] = useState(() => savedState.current?.blockIndex ?? savedProgress.current?.blockIndex ?? 0);
  const [blockPhase, setBlockPhase] = useState<BlockPhase>("typing_speech");
  const [currentOptions, setCurrentOptions] = useState<BlockOption[]>([]);
  const [notification, setNotification] = useState<{ sats: number; skill: string | null } | null>(null);
  const [inputText, setInputText] = useState("");
  const [walletMode, setWalletMode] = useState(() => savedState.current?.walletMode ?? false);
  const [currentWalletStepId, setCurrentWalletStepId] = useState<string | null>(() => savedState.current?.stepId ?? null);
  const [walletButtons, setWalletButtons] = useState<WalletStepButton[]>([]);
  const [satsClaimed, setSatsClaimed] = useState(() => {
    try { return localStorage.getItem("liberta_sats_claimed") === "1"; } catch (_) { return false; }
  });
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [flowCompleted, setFlowCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [followUpdatesClicked, setFollowUpdatesClicked] = useState(false);
  const [followUpdatesTyped, setFollowUpdatesTyped] = useState(false);
  const isLockedRef = useRef(false);
  const mountedRef = useRef(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const typeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const skippedFirstRef = useRef(false);
  const typeTickCounterRef = useRef(0);
  const userScrolledRef = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollTopRef = useRef(0);
  const pendingTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const deeplinkCleanupRef = useRef<(() => void) | null>(null);

  const scrollToBottom = useCallback(() => {
    if (!userScrolledRef.current) {
      const container = messagesContainerRef.current;
      if (container) {
        container.scrollTop = container.scrollHeight;
        lastScrollTopRef.current = container.scrollTop;
      }
    }
  }, []);

  const handleUserScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    const currentScrollTop = container.scrollTop;
    const prevScrollTop = lastScrollTopRef.current;
    lastScrollTopRef.current = currentScrollTop;
    const distanceFromBottom = container.scrollHeight - currentScrollTop - container.clientHeight;
    const isScrollingUp = currentScrollTop < prevScrollTop - 2;
    if (isScrollingUp) {
      userScrolledRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    } else if (distanceFromBottom < 10) {
      userScrolledRef.current = false;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    }
  }, [scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText, scrollToBottom]);

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
      if (messagesRef.current.length > 0) {
        saveTerminalMessages(messagesRef.current);
      }
      if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      pendingTimeoutsRef.current.forEach(t => clearTimeout(t));
      pendingTimeoutsRef.current = [];
      if (deeplinkCleanupRef.current) {
        deeplinkCleanupRef.current();
        deeplinkCleanupRef.current = null;
      }
    };
  }, []);

  const typeMessage = useCallback((text: string, sender: "satoshi" | "system", onComplete?: () => void) => {
    if (typeIntervalRef.current) {
      clearInterval(typeIntervalRef.current);
      typeIntervalRef.current = null;
    }
    
    if (!text) {
      onComplete?.();
      return;
    }
    
    setIsTyping(true);
    setDisplayedText("");
    typeTickCounterRef.current = 0;
    let charIndex = 0;

    typeIntervalRef.current = setInterval(() => {
      if (!mountedRef.current) {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
        return;
      }
      if (charIndex < text.length) {
        setDisplayedText(text.slice(0, charIndex + 1));
        typeTickCounterRef.current++;
        if (typeTickCounterRef.current % 3 === 0) {
          playTypeTick();
        }
        charIndex++;
      } else {
        if (typeIntervalRef.current) clearInterval(typeIntervalRef.current);
        typeIntervalRef.current = null;
        requestAnimationFrame(() => {
          if (!mountedRef.current) return;
          setIsTyping(false);
          setDisplayedText("");
          setMessages(prev => [...prev, { id: nextMsgId(), text, sender }]);
          onComplete?.();
        });
      }
    }, 12);
  }, []);

  const handleFollowUpdatesClick = useCallback(() => {
    if (followUpdatesClicked || isTyping) return;
    playClick();
    setFollowUpdatesClicked(true);
    setMessages(prev => [...prev, { id: nextMsgId(), text: uiTexts.followQuestion, sender: "user" }]);
    safeTimeout(() => {
      typeMessage(
        uiTexts.followResponse,
        "satoshi",
        () => { setFollowUpdatesTyped(true); }
      );
    }, 500);
  }, [followUpdatesClicked, isTyping, typeMessage, safeTimeout, uiTexts]);

  const [showInstallInstructions, setShowInstallInstructions] = useState(false);
  const [installInstructionText, setInstallInstructionText] = useState("");

  const handlePWAInstall = useCallback(async () => {
    playClick();
    if (isPromptAvailable()) {
      const outcome = await triggerInstallPrompt();
      if (outcome === "accepted") return;
    }
    let instruction = uiTexts.installInstructionsFallback;
    if (checkIsIOS()) instruction = uiTexts.installInstructionsIOS;
    else if (checkIsAndroid()) instruction = uiTexts.installInstructionsAndroid;
    setInstallInstructionText(instruction);
    setShowInstallInstructions(true);
  }, [uiTexts]);

  const startBlock = useCallback((blockIndex: number, skipTyping?: boolean) => {
    const block = LEARNING_BLOCKS_LOCAL[blockIndex];
    if (!block) return;

    userScrolledRef.current = false;
    setCurrentBlockIndex(blockIndex);
    setBlockPhase("typing_speech");
    setCurrentOptions([]);
    isLockedRef.current = true;

    if (skipTyping) {
      setMessages(prev => [...prev, { id: nextMsgId(), text: block.speech, sender: "satoshi" }]);
      isLockedRef.current = false;
      if (block.intermediate_question) {
        setBlockPhase("waiting_intermediate");
        setCurrentOptions(block.intermediate_question.options);
      } else {
        setBlockPhase("waiting_options");
        setCurrentOptions(block.options);
      }
      return;
    }

    playTransition();

    typeMessage(block.speech, "satoshi", () => {
      isLockedRef.current = false;
      if (block.intermediate_question) {
        setBlockPhase("waiting_intermediate");
        setCurrentOptions(block.intermediate_question.options);
      } else {
        setBlockPhase("waiting_options");
        setCurrentOptions(block.options);
      }
    });
  }, [typeMessage]);

  const restoredWalletRef = useRef(savedState.current);
  const initializedRef = useRef(false);
  const onSatsUpdateRef = useRef(onSatsUpdate);
  const onProgressUpdateRef = useRef(onProgressUpdate);
  onSatsUpdateRef.current = onSatsUpdate;
  onProgressUpdateRef.current = onProgressUpdate;

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const shouldSkip = skipFirstTypewriter && !skippedFirstRef.current;
    skippedFirstRef.current = true;
    if (restoredWalletRef.current?.walletMode) return;

    const saved = savedProgress.current;
    if (saved && !saved.walletMode && saved.blockIndex > 0) {
      savedProgress.current = null;
      internalSatsRef.current = saved.sats;
      onSatsUpdateRef.current(saved.sats);
      onProgressUpdateRef.current(saved.progress);
      if (saved.blockIndex > 7 && onLabelSwitch) onLabelSwitch();
      const savedMsgs = loadTerminalMessages();
      if (savedMsgs.length > 0) {
        setMessages(savedMsgs);
        messagesRef.current = savedMsgs;
      }
      startBlock(saved.blockIndex, true);
    } else {
      startBlock(0, shouldSkip);
    }
  }, [startBlock, skipFirstTypewriter]);

  const internalSatsRef = useRef(totalSats);

  const showNotification = useCallback((sats: number) => {
    setNotification({ sats, skill: null });
    safeTimeout(() => setNotification(null), 1800);
  }, [safeTimeout]);

  const completeBlock = useCallback((blockIndex: number) => {
    const block = LEARNING_BLOCKS_LOCAL[blockIndex];
    if (!block) return;

    setCompletedBlockCount(prev => Math.max(prev, blockIndex + 1));

    if (block.reward > 0) {
      internalSatsRef.current = Math.min(internalSatsRef.current + block.reward, 1000);
      onSatsUpdate(internalSatsRef.current);
      showNotification(block.reward);
      try { playSatsChime(); } catch (_) {}
    }
    const newProgress = Math.min(block.progress_target, 100);
    onProgressUpdate(newProgress);

    if (blockIndex === 7 && onLabelSwitch) {
      safeTimeout(() => onLabelSwitch(), 1500);
    }

    if (block.grantSkillKey && onGrantSkill) {
      const skillKey = block.grantSkillKey;
      const notify = blockIndex === 0;
      safeTimeout(() => onGrantSkill(skillKey, notify), 1000);
    }

    saveTerminalProgress({
      blockIndex: blockIndex + 1,
      sats: internalSatsRef.current,
      progress: newProgress,
      messages: messagesRef.current,
    });
  }, [onSatsUpdate, onProgressUpdate, showNotification, onGrantSkill, safeTimeout, onLabelSwitch]);

  const startWalletStep = useCallback((stepId: string) => {
    const step = WALLET_STEPS_LOCAL.find(s => s.id === stepId);
    if (!step) return;

    setWalletMode(true);
    userScrolledRef.current = false;
    setCurrentWalletStepId(stepId);
    setWalletButtons([]);
    setCurrentOptions([]);
    isLockedRef.current = true;

    saveWalletState({ walletMode: true, stepId, blockIndex: 7, sats: internalSatsRef.current, progress: 11 });
    saveTerminalProgress({ blockIndex: 7, sats: internalSatsRef.current, progress: 11, walletMode: true, walletStepId: stepId, messages: messagesRef.current });

    try { playTransition(); } catch (_) {}

    if (stepId === "step_5") {
      clearWalletState();
    }

    typeMessage(step.instruction, "satoshi", () => {
      isLockedRef.current = false;
      setWalletButtons(step.buttons);
      if (stepId === "step_5") {
        setFlowCompleted(true);
      }
    });
  }, [typeMessage, safeTimeout]);

  useEffect(() => {
    const restored = restoredWalletRef.current;
    if (restored && restored.walletMode && restored.stepId) {
      restoredWalletRef.current = null;
      if (restored.sats) onSatsUpdate(restored.sats);
      if (onLabelSwitch) onLabelSwitch();
      const savedMsgs = loadTerminalMessages();
      if (savedMsgs.length > 0) {
        setMessages(savedMsgs);
        messagesRef.current = savedMsgs;
      }
      startWalletStep(restored.stepId);
    }
  }, [startWalletStep, onSatsUpdate, onLabelSwitch]);

  const handleWalletButtonClick = useCallback((button: WalletStepButton) => {
    if (isLockedRef.current || isTyping) return;
    playClick();

    if (button.type === "external" && button.url) {
      window.open(button.url, "_blank", "noopener,noreferrer");
      return;
    }

    if (button.type === "deeplink" && button.url) {
      isLockedRef.current = true;
      setSatsClaimed(true);
      try { localStorage.setItem("liberta_sats_claimed", "1"); } catch (_) {}
      setWalletButtons([]);
      setMessages(prev => [...prev, { id: nextMsgId(), text: button.text, sender: "user" }]);

      try {
        const iframe = document.createElement("iframe");
        iframe.style.cssText = "position:fixed;top:-9999px;left:-9999px;width:0;height:0;border:none;opacity:0;pointer-events:none;";
        document.body.appendChild(iframe);
        try { iframe.contentWindow?.location.replace(button.url); } catch (_) { iframe.src = button.url; }
        setTimeout(() => { try { document.body.removeChild(iframe); } catch (_) {} }, 3000);
      } catch (_) {
        try {
          const a = document.createElement("a");
          a.href = button.url;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
          document.body.appendChild(a);
          a.click();
          setTimeout(() => { try { document.body.removeChild(a); } catch (_) {} }, 500);
        } catch (_) {}
      }

      if (button.target) {
        const targetStep = button.target;
        let alreadyFired = false;
        const fireOnce = () => {
          if (alreadyFired) return;
          alreadyFired = true;
          document.removeEventListener("visibilitychange", onReturn);
          window.removeEventListener("focus", onReturn);
          deeplinkCleanupRef.current = null;
          startWalletStep(targetStep);
        };
        const onReturn = () => {
          if (document.visibilityState === "visible" || document.hasFocus()) {
            setTimeout(fireOnce, 500);
          }
        };
        document.addEventListener("visibilitychange", onReturn);
        window.addEventListener("focus", onReturn);
        deeplinkCleanupRef.current = () => {
          document.removeEventListener("visibilitychange", onReturn);
          window.removeEventListener("focus", onReturn);
        };
        setTimeout(fireOnce, 3000);
      } else {
        isLockedRef.current = false;
      }
      return;
    }

    if (button.type === "next" && button.target) {
      isLockedRef.current = true;
      setWalletButtons([]);
      setMessages(prev => [...prev, { id: nextMsgId(), text: button.text, sender: "user" }]);
      safeTimeout(() => {
        startWalletStep(button.target!);
      }, 800);
      return;
    }
  }, [isTyping, startWalletStep, safeTimeout]);

  const lastWisdomRef = useRef(-1);

  const handleInputSend = useCallback(() => {
    if (!inputText.trim()) return;
    const userText = inputText.trim();
    setInputText("");
    setMessages(prev => [...prev, { id: nextMsgId(), text: userText, sender: "user" }]);
    playClick();

    if (flowCompleted) {
      let idx = Math.floor(Math.random() * SATOSHI_WISDOM_LOCAL.length);
      if (idx === lastWisdomRef.current) {
        idx = (idx + 1) % SATOSHI_WISDOM_LOCAL.length;
      }
      lastWisdomRef.current = idx;
      const wisdom = SATOSHI_WISDOM_LOCAL[idx];
      safeTimeout(() => {
        typeMessage(wisdom, "satoshi", () => {});
      }, 500);
    } else {
      safeTimeout(() => {
        setMessages(prev => [...prev, { id: nextMsgId(), text: uiTexts.waitMessage, sender: "satoshi" }]);
      }, 500);
    }
  }, [inputText, flowCompleted, typeMessage, safeTimeout, SATOSHI_WISDOM_LOCAL, uiTexts]);

  const handleOptionClick = useCallback((option: BlockOption) => {
    if (isLockedRef.current || isTyping) return;
    isLockedRef.current = true;
    playClick();

    setMessages(prev => [...prev, { id: nextMsgId(), text: option.text, sender: "user" }]);
    setCurrentOptions([]);

    const currentBlock = LEARNING_BLOCKS_LOCAL[currentBlockIndex];

    if (option.action === "continue") {
      setBlockPhase("typing_speech_continued");
      const continuedText = option.continued_text || currentBlock.speech_continued || "";
      safeTimeout(() => {
        typeMessage(continuedText, "satoshi", () => {
          isLockedRef.current = false;
          setBlockPhase("waiting_options");
          setCurrentOptions(currentBlock.options);
        });
      }, 400);
      return;
    }

    if (option.action === "next_block") {
      trackEvent(`block_${currentBlockIndex + 1}_completed`);
      if (option.conditional_text) {
        setBlockPhase("typing_conditional");
        safeTimeout(() => {
          typeMessage(option.conditional_text!, "satoshi", () => {
            isLockedRef.current = false;
            completeBlock(currentBlockIndex);
            safeTimeout(() => {
              const nextIndex = currentBlockIndex + 1;
              if (nextIndex < LEARNING_BLOCKS_LOCAL.length) {
                startBlock(nextIndex);
              }
            }, 800);
          });
        }, 400);
      } else {
        completeBlock(currentBlockIndex);
        safeTimeout(() => {
          isLockedRef.current = false;
          const nextIndex = currentBlockIndex + 1;
          if (nextIndex < LEARNING_BLOCKS_LOCAL.length) {
            startBlock(nextIndex);
          }
        }, 800);
      }
      return;
    }

    if (option.action === "go_back") {
      if (option.conditional_text) {
        setBlockPhase("typing_conditional");
        safeTimeout(() => {
          typeMessage(option.conditional_text!, "satoshi", () => {
            isLockedRef.current = false;
            safeTimeout(() => {
              onBack();
            }, 2000);
          });
        }, 400);
      } else {
        safeTimeout(() => {
          isLockedRef.current = false;
          onBack();
        }, 500);
      }
      return;
    }

    if (option.action === "restart") {
      const doRestart = () => {
        internalSatsRef.current = 200;
        onSatsUpdate(200);
        onProgressUpdate(20);
        setCompletedBlockCount(0);
        setWalletMode(false);
        setCurrentWalletStepId(null);
        setWalletButtons([]);
        clearWalletState();
        saveTerminalProgress({ blockIndex: 0, sats: 200, progress: 20, messages: [] });
        try { localStorage.removeItem("liberta_terminal_messages"); } catch (_) {}
        setMessages([]);
        startBlock(0);
      };
      if (option.conditional_text) {
        setBlockPhase("typing_conditional");
        safeTimeout(() => {
          typeMessage(option.conditional_text!, "satoshi", () => {
            isLockedRef.current = false;
            safeTimeout(doRestart, 2000);
          });
        }, 400);
      } else {
        safeTimeout(() => {
          isLockedRef.current = false;
          doRestart();
        }, 500);
      }
      return;
    }

    if (option.action === "show_conditional_text" && option.conditional_text) {
      setBlockPhase("typing_conditional");
      safeTimeout(() => {
        typeMessage(option.conditional_text!, "satoshi", () => {
          isLockedRef.current = false;
          if (option.conditional_options && option.conditional_options.length > 0) {
            setBlockPhase("waiting_conditional_options");
            setCurrentOptions(option.conditional_options);
          } else {
            setBlockPhase("waiting_options");
            setCurrentOptions(currentBlock.options);
          }
        });
      }, 400);
      return;
    }

    if (option.action === "create_wallet") {
      trackEvent('wallet_started');
      setShowCelebration(true);
      safeTimeout(() => setShowCelebration(false), 4000);
      completeBlock(currentBlockIndex);
      setWalletMode(true);
      safeTimeout(() => {
        isLockedRef.current = false;
        startWalletStep("step_1");
      }, 800);
      return;
    }

    isLockedRef.current = false;
  }, [isTyping, currentBlockIndex, typeMessage, startBlock, completeBlock, onBack, startWalletStep, safeTimeout]);

  const [satsAnimating, setSatsAnimating] = useState(false);
  const prevSatsRef = useRef(totalSats);

  useEffect(() => {
    if (totalSats > prevSatsRef.current) {
      setSatsAnimating(true);
      const id = setTimeout(() => setSatsAnimating(false), 600);
      prevSatsRef.current = totalSats;
      return () => clearTimeout(id);
    }
    prevSatsRef.current = totalSats;
  }, [totalSats]);

  const currentBlock = LEARNING_BLOCKS_LOCAL[currentBlockIndex];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#E8E8E8] font-mono">
      <AnimatePresence>
        {notification && notification.sats > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.7 }}
            animate={{ opacity: [0, 1, 1, 1, 0], y: [0, 60, 60, 60, 0], scale: [0.7, 1.15, 1, 1.15, 0.7] }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 1.6, times: [0, 0.15, 0.45, 0.75, 1], ease: "easeInOut" }}
            className="fixed top-12 left-0 right-0 z-[100] pointer-events-none flex justify-center"
          >
            <motion.div
              className="px-5 py-2 text-[15px] tracking-[4px] font-mono font-bold border-2 border-[#B87333]"
              style={{
                imageRendering: 'pixelated',
                background: '#0A0A0A',
                color: '#FFD700',
                textShadow: '0 0 8px #FFD700, 0 0 16px #B87333',
                boxShadow: '0 0 20px rgba(184,115,51,0.5), 0 0 40px rgba(255,215,0,0.2)',
              }}
              animate={{
                boxShadow: [
                  "0 0 10px rgba(184,115,51,0.3), 0 0 20px rgba(255,215,0,0.1)",
                  "0 0 30px rgba(184,115,51,0.7), 0 0 50px rgba(255,215,0,0.4)",
                  "0 0 10px rgba(184,115,51,0.3), 0 0 20px rgba(255,215,0,0.1)"
                ]
              }}
              transition={{ duration: 0.6, repeat: 2 }}
              data-testid="toast-sats"
            >
              +{notification.sats} SATS
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCelebration && <CelebrationOverlay />}
      </AnimatePresence>

      <div className="flex-shrink-0 bg-[#111111] border-b-2 border-[#B87333]/60 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#B87333]" />
            <span className="text-[11px] tracking-[4px] font-bold text-[#B87333]">
              re_terminal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              ref={dosierIconRef}
              type="button"
              onClick={() => setShowProfile(true)}
              className="w-9 h-9 flex items-center justify-center hover:opacity-90 transition-opacity"
              style={{ opacity: iconBlinking ? 1 : 0.5 }}
              animate={iconBlinking ? {
                opacity: [0.5, 1, 0.5, 1, 0.5, 1, 0.5, 1, 0.5],
                filter: [
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 8px rgba(0,229,255,0.8))",
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 8px rgba(0,229,255,0.8))",
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 8px rgba(0,229,255,0.8))",
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 8px rgba(0,229,255,0.8))",
                  "drop-shadow(0 0 0px transparent)",
                ],
              } : {
                opacity: [0.5, 0.5, 0.85, 0.5, 0.5],
                filter: [
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 6px rgba(184,115,51,0.7))",
                  "drop-shadow(0 0 0px transparent)",
                  "drop-shadow(0 0 0px transparent)",
                ],
              }}
              transition={iconBlinking ? { duration: 2.4, ease: "easeInOut" } : { duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.35, 0.5, 0.65, 1] }}
              data-testid="button-profile-avatar"
            >
              <EyeOff
                className="w-[22px] h-[22px]"
                style={{
                  color: iconBlinking ? "#00e5ff" : "#B87333",
                  transition: "color 0.3s",
                }}
              />
            </motion.button>
            <div className="flex items-center gap-2.5 px-3 py-1.5 border-2 border-[#B87333]/60 bg-[#B87333]/10">
              <PixelCoin animating={satsAnimating} />
              <motion.span
                key={totalSats}
                initial={{ scale: 1.4, color: "#FFD700" }}
                animate={{ scale: 1, color: "#B87333" }}
                transition={{ duration: 0.4 }}
                className="text-[14px] tracking-[2px] font-bold"
                data-testid="text-sats-count"
              >
                {totalSats}
              </motion.span>
              <span className="text-[10px] tracking-[2px] text-[#B87333]/60 font-bold">SATS</span>
            </div>
            <motion.button
              type="button"
              onClick={onBack}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 flex items-center justify-center border-2 border-[#B87333]/50 bg-[#B87333]/10 text-[#B87333] hover:bg-[#B87333]/20 transition-colors"
              data-testid="button-close-terminal"
            >
              <X size={16} strokeWidth={3} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 px-4 py-1.5 border-b border-[#B87333]/30 bg-[#0D0D0D]">
        <div className="flex items-center justify-center max-w-[400px] mx-auto">
          <span className="text-[8px] tracking-[2px] text-[#B87333]/25 font-bold" data-testid="text-block-indicator">
            {uiTexts.moduleLabel} {walletMode ? "" : "1/7"}
          </span>
        </div>
      </div>

      <div 
        ref={messagesContainerRef}
        onScroll={handleUserScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-2 terminal-scrollbar"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 3px,
              rgba(0,0,0,0.15) 3px,
              rgba(0,0,0,0.15) 6px
            ),
            linear-gradient(180deg, #0A0A0A 0%, #0F0F0F 100%)
          `,
          overscrollBehavior: "contain",
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] px-3 py-2 text-[13px] leading-snug whitespace-pre-line ${
                message.sender === "user"
                  ? "bg-[#4ADE80]/10 text-[#4ADE80] border-l-4 border-[#4ADE80]"
                  : message.sender === "system"
                  ? "bg-[#B87333]/20 text-[#B87333] border-l-4 border-[#B87333] text-center w-full"
                  : "bg-[#B87333]/10 text-[#B87333] border-l-4 border-[#B87333]"
              }`}
            >
              <span className="text-[10px] opacity-60 block mb-0.5 tracking-wider">
                {message.sender === "user" ? "[ USER ]" : message.sender === "system" ? "[ SYSTEM ]" : "[ SATOSHI ]"}
              </span>
              {message.text}
            </div>
          </div>
        ))}

        {isTyping && displayedText && (
          <div className="flex justify-start">
            <div className="max-w-[90%] px-3 py-2 text-[13px] leading-snug bg-[#B87333]/10 text-[#B87333] border-l-4 border-[#B87333] whitespace-pre-line">
              <span className="text-[10px] opacity-60 block mb-0.5 tracking-wider">[ SATOSHI ]</span>
              {displayedText}
              <span className="inline-block w-3 h-4 ml-1 bg-[#B87333] animate-pulse" />
            </div>
          </div>
        )}

        {currentOptions.length > 0 && !isTyping && !walletMode && (
          <div className="flex flex-col gap-2 pt-1">
            {currentOptions.map((option, idx) => (
              <motion.button
                type="button"
                key={`${currentBlock?.id}-${blockPhase}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleOptionClick(option); }}
                disabled={isLockedRef.current}
                className="w-full px-4 py-3 text-left text-[13px] font-mono font-bold tracking-wide
                         border-2 border-[#B87333]/50 bg-[#B87333]/5 text-[#B87333]
                         hover:bg-[#B87333]/15 hover:border-[#B87333] 
                         active:scale-[0.98] transition-all duration-200
                         disabled:opacity-30 disabled:cursor-not-allowed"
                data-testid={`button-option-${idx}`}
              >
                <span className="text-[#B87333]/40 mr-2">&gt;</span>
                {option.text}
              </motion.button>
            ))}
          </div>
        )}

        {walletButtons.length > 0 && !isTyping && walletMode && (
          <div className="flex flex-col gap-2 pt-1">
            {walletButtons.map((button, idx) => (
              <motion.button
                type="button"
                key={`wallet-${currentWalletStepId}-${idx}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleWalletButtonClick(button); }}
                disabled={isLockedRef.current}
                className={`w-full px-4 py-3 text-left text-[13px] font-mono font-bold tracking-wide
                         border-2 active:scale-[0.98] transition-all duration-200
                         disabled:opacity-30 disabled:cursor-not-allowed
                         ${button.type === "external"
                           ? "border-[#4ADE80]/50 bg-[#4ADE80]/5 text-[#4ADE80] hover:bg-[#4ADE80]/15 hover:border-[#4ADE80]"
                           : button.type === "deeplink"
                           ? "border-[#FFD700]/50 bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 hover:border-[#FFD700]"
                           : "border-[#B87333]/50 bg-[#B87333]/5 text-[#B87333] hover:bg-[#B87333]/15 hover:border-[#B87333]"
                         }`}
                data-testid={`button-wallet-${idx}`}
              >
                <span className={`mr-2 ${
                  button.type === "external" ? "text-[#4ADE80]/40" 
                  : button.type === "deeplink" ? "text-[#FFD700]/40"
                  : "text-[#B87333]/40"
                }`}>
                  {button.type === "external" ? "[>>]" : button.type === "deeplink" ? ">>>" : ">"}
                </span>
                {button.text}
              </motion.button>
            ))}
          </div>
        )}


        {flowCompleted && !isTyping && (
          <div className="pt-3 space-y-2">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                if (!satsClaimed) {
                  setSatsClaimed(true);
                  try { localStorage.setItem("liberta_sats_claimed", "1"); } catch (_) {}
                }
                const lnurl = "lightning:LNURL1DP68GURN8GHJ7MR0WEJHX6TRDDKXZUNY8QHXCMNZD968XTNRDAKJ7AMFW35XGUNPWUHKZURF9AMRZTMVDE6HYMP0XDMKGMFK2D6XK36ZFP29XVEN2FMY23R3VAXS0EPX5A";
                window.location.href = lnurl;
                setTimeout(() => {
                  window.open("https://lovesicklard8.lnbits.com/withdraw/7d77shxdb56wPeXf4s8B4o", "_blank");
                }, 2000);
              }}
              disabled={satsClaimed}
              className={`w-full px-4 py-3 text-left text-[13px] font-mono font-bold tracking-wide
                       border-2 transition-all duration-200 cursor-pointer block
                       ${satsClaimed
                         ? "border-[#FFD700]/30 bg-[#FFD700]/5 text-[#FFD700]/40 cursor-not-allowed opacity-50"
                         : "border-[#FFD700]/50 bg-[#FFD700]/10 text-[#FFD700] hover:bg-[#FFD700]/20 hover:border-[#FFD700]"
                       }`}
              data-testid="button-sats-claim-persistent"
            >
              <span className={`mr-2 ${satsClaimed ? "text-[#FFD700]/20" : "text-[#FFD700]/40"}`}>{">>>"}</span>
              {satsClaimed
                ? ((uiTexts as any).satsClaimedButton || "SATS CLAIMED")
                : "[ ПОЛУЧИТЬ_НАГРАДУ ]"
              }
            </motion.button>

            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTroubleshooting(prev => !prev); }}
              className="w-full px-4 py-3 text-left text-[11px] font-mono font-bold tracking-[2px]
                       border border-[#B87333]/30 bg-[#B87333]/5 text-[#B87333]/60
                       hover:bg-[#B87333]/10 hover:text-[#B87333] transition-all duration-200"
              data-testid="button-troubleshooting"
            >
              <span className="mr-2 text-[#B87333]/30">{showTroubleshooting ? "[-]" : "[+]"}</span>
              {uiTexts.troubleshootingButton}
            </motion.button>

            <AnimatePresence>
              {showTroubleshooting && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 py-3 text-[12px] font-mono leading-relaxed text-[#B87333]/70 border border-t-0 border-[#B87333]/20 bg-[#0A0A0A]">
                    <p className="text-[#B87333] font-bold mb-2 tracking-wider text-[11px]">{uiTexts.troubleshootingTitle}</p>
                    {uiTexts.troubleshootingSteps.map((step: string, i: number) => (
                      <p key={i} className={i < uiTexts.troubleshootingSteps.length - 1 ? "mb-1" : ""}>- {step}</p>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!followUpdatesClicked && (
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleFollowUpdatesClick(); }}
                className="w-full px-4 py-3 text-left text-[11px] font-mono font-bold tracking-[2px]
                         border border-[#00e5ff]/30 bg-[#00e5ff]/5 text-[#00e5ff]/60
                         hover:bg-[#00e5ff]/10 hover:text-[#00e5ff] transition-all duration-200"
                data-testid="button-follow-updates"
              >
                <span className="mr-2 text-[#00e5ff]/30">[?]</span>
                {uiTexts.followButton}
              </motion.button>
            )}
          </div>
        )}

        {followUpdatesTyped && !isTyping && (
          <div className="pt-3 space-y-2">
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePWAInstall(); }}
              className="w-full px-4 py-3 text-left text-[12px] font-mono font-bold tracking-[1px]
                       border border-[#B87333]/40 bg-[#B87333]/10 text-[#B87333]
                       hover:bg-[#B87333]/20 transition-all duration-200"
              data-testid="button-install-pwa"
            >
              {uiTexts.downloadApp}
            </motion.button>
            <motion.a
              href="https://primal.net/p/npub1qlkwmzmrhzpuak7c2g9afdcstamqrfmxkpjkgy3wjfagxtjqs2xqnxshjp"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="block w-full px-4 py-3 text-left text-[12px] font-mono font-bold tracking-[1px]
                       border border-[#00e5ff]/30 bg-[#00e5ff]/5 text-[#00e5ff]
                       hover:bg-[#00e5ff]/10 transition-all duration-200"
              data-testid="link-nostr-founder"
            >
              {uiTexts.founderNostr}
            </motion.a>
            <motion.a
              href="https://t.me/yeg0r"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="block w-full px-4 py-3 text-left text-[12px] font-mono font-bold tracking-[1px]
                       border border-[#00e5ff]/30 bg-[#00e5ff]/5 text-[#00e5ff]
                       hover:bg-[#00e5ff]/10 transition-all duration-200"
              data-testid="link-telegram-contact"
            >
              Telegram @yeg0r ({lang === "RU" ? "\u0432\u0440\u0435\u043c\u0435\u043d\u043d\u0430\u044f \u043c\u0435\u0440\u0430" : lang === "EN" ? "temporary" : "temporaneo"})
            </motion.a>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 border-t border-[#B87333]/30 bg-[#111111]">
        <div className="flex items-center gap-2 px-3 py-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleInputSend(); }}
            placeholder={uiTexts.inputPlaceholder}
            className="flex-1 bg-[#1A1A1A] text-[#B87333] text-[12px] font-mono px-3 py-2 border border-[#B87333]/20 outline-none focus:border-[#B87333]/50 placeholder-[#B87333]/30"
            data-testid="input-message"
          />
          <motion.button
            type="button"
            onClick={handleInputSend}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 flex items-center justify-center border border-[#B87333]/40 bg-[#1A1A1A] text-[#B87333] hover:bg-[#B87333]/20 transition-colors"
            data-testid="button-send"
          >
            <PixelSendIcon />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {levelUpSkill && onDismissLevelUp && (
          <SkillNotificationBanner
            iconRect={dosierIconRef.current ? (() => {
              const r = dosierIconRef.current!.getBoundingClientRect();
              return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            })() : null}
            onClose={() => {
              onDismissLevelUp();
              setIconBlinking(true);
              safeTimeout(() => setIconBlinking(false), 2600);
            }}
            skillText={uiTexts.skillNotification}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProfile && (
          <ProfileOverlay
            onClose={() => setShowProfile(false)}
            token={userToken || localStorage.getItem("liberta_token")}
            completedBlockIndex={completedBlockCount}
            lang={lang}
            originRect={dosierIconRef.current ? (() => {
              const r = dosierIconRef.current!.getBoundingClientRect();
              return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
            })() : null}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstallInstructions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.85)" }}
            onClick={() => setShowInstallInstructions(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="mx-6 p-6 border-2 border-[#B87333]/60 max-w-sm"
              style={{ background: "#0D0D0D" }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-[13px] font-mono text-[#B87333] leading-relaxed whitespace-pre-line">
                {installInstructionText}
              </p>
              <button
                type="button"
                onClick={() => setShowInstallInstructions(false)}
                className="mt-4 w-full px-4 py-2 text-[12px] font-mono font-bold tracking-[2px]
                         border border-[#B87333]/40 text-[#B87333] hover:bg-[#B87333]/10 transition-all"
                data-testid="button-close-install-instructions"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}