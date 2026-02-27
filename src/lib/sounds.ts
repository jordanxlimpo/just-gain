// Sound utility using Web Audio API - no external dependencies needed
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

function playTone(frequency: number, duration: number, type: OscillatorType = "square", volume = 0.15) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.value = volume;
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + duration);
}

export const sounds = {
  spin: () => {
    // Rapid clicking/spinning sound
    for (let i = 0; i < 8; i++) {
      setTimeout(() => playTone(800 + i * 50, 0.05, "square", 0.08), i * 60);
    }
  },

  reel: () => {
    // Single reel tick
    playTone(600, 0.03, "square", 0.06);
  },

  win: () => {
    // Ascending celebratory tones
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, "sine", 0.2), i * 150);
    });
  },

  bigWin: () => {
    // Fanfare for big wins
    const notes = [523, 659, 784, 1047, 1319, 1568];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.4, "sine", 0.25), i * 120);
    });
    // Add shimmer
    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => playTone(2000 + Math.random() * 2000, 0.1, "sine", 0.05), i * 80);
      }
    }, 600);
  },

  click: () => {
    playTone(1000, 0.05, "square", 0.1);
  },

  deposit: () => {
    playTone(440, 0.15, "sine", 0.15);
    setTimeout(() => playTone(660, 0.15, "sine", 0.15), 100);
    setTimeout(() => playTone(880, 0.2, "sine", 0.15), 200);
  },

  withdraw: () => {
    // Coin dropping sound
    for (let i = 0; i < 5; i++) {
      setTimeout(() => playTone(1200 + Math.random() * 800, 0.15, "sine", 0.12), i * 100);
    }
  },

  success: () => {
    const notes = [523, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.25, "sine", 0.2), i * 200);
    });
  },
};

export const resumeAudio = () => {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
};
