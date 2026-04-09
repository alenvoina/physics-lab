export * from "./vector";
export * from "./body";
export * from "./world";
export * from "./simulations/orbit-simulation";
export * from "./simulations/pendulum";
export * from "./simulations/gravity-system";
export * from "./simulations/quantum-system";
export * from "./simulations/quantum-superposition";
export * from "./simulations/quantum-tunneling";
export * from "./simulations/radioactive-decay";
export * from "./simulations/nuclear-reaction";
export * from "./simulations/nuclear-stability";

import { Body, Vector, World } from "./index";

const body = new Body({
  position: new Vector(0, 0),
  velocity: new Vector(1, 0),
  mass: 1,
});

body.applyForce(new Vector(10, 0));

body.update(1);

console.log(body.position);