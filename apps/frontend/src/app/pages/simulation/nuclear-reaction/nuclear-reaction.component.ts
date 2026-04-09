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
  styleUrls: ['./nuclear-reaction.component.scss']
})
export class NuclearReactorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  sim = NuclearReactorSystem.create();

  animationId = 0;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = 900;
    canvas.height = 600;

    this.loop();
  }

  loop = () => {
    this.sim.step(0.5);
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  draw() {
    const ctx = this.ctx;

    const heat = Math.min(this.sim.temperature / 1000, 1);

    ctx.fillStyle = `rgba(2,6,23,${0.3 - heat * 0.2})`;
    ctx.fillRect(0, 0, 900, 600);

    this.sim.particles.forEach(p => this.drawParticle(p));

    this.drawUI();
  }

  drawParticle(p: Particle) {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(p.position.x, p.position.y, p.radius, 0, Math.PI * 2);

    if (p.type === 'nucleus') {
      ctx.fillStyle = '#facc15';
    } else {
      ctx.fillStyle = '#38bdf8';
    }

    ctx.fill();
  }

  drawUI() {
    const ctx = this.ctx;

    ctx.fillStyle = 'white';
    ctx.font = '14px monospace';

    ctx.fillText(`Reactions: ${this.sim.reactions}`, 10, 20);
    ctx.fillText(`Energy: ${this.sim.energy}`, 10, 40);
    ctx.fillText(`Temp: ${this.sim.temperature.toFixed(0)}`, 10, 60);

    if (this.sim.meltdown) {
      ctx.fillStyle = '#ef4444';
      ctx.font = '28px monospace';
      ctx.fillText('MELTDOWN', 350, 300);
    }
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