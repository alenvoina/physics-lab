export class QuantumTunneling {
  x = 0;
  time = 0;

  barrierX = 400;
  barrierWidth = 80;
  barrierHeight = 1;

  energy = 0.8;

  wavelength = 40;
  amplitude = 1;

  step(dt: number) {
    this.time += dt;
    this.x += 100 * dt;
  }

  getTunnelProbability(): number {
    const diff = this.barrierHeight - this.energy;
    if (diff <= 0) return 1;

    return Math.exp(-diff * this.barrierWidth * 0.04);
  }

  getWave(x: number): number {
    const k = 2 * Math.PI / this.wavelength;

    if (x < this.barrierX) {
      return Math.sin(k * x - this.time * 5);
    }

    if (x >= this.barrierX && x <= this.barrierX + this.barrierWidth) {
      const decay = Math.exp(-(x - this.barrierX) * 0.03 * (this.barrierHeight - this.energy + 0.5));
      return Math.sin(k * x - this.time * 5) * decay;
    }

    const transmission = this.getTunnelProbability();
    return Math.sin(k * x - this.time * 5) * transmission;
  }

  reset() {
    this.x = 0;
    this.time = 0;
  }

  setBarrier(h: number, w: number) {
    this.barrierHeight = h;
    this.barrierWidth = w;
  }

  setEnergy(e: number) {
    this.energy = e;
  }
}