export class QuantumTunneling {
  x = 0;
  velocity = 2;
  barrierX = 400;
  barrierWidth = 40;
  barrierHeight = 1;

  energy = 0.8;

  passed = false;
  reflected = false;

  step(dt: number) {
    if (this.passed || this.reflected) return;

    this.x += this.velocity * dt * 100;

    if (this.x >= this.barrierX && this.x <= this.barrierX + this.barrierWidth) {
      const p = this.getTunnelProbability();

      if (Math.random() < p) {
        this.passed = true;
      } else {
        this.velocity *= -1;
        this.reflected = true;
      }
    }
  }

  getTunnelProbability(): number {
    const diff = this.barrierHeight - this.energy;

    if (diff <= 0) return 1;

    return Math.exp(-diff * this.barrierWidth * 0.05);
  }

  reset() {
    this.x = 50;
    this.velocity = 2;
    this.passed = false;
    this.reflected = false;
  }

  setBarrier(height: number, width: number) {
    this.barrierHeight = height;
    this.barrierWidth = width;
  }

  setEnergy(e: number) {
    this.energy = e;
  }
}