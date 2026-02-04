import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";

interface DialogueBlock {
  id: string;
  speaker: "satoshi" | "user";
  message: string;
  reward: number;
  options?: { id: string; label: string; next?: string; action?: string }[];
}

interface TerminalChatProps {
  dialogues: DialogueBlock[];
  onDialogueComplete: (reward: number) => void;
  onComplete: () => void;
  onClose?: () => void;
}

export function TerminalChat({ dialogues, onDialogueComplete, onComplete }: TerminalChatProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<{ speaker: string; text: string }[]>([]);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [branchPath, setBranchPath] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [inputEnabled, setInputEnabled] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const allDialogues = dialogues;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedMessages, typingText]);

  useEffect(() => {
    if (currentIndex >= allDialogues.length) {
      onComplete();
      return;
    }

    const dialogue = allDialogues[currentIndex];
    
    if (branchPath && dialogue.id !== branchPath && !dialogue.id.includes(branchPath.split("_")[0])) {
      if (dialogue.id.startsWith("dialogue_4") && !dialogue.id.includes(branchPath.slice(-1))) {
        setCurrentIndex(prev => prev + 1);
        return;
      }
    }

    if (dialogue.speaker === "satoshi") {
      typeMessage(dialogue);
    }
  }, [currentIndex, branchPath]);

  const typeMessage = async (dialogue: DialogueBlock) => {
    setIsTyping(true);
    setInputEnabled(false);
    const text = dialogue.message;
    
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 25));
      setTypingText(text.slice(0, i));
    }
    
    setIsTyping(false);
    setDisplayedMessages(prev => [...prev, { speaker: "SATOSHI", text }]);
    setTypingText("");
    onDialogueComplete(dialogue.reward);
    
    // Enable input after message, let user type response
    await new Promise(resolve => setTimeout(resolve, 500));
    setInputEnabled(true);
    inputRef.current?.focus();
  };

  const sendUserMessage = (text: string) => {
    if (!text.trim()) return;
    
    setDisplayedMessages(prev => [...prev, { speaker: "ТЫ", text }]);
    setInputEnabled(false);
    setInputValue("");
    
    const currentDialogue = allDialogues[currentIndex];
    
    // Check if this dialogue has options with actions
    if (currentDialogue?.options) {
      const completeOption = currentDialogue.options.find(o => o.action === "complete_phase_2");
      if (completeOption) {
        onComplete();
        return;
      }
      
      // Check for branch paths
      const branchOption = currentDialogue.options.find(o => o.next);
      if (branchOption?.next) {
        setBranchPath(branchOption.next);
        const nextIndex = allDialogues.findIndex(d => d.id === branchOption.next);
        if (nextIndex !== -1) {
          setCurrentIndex(nextIndex);
          return;
        }
      }
    }
    
    // Default: move to next dialogue
    setCurrentIndex(prev => prev + 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !inputEnabled) return;
    sendUserMessage(inputValue);
  };

  return (
    <div className="flex flex-col h-full bg-[#2A2A2A]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#B87333]/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            className="w-2 h-2 rounded-full bg-[#B87333]"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <span className="text-[10px] text-[#B87333] tracking-[1px] font-mono">
            SATOSHI_PROTOCOL
          </span>
        </div>
        <span className="text-[8px] text-[#E8E8E8]/40 tracking-wider font-mono">
          ENCRYPTED
        </span>
      </div>
      
      {/* Chat area - extra padding at bottom to avoid independence bar overlap */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-4 bg-[#1E1E1E]">
        {/* System initialization message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[9px] text-[#B87333]/50 font-mono mb-4"
        >
          [SYSTEM] Connection established. Digital resistance protocol active.
        </motion.div>
        
        <AnimatePresence>
          {displayedMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-[13px] leading-relaxed"
            >
              <span className={msg.speaker === "SATOSHI" ? "text-[#B87333]" : "text-[#4ADE80]"}>
                [{msg.speaker}]
              </span>
              <span className="text-[#E8E8E8]/80 ml-2">{msg.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Currently typing */}
        {isTyping && typingText && (
          <div className="font-mono text-[13px] leading-relaxed">
            <span className="text-[#B87333]">[SATOSHI]</span>
            <span className="text-[#E8E8E8]/80 ml-2">{typingText}</span>
            <motion.span
              className="inline-block w-2 h-4 bg-[#B87333] ml-1 align-middle"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      {/* Input area - positioned above independence bar */}
      <form 
        onSubmit={handleSubmit}
        className="p-3 pb-20 border-t border-[#B87333]/40 bg-[#2A2A2A]"
      >
        <div className="flex items-center gap-2 border border-[#B87333]/50 bg-[#1E1E1E] px-3 py-2">
          <span className="text-[#4ADE80] text-xs font-mono">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputEnabled ? "Введите ответ..." : "Ожидание..."}
            disabled={!inputEnabled}
            className="flex-1 bg-transparent text-[#E8E8E8] text-[13px] font-mono 
                     placeholder:text-[#E8E8E8]/30 focus:outline-none disabled:opacity-50"
            data-testid="input-chat"
          />
          <button
            type="submit"
            disabled={!inputEnabled || !inputValue.trim()}
            className="p-1 text-[#B87333] hover:text-[#D4956A] disabled:opacity-30 transition-colors"
            data-testid="button-send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
