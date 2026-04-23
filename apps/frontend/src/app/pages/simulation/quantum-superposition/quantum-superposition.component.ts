import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { QuantumSuperposition } from '@physics-lab/engine';

@Component({
  selector: 'app-quantum-superposition',
  templateUrl: './quantum-superposition.component.html',
  styleUrls: ['./quantum-superposition.component.scss'],
})
export class QuantumSuperpositionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  system = new QuantumSuperposition();

  animationId = 0;

  lastMeasurement: number | null = null;
  flashTime = 0;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;

    const dpr = window.devicePixelRatio || 1;
    const width = 900;
    const height = 600;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    this.ctx = canvas.getContext('2d')!;
    this.ctx.scale(dpr, dpr);

    this.loop();
  }

  loop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  update() {
    this.system.step(0.02);
  }

  measure() {
    this.lastMeasurement = this.system.measure();
    this.flashTime = 10;
  }

  addState() {
    this.system.addState();
  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 900, 600);

    this.drawWave();
    this.drawStates();
    this.drawProbabilities();
    this.drawUI();

    if (this.flashTime > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      ctx.fillRect(0, 0, 900, 600);
      this.flashTime--;
    }
  }

  drawWave() {
    const ctx = this.ctx;

    ctx.beginPath();

    for (let x = 0; x < 900; x++) {
      const value = this.system.getWavePoint(x * 0.02);
      const y = 300 + value * 100;

      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawStates() {
    const ctx = this.ctx;

    const cx = 150;
    const cy = 300;

    this.system.states.forEach(s => {
      const len = s.amplitude * 100;

      const x = cx + Math.cos(s.phase) * len;
      const y = cy + Math.sin(s.phase) * len;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#facc15';
      ctx.fill();
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }

  drawProbabilities() {
    const ctx = this.ctx;
    const probs = this.system.getProbabilities();

    probs.forEach((p, i) => {
      const x = 300 + i * 80;
      const h = p * 200;

      ctx.fillStyle = '#22c55e';
      ctx.fillRect(x, 550 - h, 40, h);

      ctx.fillStyle = 'white';
      ctx.font = '12px monospace';
      ctx.fillText(p.toFixed(2), x, 560);
    });
  }

  drawUI() {
    const ctx = this.ctx;

    ctx.fillStyle = 'white';
    ctx.font = '14px monospace';

    ctx.fillText(`States: ${this.system.states.length}`, 10, 20);

    if (this.lastMeasurement !== null) {
      ctx.fillText(`Measured: ${this.lastMeasurement}`, 10, 40);
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}