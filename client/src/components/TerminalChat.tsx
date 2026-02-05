import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "satoshi" | "user";
}

interface TerminalChatProps {
  onProgressUpdate: (newProgress: number) => void;
}

const PixelSendIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor" style={{ imageRendering: 'pixelated' }}>
    <rect x="2" y="7" width="2" height="2" />
    <rect x="4" y="7" width="2" height="2" />
    <rect x="6" y="7" width="2" height="2" />
    <rect x="8" y="7" width="2" height="2" />
    <rect x="10" y="5" width="2" height="2" />
    <rect x="10" y="9" width="2" height="2" />
    <rect x="12" y="7" width="2" height="2" />
    <rect x="8" y="5" width="2" height="2" />
    <rect x="8" y="9" width="2" height="2" />
    <rect x="6" y="3" width="2" height="2" />
    <rect x="6" y="11" width="2" height="2" />
  </svg>
);

const dialogueBlocks = [
  { satoshi: "Привет, я Сатоши.", progressTarget: 20 },
  { satoshi: "Ты прошёл первый этап. Теперь поговорим о свободе.", progressTarget: 31 },
  { satoshi: "Деньги — это энергия. Кто контролирует деньги, контролирует время людей.", progressTarget: 43 },
  { satoshi: "Биткоин — это выход. Никто не может заблокировать твой кошелёк.", progressTarget: 54 },
  { satoshi: "Суверенитет начинается с контроля над своими ключами.", progressTarget: 66 },
  { satoshi: "Not your keys, not your coins. Запомни это.", progressTarget: 77 },
  { satoshi: "Ты уже не такой как раньше. Добро пожаловать в сеть.", progressTarget: 89 },
  { satoshi: "ПРОТОКОЛ ЗАВЕРШЁН. ТЫ АКТИВИРОВАН.", progressTarget: 100 }
];

export function TerminalChat({ onProgressUpdate }: TerminalChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [dialogueStep, setDialogueStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); // UI state for disabling input
  const isLockedRef = useRef(false); // Synchronous lock to prevent any race conditions
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText]);

  useEffect(() => {
    if (dialogueStep === 0 && messages.length === 0) {
      typeMessage(dialogueBlocks[0].satoshi, "satoshi");
    }
  }, []);

  const typeMessage = (text: string, sender: "satoshi" | "user", onComplete?: () => void) => {
    if (sender === "satoshi") {
      setIsTyping(true);
      setDisplayedText("");
      let charIndex = 0;
      
      const typeInterval = setInterval(() => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
          setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
          setDisplayedText("");
          onComplete?.();
        }
      }, 30);
    } else {
      setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
    }
  };

  const handleSend = () => {
    // Synchronous ref check prevents any race conditions
    if (isLockedRef.current) return;
    if (!inputValue.trim() || isTyping || isProcessing || dialogueStep >= dialogueBlocks.length - 1) return;
    
    isLockedRef.current = true; // Immediate synchronous lock
    setIsProcessing(true); // Disable UI immediately
    
    const userMessage = inputValue.trim();
    typeMessage(userMessage, "user");
    setInputValue("");
    
    const nextStep = dialogueStep + 1;
    setDialogueStep(nextStep);
    
    setTimeout(() => {
      if (nextStep < dialogueBlocks.length) {
        const block = dialogueBlocks[nextStep];
        // Unlock only after Satoshi finishes typing
        typeMessage(block.satoshi, "satoshi", () => {
          isLockedRef.current = false;
          setIsProcessing(false);
        });
        onProgressUpdate(block.progressTarget);
      } else {
        isLockedRef.current = false;
        setIsProcessing(false);
      }
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isComplete = dialogueStep >= dialogueBlocks.length - 1;

  return (
    <div className="flex flex-col h-full bg-[#0D0D0D] text-[#E8E8E8] font-mono">
      {/* Pixel-style header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#B87333]/50 bg-[#151515]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-[#B87333]" style={{ imageRendering: 'pixelated' }} />
          <span className="text-[10px] tracking-[3px] font-bold text-[#B87333] uppercase">
            TERMINAL://SATOSHI
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 border border-[#B87333]/40 bg-[#B87333]/10">
            <span className="text-[8px] tracking-[2px] text-[#B87333]/80">
              {isComplete ? "100%" : "ENCRYPTED"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages area with scanlines */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 relative pb-36"
        style={{
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0,0,0,0.1) 2px,
              rgba(0,0,0,0.1) 4px
            ),
            #0D0D0D
          `
        }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 text-[12px] leading-relaxed ${
                  message.sender === "user"
                    ? "bg-[#4ADE80]/15 text-[#4ADE80] border-l-2 border-[#4ADE80]"
                    : "bg-[#B87333]/10 text-[#B87333] border-l-2 border-[#B87333]"
                }`}
              >
                <span className="text-[9px] opacity-50 block mb-1">
                  {message.sender === "user" ? "> USER" : "> SATOSHI"}
                </span>
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && displayedText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="max-w-[85%] px-3 py-2 text-[12px] leading-relaxed bg-[#B87333]/10 text-[#B87333] border-l-2 border-[#B87333]">
              <span className="text-[9px] opacity-50 block mb-1">&gt; SATOSHI</span>
              {displayedText}
              <span className="inline-block w-2 h-3 ml-1 bg-[#B87333] animate-pulse" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Fixed input at bottom - height: 68px total (py-3=24px + input h-11=44px) */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 border-t-2 border-[#B87333]/50 bg-[#151515] z-50">
        <div className="flex items-center gap-3 max-w-[400px] mx-auto">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B87333]/50 text-[12px]">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isComplete ? "Протокол завершён" : "Введите ответ..."}
              disabled={isTyping || isProcessing || isComplete}
              className="w-full h-11 bg-[#0D0D0D] border-2 border-[#B87333]/40 px-4 pl-7
                       text-[#E8E8E8] text-[12px] placeholder-[#555]
                       focus:outline-none focus:border-[#B87333] transition-colors
                       disabled:opacity-40"
              data-testid="input-terminal-message"
            />
          </div>
          <motion.button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping || isProcessing || isComplete}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 flex items-center justify-center 
                     bg-[#B87333] text-[#0D0D0D] border-2 border-[#B87333]
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-opacity"
            data-testid="button-send-message"
          >
            <PixelSendIcon />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
