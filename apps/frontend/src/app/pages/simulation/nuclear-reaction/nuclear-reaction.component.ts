import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';

import { NuclearReactorSystem, Particle } from '@physics-lab/engine';

@Component({
  selector: 'app-reactor',
  templateUrl: './nuclear-reaction.component.html',
  styleUrls: ['./nuclear-reaction.component.scss'],
  imports: [CommonModule]
})
export class NuclearReactorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  sim = NuclearReactorSystem.create();

  animationId = 0;
  energyHistory: number[] = [];
  tempHistory: number[] = [];
  maxHistory = 120;
  speed = 1;

setSpeed(v: number) {
  this.speed = v;
}

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = 900;
    canvas.height = 600;

    this.ctx = canvas.getContext('2d')!;
    this.loop();
  }

  loop = () => {
  this.sim.step(0.016 * this.speed);
  this.energyHistory.push(this.sim.energy);
  this.tempHistory.push(this.sim.temperature);

  if (this.energyHistory.length > this.maxHistory) {
    this.energyHistory.shift();
    this.tempHistory.shift();
  }

  this.draw();
  this.animationId = requestAnimationFrame(this.loop);
};

  draw() {
    const ctx = this.ctx;
    const heat = Math.min(this.sim.temperature / 1200, 1);

    const bg = ctx.createRadialGradient(450, 300, 50, 450, 300, 500);
    bg.addColorStop(0, `rgba(${255}, ${200 - heat * 150}, 50, 0.5)`);
    bg.addColorStop(1, '#020617');

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 900, 600);

    this.sim.particles.forEach(p => this.drawParticle(p));

    if (Math.random() < this.sim.reactions * 0.0005) {
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(0, 0, 900, 600);
    }

    this.drawUI();
    this.drawGraphs();
  }

  drawGraphs() {
  const ctx = this.ctx;

  const x = 10;
  const y = 500;
  const width = 250;
  const height = 80;

  // фон
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(x, y, width, height);

  // ENERGY (желтая)
  ctx.beginPath();
  ctx.strokeStyle = '#facc15';

  this.energyHistory.forEach((val, i) => {
    const px = x + (i / this.maxHistory) * width;
    const py = y + height - Math.min(val / 200, 1) * height;

    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });

  ctx.stroke();

  // TEMP (красная)
  ctx.beginPath();
  ctx.strokeStyle = '#ef4444';

  this.tempHistory.forEach((val, i) => {
    const px = x + (i / this.maxHistory) * width;
    const py = y + height - Math.min(val / 1200, 1) * height;

    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  });

  ctx.stroke();

  // подписи
  ctx.fillStyle = 'white';
  ctx.font = '10px monospace';
  ctx.fillText('Energy', x + 5, y + 12);
  ctx.fillText('Temp', x + 70, y + 12);
}

  drawParticle(p: Particle) {
    const ctx = this.ctx;

    const color = p.type === 'neutron' ? '#38bdf8' : '#facc15';

    const glow = ctx.createRadialGradient(
      p.position.x,
      p.position.y,
      0,
      p.position.x,
      p.position.y,
      p.radius * 6
    );

    glow.addColorStop(0, color + 'cc');
    glow.addColorStop(1, 'transparent');

    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(p.position.x, p.position.y, p.radius * 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.position.x, p.position.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawUI() {
    const ctx = this.ctx;

    ctx.fillStyle = 'white';
    ctx.fillText(`Reactions: ${this.sim.reactions}`, 10, 20);
    ctx.fillText(`Temp: ${this.sim.temperature.toFixed(0)}`, 10, 40);
  }

  getStatusClass() {
    if (this.sim.meltdown) return 'danger';
    if (this.sim.temperature > 800) return 'danger';
    if (this.sim.temperature > 400) return 'warning';
    return 'stable';
  }

  getStatusText() {
    if (this.sim.meltdown) return '💥 MELTDOWN';
    if (this.sim.temperature > 800) return 'Critical';
    if (this.sim.temperature > 400) return 'Heating';
    return 'Stable';
  }

  setControl(value: number) {
    this.sim.controlLevel = value;
  }

  reset() {
    this.sim = NuclearReactorSystem.create();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}