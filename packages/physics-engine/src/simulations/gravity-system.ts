import { Body, Vector, World } from "../index";

const G = 1;

export class GravitySystem {
  world: World;
  showTrails = true;

  constructor() {
    this.world = new World();
    this.world.friction = 1;
  }

  addBody(body: Body) {
    this.world.addBody(body);
  }

  step(dt: number) {
    this.world.step(dt);
  }

  getKineticEnergy(): number {
    return this.world.bodies.reduce((sum, b) => {
      const speed = b.velocity.length();
      return sum + 0.5 * b.mass * speed * speed;
    }, 0);
  }

  getPotentialEnergy(): number {
    let energy = 0;

    for (let i = 0; i < this.world.bodies.length; i++) {
      for (let j = i + 1; j < this.world.bodies.length; j++) {
        const a = this.world.bodies[i];
        const b = this.world.bodies[j];

        const dist = a.position.subtract(b.position).length();
        if (dist > 0) {
          energy -= (G * a.mass * b.mass) / dist;
        }
      }
    }

    return energy;
  }

  getTotalEnergy(): number {
    return this.getKineticEnergy() + this.getPotentialEnergy();
  }

  static createOrbitSystem(): GravitySystem {
    const sim = new GravitySystem();

    const center = new Body({
      position: new Vector(450, 300),
      mass: 1000,
      radius: 10,
    });

    (center as any).isStatic = true;
    sim.addBody(center);

    const r = 150;
    const v = Math.sqrt((G * center.mass) / r);

    sim.addBody(
      new Body({
        position: new Vector(450 + r, 300),
        velocity: new Vector(0, v),
        mass: 5,
        radius: 5,
      }),
    );

    return sim;
  }

  static createGalaxy(): GravitySystem {
    const sim = new GravitySystem();

    const center = new Body({
      position: new Vector(450, 300),
      mass: 500,
      radius: 10,
    });

    (center as any).isStatic = true;
    sim.addBody(center);

    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 80 + Math.random() * 200;

      const x = 450 + Math.cos(angle) * radius;
      const y = 300 + Math.sin(angle) * radius;

      const speed = Math.sqrt((G * center.mass) / radius);

      const vx = -Math.sin(angle) * speed;
      const vy = Math.cos(angle) * speed;

      sim.addBody(
        new Body({
          position: new Vector(x, y),
          velocity: new Vector(vx, vy),
          mass: 2,
          radius: 3,
        }),
      );
    }

    return sim;
  }

  static createChaosSystem(): GravitySystem {
    const sim = new GravitySystem();

    for (let i = 0; i < 6; i++) {
      sim.addBody(
        new Body({
          position: new Vector(Math.random() * 800, Math.random() * 600),
          velocity: new Vector(
            (Math.random() - 0.5) * 1,
            (Math.random() - 0.5) * 1,
          ),
          mass: 5 + Math.random() * 5,
          radius: 4,
        }),
      );
    }

    return sim;
  }
}
