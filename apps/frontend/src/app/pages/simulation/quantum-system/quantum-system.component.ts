import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { QuantumSystem } from '@physics-lab/engine';

@Component({
  selector: 'app-quantum',
  templateUrl: './quantum-system.component.html',
  styleUrls: ['./quantum-system.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class QuantumComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasWrap', { static: true })
  canvasWrapRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  sim = new QuantumSystem();

  animationId = 0;
  lastTime = 0;
  mode: 'levels' | 'wave' | 'states' = 'levels';
  private resizeObserver!: ResizeObserver;

  setMode(mode: 'levels' | 'wave' | 'states') {
    this.mode = mode;
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d', { alpha: false })!;

    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      this.canvasRef.nativeElement.width = width;
      this.canvasRef.nativeElement.height = height;
      this.sim.width = width;
      this.sim.height = height;
    });
    this.resizeObserver.observe(this.canvasWrapRef.nativeElement);

    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop = (time: number) => {
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    this.sim.step(dt);
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.3)';
    ctx.fillRect(0, 0, this.sim.width, this.sim.height);

    switch (this.mode) {
      case 'levels':
        this.drawLevels();
        break;
      case 'wave':
        this.drawWave();
        break;
      case 'states':
        this.drawStates();
        break;
    }

    this.drawHUD();
  }

  drawLevels() {
    const ctx = this.ctx;
    const cx = this.sim.width / 2;
    const cy = this.sim.height / 2;
    const baseRadius = Math.min(cx, cy) / 4;

    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#facc15';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#facc15';
    ctx.fill();
    ctx.shadowBlur = 0;

    for (let n = 1; n <= 3; n++) {
      ctx.beginPath();
      ctx.arc(cx, cy, baseRadius * n, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, 0.15)`;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    this.sim.electrons.forEach((e) => {
      const pos = this.sim.getElectronPosition(e);

      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  drawWave() {
    const ctx = this.ctx;
    const cx = this.sim.width / 2;
    const cy = this.sim.height / 2;
    const maxR = Math.min(cx, cy) * 0.9;

    for (let r = maxR; r > 0; r -= 2) {
      const amp = this.sim.getWaveAmplitude(r, maxR);
      const intensity = Math.min(Math.abs(amp), 1);

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);

      if (amp > 0) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${intensity})`;
      } else {
        ctx.strokeStyle = `rgba(192, 132, 252, ${intensity})`;
      }
      ctx.lineWidth = 2.5;
      ctx.stroke();
    }
  }

  drawStates() {
    const ctx = this.ctx;
    const w = this.sim.width;
    const h = this.sim.height;

    const startX = w * 0.2;
    const endX = w * 0.8;

    for (let n = 1; n <= 4; n++) {
      const energy = -13.6 / (n * n);
      const y = h * 0.1 + ((energy - -13.6) / 13.6) * (h * 0.7);

      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(endX, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(`n=${n}`, startX - 35, y + 4);
      ctx.fillText(`${energy.toFixed(2)} eV`, endX + 10, y + 4);
    }

    const counts = [0, 0, 0, 0, 0];
    this.sim.electrons.forEach((e) => {
      const y = h * 0.1 + ((e.energy - -13.6) / 13.6) * (h * 0.7);

      const offset = counts[e.n] * 25;
      counts[e.n]++;
      const ex = startX + 50 + offset;

      ctx.beginPath();
      ctx.arc(ex, y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#38bdf8';
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }

  drawHUD() {
    const ctx = this.ctx;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
    ctx.fillRect(10, 10, 200, 75);
    ctx.strokeRect(10, 10, 200, 75);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '12px "JetBrains Mono", monospace';
    ctx.fillText(`MODE: ${this.mode.toUpperCase()}`, 20, 30);
    ctx.fillStyle = '#f8fafc';
    ctx.fillText(`ELECTRONS: ${this.sim.electrons.length}`, 20, 50);
    ctx.fillText(`TICKS: ${this.sim.stepCount}`, 20, 70);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
