import { Body } from '../body.js'

export function applyGravity(a: Body, b: Body) {
  const G = 6.67e-11;

  const r = b.position.subtract(a.position);
  const distance = r.length();

  if (distance === 0) return;

  const forceMagnitude = (G * a.mass * b.mass) / (distance * distance);

  const force = r.normalize().scale(forceMagnitude);

  a.applyForce(force);
  b.applyForce(force.scale(-1));
}