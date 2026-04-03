import { Body } from './body.js';
import { World } from './world.js';
import { Vector } from './vector.js';

const world = new World();

const a = new Body({
  position: new Vector(0, 0),
  velocity: new Vector(5, 0),
  mass: 1,
  radius: 1
});

const b = new Body({
  position: new Vector(5, 0),
  velocity: new Vector(-2, 0),
  mass: 1,
  radius: 1
});

world.addBody(a);
world.addBody(b);

let stepCount = 0;

const interval = setInterval(() => {
  stepCount++;
  world.step(0.016);

  console.log(`Step ${stepCount}`);
  console.log(`A: ${JSON.stringify(a.position)}, velocity: ${JSON.stringify(a.velocity)}`);
  console.log(`B: ${JSON.stringify(b.position)}, velocity: ${JSON.stringify(b.velocity)}`);

  if (stepCount > 200) {
    clearInterval(interval);
    console.log('Simulation finished.');
  }
}, 16);