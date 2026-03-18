import { Body } from './body.js'
import { applyGravity } from './forces/gravity.js'

export class World {
  bodies: Body[] = [];

  addBody(body: Body) {
    this.bodies.push(body);
  }

 step(dt: number) {
  // гравитация между всеми
  for (let i = 0; i < this.bodies.length; i++) {
    for (let j = i + 1; j < this.bodies.length; j++) {
      applyGravity(this.bodies[i], this.bodies[j]);
    }
  }

  // обновление
  this.bodies.forEach(body => body.update(dt));
}
}