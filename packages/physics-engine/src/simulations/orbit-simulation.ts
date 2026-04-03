import { Body, Vector, World } from "../index";

const world = new World();

const G = 1;
const sun = new Body({ position: new Vector(0, 0), mass: 10000 });
const r = 10;
const M = sun.mass;

const v = Math.sqrt(G * M / r);

const planet = new Body({
  position: new Vector(r, 0),
  mass: 1,
  velocity: new Vector(0, v), 
});

world.addBody(sun);
world.addBody(planet);

const maxSteps = 2000;
let stepCount = 0;


const interval = setInterval(() => {
  world.step(0.005);
  stepCount++;

  if (stepCount >= maxSteps) {
    clearInterval(interval);
    console.log("Simulation finished.");
  }
}, 16);