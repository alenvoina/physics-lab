export class QuantumTunneling {
  energy = 1.0;
  barrierHeight = 1.5;
  barrierWidth = 80;
  barrierX = 400;
  time = 0;

  step(dt: number) {
    this.time += dt * Math.sqrt(this.energy) * 6;
  }

  setEnergy(e: number) {
    this.energy = e;
  }
  setBarrier(h: number) {
    this.barrierHeight = h;
  }

  getTunnelProbability(): number {
    if (this.energy >= this.barrierHeight) return 1.0;

    const kappa = Math.sqrt(this.barrierHeight - this.energy);
    const prob = Math.exp(-2 * kappa * (this.barrierWidth / 25));
    return Math.max(0.0001, Math.min(1, prob));
  }

  getWave(x: number): number {
    const k = Math.sqrt(this.energy) * 0.05;
    const T = this.getTunnelProbability();
    const R = 1 - T;

    if (x < this.barrierX) {
      const incident = Math.sin(k * (x - this.barrierX) - this.time);
      const reflected = R * Math.sin(-k * (x - this.barrierX) - this.time);
      return incident + reflected;
    } else if (x > this.barrierX + this.barrierWidth) {
      return (
        T * Math.sin(k * (x - this.barrierX - this.barrierWidth) - this.time)
      );
    } else {
      const progress = (x - this.barrierX) / this.barrierWidth;
      let envelope = 1;

      if (this.energy < this.barrierHeight) {
        envelope = Math.pow(Math.max(T, 0.0001), progress);
      }
      return envelope * Math.sin(k * (x - this.barrierX) - this.time);
    }
  }

  reset() {
    this.time = 0;
    this.energy = 1.0;
    this.barrierHeight = 1.5;
  }
}