import { Vector } from "../vector";

export type ParticleType = 'nucleus' | 'neutron';

export class Particle {
  position: Vector;
  velocity: Vector;
  radius: number;
  mass: number;
  type: ParticleType;
  life = 500;

  constructor(data: {
    position: Vector;
    velocity: Vector;
    radius: number;
    mass: number;
    type: ParticleType;
  }) {
    this.position = data.position;
    this.velocity = data.velocity;
    this.radius = data.radius;
    this.mass = data.mass;
    this.type = data.type;
  }

  step(dt: number) {
    this.position = this.position.add(this.velocity.scale(dt * 20));
    this.life--;
  }
}

export class NuclearReactorSystem {
  particles: Particle[] = [];

  energy = 0;
  reactions = 0;
  temperature = 20;

  controlLevel = 0.3;
  meltdown = false;

  step(dt: number) {
    if (this.meltdown) return;

    this.particles.forEach(p => p.step(dt));

    const newParticles: Particle[] = [];
    const remove = new Set<Particle>();

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];

        if (a.type === 'neutron' && b.type === 'nucleus') {
          this.collide(a, b, newParticles, remove);
        }

        if (b.type === 'neutron' && a.type === 'nucleus') {
          this.collide(b, a, newParticles, remove);
        }
      }
    }

    this.particles = this.particles.filter(
      p => !remove.has(p) && p.life > 0
    );

    this.particles.push(...newParticles);

    if (this.particles.length > 400) {
      this.particles.length = 400;
    }

    // физика
  this.temperature += this.energy * 0.002;
  this.temperature *= 0.998;

  this.energy *= 0.995;

    if (this.temperature > 1200) {
      this.meltdown = true;
    }
  }

  collide(
    neutron: Particle,
    nucleus: Particle,
    newParticles: Particle[],
    remove: Set<Particle>
  ) {
    const dx = neutron.position.x - nucleus.position.x;
    const dy = neutron.position.y - nucleus.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > neutron.radius + nucleus.radius) return;

    // поглощение стержнями
    if (Math.random() < this.controlLevel) {
      remove.add(neutron);
      return;
    }

    remove.add(neutron);
    remove.add(nucleus);

    this.reactions++;
    this.energy += 20;

    this.energy *= 0.995;

    // осколки
    for (let i = 0; i < 2; i++) {
      newParticles.push(new Particle({
        position: new Vector(nucleus.position.x, nucleus.position.y),
        velocity: new Vector(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ),
        radius: 5,
        mass: 5,
        type: 'nucleus'
      }));
    }

    // нейтроны
    for (let i = 0; i < 3; i++) {
      newParticles.push(new Particle({
        position: new Vector(nucleus.position.x, nucleus.position.y),
        velocity: new Vector(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3
        ),
        radius: 2,
        mass: 1,
        type: 'neutron'
      }));
    }
  }

  static create(): NuclearReactorSystem {
    const sim = new NuclearReactorSystem();

    // ядра
    for (let i = 0; i < 50; i++) {
      sim.particles.push(new Particle({
        position: new Vector(
          200 + Math.random() * 500,
          100 + Math.random() * 400
        ),
        velocity: new Vector(0, 0),
        radius: 8,
        mass: 10,
        type: 'nucleus'
      }));
    }

    // стартовые нейтроны
    for (let i = 0; i < 5; i++) {
      sim.particles.push(new Particle({
        position: new Vector(100, 300),
        velocity: new Vector(
          1 + Math.random(),
          (Math.random() - 0.5)
        ),
        radius: 2,
        mass: 1,
        type: 'neutron'
      }));
    }

    return sim;
  }
}