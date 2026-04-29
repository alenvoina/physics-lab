export type DecayType = 'alpha' | 'beta' | 'gamma';

export class Emission {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: DecayType;
  life = 1.0;

  constructor(x: number, y: number, type: DecayType) {
    this.x = x;
    this.y = y;
    this.type = type;
    const angle = Math.random() * Math.PI * 2;
    const speed = type === 'alpha' ? 20 : type === 'beta' ? 80 : 0;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  step(dt: number) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -=
      dt * (this.type === 'gamma' ? 1.5 : this.type === 'beta' ? 3 : 1);
  }
}

export class Atom {
  x: number;
  y: number;
  decayed = false;
  decayProgress = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class RadioactiveDecaySystem {
  atoms: Atom[] = [];
  emissions: Emission[] = [];

  time = 0;
  decayType: DecayType = 'alpha';
  width = 800;
  height = 400;

  lambdas = {
    alpha: 0.15,
    beta: 0.05,
    gamma: 0.015,
  };

  constructor(public initialCount: number) {}

  get lambda() {
    return this.lambdas[this.decayType];
  }
  getRemaining() {
    return this.atoms.filter((a) => !a.decayed).length;
  }
  getDecayed() {
    return this.initialCount - this.getRemaining();
  }
  getHalfLife() {
    return Math.LN2 / this.lambda;
  }

  setDecayType(type: DecayType) {
    this.decayType = type;
    this.reset();
  }

  reset() {
    this.time = 0;
    this.atoms = [];
    this.emissions = [];

    const cols = Math.ceil(
      Math.sqrt(this.initialCount * (this.width / this.height)),
    );
    const rows = Math.ceil(this.initialCount / cols);
    const paddingX = this.width * 0.1;
    const paddingY = this.height * 0.1;
    const stepX = (this.width - paddingX * 2) / cols;
    const stepY = (this.height - paddingY * 2) / rows;

    let count = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (count++ >= this.initialCount) break;
        const x = paddingX + j * stepX + (Math.random() - 0.5) * stepX * 0.8;
        const y = paddingY + i * stepY + (Math.random() - 0.5) * stepY * 0.8;
        this.atoms.push(new Atom(x, y));
      }
    }
  }

  step(dt: number) {
    this.time += dt;

    const decayProb = 1 - Math.exp(-this.lambda * dt);

    this.atoms.forEach((a) => {
      if (!a.decayed && Math.random() < decayProb) {
        a.decayed = true;
        a.decayProgress = 1.0;
        this.emissions.push(new Emission(a.x, a.y, this.decayType));
      }

      if (a.decayed && a.decayProgress > 0) {
        a.decayProgress = Math.max(0, a.decayProgress - dt * 2);
      }
    });

    this.emissions.forEach((e) => e.step(dt));
    this.emissions = this.emissions.filter((e) => e.life > 0);
  }
}