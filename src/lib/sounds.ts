// Cyberpunk Sound Effects Engine using Web Audio API

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) audioCtx = new AudioContext();
  return audioCtx;
}

export function playTypingSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(3000 + Math.random() * 2000, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.03);
  } catch {}
}

export function playHoverSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.08);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  } catch {}
}

export function playClickSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch {}
}

export function playSuccessSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    [400, 600, 800, 1200].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.1, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.2);
    });
  } catch {}
}

export function playErrorSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(100, now + 0.3);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    osc.connect(filter).connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
    // Second buzz
    const osc2 = ctx.createOscillator();
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(250, now + 0.15);
    osc2.frequency.linearRampToValueAtTime(80, now + 0.4);
    const gain2 = ctx.createGain();
    gain2.gain.setValueAtTime(0.12, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc2.connect(filter).connect(gain2).connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.4);
  } catch {}
}

export function playBootSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    // Rising tone
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 1);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.setValueAtTime(0.08, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1);
    // Digital chirps
    for (let i = 0; i < 5; i++) {
      const chirp = ctx.createOscillator();
      chirp.type = 'square';
      chirp.frequency.setValueAtTime(800 + i * 400, now + 0.2 * i);
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0.03, now + 0.2 * i);
      cg.gain.exponentialRampToValueAtTime(0.001, now + 0.2 * i + 0.05);
      chirp.connect(cg).connect(ctx.destination);
      chirp.start(now + 0.2 * i);
      chirp.stop(now + 0.2 * i + 0.05);
    }
  } catch {}
}

export function playWhooshSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(200, now);
    filter.frequency.exponentialRampToValueAtTime(4000, now + 0.2);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);
    filter.Q.setValueAtTime(2, now);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(now);
    source.stop(now + 0.4);
  } catch {}
}

export function playDataSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1500 + Math.random() * 1000, now + i * 0.05);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, now + i * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.04);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.04);
    }
  } catch {}
}

export function playScanSound() {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.5);
    osc.frequency.linearRampToValueAtTime(400, now + 1);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.setValueAtTime(0.06, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 1);
  } catch {}
}
