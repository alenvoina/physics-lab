import { Body, Vector, World } from "./index.js";

const world = new World();

const a = new Body({ position: new Vector(0, 0), mass: 1000 });
const b = new Body({ position: new Vector(10, 0), mass: 1 });

world.addBody(a);
world.addBody(b);

setInterval(() => {
  world.step(0.016);

  console.log("A:", a.position);
  console.log("B:", b.position);
}, 16);