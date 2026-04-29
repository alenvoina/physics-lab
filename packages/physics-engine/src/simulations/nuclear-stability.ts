import { Vector } from "../vector";

export class Nucleus {
  position: Vector;
  velocity: Vector;

  protons: number;
  neutrons: number;

  radius: number;
  stability = 1;
  energy = 0;

  flash = 0;

  constructor({
    position,
    velocity,
    protons,
    neutrons,
  }: {
    position: Vector;
    velocity: Vector;
    protons: number;
    neutrons: number;
  }) {
    this.position = position;
    this.velocity = velocity;
    this.protons = protons;
    this.neutrons = neutrons;

    this.radius = Math.pow(protons + neutrons, 1 / 3) * 1.5 + 4;

    this.calcStability();
  }

  calcStability() {
    const optimalN = this.protons * (1 + 0.006 * this.protons);
    const deviation = Math.abs(this.neutrons - optimalN) / optimalN;

    this.stability = Math.max(0.05, 1 - deviation * 3);
    this.energy = this.stability * 8.5;
  }

  step(dt: number, width: number, height: number) {
    this.position = this.position.add(this.velocity.scale(dt * 30));

    if (
      this.position.x < this.radius ||
      this.position.x > width - this.radius
    ) {
      this.velocity.x *= -1;
      this.position.x = Math.max(
        this.radius,
        Math.min(width - this.radius, this.position.x),
      );
    }

    if (
      this.position.y < this.radius ||
      this.position.y > height - this.radius
    ) {
      this.velocity.y *= -1;
      this.position.y = Math.max(
        this.radius,
        Math.min(height - this.radius, this.position.y),
      );
    }

    if (
      this.stability < 0.8 &&
      Math.random() < (1 - this.stability) * 0.005 * dt
    ) {
      this.decay();
    }

    this.flash *= 0.9;
  }

  decay() {
    this.flash = 1;

    if (this.protons > 82) {
      this.protons -= 2;
      this.neutrons -= 2;
    } else if (this.neutrons > this.protons * 1.2) {
      this.neutrons -= 1;
      this.protons += 1;
    } else {
      this.protons -= 1;
      this.neutrons += 1;
    }

    this.radius = Math.pow(this.protons + this.neutrons, 1 / 3) * 1.5 + 4;

    this.calcStability();
  }
}

export class NuclearStabilitySystem {
  nuclei: Nucleus[] = [];

  width = 800;
  height = 600;

  setBounds(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  step(dt: number) {
    this.nuclei.forEach((n) => n.step(dt, this.width, this.height));
  }

  reset() {
    const fresh = NuclearStabilitySystem.createIsotopes(
      this.width,
      this.height,
    );
    Object.assign(this, fresh);
  }

  static createIsotopes(width: number, height: number): NuclearStabilitySystem {
    const sim = new NuclearStabilitySystem();
    sim.width = width;
    sim.height = height;

    for (let i = 0; i < 70; i++) {
      const z = Math.floor(Math.random() * 90) + 2;

      const optimalN = z * (1 + 0.006 * z);
      const n = Math.floor(optimalN + (Math.random() - 0.5) * z * 0.5);

      sim.nuclei.push(
        new Nucleus({
          position: new Vector(Math.random() * width, Math.random() * height),
          velocity: new Vector(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
          ),
          protons: z,
          neutrons: Math.max(1, n),
        }),
      );
    }

    return sim;
  }
}
