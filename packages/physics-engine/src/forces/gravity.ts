import { Body } from '../body.js'

const G = 1;
const SOFTENING = 0.1;

export function applyGravity(a: Body, b: Body) {
  const delta = b.position.subtract(a.position);

  const distSq = delta.x * delta.x + delta.y * delta.y + SOFTENING;

  const distance = Math.sqrt(distSq);

  const nx = delta.x / distance;
  const ny = delta.y / distance;

  const forceMag = (G * a.mass * b.mass) / distSq;

  const fx = nx * forceMag;
  const fy = ny * forceMag;

  a.force.x += fx;
  a.force.y += fy;

  b.force.x -= fx;
  b.force.y -= fy;
}