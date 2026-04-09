import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { QuantumSuperposition } from '@physics-lab/engine';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-quantum-superposition',
  templateUrl: './quantum-superposition.component.html',
  styleUrls: ['./quantum-superposition.component.scss'],
  imports: [CommonModule]
})
export class QuantumSuperpositionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  sim = new QuantumSuperposition();

  animationId = 0;

  mode: 'states' | 'probability' | 'measurement' = 'states';

  lastMeasurement: number | null = null;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;

    canvas.width = 900;
    canvas.height = 500;

    this.ctx = canvas.getContext('2d')!;

    this.loop();
  }

  loop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  update() {
    this.sim.step(0.02);
  }

  measure() {
    this.lastMeasurement = this.sim.measure();
  }

  addState() {
    this.sim.addState();
  }

  setMode(m: any) {
    this.mode = m;
  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 900, 500);

    if (this.mode === 'states') this.drawStates();
    if (this.mode === 'probability') this.drawProbability();
    if (this.mode === 'measurement') this.drawMeasurement();
  }

  drawStates() {
    const ctx = this.ctx;

    this.sim.states.forEach((s, i) => {
      const x = 150 + i * 150;
      const y = 250;

      const radius = 30 + s.amplitude * 40;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();

      ctx.fillStyle = 'white';
      ctx.fillText(`State ${i}`, x - 20, y + 70);
    });
  }

  drawProbability() {
    const ctx = this.ctx;
    const probs = this.sim.getProbabilities();

    probs.forEach((p, i) => {
      const x = 150 + i * 150;
      const h = p * 200;

      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x, 400 - h, 40, h);

      ctx.fillStyle = 'white';
      ctx.fillText(p.toFixed(2), x, 420);
    });
  }

  drawMeasurement() {
    const ctx = this.ctx;

    if (this.lastMeasurement === null) return;

    ctx.fillStyle = '#facc15';
    ctx.font = '20px monospace';

    ctx.fillText(
      `Measured State: ${this.lastMeasurement}`,
      300,
      250
    );
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}