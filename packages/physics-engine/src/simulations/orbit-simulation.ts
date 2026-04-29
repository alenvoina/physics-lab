import { Body, Vector, World } from "../index";

const world = new World();

const G = 1;

const center = new Vector(450, 300);

const sun = new Body({
  position: center,
  mass: 10000,
});

(sun as any).isStatic = true;

const r = 150;

const v = Math.sqrt((G * sun.mass) / r);

const planet = new Body({
  position: center.add(new Vector(r, 0)),
  mass: 1,
  velocity: new Vector(0, v),
});

world.addBody(sun);
world.addBody(planet);

setInterval(() => {
  world.step(0.01);
}, 16);
