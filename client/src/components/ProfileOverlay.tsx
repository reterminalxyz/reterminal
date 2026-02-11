import { useEffect, useState, useCallback, useRef, useMemo, Component, Suspense, type ReactNode, type ErrorInfo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Lock, ArrowLeft, Sparkles } from "lucide-react";
import { SKILL_META, type SkillKey, SKILL_KEYS } from "@shared/schema";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

type GrantedSkill = { skillKey: string; grantedAt: string | null };

function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl") || canvas.getContext("webgl2") || canvas.getContext("experimental-webgl"));
  } catch (_) {
    return false;
  }
}

class WebGLErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  constructor(props: { fallback: ReactNode; children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("WebGL error caught:", error.message);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function BloomEffect() {
  const { gl, scene, camera, size } = useThree();
  const composerRef = useRef<EffectComposer | null>(null);

  useEffect(() => {
    const composer = new EffectComposer(gl);
    composer.setSize(size.width, size.height);
    composer.setPixelRatio(gl.getPixelRatio());

    const renderPass = new RenderPass(scene, camera);
    renderPass.clear = true;
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.8,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    composerRef.current = composer;

    return () => {
      composer.dispose();
    };
  }, [gl, scene, camera, size]);

  useFrame((state) => {
    if (composerRef.current) {
      state.gl.autoClear = false;
      state.gl.clear();
      composerRef.current.render();
    }
  }, 100);

  return null;
}

const AVATAR_URL = "/avatar.glb";

function AvatarModel({ skills }: { skills: GrantedSkill[] }) {
  const { scene } = useGLTF(AVATAR_URL);
  const groupRef = useRef<THREE.Group>(null);
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color("#444444"),
          roughness: 0.4,
          metalness: 0.8,
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return clone;
  }, [scene]);

  const bbox = useMemo(() => {
    const box = new THREE.Box3().setFromObject(clonedScene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    return { size, center };
  }, [clonedScene]);

  const scale = useMemo(() => {
    const maxDim = Math.max(bbox.size.x, bbox.size.y, bbox.size.z);
    return maxDim > 0 ? 3.0 / maxDim : 1;
  }, [bbox]);

  const offsetY = -bbox.center.y * scale;

  return (
    <group ref={groupRef} position={[0, -1, 0]}>
      <group scale={[scale, scale, scale]} position={[-bbox.center.x * scale, offsetY, -bbox.center.z * scale]}>
        <primitive object={clonedScene} />
      </group>

      <group name="equipment_head" position={[0, bbox.size.y * scale * 0.45 + offsetY, 0]} />
      <group name="equipment_body" position={[0, offsetY, 0]} />
      <group name="equipment_hands" position={[0, bbox.size.y * scale * 0.15 + offsetY, 0]} />
    </group>
  );
}

useGLTF.preload(AVATAR_URL);

function AvatarFallback({ skills }: { skills: GrantedSkill[] }) {
  const hasSkill = (key: SkillKey) => skills.some(s => s.skillKey === key);

  return (
    <div className="flex flex-col items-center justify-center h-full" data-testid="avatar-fallback">
      <div className="relative w-[180px] h-[280px]">
        <svg viewBox="0 0 120 200" width="180" height="280" className="mx-auto">
          <rect x="40" y="10" width="40" height="40" fill="#6B6B6B" rx="2" />
          <rect x="48" y="22" width="8" height="8" fill="#222" />
          <rect x="64" y="22" width="8" height="8" fill="#222" />
          <rect x="52" y="34" width="16" height="4" fill="#444" />

          {hasSkill("TRUTH_SEEKER") && (
            <rect x="38" y="24" width="44" height="8" fill="#FF6600" opacity="0.8" rx="1">
              <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
            </rect>
          )}

          <rect x="30" y="55" width="60" height="65" fill="#6B6B6B" rx="2" />
          <rect x="35" y="60" width="50" height="55" fill="#555" rx="1" />

          {hasSkill("HARD_MONEY") && (
            <g>
              <rect x="48" y="72" width="24" height="24" fill="#B87333" rx="2">
                <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
              </rect>
              <text x="60" y="90" textAnchor="middle" fill="#FFD700" fontSize="14" fontFamily="monospace" fontWeight="bold">B</text>
            </g>
          )}

          <rect x="15" y="58" width="15" height="55" fill="#555" rx="2" />
          <rect x="90" y="58" width="15" height="55" fill="#555" rx="2" />

          <rect x="35" y="125" width="20" height="50" fill="#555" rx="2" />
          <rect x="65" y="125" width="20" height="50" fill="#555" rx="2" />
          <rect x="33" y="172" width="24" height="10" fill="#444" rx="2" />
          <rect x="63" y="172" width="24" height="10" fill="#444" rx="2" />

          {hasSkill("GRID_RUNNER") && (
            <circle cx="60" cy="90" r="65" fill="none" stroke="#00BFFF" strokeWidth="1" opacity="0.4">
              <animateTransform attributeName="transform" type="rotate" from="0 60 90" to="360 60 90" dur="10s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.2;0.5;0.2" dur="3s" repeatCount="indefinite" />
            </circle>
          )}
        </svg>
      </div>
    </div>
  );
}

function AvatarScene({ skills }: { skills: GrantedSkill[] }) {
  const [webglSupported] = useState(() => checkWebGLSupport());

  if (!webglSupported) {
    return <AvatarFallback skills={skills} />;
  }

  return (
    <WebGLErrorBoundary fallback={<AvatarFallback skills={skills} />}>
      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 45 }}
        style={{ background: "transparent" }}
        frameloop="always"
        gl={{ alpha: true, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <ambientLight intensity={1.5} />

        <directionalLight position={[10, 10, 5]} intensity={3} color="#ffffff" />

        <pointLight position={[-10, -10, -10]} intensity={2} color="#ff8c00" />

        <spotLight
          position={[-5, 2, -5]}
          angle={0.6}
          penumbra={1}
          intensity={1.5}
          color="#4488CC"
          target-position={[0, 0, 0]}
        />

        <Suspense fallback={null}>
          <AvatarModel skills={skills} />
          <Environment preset="city" />
        </Suspense>
        <BloomEffect />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          target={[0, 0, 0]}
          autoRotate={false}
        />
      </Canvas>
    </WebGLErrorBoundary>
  );
}

function CyberpunkSkillCard({ skillKey, granted }: { skillKey: SkillKey; granted: GrantedSkill | undefined }) {
  const meta = SKILL_META[skillKey];
  const isUnlocked = !!granted;

  const neonColor = isUnlocked ? "#B87333" : "#FF2222";
  const glowColor = isUnlocked ? "rgba(184,115,51,0.5)" : "rgba(255,34,34,0.15)";

  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        background: isUnlocked
          ? "linear-gradient(135deg, rgba(184,115,51,0.08) 0%, rgba(10,10,10,0.95) 100%)"
          : "linear-gradient(135deg, rgba(40,10,10,0.3) 0%, rgba(10,10,10,0.95) 100%)",
        border: `2px solid ${isUnlocked ? "rgba(184,115,51,0.7)" : "rgba(255,34,34,0.2)"}`,
        boxShadow: isUnlocked
          ? `0 0 15px ${glowColor}, 0 0 40px rgba(184,115,51,0.15), inset 0 0 20px rgba(184,115,51,0.05)`
          : `inset 0 0 15px rgba(255,34,34,0.03)`,
      }}
      data-testid={`card-skill-${skillKey}`}
    >
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(${isUnlocked ? "184,115,51" : "255,34,34"},0.15) 3px, rgba(${isUnlocked ? "184,115,51" : "255,34,34"},0.15) 4px),
            repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(${isUnlocked ? "184,115,51" : "255,34,34"},0.08) 8px, rgba(${isUnlocked ? "184,115,51" : "255,34,34"},0.08) 9px)
          `,
        }}
      />

      <div className="relative p-4 z-10">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 flex items-center justify-center"
            style={{
              background: isUnlocked ? "rgba(184,115,51,0.15)" : "rgba(255,34,34,0.08)",
              border: `1px solid ${isUnlocked ? "rgba(184,115,51,0.5)" : "rgba(255,34,34,0.15)"}`,
              boxShadow: isUnlocked ? `0 0 10px rgba(184,115,51,0.3)` : "none",
            }}
          >
            {isUnlocked ? (
              <Sparkles className="w-4 h-4 text-[#FFD700]" />
            ) : (
              <Lock className="w-4 h-4 text-[#662222]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="text-[11px] tracking-[3px] font-bold uppercase truncate font-mono"
              style={{
                color: isUnlocked ? "#FFD700" : "#662222",
                textShadow: isUnlocked ? "0 0 8px rgba(255,215,0,0.5)" : "none",
              }}
            >
              {meta.name}
            </div>
          </div>
        </div>

        {isUnlocked ? (
          <div>
            <p className="text-[11px] leading-relaxed text-[#999] font-mono mb-2">
              {meta.description}
            </p>
            {granted?.grantedAt && (
              <div
                className="text-[9px] tracking-[2px] font-bold uppercase font-mono"
                style={{ color: "rgba(184,115,51,0.5)" }}
              >
                {new Date(granted.grantedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" })}
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <p className="text-[11px] leading-relaxed text-[#333] select-none font-mono" style={{ filter: "blur(4px)" }}>
              {meta.description}
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-[10px] tracking-[4px] font-bold font-mono"
                style={{ color: "#662222", textShadow: "0 0 4px rgba(255,34,34,0.3)" }}
              >
                [ LOCKED ]
              </span>
            </div>
          </div>
        )}
      </div>

      {isUnlocked && (
        <>
          <motion.div
            className="absolute top-0 left-0 w-full h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${neonColor}, transparent)` }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-0 w-full h-[1px]"
            style={{ background: `linear-gradient(90deg, transparent, ${neonColor}, transparent)` }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </>
      )}
    </motion.div>
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
      style={{ background: "#0A0A0A" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      data-testid="overlay-profile"
    >
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(184,115,51,0.1) 2px, rgba(184,115,51,0.1) 4px)`,
        }}
      />

      <div className="flex-shrink-0 bg-[#111111] border-b-2 border-[#B87333]/60 z-50 relative">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 text-[#B87333]/60 hover:text-[#B87333] transition-colors"
            data-testid="button-back-terminal"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[10px] tracking-[2px] font-bold uppercase font-mono">ТЕРМИНАЛ</span>
          </button>
          <span className="text-[11px] tracking-[4px] font-bold text-[#B87333] uppercase font-mono">
            ДОСЬЕ
          </span>
          <div className="w-16" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto z-10 relative">
        <div className="px-4 pt-4 pb-8 max-w-[400px] mx-auto">
          <div className="text-center mb-2">
            <div
              className="text-[9px] tracking-[4px] font-bold uppercase mb-1 font-mono"
              style={{ color: "rgba(184,115,51,0.4)" }}
            >
              АГЕНТ #{token ? token.slice(0, 8) : "???"}
            </div>
            <div className="text-[10px] tracking-[2px] text-[#555] font-bold font-mono">
              {unlockedCount}/{SKILL_KEYS.length} НАВЫКОВ
            </div>
          </div>

          <div
            className="relative mx-auto"
            style={{ height: "380px", maxWidth: "360px", touchAction: "none" }}
            data-testid="avatar-display"
          >
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <motion.div
                  className="w-8 h-8 border-2 border-[#B87333]/30 border-t-[#B87333]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (
              <AvatarScene skills={skills} />
            )}

            <div
              className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] tracking-[3px] font-mono uppercase"
              style={{ color: "rgba(184,115,51,0.3)" }}
            >
              ВРАЩАЙ
            </div>
          </div>

          <div className="mt-4 mb-2">
            <div
              className="text-[10px] tracking-[3px] font-bold uppercase mb-4 font-mono"
              style={{
                color: "#B87333",
                textShadow: "0 0 6px rgba(184,115,51,0.3)",
              }}
            >
              НАВЫКИ
            </div>
            <div className="grid gap-3">
              {SKILL_KEYS.map(key => (
                <CyberpunkSkillCard
                  key={key}
                  skillKey={key}
                  granted={skills.find(s => s.skillKey === key)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
