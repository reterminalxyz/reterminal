import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Lock, ArrowLeft, Sparkles } from "lucide-react";
import { SKILL_META, type SkillKey, SKILL_KEYS } from "@shared/schema";
import voxelBase from "@assets/Gemini_Generated_Image_nta1lsnta1lsnta1_1770836515591.png";

type GrantedSkill = { skillKey: string; grantedAt: string | null };

function AvatarDisplay({ skills }: { skills: GrantedSkill[] }) {
  const hasSkill = (key: SkillKey) => skills.some(s => s.skillKey === key);
  const hasTruth = hasSkill("TRUTH_SEEKER");
  const hasMoney = hasSkill("HARD_MONEY");
  const hasGrid = hasSkill("GRID_RUNNER");

  return (
    <div className="relative w-[240px] h-[320px] mx-auto" data-testid="avatar-display">
      {hasGrid && (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(184,115,51,0.25) 0%, rgba(184,115,51,0.08) 40%, transparent 70%)",
              filter: "blur(20px)",
            }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(circle at 50% 40%, rgba(255,215,0,0.1) 0%, transparent 50%)",
            }}
          />
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#B87333]"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                y: [0, -20, -40],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </motion.div>
      )}

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <img
          src={voxelBase}
          alt="Voxel Avatar"
          className="w-full h-full object-contain"
          style={{ imageRendering: "auto" }}
          data-testid="img-avatar-base"
        />
      </div>

      {hasTruth && (
        <motion.div
          className="absolute z-20"
          style={{ top: "18%", left: "25%", width: "50%", height: "8%" }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="w-full h-full"
            animate={{
              boxShadow: [
                "0 0 15px rgba(255,140,50,0.6), 0 0 30px rgba(255,100,30,0.3)",
                "0 0 25px rgba(255,140,50,0.8), 0 0 50px rgba(255,100,30,0.5)",
                "0 0 15px rgba(255,140,50,0.6), 0 0 30px rgba(255,100,30,0.3)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "linear-gradient(90deg, rgba(255,120,30,0.9), rgba(255,180,80,0.95), rgba(255,120,30,0.9))",
              borderRadius: "2px",
            }}
          />
        </motion.div>
      )}

      {hasMoney && (
        <motion.div
          className="absolute z-20"
          style={{ bottom: "30%", right: "15%", width: "20%", height: "15%" }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
        >
          <motion.div
            className="w-full h-full flex items-center justify-center"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="2" fill="#B87333" opacity="0.3" />
              <rect x="6" y="6" width="12" height="12" rx="1" stroke="#FFD700" strokeWidth="2" fill="none" />
              <motion.text
                x="12" y="15"
                textAnchor="middle"
                fill="#FFD700"
                fontSize="10"
                fontWeight="bold"
                fontFamily="monospace"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ₿
              </motion.text>
            </svg>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function SkillCard({ skillKey, granted }: { skillKey: SkillKey; granted: GrantedSkill | undefined }) {
  const meta = SKILL_META[skillKey];
  const isUnlocked = !!granted;

  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        background: isUnlocked ? "rgba(184,115,51,0.08)" : "rgba(255,255,255,0.03)",
        border: isUnlocked ? "2px solid rgba(184,115,51,0.6)" : "2px solid rgba(255,255,255,0.08)",
        boxShadow: isUnlocked ? "0 0 20px rgba(184,115,51,0.15), inset 0 0 20px rgba(184,115,51,0.05)" : "none",
      }}
      initial={false}
      animate={isUnlocked ? { borderColor: "rgba(184,115,51,0.6)" } : { borderColor: "rgba(255,255,255,0.08)" }}
      data-testid={`card-skill-${skillKey}`}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 flex items-center justify-center"
            style={{
              background: isUnlocked ? "rgba(184,115,51,0.2)" : "rgba(255,255,255,0.05)",
              border: isUnlocked ? "1px solid rgba(184,115,51,0.4)" : "1px solid rgba(255,255,255,0.1)",
            }}
          >
            {isUnlocked ? (
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
            ) : (
              <Lock className="w-4 h-4 text-[#555]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-[11px] tracking-[2px] font-bold uppercase truncate"
              style={{ color: isUnlocked ? "#B87333" : "#555" }}
            >
              {meta.name}
            </div>
          </div>
        </div>

        {isUnlocked ? (
          <div>
            <p className="text-[11px] leading-relaxed text-[#A0A0A0] mb-2">
              {meta.description}
            </p>
            {granted?.grantedAt && (
              <div className="text-[9px] tracking-[1px] text-[#B87333]/50 uppercase">
                {new Date(granted.grantedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <p className="text-[11px] leading-relaxed text-[#333] select-none" style={{ filter: "blur(4px)" }}>
              {meta.description}
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] tracking-[3px] text-[#555] font-bold">???</span>
            </div>
          </div>
        )}
      </div>

      {isUnlocked && (
        <motion.div
          className="absolute top-0 left-0 w-full h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, #B87333, transparent)" }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

export function LevelUpPopup({ skillKey, onClose }: { skillKey: SkillKey; onClose: () => void }) {
  const meta = SKILL_META[skillKey];

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      data-testid="popup-level-up"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <motion.div
        className="relative flex flex-col items-center gap-4 p-8"
        initial={{ scale: 0.5, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: -20 }}
        transition={{ type: "spring", damping: 15 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          className="w-20 h-20 flex items-center justify-center"
          style={{
            border: "3px solid #B87333",
            background: "rgba(184,115,51,0.1)",
            boxShadow: "0 0 40px rgba(184,115,51,0.3), 0 0 80px rgba(184,115,51,0.1)",
          }}
          animate={{
            boxShadow: [
              "0 0 40px rgba(184,115,51,0.3), 0 0 80px rgba(184,115,51,0.1)",
              "0 0 60px rgba(255,215,0,0.5), 0 0 120px rgba(184,115,51,0.2)",
              "0 0 40px rgba(184,115,51,0.3), 0 0 80px rgba(184,115,51,0.1)",
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-10 h-10 text-[#FFD700]" />
        </motion.div>

        <motion.div
          className="text-[10px] tracking-[6px] text-[#B87333]/60 font-bold uppercase"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          НАВЫК ОТКРЫТ
        </motion.div>

        <motion.div
          className="text-[18px] tracking-[4px] text-[#FFD700] font-bold uppercase text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {meta.name}
        </motion.div>

        <motion.div
          className="text-[12px] text-[#A0A0A0] text-center max-w-[280px] leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {meta.description}
        </motion.div>

        <motion.div
          className="mt-2 text-[9px] tracking-[3px] text-[#B87333]/40 font-bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          АВАТАР ОБНОВЛЁН
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Profile() {
  const [, setLocation] = useLocation();
  const [skills, setSkills] = useState<GrantedSkill[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("liberta_token");

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

  useEffect(() => {
    document.body.style.backgroundColor = "#0A0A0A";
    document.documentElement.style.backgroundColor = "#0A0A0A";
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", "#0A0A0A");
    return () => {
      document.body.style.backgroundColor = "";
      document.documentElement.style.backgroundColor = "";
    };
  }, []);

  const unlockedCount = skills.length;

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] flex flex-col overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(184,115,51,0.1) 2px, rgba(184,115,51,0.1) 4px)`,
        }}
      />

      <div className="flex-shrink-0 bg-[#111111] border-b-2 border-[#B87333]/60 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-[#B87333]/60 hover:text-[#B87333] transition-colors"
            data-testid="button-back-terminal"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] tracking-[2px] font-bold uppercase">ТЕРМИНАЛ</span>
          </button>
          <span className="text-[11px] tracking-[4px] font-bold text-[#B87333] uppercase">
            ДОСЬЕ
          </span>
          <div className="w-16" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto z-10 relative">
        <div className="px-4 pt-6 pb-8 max-w-[400px] mx-auto">
          <div className="text-center mb-2">
            <div className="text-[9px] tracking-[4px] text-[#B87333]/40 font-bold uppercase mb-1">
              АГЕНТ #{token ? token.slice(0, 8) : "???"}
            </div>
            <div className="text-[10px] tracking-[2px] text-[#555] font-bold">
              {unlockedCount}/{SKILL_KEYS.length} НАВЫКОВ
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-[320px]">
              <motion.div
                className="w-8 h-8 border-2 border-[#B87333]/30 border-t-[#B87333]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          ) : (
            <AvatarDisplay skills={skills} />
          )}

          <div className="mt-6 mb-2">
            <div className="text-[10px] tracking-[3px] text-[#B87333]/50 font-bold uppercase mb-4">
              НАВЫКИ
            </div>
            <div className="grid gap-3">
              {SKILL_KEYS.map(key => (
                <SkillCard
                  key={key}
                  skillKey={key}
                  granted={skills.find(s => s.skillKey === key)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
