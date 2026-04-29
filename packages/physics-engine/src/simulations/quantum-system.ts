import { Vector } from "../index";

export interface ElectronState {
  n: number;
  energy: number;
  offsetAngle: number;
}

export class QuantumSystem {
  electrons: ElectronState[] = [];
  time = 0;
  stepCount = 0;

  width = 800;
  height = 600;

  constructor() {
    this.generateLevels(3);
  }

  generateLevels(count: number) {
    this.electrons = [];
    for (let n = 1; n <= count; n++) {
      const maxElectrons = n === 1 ? 2 : n === 2 ? 8 : 6;
      for (let i = 0; i < maxElectrons; i++) {
        this.electrons.push({
          n,
          energy: -13.6 / (n * n),
          offsetAngle: ((Math.PI * 2) / maxElectrons) * i,
        });
      }
    }
  }

  step(dt: number) {
    this.time += dt;
    this.stepCount++;
  }

  getElectronPosition(e: ElectronState): Vector {
    const cx = this.width / 2;
    const cy = this.height / 2;
    const baseRadius = Math.min(cx, cy) / 4;
    const radius = baseRadius * e.n;

    const angle = this.time * (1.5 / e.n) + e.offsetAngle;

    return new Vector(
      cx + Math.cos(angle) * radius,
      cy + Math.sin(angle) * radius,
    );
  }

  getWaveAmplitude(r: number, maxRadius: number): number {
    const scale = maxRadius / 15;
    return Math.exp(-r / (scale * 3)) * Math.sin(r / scale - this.time * 5);
  }
}