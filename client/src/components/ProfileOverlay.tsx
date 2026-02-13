import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { SKILL_META, type SkillKey, SKILL_KEYS } from "@shared/schema";
import { playBeep } from "@/lib/sounds";

type GrantedSkill = { skillKey: string; grantedAt: string | null };
type Lang = "IT" | "EN" | "RU";

const PROFILE_I18N: Record<Lang, {
  terminal: string;
  skillSet: string;
  skills: string;
  moduleScan: string;
  noSkills: string;
  segmentLabel: string;
}> = {
  IT: {
    terminal: "TERMINALE",
    skillSet: "SET DI ABILIT\u00c0",
    skills: "ABILIT\u00c0",
    moduleScan: "SCANSIONE MODULI",
    noSkills: "NESSUNA ABILIT\u00c0 RILEVATA",
    segmentLabel: "PROTOCOLLO VOLONT\u00c0",
  },
  EN: {
    terminal: "TERMINAL",
    skillSet: "SKILL SET",
    skills: "SKILLS",
    moduleScan: "MODULE SCAN",
    noSkills: "NO SKILLS DETECTED",
    segmentLabel: "WILL PROTOCOL",
  },
  RU: {
    terminal: "\u0422\u0415\u0420\u041c\u0418\u041d\u0410\u041b",
    skillSet: "\u041d\u0410\u0411\u041e\u0420 \u041d\u0410\u0412\u042b\u041a\u041e\u0412",
    skills: "\u041d\u0410\u0412\u042b\u041a\u041e\u0412",
    moduleScan: "\u0421\u041a\u0410\u041d \u041c\u041e\u0414\u0423\u041b\u0415\u0419",
    noSkills: "\u041d\u0410\u0412\u042b\u041a\u0418 \u041d\u0415 \u041e\u0411\u041d\u0410\u0420\u0423\u0416\u0415\u041d\u042b",
    segmentLabel: "\u041f\u0420\u041e\u0422\u041e\u041a\u041e\u041b \u0412\u041e\u041b\u0418",
  },
};

const SEGMENT_SKILLS: { keys: SkillKey[]; labelKey: "segmentLabel"; color: string; colorDim: string }[] = [
  { keys: ["WILL_TO_FREEDOM"], labelKey: "segmentLabel", color: "#00e5ff", colorDim: "#00e5ff" },
];

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

function PixelDevice({ segments, shimmer }: { segments: [boolean, boolean, boolean]; shimmer?: boolean }) {
  return (
    <svg viewBox="0 0 200 340" width="200" height="340" className="mx-auto" data-testid="pixel-device">
      <defs>
        {shimmer && segments[0] && (
          <>
            <linearGradient id="cyanShimmer" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#00e5ff" stopOpacity="1" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="60%" stopColor="#00e5ff" stopOpacity="1" />
              <stop offset="100%" stopColor="#00e5ff" stopOpacity="0.3" />
              <animateTransform attributeName="gradientTransform" type="translate" values="-1 -1;1 1" dur="2s" repeatCount="indefinite" />
            </linearGradient>
            <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur1" />
                <feMergeNode in="blur2" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </>
        )}
      </defs>
      <rect x="40" y="10" width="120" height="320" rx="4" fill="#1a1a1a" stroke="#333" strokeWidth="1.5" />
      <rect x="44" y="14" width="112" height="312" rx="2" fill="#111" />

      <rect x="60" y="4" width="8" height="10" fill="#222" stroke="#333" strokeWidth="0.5" />
      <rect x="75" y="2" width="12" height="12" fill="#222" stroke="#333" strokeWidth="0.5" />
      <rect x="92" y="0" width="16" height="16" fill="#222" stroke="#444" strokeWidth="0.5" />
      <rect x="96" y="4" width="8" height="8" fill={segments[0] ? "#00e5ff22" : "#111"} stroke={segments[0] ? "#00e5ff" : "#333"} strokeWidth="0.5" />
      <rect x="113" y="2" width="12" height="12" fill="#222" stroke="#333" strokeWidth="0.5" />
      <rect x="130" y="4" width="8" height="10" fill="#222" stroke="#333" strokeWidth="0.5" />

      <line x1="70" y1="14" x2="70" y2="8" stroke="#333" strokeWidth="0.5" />
      <line x1="130" y1="14" x2="130" y2="8" stroke="#333" strokeWidth="0.5" />

      <line x1="44" y1="118" x2="156" y2="118" stroke="#333" strokeWidth="0.5" strokeDasharray="2 2" />
      <line x1="44" y1="222" x2="156" y2="222" stroke="#333" strokeWidth="0.5" strokeDasharray="2 2" />

      {/* SEGMENT 1: Top - Protocol Core (WILL_TO_FREEDOM) */}
      <g opacity={segments[0] ? 1 : 0.2} filter={shimmer && segments[0] ? "url(#cyanGlow)" : undefined}>
        <circle cx="100" cy="66" r="28" fill="none" stroke={segments[0] ? (shimmer ? "url(#cyanShimmer)" : "#00e5ff") : "#333"} strokeWidth={shimmer && segments[0] ? 2.5 : 1.5}>
          {segments[0] && <animate attributeName="opacity" values="0.6;1;0.6" dur={shimmer ? "1.5s" : "3s"} repeatCount="indefinite" />}
        </circle>
        <circle cx="100" cy="66" r="20" fill="none" stroke={segments[0] ? (shimmer ? "url(#cyanShimmer)" : "#00e5ff") : "#333"} strokeWidth={shimmer && segments[0] ? 1 : 0.5} opacity={shimmer && segments[0] ? 0.8 : 0.5} />
        <circle cx="100" cy="66" r="12" fill={segments[0] ? (shimmer ? "#00e5ff30" : "#00e5ff15") : "none"} stroke={segments[0] ? (shimmer ? "url(#cyanShimmer)" : "#00e5ff") : "#333"} strokeWidth={shimmer && segments[0] ? 1.5 : 1}>
          {segments[0] && <animate attributeName="opacity" values="0.5;1;0.5" dur={shimmer ? "1s" : "2s"} repeatCount="indefinite" />}
        </circle>
        <circle cx="100" cy="66" r="4" fill={segments[0] ? "#00e5ff" : "#333"}>
          {shimmer && segments[0] && <animate attributeName="r" values="4;6;4" dur="1.5s" repeatCount="indefinite" />}
        </circle>

        <line x1="60" y1="44" x2="72" y2="44" stroke={segments[0] ? (shimmer ? "url(#cyanShimmer)" : "#00e5ff") : "#333"} strokeWidth={shimmer && segments[0] ? 1 : 0.5} />
        <rect x="56" y="42" width="4" height="4" fill={segments[0] ? "#00e5ff" : "#333"} opacity={shimmer && segments[0] ? 1 : 0.6}>
          {shimmer && segments[0] && <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />}
        </rect>
        <line x1="128" y1="44" x2="140" y2="44" stroke={segments[0] ? (shimmer ? "url(#cyanShimmer)" : "#00e5ff") : "#333"} strokeWidth={shimmer && segments[0] ? 1 : 0.5} />
        <rect x="140" y="42" width="4" height="4" fill={segments[0] ? "#00e5ff" : "#333"} opacity={shimmer && segments[0] ? 1 : 0.6}>
          {shimmer && segments[0] && <animate attributeName="opacity" values="0.6;1;0.6" dur="1.2s" repeatCount="indefinite" />}
        </rect>

        <line x1="60" y1="88" x2="72" y2="88" stroke={segments[0] ? (shimmer ? "url(#cyanShimmer)" : "#00e5ff") : "#333"} strokeWidth={shimmer && segments[0] ? 1 : 0.5} />
        <line x1="128" y1="88" x2="140" y2="88" stroke={segments[0] ? (shimmer ? "url(#cyanShimmer)" : "#00e5ff") : "#333"} strokeWidth={shimmer && segments[0] ? 1 : 0.5} />

        <rect x="56" y="50" width="12" height="3" fill={segments[0] ? "#00e5ff" : "#222"} opacity={shimmer && segments[0] ? 0.8 : 0.4} />
        <rect x="56" y="56" width="8" height="3" fill={segments[0] ? "#00e5ff" : "#222"} opacity={shimmer && segments[0] ? 0.6 : 0.3} />
        <rect x="132" y="50" width="12" height="3" fill={segments[0] ? "#00e5ff" : "#222"} opacity={shimmer && segments[0] ? 0.8 : 0.4} />
        <rect x="134" y="56" width="8" height="3" fill={segments[0] ? "#00e5ff" : "#222"} opacity={shimmer && segments[0] ? 0.6 : 0.3} />

        <text x="100" y="106" textAnchor="middle" fill={segments[0] ? "#00e5ff" : "#333"} fontSize="5" fontFamily="monospace" letterSpacing="2">
          {segments[0] ? "ACTIVATED" : "OFFLINE"}
        </text>
      </g>

      {/* SEGMENT 2: Middle - Knowledge Module (TRUTH_SEEKER + HARD_MONEY) */}
      <g opacity={segments[1] ? 1 : 0.2}>
        {[0,1,2,3,4,5].map(row => (
          <g key={`keys-${row}`}>
            {[0,1,2,3,4,5,6].map(col => (
              <rect
                key={`key-${row}-${col}`}
                x={58 + col * 12}
                y={128 + row * 12}
                width="10"
                height="10"
                rx="1"
                fill={segments[1] ? (row < 2 ? "#ffaa0020" : "#ffaa0010") : "#151515"}
                stroke={segments[1] ? "#ffaa0050" : "#222"}
                strokeWidth="0.5"
              />
            ))}
          </g>
        ))}

        <circle cx="58" cy="206" r="12" fill="none" stroke={segments[1] ? "#ffaa00" : "#333"} strokeWidth="1">
          {segments[1] && <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" />}
        </circle>
        <circle cx="58" cy="206" r="6" fill={segments[1] ? "#ffaa0030" : "none"} stroke={segments[1] ? "#ffaa00" : "#333"} strokeWidth="0.5" />

        <circle cx="142" cy="206" r="12" fill="none" stroke={segments[1] ? "#ffaa00" : "#333"} strokeWidth="1">
          {segments[1] && <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />}
        </circle>
        <circle cx="142" cy="206" r="6" fill={segments[1] ? "#ffaa0030" : "none"} stroke={segments[1] ? "#ffaa00" : "#333"} strokeWidth="0.5" />

        <rect x="76" y="198" width="48" height="16" fill={segments[1] ? "#ffaa0010" : "#111"} stroke={segments[1] ? "#ffaa0040" : "#222"} strokeWidth="0.5" />
        <rect x="80" y="202" width="10" height="3" fill={segments[1] ? "#ffaa00" : "#222"} opacity="0.6" />
        <rect x="94" y="202" width="10" height="3" fill={segments[1] ? "#ffaa00" : "#222"} opacity="0.6" />
        <rect x="108" y="202" width="10" height="3" fill={segments[1] ? "#ffaa00" : "#222"} opacity="0.6" />
        <rect x="80" y="208" width="6" height="2" fill={segments[1] ? "#ffaa00" : "#222"} opacity="0.4" />
      </g>

      {/* SEGMENT 3: Bottom - Network Drive (GRID_RUNNER) */}
      <g opacity={segments[2] ? 1 : 0.2}>
        <circle cx="76" cy="268" r="18" fill="none" stroke={segments[2] ? "#b87333" : "#333"} strokeWidth="1">
          {segments[2] && <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />}
        </circle>
        <circle cx="76" cy="268" r="10" fill={segments[2] ? "#b8733320" : "none"} stroke={segments[2] ? "#b87333" : "#333"} strokeWidth="0.5" />
        <line x1="76" y1="256" x2="76" y2="250" stroke={segments[2] ? "#b87333" : "#333"} strokeWidth="0.5" />
        <line x1="86" y1="258" x2="92" y2="252" stroke={segments[2] ? "#b87333" : "#333"} strokeWidth="0.5" />
        <line x1="66" y1="258" x2="60" y2="252" stroke={segments[2] ? "#b87333" : "#333"} strokeWidth="0.5" />

        <circle cx="124" cy="268" r="18" fill="none" stroke={segments[2] ? "#b87333" : "#333"} strokeWidth="1">
          {segments[2] && <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite" />}
        </circle>
        <circle cx="124" cy="268" r="10" fill={segments[2] ? "#b8733320" : "none"} stroke={segments[2] ? "#b87333" : "#333"} strokeWidth="0.5" />

        <rect x="56" y="294" width="88" height="18" fill={segments[2] ? "#b8733310" : "#111"} stroke={segments[2] ? "#b8733350" : "#222"} strokeWidth="0.5" />
        <rect x="60" y="298" width="20" height="6" fill={segments[2] ? "#b87333" : "#222"} opacity="0.5" />
        <rect x="84" y="298" width="20" height="6" fill={segments[2] ? "#b87333" : "#222"} opacity="0.4" />
        <rect x="108" y="298" width="20" height="6" fill={segments[2] ? "#b87333" : "#222"} opacity="0.3" />
        <rect x="60" y="306" width="12" height="2" fill={segments[2] ? "#b87333" : "#222"} opacity="0.3" />
      </g>

      {/* Connectors on sides */}
      <rect x="32" y="60" width="8" height="16" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
      <rect x="32" y="160" width="8" height="16" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
      <rect x="32" y="260" width="8" height="16" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
      <rect x="160" y="60" width="8" height="16" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
      <rect x="160" y="160" width="8" height="16" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
      <rect x="160" y="260" width="8" height="16" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />

      {/* Bottom connectors / cables */}
      <rect x="70" y="326" width="12" height="14" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
      <rect x="94" y="326" width="12" height="14" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
      <rect x="118" y="326" width="12" height="14" rx="1" fill="#1a1a1a" stroke="#333" strokeWidth="0.5" />
    </svg>
  );
}

function SkillRow({ skillKey, granted, isNew, lang = "IT" }: { skillKey: SkillKey; granted: boolean; isNew: boolean; lang?: Lang }) {
  const meta = SKILL_META[skillKey];
  const [showCheck, setShowCheck] = useState(false);

  useEffect(() => {
    if (granted && isNew) {
      const t = setTimeout(() => {
        setShowCheck(true);
        try { playBeep(); } catch (_) {}
      }, 600);
      return () => clearTimeout(t);
    }
    if (granted) setShowCheck(true);
  }, [granted, isNew]);

  const segConfig = SEGMENT_SKILLS.find(s => s.keys.includes(skillKey));
  const color = segConfig?.color || "#555";

  return (
    <div
      className="flex items-center gap-3 py-2 px-3"
      style={{
        borderBottom: "1px solid #151515",
        opacity: granted ? 1 : 0.3,
      }}
      data-testid={`skill-row-${skillKey}`}
    >
      <div
        className="w-[8px] h-[8px] flex-shrink-0"
        style={{
          background: granted ? color : "#222",
          boxShadow: granted ? `0 0 8px ${color}60` : "none",
        }}
      />
      <div className="flex-1 min-w-0">
        <div
          className="text-[10px] tracking-[2px] font-bold font-mono uppercase truncate"
          style={{
            color: granted ? "#e0e0e0" : "#333",
            textShadow: granted ? `0 0 4px ${color}30` : "none",
          }}
        >
          {meta.name[lang]}
        </div>
        <div
          className="text-[8px] font-mono mt-0.5 truncate"
          style={{ color: granted ? "#666" : "#222" }}
        >
          {meta.description[lang]}
        </div>
      </div>
      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
        <AnimatePresence>
          {granted && showCheck && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", damping: 10 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" style={{ imageRendering: "pixelated" }}>
                <rect x="1" y="7" width="2" height="2" fill={color} />
                <rect x="3" y="9" width="2" height="2" fill={color} />
                <rect x="5" y="11" width="2" height="2" fill={color} />
                <rect x="7" y="9" width="2" height="2" fill={color} />
                <rect x="9" y="7" width="2" height="2" fill={color} />
                <rect x="11" y="5" width="2" height="2" fill={color} />
                <rect x="13" y="3" width="1" height="2" fill={color} />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SegmentLabel({ label, active, color }: { label: string; active: boolean; color: string }) {
  return (
    <div className="flex items-center gap-2 py-1.5 px-3">
      <div className="flex-1 h-[1px]" style={{ background: active ? `${color}30` : "#151515" }} />
      <span
        className="text-[7px] tracking-[3px] font-mono uppercase flex-shrink-0"
        style={{ color: active ? color : "#222" }}
      >
        {label}
      </span>
      <div className="flex-1 h-[1px]" style={{ background: active ? `${color}30` : "#151515" }} />
    </div>
  );
}

function Greebles({ token, unlockedCount }: { token: string | null; unlockedCount: number }) {
  const now = new Date();
  const dateStr = now.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  const timeStr = now.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex items-center justify-between px-3 py-1.5" style={{ borderBottom: "1px solid #151515" }}>
      <div className="flex items-center gap-3">
        <span className="text-[7px] font-mono tracking-[2px] text-[#333]">
          SYS.ID: {token ? token.slice(0, 8).toUpperCase() : "--------"}
        </span>
        <span className="text-[7px] font-mono text-[#333]">
          {dateStr} {timeStr}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <motion.div
          className="w-[4px] h-[4px]"
          style={{ background: unlockedCount > 0 ? "#00e5ff" : "#333" }}
          animate={unlockedCount > 0 ? { opacity: [0.5, 1, 0.5] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-[7px] font-mono" style={{ color: unlockedCount > 0 ? "#00e5ff" : "#333" }}>
          {unlockedCount > 0 ? "SYNCED" : "STANDBY"}
        </span>
      </div>
    </div>
  );
}

const SKILL_BLOCK_INDEX: Record<string, number> = {
  WILL_TO_FREEDOM: 0,
  TRUTH_SEEKER: 1,
  HARD_MONEY: 2,
  GRID_RUNNER: 5,
};

interface ProfileOverlayProps {
  onClose: () => void;
  token: string | null;
  originRect?: { x: number; y: number } | null;
  completedBlockIndex: number;
  lang?: string;
}

export default function ProfileOverlay({ onClose, token, originRect, completedBlockIndex, lang = "IT" }: ProfileOverlayProps) {
  const t = PROFILE_I18N[(lang as Lang)] || PROFILE_I18N.IT;
  const [skills, setSkills] = useState<GrantedSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkillKeys, setNewSkillKeys] = useState<Set<string>>(new Set());

  const fetchSkills = useCallback(() => {
    if (!token) { setLoading(false); return; }
    fetch(`/api/skills/${token}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const filtered = data.filter((s: GrantedSkill) => {
            const blockIdx = SKILL_BLOCK_INDEX[s.skillKey];
            return blockIdx !== undefined && blockIdx < completedBlockIndex;
          });
          setSkills(filtered);
          try {
            const seenKey = `liberta_seen_skills_${token}`;
            const seen = JSON.parse(localStorage.getItem(seenKey) || "[]") as string[];
            const seenSet = new Set(seen);
            const newKeys = new Set<string>();
            const currentKeys: string[] = [];
            filtered.forEach((s: GrantedSkill) => {
              currentKeys.push(s.skillKey);
              if (!seenSet.has(s.skillKey)) newKeys.add(s.skillKey);
            });
            setNewSkillKeys(newKeys);
            localStorage.setItem(seenKey, JSON.stringify(currentKeys));
          } catch (_) {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token, completedBlockIndex]);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  const grantedKeys = new Set(skills.map(s => s.skillKey));
  const unlockedCount = skills.length;

  const seg1Active = SEGMENT_SKILLS[0].keys.some(k => grantedKeys.has(k));
  const seg2Active = false;
  const seg3Active = false;

  const ox = originRect ? `${originRect.x}px` : "50%";
  const oy = originRect ? `${originRect.y}px` : "0%";

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: "#0a0a0a", transformOrigin: `${ox} ${oy}` }}
      initial={{ opacity: 0, scale: 0.05, borderRadius: "50%" }}
      animate={{ opacity: 1, scale: 1, borderRadius: "0%" }}
      exit={{ opacity: 0, scale: 0.05, borderRadius: "50%" }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      data-testid="overlay-profile"
    >
      <GridBackground />

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
            <span className="text-[9px] tracking-[2px] font-bold uppercase font-mono">{t.terminal}</span>
          </button>
          <span className="text-[12px] tracking-[4px] font-bold uppercase font-mono" style={{ color: "#e0e0e0" }}>
            {t.skillSet}
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
            <div className="text-center mb-2">
              <div className="text-[7px] tracking-[4px] font-mono uppercase mb-3" style={{ color: "#333" }}>
                DIAGNOSTIC DEVICE v0.1
              </div>
              <PixelDevice segments={[seg1Active, seg2Active, seg3Active]} shimmer={newSkillKeys.size > 0} />
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-[7px] tracking-[2px] font-mono" style={{ color: "#333" }}>
                  {unlockedCount}/1 {t.skills}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-[1px]" style={{ background: "#1a1a1a" }} />
                <span className="text-[8px] tracking-[3px] font-mono uppercase" style={{ color: "#444" }}>
                  {t.moduleScan}
                </span>
                <div className="flex-1 h-[1px]" style={{ background: "#1a1a1a" }} />
              </div>

              {unlockedCount === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <span className="text-[9px] tracking-[3px] font-mono uppercase" style={{ color: "#333" }}>
                    {t.noSkills}
                  </span>
                </div>
              ) : (
                SEGMENT_SKILLS.map((seg, i) => {
                  const segActive = [seg1Active, seg2Active, seg3Active][i];
                  const grantedInSeg = seg.keys.filter(k => grantedKeys.has(k));
                  if (grantedInSeg.length === 0) return null;
                  return (
                    <div key={seg.labelKey}>
                      <SegmentLabel label={t[seg.labelKey]} active={segActive} color={seg.color} />
                      {grantedInSeg.map(key => (
                        <SkillRow
                          key={key}
                          skillKey={key}
                          granted={true}
                          isNew={newSkillKeys.has(key)}
                          lang={(lang as Lang)}
                        />
                      ))}
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex items-center justify-between px-1 mt-4" style={{ borderTop: "1px solid #151515", paddingTop: "8px" }}>
              <span className="text-[7px] font-mono" style={{ color: "#222" }}>
                RE_TERMINAL.PROTOCOL v0.1.0
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
