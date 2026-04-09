import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import {DecimalPipe, CommonModule} from '@angular/common'

import { GravitySystem, Body, Vector } from '@physics-lab/engine';

@Component({
  selector: 'app-gravity-system',
  templateUrl: './gravity-system.component.html',
  styleUrls: ['./gravity-system.component.scss'],
  imports: [DecimalPipe, CommonModule]
})
export class GravitySimComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  sim!: GravitySystem;
  kinetic = 0;
  potential = 0;
  total = 0;

  animationId = 0;
  trails: Map<Body, Vector[]> = new Map();

  mode: 'orbit' | 'galaxy' | 'chaos' = 'orbit';

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    canvas.width = 900;
    canvas.height = 600;

    this.setMode(this.mode);

    this.loop();
  }

  setMode(mode: 'orbit' | 'galaxy' | 'chaos') {
    this.mode = mode;

    if (mode === 'orbit') {
      this.sim = GravitySystem.createOrbitSystem();
    }

    if (mode === 'galaxy') {
      this.sim = GravitySystem.createGalaxy();
    }

    if (mode === 'chaos') {
      this.sim = GravitySystem.createChaosSystem();
    }

    this.trails.clear();
  }

  loop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

 update() {
  this.sim.step(0.01);

  this.kinetic = this.sim.getKineticEnergy();
  this.potential = this.sim.getPotentialEnergy();
  this.total = this.sim.getTotalEnergy();

  this.sim.world.bodies.forEach(b => {
    if (!this.trails.has(b)) this.trails.set(b, []);

    const trail = this.trails.get(b)!;
    trail.push(new Vector(b.position.x, b.position.y));

    if (trail.length > 80) trail.shift();
  });
}

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 900, 600);

    this.sim.world.bodies.forEach(b => {
      this.drawTrail(b);
      this.drawBody(b);
    });

    this.drawUI();
  }

  drawBody(b: Body) {
  const ctx = this.ctx;

  ctx.beginPath();
  ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2);

  if (b.mass > 100) {
    const gradient = ctx.createRadialGradient(
      b.position.x, b.position.y, 0,
      b.position.x, b.position.y, b.radius * 2
    );
    gradient.addColorStop(0, '#facc15');
    gradient.addColorStop(1, '#f97316');

    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = '#38bdf8';
  }

  ctx.fill();
}

  drawTrail(b: Body) {
    const ctx = this.ctx;
    const trail = this.trails.get(b);
    if (!trail) return;

    ctx.beginPath();
    ctx.moveTo(trail[0].x, trail[0].y);

    for (let p of trail) {
      ctx.lineTo(p.x, p.y);
    }

    ctx.strokeStyle = 'rgba(56,189,248,0.2)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawUI() {
    const ctx = this.ctx;

    ctx.fillStyle = 'white';
    ctx.font = '14px monospace';

    ctx.fillText(`Mode: ${this.mode}`, 10, 20);

    const k = this.sim.getKineticEnergy().toFixed(1);
    const p = this.sim.getPotentialEnergy().toFixed(1);
    const t = this.sim.getTotalEnergy().toFixed(1);

    ctx.fillText(`Kinetic: ${k}`, 10, 40);
    ctx.fillText(`Potential: ${p}`, 10, 60);
    ctx.fillText(`Total: ${t}`, 10, 80);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}