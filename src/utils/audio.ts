const ctx = new AudioContext();

const tone = (freq: number, ms = 120, type: OscillatorType = "sine") => {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.value = 0.05;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  setTimeout(() => osc.stop(), ms);
};

export const sfx = {
  select: () => tone(520, 90, "triangle"),
  correct: () => {
    tone(660, 120, "sine");
    setTimeout(() => tone(880, 180, "sine"), 120);
  },
  wrong: () => {
    tone(320, 120, "square");
    setTimeout(() => tone(220, 180, "square"), 120);
  }
};
