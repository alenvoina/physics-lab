export type DecayType = 'alpha' | 'beta' | 'gamma';

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

  decayConstant = 0.01;
  time = 0;
  decayType: DecayType = 'beta';

  history: { time: number; remaining: number }[] = [];

  constructor(count = 100) {
    this.generateAtoms(count);
  }

  generateAtoms(count: number) {
    this.atoms = [];
    const centerX = 450;
    const centerY = 200;

    for (let i = 0; i < count; i++) {
      this.atoms.push(
        new Atom(
          centerX + (Math.random() - 0.5) * 250,
          centerY + (Math.random() - 0.5) * 200
        )
      );
    }
  }

  step(dt: number) {
    this.time += dt;

    this.atoms.forEach(atom => {
      if (atom.decayed) return;

      const p = this.getDecayProbability(dt);

      if (Math.random() < p) {
        atom.decayed = true;
        atom.decayProgress = 1;
      }
    });

    this.history.push({
      time: this.time,
      remaining: this.getRemaining(),
    });
  }

  getDecayProbability(dt: number): number {
    return 1 - Math.exp(-this.decayConstant * dt);
  }

  getRemaining(): number {
    return this.atoms.filter(a => !a.decayed).length;
  }

  getDecayed(): number {
    return this.atoms.filter(a => a.decayed).length;
  }

  reset(count = 100) {
    this.time = 0;
    this.history = [];
    this.generateAtoms(count);
  }

  setDecayType(type: DecayType) {
    this.decayType = type;

    if (type === 'alpha') this.decayConstant = 0.02;
    if (type === 'beta') this.decayConstant = 0.01;
    if (type === 'gamma') this.decayConstant = 0.005;
  }

  getHalfLife(): number {
    return Math.log(2) / this.decayConstant;
  }
}