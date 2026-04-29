export class Telemetry {
  energyHistory: number[] = [];
  tempHistory: number[] = [];
  max = 100;

  push(energy: number, temp: number) {
    this.energyHistory.push(energy);
    this.tempHistory.push(temp);

    if (this.energyHistory.length > this.max) {
      this.energyHistory.shift();
      this.tempHistory.shift();
    }
  }

  clear() {
    this.energyHistory = [];
    this.tempHistory = [];
  }
}