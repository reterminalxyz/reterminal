let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

function resumeCtx() {
  const ctx = getCtx();
  if (ctx.state === "suspended") ctx.resume();
}

export function playClick() {
  resumeCtx();
  const ctx = getCtx();
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(100, ctx.currentTime);
  osc1.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.04);
  gain1.gain.setValueAtTime(0.12, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
  osc1.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.05);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(2400, ctx.currentTime);
  osc2.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + 0.035);
  gain2.gain.setValueAtTime(0.035, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
  osc2.start(ctx.currentTime);
  osc2.stop(ctx.currentTime + 0.06);
}

export function playTypeTick() {
  resumeCtx();
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;
  filter.Q.value = 1;
  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(340, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.025);
  gain.gain.setValueAtTime(0.045, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.035);
}

export function playSatsChime() {
  resumeCtx();
  const ctx = getCtx();
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    const t = ctx.currentTime + i * 0.08;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.start(t);
    osc.stop(t + 0.2);
  });
}

export function playTransition() {
  resumeCtx();
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.2);
  osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.5);

  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1800, ctx.currentTime + 0.05);
  osc2.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
  gain2.gain.setValueAtTime(0.02, ctx.currentTime + 0.05);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
  osc2.start(ctx.currentTime + 0.05);
  osc2.stop(ctx.currentTime + 0.3);
}

export function playError() {
  resumeCtx();
  const ctx = getCtx();
  [0, 0.08].forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sawtooth";
    const t = ctx.currentTime + delay;
    osc.frequency.setValueAtTime(120, t);
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    osc.start(t);
    osc.stop(t + 0.06);
  });
}

export function playPhaseComplete() {
  resumeCtx();
  const ctx = getCtx();
  const notes = [200, 400, 600, 800];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    const t = ctx.currentTime + i * 0.1;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.02, t + 0.15);
    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    osc.start(t);
    osc.stop(t + 0.3);
  });
}
