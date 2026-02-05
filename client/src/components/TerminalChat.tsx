import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "satoshi" | "user";
}

interface TerminalChatProps {
  onBack: () => void;
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

const dialogueResponses = [
  "Ты прошёл первый этап. Теперь поговорим о свободе.",
  "Деньги — это энергия. Кто контролирует деньги, контролирует время людей.",
  "Биткоин — это выход. Никто не может заблокировать твой кошелёк.",
  "Суверенитет начинается с контроля над своими ключами.",
  "Not your keys, not your coins. Запомни это.",
  "Ты уже не такой как раньше. Добро пожаловать в сеть.",
  "ПРОТОКОЛ ПРОДОЛЖАЕТСЯ..."
];

export function TerminalChat({ onBack }: TerminalChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [dialogueStep, setDialogueStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const isLockedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText]);

  useEffect(() => {
    typeMessage("Привет, я Сатоши.", "satoshi");
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
    if (isLockedRef.current) return;
    if (!inputValue.trim() || isTyping || isProcessing) return;
    
    isLockedRef.current = true;
    setIsProcessing(true);
    
    const userMessage = inputValue.trim();
    typeMessage(userMessage, "user");
    setInputValue("");
    
    const nextStep = dialogueStep;
    setDialogueStep(prev => prev + 1);
    
    setTimeout(() => {
      const response = dialogueResponses[nextStep % dialogueResponses.length];
      typeMessage(response, "satoshi", () => {
        isLockedRef.current = false;
        setIsProcessing(false);
      });
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] text-[#E8E8E8] font-mono">
      {/* Pixel-style header with X button */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[#B87333]/60 bg-[#111111]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-[#B87333]" />
          <span className="text-[11px] tracking-[4px] font-bold text-[#B87333] uppercase">
            TERMINAL://SATOSHI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-2 py-1 border-2 border-[#B87333]/50 bg-[#B87333]/10">
            <span className="text-[9px] tracking-[2px] text-[#B87333] font-bold">
              ENCRYPTED
            </span>
          </div>
          <motion.button
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

      {/* Messages area with heavy scanlines */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-6 space-y-5"
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
                className={`max-w-[90%] px-4 py-3 text-[13px] leading-relaxed ${
                  message.sender === "user"
                    ? "bg-[#4ADE80]/10 text-[#4ADE80] border-l-4 border-[#4ADE80]"
                    : "bg-[#B87333]/10 text-[#B87333] border-l-4 border-[#B87333]"
                }`}
              >
                <span className="text-[10px] opacity-60 block mb-1 tracking-wider">
                  {message.sender === "user" ? "[ USER ]" : "[ SATOSHI ]"}
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
            <div className="max-w-[90%] px-4 py-3 text-[13px] leading-relaxed bg-[#B87333]/10 text-[#B87333] border-l-4 border-[#B87333]">
              <span className="text-[10px] opacity-60 block mb-1 tracking-wider">[ SATOSHI ]</span>
              {displayedText}
              <span className="inline-block w-3 h-4 ml-1 bg-[#B87333] animate-pulse" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} className="h-40" />
      </div>

      {/* Fixed input at bottom */}
      <div className="fixed bottom-[90px] left-0 right-0 px-4 py-3 border-t-2 border-[#B87333]/60 bg-[#111111] z-50">
        <div className="flex items-center gap-3 max-w-[400px] mx-auto">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B87333]/60 text-[14px] font-bold">&gt;</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Введите ответ..."
              disabled={isTyping || isProcessing}
              className="w-full h-12 bg-[#0A0A0A] border-2 border-[#B87333]/50 px-4 pl-8
                       text-[#E8E8E8] text-[13px] placeholder-[#555]
                       focus:outline-none focus:border-[#B87333] transition-colors
                       disabled:opacity-40"
              data-testid="input-terminal-message"
            />
          </div>
          <motion.button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping || isProcessing}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 flex items-center justify-center 
                     bg-[#B87333] text-[#0A0A0A] border-2 border-[#B87333]
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
