import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SKILL_META, type SkillKey, SKILL_KEYS } from "@shared/schema";

type GrantedSkill = { skillKey: string; grantedAt: string | null };

const MODULE_CONFIG: Record<SkillKey, { serial: string; label: string; neonColor: string; specs: string[]; code: string[] }> = {
  TRUTH_SEEKER: {
    serial: "MOD_01",
    label: "VISUAL UPLINK",
    neonColor: "#00e5ff",
    specs: ["FREQ: 2.4GHz", "RANGE: 500m", "LATENCY: <2ms"],
    code: ["decrypt(stream.in)", "filter(noise > 0.3)", "render(truth.map)"],
  },
  HARD_MONEY: {
    serial: "MOD_02",
    label: "NEURAL INPUT",
    neonColor: "#ffaa00",
    specs: ["HASH: SHA-256", "DEPTH: 21M", "VERIFY: PROOF"],
    code: ["validate(block.hash)", "sign(tx, privKey)", "broadcast(mempool)"],
  },
  GRID_RUNNER: {
    serial: "MOD_03",
    label: "LOGIC ENGINE",
    neonColor: "#b87333",
    specs: ["SPEED: 1M tx/s", "ROUTE: ONION", "CHANNEL: ACTIVE"],
    code: ["route(payment.path)", "encrypt(layer, 3)", "settle(invoice.id)"],
  },
};

function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 w-full h-[2px] z-30 pointer-events-none"
      style={{
        background: "linear-gradient(90deg, transparent, rgba(0,229,255,0.15), rgba(0,229,255,0.3), rgba(0,229,255,0.15), transparent)",
        boxShadow: "0 0 8px rgba(0,229,255,0.2)",
      }}
      animate={{ top: ["-2%", "102%"] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
    />
  );
}

function GridBackground() {
  return (
    <div
      className="absolute inset-0 opacity-[0.06] pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,229,255,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,255,0.3) 1px, transparent 1px)
        `,
        backgroundSize: "24px 24px",
      }}
    />
  );
}

function CoreModule({ unlockedCount }: { unlockedCount: number }) {
  const pct = Math.round((unlockedCount / SKILL_KEYS.length) * 100);

  return (
    <div className="relative mx-auto" style={{ width: 160, height: 160 }} data-testid="core-module">
      <svg viewBox="0 0 160 160" width="160" height="160" className="mx-auto">
        <rect x="30" y="30" width="100" height="100" fill="none" stroke="#333" strokeWidth="1" />
        <rect x="40" y="40" width="80" height="80" fill="none" stroke="#444" strokeWidth="0.5" strokeDasharray="4 2" />

        <line x1="80" y1="0" x2="80" y2="30" stroke="#333" strokeWidth="0.5" />
        <line x1="80" y1="130" x2="80" y2="160" stroke="#333" strokeWidth="0.5" />
        <line x1="0" y1="80" x2="30" y2="80" stroke="#333" strokeWidth="0.5" />
        <line x1="130" y1="80" x2="160" y2="80" stroke="#333" strokeWidth="0.5" />

        <circle cx="80" cy="80" r="25" fill="none" stroke={unlockedCount > 0 ? "#00e5ff" : "#333"} strokeWidth="1" opacity={unlockedCount > 0 ? 0.6 : 0.3}>
          {unlockedCount > 0 && (
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
          )}
        </circle>
        <circle cx="80" cy="80" r="18" fill="none" stroke={unlockedCount > 0 ? "#00e5ff" : "#333"} strokeWidth="0.5" opacity="0.3" />

        <circle cx="30" cy="30" r="2" fill="#444" />
        <circle cx="130" cy="30" r="2" fill="#444" />
        <circle cx="30" cy="130" r="2" fill="#444" />
        <circle cx="130" cy="130" r="2" fill="#444" />

        <rect x="55" y="55" width="50" height="50" fill="none" stroke="#555" strokeWidth="0.5" />
        <line x1="60" y1="60" x2="100" y2="100" stroke="#333" strokeWidth="0.3" />
        <line x1="100" y1="60" x2="60" y2="100" stroke="#333" strokeWidth="0.3" />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="text-[18px] font-bold font-mono tracking-wider"
          style={{
            color: unlockedCount > 0 ? "#00e5ff" : "#444",
            textShadow: unlockedCount > 0 ? "0 0 10px rgba(0,229,255,0.5)" : "none",
          }}
        >
          {pct}%
        </div>
        <div className="text-[7px] tracking-[3px] font-mono text-[#555] uppercase mt-0.5">
          SYNCED
        </div>
      </div>
    </div>
  );
}

function ModuleSlot({ skillKey, granted }: { skillKey: SkillKey; granted: GrantedSkill | undefined }) {
  const config = MODULE_CONFIG[skillKey];
  const meta = SKILL_META[skillKey];
  const isUnlocked = !!granted;

  return (
    <div
      className="relative"
      style={{
        border: `1px solid ${isUnlocked ? config.neonColor + "66" : "#222"}`,
        background: isUnlocked
          ? `linear-gradient(180deg, ${config.neonColor}08 0%, #0a0a0a 100%)`
          : "#0d0d0d",
        boxShadow: isUnlocked
          ? `0 0 20px ${config.neonColor}20, inset 0 0 30px ${config.neonColor}05`
          : "none",
      }}
      data-testid={`module-slot-${skillKey}`}
    >
      {isUnlocked && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ border: `1px solid ${config.neonColor}` }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
      )}

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              className="w-[6px] h-[6px]"
              style={{
                background: isUnlocked ? config.neonColor : "#333",
                boxShadow: isUnlocked ? `0 0 6px ${config.neonColor}` : "none",
              }}
            />
            <span
              className="text-[9px] tracking-[3px] font-bold font-mono uppercase"
              style={{
                color: isUnlocked ? config.neonColor : "#333",
                textShadow: isUnlocked ? `0 0 6px ${config.neonColor}60` : "none",
              }}
            >
              {config.serial}
            </span>
          </div>
          <span
            className="text-[8px] tracking-[2px] font-mono uppercase"
            style={{ color: isUnlocked ? "#666" : "#222" }}
          >
            {isUnlocked ? "ONLINE" : "OFFLINE"}
          </span>
        </div>

        <div
          className="text-[11px] tracking-[2px] font-bold font-mono uppercase mb-1"
          style={{
            color: isUnlocked ? "#e0e0e0" : "#2a2a2a",
            textShadow: isUnlocked ? `0 0 4px ${config.neonColor}30` : "none",
          }}
        >
          {config.label}
        </div>

        <div
          className="text-[9px] font-mono mb-2"
          style={{ color: isUnlocked ? "#777" : "#1a1a1a" }}
        >
          {meta.name}
        </div>

        {isUnlocked ? (
          <div>
            <div className="mb-2">
              <div className="text-[7px] tracking-[2px] font-mono text-[#444] uppercase mb-1">
                SPECIFICATIONS
              </div>
              <div className="grid grid-cols-3 gap-1">
                {config.specs.map((spec, i) => (
                  <div
                    key={i}
                    className="text-[7px] font-mono px-1 py-0.5"
                    style={{
                      color: config.neonColor,
                      background: `${config.neonColor}08`,
                      border: `1px solid ${config.neonColor}15`,
                    }}
                  >
                    {spec}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[7px] tracking-[2px] font-mono text-[#444] uppercase mb-1">
                RUNTIME
              </div>
              {config.code.map((line, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span className="text-[7px] font-mono" style={{ color: `${config.neonColor}60` }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <motion.span
                    className="text-[8px] font-mono"
                    style={{ color: config.neonColor }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  >
                    {line}
                  </motion.span>
                </div>
              ))}
            </div>

            <div className="mt-2 h-[3px] w-full overflow-hidden" style={{ background: "#111" }}>
              <motion.div
                className="h-full"
                style={{ background: config.neonColor, width: "100%" }}
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>

            {granted?.grantedAt && (
              <div className="text-[7px] font-mono mt-1" style={{ color: "#444" }}>
                ACTIVATED: {new Date(granted.grantedAt).toLocaleDateString("ru-RU")}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 h-[1px]" style={{ background: "#1a1a1a" }} />
              <span className="text-[8px] tracking-[3px] font-mono" style={{ color: "#2a2a2a" }}>
                SYSTEM_OFFLINE
              </span>
              <div className="flex-1 h-[1px]" style={{ background: "#1a1a1a" }} />
            </div>

            <div className="space-y-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[6px] w-full" style={{ background: "#111", border: "1px solid #1a1a1a" }} />
              ))}
            </div>

            <div className="mt-2 h-[3px] w-full" style={{ background: "#111", border: "1px solid #151515" }} />
          </div>
        )}
      </div>
    </div>
  );
}

function Greebles({ token, unlockedCount }: { token: string | null; unlockedCount: number }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: "1px solid #151515" }}>
        <div className="flex items-center gap-3">
          <span className="text-[7px] font-mono tracking-[2px] text-[#333]">
            SYS.ID: {token ? token.slice(0, 8).toUpperCase() : "--------"}
          </span>
          <span className="text-[7px] font-mono text-[#333]">
            {dateStr} {timeStr}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-[4px] h-[4px]" style={{ background: unlockedCount > 0 ? "#00e5ff" : "#333" }}>
              {unlockedCount > 0 && (
                <motion.div
                  className="w-full h-full"
                  style={{ background: "#00e5ff" }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <span className="text-[7px] font-mono" style={{ color: unlockedCount > 0 ? "#00e5ff" : "#333" }}>
              {unlockedCount > 0 ? "SYNCED" : "STANDBY"}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

function MiniGraph() {
  const bars = [3, 5, 4, 7, 6, 8, 5, 7, 9, 6, 4, 7];
  return (
    <div className="flex items-end gap-[1px] h-[12px]">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-[2px]"
          style={{
            height: `${h}px`,
            background: "#333",
          }}
        />
      ))}
    </div>
  );
}

interface ProfileOverlayProps {
  onClose: () => void;
  token: string | null;
}

export default function ProfileOverlay({ onClose, token }: ProfileOverlayProps) {
  const [skills, setSkills] = useState<GrantedSkill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = useCallback(() => {
    if (!token) { setLoading(false); return; }
    fetch(`/api/skills/${token}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setSkills(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const unlockedCount = skills.length;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: "#0a0a0a" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      data-testid="overlay-profile"
    >
      <GridBackground />
      <ScanLine />

      <div className="flex-shrink-0 z-50 relative" style={{ background: "#0d0d0d", borderBottom: "1px solid #222" }}>
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 transition-colors"
            style={{ color: "#555" }}
            data-testid="button-back-terminal"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[9px] tracking-[2px] font-bold uppercase font-mono">ТЕРМИНАЛ</span>
          </button>
          <span className="text-[10px] tracking-[4px] font-bold uppercase font-mono" style={{ color: "#00e5ff", textShadow: "0 0 8px rgba(0,229,255,0.3)" }}>
            MODULE CONTROL
          </span>
          <div className="w-16" />
        </div>
      </div>

      <Greebles token={token} unlockedCount={unlockedCount} />

      <div className="flex-1 overflow-y-auto z-10 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="w-8 h-8 border border-[#00e5ff]/30 border-t-[#00e5ff]"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : (
          <div className="px-3 pt-4 pb-8 max-w-[400px] mx-auto">
            <div className="text-center mb-4">
              <div className="text-[7px] tracking-[4px] font-mono uppercase mb-3" style={{ color: "#333" }}>
                CORE SYSTEM DIAGNOSTICS
              </div>
              <CoreModule unlockedCount={unlockedCount} />
              <div className="flex items-center justify-center gap-3 mt-3">
                <MiniGraph />
                <span className="text-[7px] tracking-[2px] font-mono" style={{ color: "#333" }}>
                  {unlockedCount}/{SKILL_KEYS.length} MODULES
                </span>
                <MiniGraph />
              </div>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-[1px]" style={{ background: "#1a1a1a" }} />
                <span className="text-[8px] tracking-[3px] font-mono uppercase" style={{ color: "#333" }}>
                  EQUIPMENT BAY
                </span>
                <div className="flex-1 h-[1px]" style={{ background: "#1a1a1a" }} />
              </div>

              <div className="grid gap-3">
                {SKILL_KEYS.map(key => (
                  <ModuleSlot
                    key={key}
                    skillKey={key}
                    granted={skills.find(s => s.skillKey === key)}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between px-1 mt-4" style={{ borderTop: "1px solid #151515", paddingTop: "8px" }}>
              <span className="text-[7px] font-mono" style={{ color: "#222" }}>
                LIBERTA.PROTOCOL v0.1.0
              </span>
              <span className="text-[7px] font-mono" style={{ color: "#222" }}>
                ENCRYPTED
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
