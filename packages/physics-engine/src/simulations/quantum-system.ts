import { Vector } from "../vector";

export interface ElectronState {
  n: number;
  radius: number;
  energy: number;
}

export class QuantumSystem {
  electrons: ElectronState[] = [];
  time = 0;
  stepCount: any;

  constructor() {
    this.generateLevels(3);
  }

  generateLevels(count: number) {
    this.electrons = [];

    for (let n = 1; n <= count; n++) {
      this.electrons.push({
        n,
        radius: 40 * n,
        energy: -13.6 / (n * n),
      });
    }
  }

  step(dt: number) {
    this.time += dt;
  }

  getElectronPosition(e: ElectronState, index: number): Vector {
    const angle = this.time * (0.5 / e.n) + index;

    return new Vector(
      450 + Math.cos(angle) * e.radius,
      300 + Math.sin(angle) * e.radius
    );
  }

  getWaveAmplitude(r: number, n: number): number {
    const a = 40;
    return Math.exp(-r / (n * a)) * Math.sin(r / 20);
  }
}