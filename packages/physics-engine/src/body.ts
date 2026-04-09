import { Vector } from "./vector";

export class Body {
  position: Vector;
  velocity: Vector;
  force: Vector;
  mass: number;
  radius: number;
  isStatic: boolean = false;

  constructor({
    position = new Vector(),
    velocity = new Vector(),
    mass = 1,
    radius = 1,
  }: {
    position?: Vector;
    velocity?: Vector;
    mass?: number;
    radius?: number;
  }) {
    this.position = position;
    this.velocity = velocity;
    this.force = new Vector();
    this.mass = mass;
    this.radius = radius;
  }

  applyForce(force: Vector) {
    this.force = this.force.add(force);
  }

update(dt: number) {
  if (this.isStatic) return;

  const acceleration = this.force.scale(1 / this.mass);

  this.velocity = this.velocity.add(acceleration.scale(dt));
  this.position = this.position.add(this.velocity.scale(dt));

  this.force = new Vector();
}
}