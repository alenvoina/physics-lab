export * from "./vector.js";
export * from "./body.js";
export * from "./world.js";

import { Body, Vector, World } from "./index.js";

const body = new Body({
  position: new Vector(0, 0),
  velocity: new Vector(1, 0),
  mass: 1,
});

body.applyForce(new Vector(10, 0));

body.update(1);

console.log(body.position);