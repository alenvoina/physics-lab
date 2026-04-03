import { Body } from '../body.js'

const G = 1;

export function applyGravity(a: Body, b: Body) {
  const delta = b.position.subtract(a.position);
  const distSq = delta.x * delta.x + delta.y * delta.y;

  const epsilon = 0.01; // SOFTENING
  const forceMag = (G * a.mass * b.mass) / (distSq + epsilon);

  const distance = Math.sqrt(distSq + epsilon);
  const force = delta.scale(1 / distance).scale(forceMag);

  a.force = a.force.add(force);
  b.force = b.force.subtract(force);
}