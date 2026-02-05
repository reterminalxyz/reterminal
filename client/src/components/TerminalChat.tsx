import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "satoshi" | "user";
}

interface TerminalChatProps {
  onProgressUpdate?: (sats: number) => void;
  onComplete?: () => void;
}

export function TerminalChat({ onProgressUpdate, onComplete }: TerminalChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, displayedText]);

  useEffect(() => {
    const initialMessage = "Привет, я Сатоши.";
    typeMessage(initialMessage, "satoshi");
  }, []);

  const typeMessage = (text: string, sender: "satoshi" | "user") => {
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
        }
      }, 30);
    } else {
      setMessages(prev => [...prev, { id: Date.now(), text, sender }]);
    }
  };

  const handleSend = () => {
    if (inputValue.trim() && !isTyping) {
      const userMessage = inputValue.trim();
      typeMessage(userMessage, "user");
      setInputValue("");
      
      setTimeout(() => {
        const responses = [
          "Интересная мысль. Продолжай.",
          "Ты на правильном пути.",
          "Свобода требует ответственности.",
          "Биткоин — это не просто деньги. Это инструмент суверенитета.",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        typeMessage(randomResponse, "satoshi");
        onProgressUpdate?.(50);
      }, 500);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1A1A1A] text-[#E8E8E8]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#B87333]/30 bg-[#222222]">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#B87333] animate-pulse" />
          <span className="text-[11px] tracking-[3px] font-mono font-bold text-[#B87333]">
            TERMINAL://SATOSHI_PROTOCOL
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[9px] tracking-[2px] font-mono text-[#B87333]/60">
            ENCRYPTED
          </span>
          {onComplete && (
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-7 h-7 flex items-center justify-center text-[#B87333]/70 hover:text-[#B87333] transition-colors"
              data-testid="button-close-terminal"
            >
              <X size={18} />
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
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
                className={`max-w-[80%] px-4 py-2 rounded font-mono text-[13px] leading-relaxed ${
                  message.sender === "user"
                    ? "bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/30"
                    : "bg-[#B87333]/10 text-[#B87333] border border-[#B87333]/30"
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && displayedText && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] px-4 py-2 rounded font-mono text-[13px] leading-relaxed bg-[#B87333]/10 text-[#B87333] border border-[#B87333]/30">
              {displayedText}
              <span className="inline-block w-2 h-4 ml-1 bg-[#B87333] animate-pulse" />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="px-4 py-4 border-t border-[#B87333]/30 bg-[#222222]">
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Введите сообщение..."
            disabled={isTyping}
            className="flex-1 bg-[#1A1A1A] border border-[#B87333]/40 rounded px-4 py-3 
                     text-[#E8E8E8] font-mono text-[13px] placeholder-[#666]
                     focus:outline-none focus:border-[#B87333] transition-colors
                     disabled:opacity-50"
            data-testid="input-terminal-message"
          />
          <motion.button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 flex items-center justify-center 
                     bg-[#B87333] text-[#1A1A1A] rounded
                     disabled:opacity-30 disabled:cursor-not-allowed
                     transition-opacity"
            data-testid="button-send-message"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
