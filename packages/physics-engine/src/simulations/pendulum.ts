export class Pendulum {
  angle: number;
  angularVelocity: number = 0;
  angularAcceleration: number = 0;

  length: number;
  gravity: number;
  mass: number;

  private lastCrossTime = 0;
  private prevAngle: number;

  constructor({
    angle = Math.PI / 4,
    length = 200,
    gravity = 9.81,
    mass = 1
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
    this.angularAcceleration = -(this.gravity / this.length) * Math.sin(this.angle);
    this.angularVelocity += this.angularAcceleration * dt;
    this.angle += this.angularVelocity * dt;
    this.angle = this.normalizeAngle(this.angle);

    // Обновляем период
    if (this.prevAngle < 0 && this.angle >= 0) {
      if (this.lastCrossTime !== 0) {
        this._period = (time - this.lastCrossTime) / 1000;
      }
      this.lastCrossTime = time;
    }
    this.prevAngle = this.angle;
  }

  reset(angle: number) {
    this.angle = angle;
    this.angularVelocity = 0;
    this.prevAngle = angle;
    this.lastCrossTime = 0;
    this._period = 0;
  }

  // --- геттеры для UI ---
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

  private _period = 0;
  get period() {
    return this._period || 2 * Math.PI * Math.sqrt(this.length / this.gravity);
  }

  // --- вспомогательные ---
  private normalizeAngle(angle: number) {
    while (angle > Math.PI) angle -= 2 * Math.PI;
    while (angle < -Math.PI) angle += 2 * Math.PI;
    return angle;
  }
}