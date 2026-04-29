import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { NuclearReactorSystem } from '@physics-lab/engine';

@Component({
  selector: 'app-reactor',
  templateUrl: './nuclear-reaction.component.html',
  styleUrls: ['./nuclear-reaction.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class NuclearReactorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasWrap', { static: true }) canvasWrapRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  sim = NuclearReactorSystem.create(800, 600);

  animationId = 0;
  speed = 1;

  private resizeObserver!: ResizeObserver;
  private lastTime = 0;

  setSpeed(v: string) {
    this.speed = parseFloat(v);
  }

  setControl(v: string) {
    this.sim.setControlLevel(parseFloat(v));
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d', { alpha: false })!;

    this.resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;

        this.canvasRef.nativeElement.width = width;
        this.canvasRef.nativeElement.height = height;

        this.sim.setBounds(width, height);
      }
    });

    this.resizeObserver.observe(this.canvasWrapRef.nativeElement);

    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop = (time: number) => {
    const dt = Math.min((time - this.lastTime) / 1000, 0.05) * this.speed;
    this.lastTime = time;

    this.sim.step(dt);

    this.draw();

    this.animationId = requestAnimationFrame(this.loop);
  };

  draw() {
    const ctx = this.ctx;
    const w = this.sim.width;
    const h = this.sim.height;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.4)';
    ctx.fillRect(0, 0, w, h);

    const rodHeight = h * this.sim.controlLevel;
    const numRods = 10;
    const rodWidth = w / (numRods * 2);

    for (let i = 0; i < numRods; i++) {
      const rx = (i * 2 + 0.5) * rodWidth;

      ctx.fillStyle = 'rgba(71, 85, 105, 0.3)';
      ctx.fillRect(rx, 0, rodWidth, rodHeight);

      ctx.fillStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#38bdf8';
      ctx.fillRect(rx, rodHeight - 4, rodWidth, 4);
      ctx.shadowBlur = 0;
    }

    if (this.sim.meltdown) {
      ctx.fillStyle = `rgba(239, 68, 68, ${Math.random() * 0.4 + 0.1})`;
      ctx.fillRect(0, 0, w, h);
    }

    this.sim.particles.forEach(p => {
      let color = '#fff';
      let glow = 0;

      if (p.type === 'neutron') { color = '#38bdf8'; glow = 6; }
      else if (p.type === 'nucleus') { color = '#facc15'; glow = 15; }
      else if (p.type === 'fragment') { color = '#ef4444'; glow = 8; }

      ctx.beginPath();
      ctx.arc(p.position.x, p.position.y, p.radius * (glow / 2), 0, Math.PI * 2);
      ctx.fillStyle = `${color}22`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(p.position.x, p.position.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });

    this.drawHUD();
  }

  drawHUD() {
    const ctx = this.ctx;
    const w = this.sim.width;
    const h = this.sim.height;

    const historyE = this.sim.telemetry.energyHistory;
    const historyT = this.sim.telemetry.tempHistory;
    const maxHistory = this.sim.telemetry.max;

    const graphW = Math.min(220, w * 0.4);
    const graphH = 60;
    const gx = 20;
    const gy = h - graphH - 20;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.fillRect(gx, gy, graphW, graphH);
    ctx.strokeRect(gx, gy, graphW, graphH);

    ctx.beginPath();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;

    historyT.forEach((val, i) => {
      const px = gx + (i / maxHistory) * graphW;
      const py = gy + graphH - Math.min(val / 1200, 1) * graphH;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });

    ctx.stroke();

    ctx.beginPath();
    ctx.strokeStyle = '#facc15';

    historyE.forEach((val, i) => {
      const px = gx + (i / maxHistory) * graphW;
      const py = gy + graphH - Math.min(val / 100, 1) * graphH;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    });

    ctx.stroke();

    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';

    ctx.fillText(`REACTIONS: ${this.sim.reactions}`, 20, 30);

    ctx.fillStyle = this.sim.temperature > 800 ? '#ef4444' : '#fff';
    ctx.fillText(`TEMP: ${this.sim.temperature.toFixed(0)} K`, 20, 50);
  }

  getStatusClass() {
    if (this.sim.meltdown) return 'danger-glow';
    if (this.sim.temperature > 800) return 'danger';
    if (this.sim.temperature > 400) return 'warning';
    return 'stable';
  }

  getStatusText() {
    if (this.sim.meltdown) return '⚠️ CORE MELTDOWN';
    if (this.sim.temperature > 800) return 'CRITICAL';
    if (this.sim.temperature > 400) return 'HEATING';
    return 'NOMINAL';
  }

  reset() {
    this.sim.reset();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}