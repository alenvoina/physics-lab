import { Body } from './body'
import { applyGravity } from './forces/gravity'

export class World {
  bodies: Body[] = [];
  restitution: number = 0.9; // коэффициент упругости при столкновениях
  friction: number = 0.99;   // простое трение, для замедления тел

  addBody(body: Body) {
    this.bodies.push(body);
  }

  step(dt: number) {
    // --- 1. Применяем силы (гравитацию пока) ---
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        applyGravity(this.bodies[i], this.bodies[j]);
      }
    }

    // --- 2. Обновляем позиции и скорости ---
    this.bodies.forEach(body => {
      body.update(dt);

      // применяем простое трение
      body.velocity = body.velocity.scale(this.friction);
    });

    // --- 3. Проверяем столкновения и отталкивание ---
    for (let i = 0; i < this.bodies.length; i++) {
      for (let j = i + 1; j < this.bodies.length; j++) {
        this.resolveCollision(this.bodies[i], this.bodies[j]);
      }
    }
  }

  // метод для упругих столкновений
  resolveCollision(a: Body, b: Body) {
    const delta = b.position.subtract(a.position);
    const distance = delta.length();

    const minDist = a.radius + b.radius; // предполагаем, что у Body есть radius
    if (distance < minDist && distance > 0) {
      // нормаль столкновения
      const normal = delta.scale(1 / distance);

      // относительная скорость
      const relVel = b.velocity.subtract(a.velocity);
      const speed = relVel.x * normal.x + relVel.y * normal.y; // скалярное произведение

      if (speed < 0) return; // если тела разлетаются, не отталкиваем

      // импульс для упругого столкновения
      const impulse = (2 * speed) / (a.mass + b.mass);
      a.velocity = a.velocity.add(normal.scale(impulse * b.mass * -this.restitution));
      b.velocity = b.velocity.add(normal.scale(impulse * a.mass * this.restitution));

      // сдвигаем тела, чтобы не пересекались
      const overlap = minDist - distance;
      a.position = a.position.add(normal.scale(-overlap * (b.mass / (a.mass + b.mass))));
      b.position = b.position.add(normal.scale(overlap * (a.mass / (a.mass + b.mass))));
    }
  }
}