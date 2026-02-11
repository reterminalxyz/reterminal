import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share, ArrowDown } from "lucide-react";

function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isInStandaloneMode(): boolean {
  return (
    ("standalone" in window.navigator && (window.navigator as any).standalone) ||
    window.matchMedia("(display-mode: standalone)").matches
  );
}

export function IOSInstallPrompt() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("pwa-install-dismissed");
    if (dismissed) return;

    if (isIOS() && !isInStandaloneMode()) {
      const timer = setTimeout(() => setShow(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("pwa-install-dismissed", "1");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
        >
          <div
            className="relative mx-auto max-w-[400px] rounded-2xl border border-[#333] bg-[#1A1A1A] p-5 shadow-2xl"
            style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.6)" }}
          >
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-[#666] transition-colors"
              data-testid="button-dismiss-install"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#333] flex-shrink-0">
                <img src="/icons/icon-192.png" alt="Liberta" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="text-[#E8E8E8] font-mono text-sm font-bold tracking-wider">
                  INSTALL LIBERTA TERMINAL
                </h3>
                <p className="text-[#666] font-mono text-[10px] tracking-wide mt-0.5">
                  FULL SCREEN / OFFLINE / NO TRACKING
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-[#111] rounded-xl p-4 border border-[#222]">
              <div className="flex flex-col items-center gap-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#E8E8E8] font-mono text-[11px]">1.</span>
                  <span className="text-[#999] font-mono text-[11px]">Tap</span>
                  <Share className="w-4 h-4 text-[#B87333]" />
                  <span className="text-[#999] font-mono text-[11px]">Share</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#E8E8E8] font-mono text-[11px]">2.</span>
                  <span className="text-[#999] font-mono text-[11px]">Add to Home Screen</span>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, 6, 0] }}
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
  );
}
