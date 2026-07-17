let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!audioCtx) audioCtx = new AC();
  return audioCtx;
}

export async function resumeAudio() {
  const ctx = getCtx();
  if (ctx?.state === "suspended") {
    await ctx.resume();
  }
  if (ctx) {
    void loadBuffer(ctx, ROULETTE_URL);
    void loadBuffer(ctx, DECIDE_URL);
  }
}

const ROULETTE_URL = "/sounds/item-roulette.wav";
const DECIDE_URL = "/sounds/item-decide.wav";

const bufferCache = new Map<string, Promise<AudioBuffer | null>>();

function loadBuffer(ctx: AudioContext, url: string): Promise<AudioBuffer | null> {
  let cached = bufferCache.get(url);
  if (!cached) {
    cached = fetch(url)
      .then((res) => res.arrayBuffer())
      .then((data) => ctx.decodeAudioData(data))
      .catch(() => null);
    bufferCache.set(url, cached);
  }
  return cached;
}

let rouletteSource: AudioBufferSourceNode | null = null;
let rouletteGen = 0;

export function startItemRoulette() {
  const ctx = getCtx();
  if (!ctx) return;
  stopItemRoulette();
  const gen = ++rouletteGen;
  void loadBuffer(ctx, ROULETTE_URL).then((buffer) => {
    if (!buffer || gen !== rouletteGen) return;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    src.connect(ctx.destination);
    src.start();
    rouletteSource = src;
  });
}

export function stopItemRoulette() {
  rouletteGen += 1;
  if (rouletteSource) {
    try {
      rouletteSource.stop();
    } catch {
      /* ignore */
    }
    rouletteSource = null;
  }
}

export function playItemDecide() {
  const ctx = getCtx();
  if (!ctx) return;
  void loadBuffer(ctx, DECIDE_URL).then((buffer) => {
    if (!buffer) return;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start();
  });
}

export function playCoinSound() {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(980, now);
  osc.frequency.exponentialRampToValueAtTime(1480, now + 0.12);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.25);
}

export function playLossSound() {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(180, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.42);
}
