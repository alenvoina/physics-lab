import { Vector } from "../vector";
import { Telemetry } from "./nuclear/telemetry";
import { BoundarySystem } from "./nuclear/boundary";

export type ParticleType = "nucleus" | "neutron" | "fragment";

export class Particle {
  position: Vector;
  velocity: Vector;
  radius: number;
  mass: number;
  type: ParticleType;
  life: number;

  constructor(data: {
    position: Vector;
    velocity: Vector;
    radius: number;
    mass: number;
    type: ParticleType;
    life?: number;
  }) {
    this.position = data.position;
    this.velocity = data.velocity;
    this.radius = data.radius;
    this.mass = data.mass;
    this.type = data.type;
    this.life = data.life ?? 500;
  }

  step(dt: number) {
    this.position = this.position.add(this.velocity.scale(dt * 20));
    this.life -= dt * 60;
  }
}

export class NuclearReactorSystem {
  particles: Particle[] = [];

  width = 900;
  height = 600;

  energy = 0;
  reactions = 0;
  temperature = 20;

  private _controlLevel = 0.3;
  meltdown = false;

  telemetry = new Telemetry();

  setBounds(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  setControlLevel(value: number) {
    this._controlLevel = Math.max(0, Math.min(1, value));
  }

  get controlLevel() {
    return this._controlLevel;
  }

  reset() {
    const fresh = NuclearReactorSystem.create(this.width, this.height);
    Object.assign(this, fresh);
  }

  step(dt: number) {
    if (this.meltdown) return;

    this.particles.forEach((p) => {
      p.step(dt);
      BoundarySystem.bounce(p, this.width, this.height);
    });

    const newParticles: Particle[] = [];
    const remove = new Set<Particle>();

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];

        if (a.type === "neutron" && b.type === "nucleus") {
          this.collide(a, b, newParticles, remove);
        } else if (b.type === "neutron" && a.type === "nucleus") {
          this.collide(b, a, newParticles, remove);
        }
      }
    }

    this.particles = this.particles.filter((p) => !remove.has(p) && p.life > 0);
    this.particles.push(...newParticles);

    this.spawnNucleiIfNeeded();

    this.updateThermal();

    this.telemetry.push(this.energy, this.temperature);

    if (this.temperature > 1200) {
      this.meltdown = true;
    }
  }

  private spawnNucleiIfNeeded() {
    const nucleiCount = this.particles.filter(
      (p) => p.type === "nucleus",
    ).length;

    if (nucleiCount < 60 && Math.random() < 0.1) {
      this.particles.push(
        new Particle({
          position: new Vector(
            Math.random() * this.width,
            Math.random() * this.height,
          ),
          velocity: new Vector(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
          ),
          radius: 8,
          mass: 10,
          type: "nucleus",
        }),
      );
    }
  }

  private updateThermal() {
    this.temperature += this.energy * 0.005;
    this.temperature = Math.max(20, this.temperature * 0.99);
    this.energy *= 0.95;
  }

  private collide(
    neutron: Particle,
    nucleus: Particle,
    newParticles: Particle[],
    remove: Set<Particle>,
  ) {
    const dx = neutron.position.x - nucleus.position.x;
    const dy = neutron.position.y - nucleus.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > neutron.radius + nucleus.radius) return;

    if (Math.random() < this._controlLevel) {
      remove.add(neutron);
      return;
    }

    remove.add(neutron);
    remove.add(nucleus);

    this.reactions++;
    this.energy += 20;

    for (let i = 0; i < 2; i++) {
      newParticles.push(
        new Particle({
          position: new Vector(nucleus.position.x, nucleus.position.y),
          velocity: new Vector(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
          ),
          radius: 4,
          mass: 5,
          type: "fragment",
          life: 40 + Math.random() * 40,
        }),
      );
    }

    const count = Math.floor(Math.random() * 2) + 2;
    for (let i = 0; i < count; i++) {
      newParticles.push(
        new Particle({
          position: new Vector(nucleus.position.x, nucleus.position.y),
          velocity: new Vector(
            (Math.random() - 0.5) * 8,
            (Math.random() - 0.5) * 8,
          ),
          radius: 2.5,
          mass: 1,
          type: "neutron",
          life: 200 + Math.random() * 100,
        }),
      );
    }
  }

  static create(width = 900, height = 600): NuclearReactorSystem {
    const sim = new NuclearReactorSystem();
    sim.width = width;
    sim.height = height;

    for (let i = 0; i < 60; i++) {
      sim.particles.push(
        new Particle({
          position: new Vector(Math.random() * width, Math.random() * height),
          velocity: new Vector(
            (Math.random() - 0.5) * 0.5,
            (Math.random() - 0.5) * 0.5,
          ),
          radius: 8,
          mass: 10,
          type: "nucleus",
        }),
      );
    }

    for (let i = 0; i < 5; i++) {
      sim.particles.push(
        new Particle({
          position: new Vector(width / 2, height / 2),
          velocity: new Vector(
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
          ),
          radius: 2.5,
          mass: 1,
          type: "neutron",
        }),
      );
    }

    return sim;
  }
}
