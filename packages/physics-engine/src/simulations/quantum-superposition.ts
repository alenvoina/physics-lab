export type QuantumState = {
  id: number;
  amplitude: number;
  phase: number;
};

export class QuantumSuperposition {
  states: QuantumState[] = [];
  time = 0;

  constructor() {
    this.reset();
  }

  reset() {
    this.time = 0;
    this.states = [
      { id: 0, amplitude: 1 / Math.sqrt(2), phase: 0 },
      { id: 1, amplitude: 1 / Math.sqrt(2), phase: Math.PI / 2 },
    ];
  }

  step(dt: number) {
    this.time += dt;

    this.states.forEach((s, i) => {
      s.phase += dt * (i + 1);
    });
  }

  normalize() {
    const sum = this.states.reduce((acc, s) => acc + s.amplitude ** 2, 0);
    const norm = Math.sqrt(sum);

    this.states.forEach((s) => {
      s.amplitude /= norm;
    });
  }

  getProbabilities(): number[] {
    return this.states.map((s) => s.amplitude ** 2);
  }

  getWavePoint(x: number): number {
    let real = 0;
    let imag = 0;

    this.states.forEach((s) => {
      real += s.amplitude * Math.cos(s.phase + x);
      imag += s.amplitude * Math.sin(s.phase + x);
    });

    return Math.sqrt(real * real + imag * imag);
  }

  measure(): number {
    const probs = this.getProbabilities();
    const sum = probs.reduce((a, b) => a + b, 0);

    let r = Math.random() * sum;

    for (let i = 0; i < probs.length; i++) {
      r -= probs[i];
      if (r <= 0) {
        this.states = this.states.map((s, j) => ({
          ...s,
          amplitude: j === i ? 1 : 0,
        }));
        return i;
      }
    }

    return 0;
  }

  addState() {
    if (this.states.length >= 8) return;

    this.states.push({
      id: this.states.length,
      amplitude: Math.random(),
      phase: Math.random() * Math.PI * 2,
    });

    this.normalize();
  }
}