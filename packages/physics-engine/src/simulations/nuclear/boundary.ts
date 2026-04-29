import { Particle } from "../nuclear-reaction";

export class BoundarySystem {
  static bounce(p: Particle, width: number, height: number) {
    if (p.position.x <= p.radius || p.position.x >= width - p.radius) {
      p.velocity.x *= -1;
      p.position.x = Math.max(p.radius, Math.min(width - p.radius, p.position.x));
    }

    if (p.position.y <= p.radius || p.position.y >= height - p.radius) {
      p.velocity.y *= -1;
      p.position.y = Math.max(p.radius, Math.min(height - p.radius, p.position.y));
    }
  }
}