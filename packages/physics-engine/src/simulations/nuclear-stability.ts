import { Vector } from '../vector';

export class Nucleus {
  position: Vector;

  protons: number;
  neutrons: number;

  radius: number;

  stability: number;
  energy: number;

  decayTimer = 0;

  constructor({
    position,
    protons,
    neutrons
  }: {
    position: Vector;
    protons: number;
    neutrons: number;
  }) {
    this.position = position;
    this.protons = protons;
    this.neutrons = neutrons;

    this.radius = 5 + Math.sqrt(protons + neutrons);

    this.energy = this.calcBindingEnergy();
    this.stability = this.calcStability();
  }

  calcBindingEnergy(): number {
    const A = this.protons + this.neutrons;

    return A - Math.pow(this.protons - this.neutrons, 2) / A;
  }

  
  calcStability(): number {
    const ratio = this.neutrons / this.protons;

    const diff = Math.abs(ratio - 1.2);

    return Math.max(0, 1 - diff);
  }

  step() {
    if (this.stability < 0.5) {
      this.decayTimer++;

      if (this.decayTimer > 100) {
        this.decay();
        this.decayTimer = 0;
      }
    }
  }

  decay() {
    if (Math.random() < 0.5 && this.neutrons > 0) {
      this.neutrons--;
    } else if (this.protons > 1) {
      this.protons--;
    }

    this.energy = this.calcBindingEnergy();
    this.stability = this.calcStability();
  }
}

export class NuclearStabilitySystem {
  nuclei: Nucleus[] = [];

  add(n: Nucleus) {
    this.nuclei.push(n);
  }

  

  step() {
    this.nuclei.forEach(n => n.step());
  }

  static createIsotopes(): NuclearStabilitySystem {
    const sim = new NuclearStabilitySystem();

    for (let i = 0; i < 8; i++) {
      sim.add(new Nucleus({
        position: new Vector(150 + i * 80, 300),
        protons: 6,
        neutrons: 4 + i
      }));
    }

    return sim;
  }
}