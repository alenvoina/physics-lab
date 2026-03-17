export class Vector {
  constructor(public x: number = 0, public y: number = 0) {}

  add(v: Vector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  subtract(v: Vector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  scale(s: number): Vector {
    return new Vector(this.x * s, this.y * s);
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector {
    const len = this.length();
    return len === 0 ? new Vector(0, 0) : this.scale(1 / len);
  }
}