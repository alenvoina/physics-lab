import { Body } from './body.js';
import { World } from './world.js';
import { Vector } from './vector.js';

// создаём мир
const world = new World();

// создаём два тела
const a = new Body({
  position: new Vector(0, 0),
  velocity: new Vector(5, 0), // движется вправо
  mass: 1,
  radius: 1
});

const b = new Body({
  position: new Vector(5, 0), // ставим на расстояние = сумма радиусов, чтобы сразу столкнулись
  velocity: new Vector(-2, 0), // движется влево
  mass: 1,
  radius: 1
});

// добавляем тела в мир
world.addBody(a);
world.addBody(b);

let stepCount = 0;

// симуляция
const interval = setInterval(() => {
  stepCount++;
  world.step(0.016); // dt = 16 мс ~ 60 FPS

  console.log(`Step ${stepCount}`);
  console.log(`A: ${JSON.stringify(a.position)}, velocity: ${JSON.stringify(a.velocity)}`);
  console.log(`B: ${JSON.stringify(b.position)}, velocity: ${JSON.stringify(b.velocity)}`);

  if (stepCount > 200) {
    clearInterval(interval);
    console.log('Simulation finished.');
  }
}, 16);