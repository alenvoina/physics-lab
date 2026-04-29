export class Pendulum {
  angle: number;
  angularVelocity = 0;
  angularAcceleration = 0;

  length: number;
  gravity: number;
  mass: number;

  private lastCrossTime = 0;
  private prevAngle: number;

  kineticHistory: number[] = [];
  potentialHistory: number[] = [];
  maxHistory = 150;

  private _period = 0;

  constructor({
    angle = Math.PI / 4,
    length = 200,
    gravity = 9.81,
    mass = 1,
  }: {
    angle?: number;
    length?: number;
    gravity?: number;
    mass?: number;
  } = {}) {
    this.angle = angle;
    this.length = length;
    this.gravity = gravity;
    this.mass = mass;
    this.prevAngle = angle;
  }

  step(dt: number, time: number) {
    this.angularAcceleration =
      -(this.gravity / this.length) * Math.sin(this.angle);

    this.angularVelocity += this.angularAcceleration * dt;
    this.angle += this.angularVelocity * dt;
    this.angle = this.normalizeAngle(this.angle);

    if (this.prevAngle < 0 && this.angle >= 0) {
      if (this.lastCrossTime !== 0) {
        this._period = (time - this.lastCrossTime) / 1000;
      }
      this.lastCrossTime = time;
    }

    this.prevAngle = this.angle;

    this.pushHistory();
  }

  private pushHistory() {
    this.kineticHistory.push(this.kineticEnergy);
    this.potentialHistory.push(this.potentialEnergy);

    if (this.kineticHistory.length > this.maxHistory) {
      this.kineticHistory.shift();
      this.potentialHistory.shift();
    }
  }

  reset(angle: number) {
    this.angle = angle;
    this.angularVelocity = 0;
    this.prevAngle = angle;
    this.lastCrossTime = 0;
    this._period = 0;

    this.kineticHistory = [];
    this.potentialHistory = [];
  }

  setLength(length: number) {
    this.length = length;
  }

  setGravity(g: number) {
    this.gravity = g;
  }

  get kineticEnergy() {
    const v = this.angularVelocity * this.length;
    return 0.5 * this.mass * v * v;
  }

  get potentialEnergy() {
    const h = this.length * (1 - Math.cos(this.angle));
    return this.mass * this.gravity * h;
  }

  get energy() {
    return this.kineticEnergy + this.potentialEnergy;
  }

  get amplitude() {
    return Math.abs(this.angle);
  }

  get period() {
    return this._period || 2 * Math.PI * Math.sqrt(this.length / this.gravity);
  }

  private normalizeAngle(angle: number) {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  }
}
