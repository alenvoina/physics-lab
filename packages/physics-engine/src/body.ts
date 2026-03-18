import { Vector } from "./vector.js";

export class Body {
  position: Vector;
  velocity: Vector;
  force: Vector;
  mass: number;

  constructor({
    position = new Vector(),
    velocity = new Vector(),
    mass = 1,
  }: {
    position?: Vector;
    velocity?: Vector;
    mass?: number;
  }) {
    this.position = position;
    this.velocity = velocity;
    this.force = new Vector();
    this.mass = mass;
  }

  applyForce(force: Vector) {
    this.force = this.force.add(force);
  }

  update(dt: number) {
    // a = F / m
    const acceleration = this.force.scale(1 / this.mass);

    // v = v + a * dt
    this.velocity = this.velocity.add(acceleration.scale(dt));

    // x = x + v * dt
    this.position = this.position.add(this.velocity.scale(dt));

    // сброс силы после шага
    this.force = new Vector();
  }
}