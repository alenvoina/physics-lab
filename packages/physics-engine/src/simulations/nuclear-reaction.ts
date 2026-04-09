import { Vector } from '../vector';

export type ParticleType = 'nucleus' | 'neutron';

export class Particle {
  position: Vector;
  velocity: Vector;
  radius: number;
  mass: number;
  type: ParticleType;
  life = 120;

  constructor({
    position,
    velocity,
    radius,
    mass,
    type
  }: {
    position: Vector;
    velocity: Vector;
    radius: number;
    mass: number;
    type: ParticleType;
  }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.mass = mass;
    this.type = type;
  }

  step(dt: number) {
    this.position = this.position.add(this.velocity.scale(dt));
    this.life--;
  }
}

export class NuclearReactorSystem {
  particles: Particle[] = [];

  energy = 0;
  reactions = 0;
  temperature = 0;

  controlLevel = 0.5;
  meltdown = false;

  add(p: Particle) {
    this.particles.push(p);
  }

  step(dt: number) {
    if (this.meltdown) return;

    this.particles.forEach(p => p.step(dt));

    this.handleCollisions();

    this.temperature += this.energy * 0.0005;

    this.temperature *= 0.999;

    if (this.temperature > 1000) {
      this.meltdown = true;
    }

    this.particles = this.particles.filter(p => p.life > 0);
  }

  handleCollisions() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const a = this.particles[i];
        const b = this.particles[j];

        if (a.type === 'neutron' && b.type === 'nucleus') {
          this.tryFission(a, b);
        }

        if (b.type === 'neutron' && a.type === 'nucleus') {
          this.tryFission(b, a);
        }
      }
    }
  }

  tryFission(neutron: Particle, nucleus: Particle) {
    const dist = neutron.position.subtract(nucleus.position).length();

    if (dist < neutron.radius + nucleus.radius) {

      if (Math.random() < this.controlLevel) {
        neutron.life = 0;
        return;
      }

      this.fission(nucleus);
      neutron.life = 0;
    }
  }

  fission(nucleus: Particle) {
    this.reactions++;
    this.energy += 50;

    this.particles = this.particles.filter(p => p !== nucleus);

    for (let i = 0; i < 2; i++) {
      this.particles.push(new Particle({
        position: nucleus.position,
        velocity: new Vector(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 3
        ),
        radius: 6,
        mass: 5,
        type: 'nucleus'
      }));
    }

    for (let i = 0; i < 3; i++) {
      this.particles.push(new Particle({
        position: nucleus.position,
        velocity: new Vector(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 6
        ),
        radius: 2,
        mass: 1,
        type: 'neutron'
      }));
    }
  }

  static create(): NuclearReactorSystem {
    const sim = new NuclearReactorSystem();

    for (let i = 0; i < 30; i++) {
      sim.add(new Particle({
        position: new Vector(
          250 + Math.random() * 400,
          150 + Math.random() * 300
        ),
        velocity: new Vector(0, 0),
        radius: 8,
        mass: 10,
        type: 'nucleus'
      }));
    }

    sim.add(new Particle({
      position: new Vector(100, 300),
      velocity: new Vector(4, 0),
      radius: 2,
      mass: 1,
      type: 'neutron'
    }));

    return sim;
  }
}