import { Vector } from '../vector';

export type QuantumState = {
  id: number;
  amplitude: number;
  phase: number;
};

export class QuantumSuperposition {
  states: QuantumState[] = [];
  time = 0;

  constructor() {
    this.states = [
      { id: 0, amplitude: 0.7, phase: 0 },
      { id: 1, amplitude: 0.7, phase: Math.PI / 2 },
    ];
  }

  step(dt: number) {
    this.time += dt;

    this.states.forEach(s => {
      s.phase += dt;
    });
  }

  getProbabilities(): number[] {
    return this.states.map(s => s.amplitude * s.amplitude);
  }

  getInterference(): number {
    let real = 0;
    let imag = 0;

    this.states.forEach(s => {
      real += s.amplitude * Math.cos(s.phase);
      imag += s.amplitude * Math.sin(s.phase);
    });

    return real * real + imag * imag;
  }

  measure(): number {
    const probs = this.getProbabilities();
    const sum = probs.reduce((a, b) => a + b, 0);

    let r = Math.random() * sum;
    let index = 0;

    for (let i = 0; i < probs.length; i++) {
      r -= probs[i];
      if (r <= 0) {
        index = i;
        break;
      }
    }

    this.states = this.states.map((s, i) => ({
      ...s,
      amplitude: i === index ? 1 : 0
    }));

    return index;
  }

  addState() {
    this.states.push({
      id: this.states.length,
      amplitude: Math.random(),
      phase: Math.random() * Math.PI * 2
    });
  }
}