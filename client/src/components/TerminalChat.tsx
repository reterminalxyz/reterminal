import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
}

export function TerminalChat({ dialogues, onDialogueComplete, onComplete }: TerminalChatProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedMessages, setDisplayedMessages] = useState<{ speaker: string; text: string }[]>([]);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [branchPath, setBranchPath] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

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
    setShowOptions(false);
    const text = dialogue.message;
    
    for (let i = 0; i <= text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 25));
      setTypingText(text.slice(0, i));
    }
    
    setIsTyping(false);
    setDisplayedMessages(prev => [...prev, { speaker: "SATOSHI", text }]);
    setTypingText("");
    onDialogueComplete(dialogue.reward);
    
    if (dialogue.options && dialogue.options.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowOptions(true);
    } else {
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleOptionClick = (option: { id: string; label: string; next?: string; action?: string }) => {
    setDisplayedMessages(prev => [...prev, { speaker: "YOU", text: option.label }]);
    setShowOptions(false);
    
    if (option.action === "complete_phase_2") {
      onComplete();
      return;
    }
    
    if (option.next) {
      setBranchPath(option.next);
      const nextIndex = allDialogues.findIndex(d => d.id === option.next);
      if (nextIndex !== -1) {
        setCurrentIndex(nextIndex);
      } else {
        setCurrentIndex(prev => prev + 1);
      }
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentDialogue = allDialogues[currentIndex];

  return (
    <div className="flex flex-col h-full bg-[#2A2A2A]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#B87333]/40">
        <span className="text-[12px] text-[#B87333] tracking-[2px] font-medium">
          TERMINAL: SATOSHI_PROTOCOL
        </span>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#1E1E1E] border border-[#B87333]/30 m-2 rounded">
        <AnimatePresence>
          {displayedMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-mono text-sm leading-relaxed"
            >
              <span className={msg.speaker === "SATOSHI" ? "text-[#B87333]" : "text-[#E8E8E8]"}>
                {msg.speaker} &gt;{" "}
              </span>
              <span className="text-[#E8E8E8]/80">{msg.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Currently typing */}
        {isTyping && typingText && (
          <div className="font-mono text-sm leading-relaxed">
            <span className="text-[#B87333]">SATOSHI &gt; </span>
            <span className="text-[#E8E8E8]/80">{typingText}</span>
            <motion.span
              className="inline-block w-2 h-4 bg-[#B87333] ml-1"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        )}
        
        {/* Options */}
        <AnimatePresence>
          {showOptions && currentDialogue?.options && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap gap-3 pt-4"
            >
              {currentDialogue.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className="px-6 py-3 border-2 border-[#B87333] text-[#E8E8E8] text-sm tracking-wider font-medium
                           hover:bg-[#B87333] hover:text-[#1E1E1E] transition-all duration-200"
                  data-testid={`chat-option-${option.id}`}
                >
                  {option.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}
