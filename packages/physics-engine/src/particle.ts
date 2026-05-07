import { Vector } from "./vector";

export type ParticleType = 'nucleus' | 'neutron';

export class Particle {
  position: Vector;
  velocity: Vector;
  radius: number;
  mass: number;
  type: ParticleType;
  life: number;

  constructor({
    position,
    velocity,
    radius,
    mass,
    type,
    life = 300
  }: {
    position: Vector;
    velocity: Vector;
    radius: number;
    mass: number;
    type: ParticleType;
    life?: number;
  }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.mass = mass;
    this.type = type;
    this.life = life;
  }

  step(dt: number) {
    this.position = this.position.add(this.velocity.scale(dt));

    this.velocity = this.velocity.scale(0.999);

    this.life--;
  }
}