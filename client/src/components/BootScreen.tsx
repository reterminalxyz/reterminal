import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share, ArrowDown } from "lucide-react";

type Lang = "RU" | "EN" | "IT";

const LANGS: Lang[] = ["IT", "EN", "RU"];

const TRANSLATIONS = {
  RU: {
    heroTitle: "Ты активировал карту свободы",
    heroSubtitle: "Для постоянного доступа и устойчивости к цензуре, установи терминал на телефон",
    stayBrowser: "Остаться в браузере",
    installTerminal: "Установить терминал",
    shuttingDown: "ОТКЛЮЧЕНИЕ...",
    terminalInstalled: "ТЕРМИНАЛ УСТАНОВЛЕН",
    openApp: "Открой приложение на главном экране",
  },
  EN: {
    heroTitle: "You have activated the Freedom Card",
    heroSubtitle: "For permanent access and censorship resistance, install the terminal on your phone",
    stayBrowser: "Stay in Browser",
    installTerminal: "Install Terminal",
    shuttingDown: "SHUTTING DOWN...",
    terminalInstalled: "TERMINAL INSTALLED",
    openApp: "Open the app on your home screen",
  },
  IT: {
    heroTitle: "Hai attivato la Carta della Libert\u00e0",
    heroSubtitle: "Per un accesso costante e resistente alla censura, installa il terminale sul telefono",
    stayBrowser: "Resta nel browser",
    installTerminal: "Installa terminale",
    shuttingDown: "DISCONNESSIONE...",
    terminalInstalled: "TERMINALE INSTALLATO",
    openApp: "Apri l'app nella schermata home",
  },
};

interface BootScreenProps {
  onDismiss: () => void;
  onLangChange?: (lang: string) => void;
  lang?: string;
}

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function LangToggle({ lang, onLangChange, variant }: { lang: Lang; onLangChange: (l: Lang) => void; variant: "dark" | "light" }) {
  const borderClass = variant === "dark" ? "border-[#333]" : "border-[#B87333]/20";
  const inactiveColor = variant === "dark" ? "#555" : "#aaa";
  const separatorColor = variant === "dark" ? "#333" : "#ccc";

  return (
    <div
      className={`flex items-center border ${borderClass}`}
      style={{ fontFamily: "monospace" }}
      data-testid="lang-toggle"
    >
      {LANGS.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span
              className="block w-px self-stretch"
              style={{ backgroundColor: separatorColor }}
            />
          )}
          <button
            type="button"
            onClick={() => onLangChange(l)}
            className="px-2 py-1 transition-colors duration-150"
            style={{
              fontSize: "8px",
              letterSpacing: "2px",
              color: lang === l ? "#B87333" : inactiveColor,
              borderBottom: lang === l ? "1px solid #B87333" : "1px solid transparent",
              lineHeight: 1,
            }}
            data-testid={`lang-${l.toLowerCase()}`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}

type ShutdownStage = "idle" | "waiting" | "squeeze" | "line" | "dot" | "black";

export { LangToggle, LANGS };
export type { Lang };

export function BootScreen({ onDismiss, onLangChange, lang = "IT" }: BootScreenProps) {
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const [shutdownStage, setShutdownStage] = useState<ShutdownStage>("idle");
  const deferredPromptRef = useRef<any>(null);

  const currentLang = (lang as Lang) || "IT";
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.IT;

  const handleLangSwitch = (l: Lang) => {
    try { localStorage.setItem("liberta_lang", l); } catch (_) {}
    onLangChange?.(l);
  };

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (isIOS()) {
      setShowIOSInstructions(true);
      return;
    }

    if (deferredPromptRef.current) {
      deferredPromptRef.current.prompt();
      const result = await deferredPromptRef.current.userChoice;
      deferredPromptRef.current = null;
      if (result.outcome === "accepted") {
        startShutdown();
      }
    } else {
      startShutdown();
    }
  };

  const startShutdown = () => {
    setShutdownStage("waiting");
    setTimeout(() => setShutdownStage("squeeze"), 4000);
    setTimeout(() => setShutdownStage("line"), 4400);
    setTimeout(() => setShutdownStage("dot"), 4700);
    setTimeout(() => setShutdownStage("black"), 5100);
  };

  if (shutdownStage === "black") {
    return (
      <div className="fixed inset-0 z-[10000] bg-black flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-center px-8"
        >
          <div className="text-[#B87333] font-mono text-[13px] tracking-[3px] font-bold mb-4">
            {t.terminalInstalled}
          </div>
          <div className="text-[#555] font-mono text-[11px] leading-relaxed max-w-[280px]">
            {t.openApp}
          </div>
          <motion.div
            className="mt-6 w-2 h-2 bg-[#B87333] mx-auto rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>
    );
  }

  const isShuttingDown = shutdownStage !== "idle";

  const getShutdownStyle = (): React.CSSProperties => {
    switch (shutdownStage) {
      case "waiting":
        return {};
      case "squeeze":
        return {
          transform: "scaleY(0.02)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 1, 1)",
          filter: "brightness(2.5)",
        };
      case "line":
        return {
          transform: "scaleY(0.005) scaleX(0.6)",
          transition: "transform 0.25s cubic-bezier(0.4, 0, 1, 1)",
          filter: "brightness(3)",
        };
      case "dot":
        return {
          transform: "scaleY(0.005) scaleX(0.01)",
          transition: "transform 0.35s cubic-bezier(0.4, 0, 1, 1)",
          filter: "brightness(4)",
          opacity: 0.6,
        };
      default:
        return {};
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black">
      <div className="absolute top-4 right-4 z-20">
        <LangToggle lang={currentLang} onLangChange={handleLangSwitch} variant="dark" />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 flex items-center justify-center bg-black"
        style={getShutdownStyle()}
      >
        <div className="boot-scanlines absolute inset-0 pointer-events-none" />
        <div className="boot-noise absolute inset-0 pointer-events-none" />
        <div className="boot-flicker absolute inset-0 pointer-events-none" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="boot-glitch-bar" />
          <div className="boot-glitch-bar" />
          <div className="boot-glitch-bar" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute left-0 right-0 h-[60px] bg-gradient-to-b from-[#B87333]/15 to-transparent"
            animate={{ top: ['-60px', '110%'] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
          />
          <motion.div
            className="absolute left-0 right-0 h-[30px] bg-gradient-to-b from-[#B87333]/10 to-transparent"
            animate={{ top: ['-30px', '110%'] }}
            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: 'linear', delay: 1.5 }}
          />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-full bg-[#B87333]"
              style={{
                top: `${3 + i * 8}%`,
                height: i % 4 === 0 ? '3px' : i % 2 === 0 ? '2px' : '1px',
                boxShadow: i % 4 === 0
                  ? '0 0 15px rgba(184, 115, 51, 0.6), 0 0 30px rgba(184, 115, 51, 0.2)'
                  : '0 0 8px rgba(184, 115, 51, 0.3)',
              }}
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: "100%", opacity: [0, 0.7, 0.5, 0] }}
              transition={{
                duration: 0.15 + (i % 3) * 0.05,
                delay: 0.5 + i * 1.8,
                repeat: Infinity,
                repeatDelay: 4 + (i % 3) * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute w-[300px] h-[300px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(184, 115, 51, 0.12) 0%, rgba(184, 115, 51, 0.04) 40%, transparent 70%)',
              top: '10%',
              left: '-15%',
            }}
            animate={{
              x: ['0%', '180%', '0%'],
              y: ['0%', '50%', '0%'],
              scale: [1, 1.3, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[250px] h-[250px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(184, 115, 51, 0.1) 0%, rgba(184, 115, 51, 0.03) 40%, transparent 70%)',
              bottom: '15%',
              right: '-10%',
            }}
            animate={{
              x: ['0%', '-150%', '0%'],
              y: ['0%', '-60%', '0%'],
              scale: [1.2, 0.8, 1.2],
            }}
            transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute w-[180px] h-[180px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(184, 115, 51, 0.08) 0%, transparent 60%)',
              top: '50%',
              left: '30%',
            }}
            animate={{
              x: ['0%', '80%', '-60%', '0%'],
              y: ['-50%', '20%', '-30%', '-50%'],
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="boot-vignette absolute inset-0 pointer-events-none" />

        {shutdownStage === "waiting" && (
          <div className="absolute inset-0 pointer-events-none z-20">
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.15, 0, 0.08, 0, 0.05, 0] }}
              transition={{ duration: 4, times: [0, 0.02, 0.04, 0.5, 0.52, 0.8, 1] }}
            />
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center px-8 max-w-[380px] w-full">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: isShuttingDown ? 0 : 1, y: 0 }}
            transition={{ delay: isShuttingDown ? 0 : 0.3, duration: isShuttingDown ? 0.3 : 0.6 }}
            className="mb-8 text-center"
          >
            <div className="text-[#B87333] font-mono text-[11px] tracking-[4px] mb-4 opacity-60">
              LIBERTA TERMINAL v0.1
            </div>
            <h1 className="text-[#B87333] font-mono text-[18px] font-bold leading-tight tracking-wide">
              {t.heroTitle}
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: isShuttingDown ? 0 : 1 }}
            transition={{ delay: isShuttingDown ? 0 : 0.6, duration: isShuttingDown ? 0.3 : 0.6 }}
            className="text-[#888] font-mono text-[12px] text-center leading-relaxed mb-10 max-w-[300px]"
          >
            {t.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isShuttingDown ? 0 : 1, y: 0 }}
            transition={{ delay: isShuttingDown ? 0 : 0.9, duration: isShuttingDown ? 0.3 : 0.5 }}
            className="flex flex-col items-center gap-3 w-full"
          >
            <button
              type="button"
              onClick={onDismiss}
              disabled={isShuttingDown}
              className="relative w-full py-4 font-mono text-[13px] font-bold tracking-[3px] uppercase transition-all duration-200 active:scale-[0.97] text-[#F5F5F5]"
              style={{
                background: "linear-gradient(135deg, #333 0%, #555 40%, #666 60%, #555 80%, #333 100%)",
                boxShadow: "0 0 12px rgba(100, 100, 100, 0.3), inset 0 1px 1px rgba(255,255,255,0.1)",
                border: "1px solid rgba(150, 150, 150, 0.4)",
              }}
              data-testid="button-stay-browser"
            >
              {t.stayBrowser}
            </button>

            <button
              type="button"
              onClick={handleInstall}
              disabled={isShuttingDown}
              className="install-btn-glitch relative w-full py-4 font-mono text-[13px] font-bold tracking-[3px] uppercase transition-all duration-200 active:scale-[0.97] text-[#F5F5F5]"
              style={{
                background: "linear-gradient(135deg, #7A3B20 0%, #A0522D 20%, #B87333 40%, #D4956A 60%, #E8B89D 80%, #B87333 100%)",
                boxShadow: "0 0 12px rgba(184, 115, 51, 0.4), 0 0 25px rgba(184, 115, 51, 0.15), inset 0 1px 1px rgba(232, 184, 157, 0.3)",
                border: "1px solid rgba(212, 149, 106, 0.5)",
              }}
              data-testid="button-install-terminal"
              data-text={t.installTerminal}
            >
              <span className="relative z-10">{t.installTerminal}</span>
              <div className="absolute inset-0 bg-[#B87333]/5 animate-pulse" />
            </button>
          </motion.div>

          {isShuttingDown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 text-[#B87333] font-mono text-[11px] tracking-[3px] text-center"
            >
              <motion.span
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                {t.shuttingDown}
              </motion.span>
            </motion.div>
          )}

          {!isShuttingDown && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.2 }}
              className="mt-12 text-[#444] font-mono text-[9px] tracking-[2px] text-center"
            >
              DECENTRALIZED / CENSORSHIP-RESISTANT / OPEN
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {showIOSInstructions && (
            <motion.div
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[10001] p-4"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
            >
              <div
                className="relative mx-auto max-w-[380px] rounded-2xl border border-[#333] bg-[#1A1A1A] p-5"
                style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.8)" }}
              >
                <button
                  type="button"
                  onClick={() => setShowIOSInstructions(false)}
                  className="absolute top-3 right-3 text-[#666] font-mono text-sm"
                  data-testid="button-close-ios-instructions"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>

                <h3 className="text-[#E8E8E8] font-mono text-[12px] font-bold tracking-wider mb-4">
                  INSTALL ON iOS
                </h3>

                <div className="flex items-center gap-4 bg-[#111] rounded-xl p-4 border border-[#222]">
                  <div className="flex flex-col gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#B87333] font-mono text-[11px] font-bold">1.</span>
                      <span className="text-[#999] font-mono text-[11px]">Tap</span>
                      <Share className="w-4 h-4 text-[#B87333]" />
                      <span className="text-[#999] font-mono text-[11px]">below</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#B87333] font-mono text-[11px] font-bold">2.</span>
                      <span className="text-[#999] font-mono text-[11px]">Add to Home Screen</span>
                    </div>
                  </div>

                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="flex-shrink-0"
                  >
                    <ArrowDown className="w-6 h-6 text-[#B87333]" strokeWidth={2.5} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
