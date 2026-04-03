export * from "./vector";
export * from "./body";
export * from "./world";
export * from "./simulations/orbit-simulation"
export * from "./simulations/pendulum";

import { Body, Vector, World } from "./index";

const body = new Body({
  position: new Vector(0, 0),
  velocity: new Vector(1, 0),
  mass: 1,
});

body.applyForce(new Vector(10, 0));

body.update(1);

console.log(body.position);