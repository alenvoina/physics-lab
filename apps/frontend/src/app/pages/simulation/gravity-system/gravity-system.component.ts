import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { DecimalPipe, CommonModule } from '@angular/common';
import { GravitySystem, Body, Vector } from '@physics-lab/engine';

@Component({
  selector: 'app-gravity-system',
  templateUrl: './gravity-system.component.html',
  styleUrls: ['./gravity-system.component.scss'],
  standalone: true,
  imports: [DecimalPipe, CommonModule],
})
export class GravitySimComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('container', { static: true })
  containerRef!: ElementRef<HTMLElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId: number = 0;
  private trails: Map<Body, Vector[]> = new Map();

  sim!: GravitySystem;
  kinetic = 0;
  potential = 0;
  total = 0;
  mode: 'orbit' | 'galaxy' | 'chaos' = 'orbit';

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d', { alpha: false })!;
    this.resize();
    this.setMode('orbit');
    this.loop();
  }

  @HostListener('window:resize')
  resize() {
    const canvas = this.canvasRef.nativeElement;
    const container = this.containerRef.nativeElement;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;
    this.ctx.scale(dpr, dpr);
  }

  setMode(mode: 'orbit' | 'galaxy' | 'chaos') {
    this.mode = mode;
    this.trails.clear();

    switch (mode) {
      case 'orbit':
        this.sim = GravitySystem.createOrbitSystem();
        break;
      case 'galaxy':
        this.sim = GravitySystem.createGalaxy();
        break;
      case 'chaos':
        this.sim = GravitySystem.createChaosSystem();
        break;
    }
  }

  private loop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  private update() {
    this.sim.step(0.01);

    this.kinetic = this.sim.getKineticEnergy();
    this.potential = this.sim.getPotentialEnergy();
    this.total = this.sim.getTotalEnergy();

    this.sim.world.bodies.forEach((b) => {
      if (!this.trails.has(b)) this.trails.set(b, []);
      const trail = this.trails.get(b)!;
      trail.push(new Vector(b.position.x, b.position.y));
      if (trail.length > 70) trail.shift();
    });
  }

  private draw() {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    const grad = this.ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width,
    );
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(1, '#020617');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, width, height);

    let comX = 0,
      comY = 0,
      totalMass = 0;
    this.sim.world.bodies.forEach((b) => {
      comX += b.position.x * b.mass;
      comY += b.position.y * b.mass;
      totalMass += b.mass;
    });

    if (totalMass > 0) {
      comX /= totalMass;
      comY /= totalMass;
    }

    this.ctx.save();

    this.ctx.translate(width / 2, height / 2);

    const minDim = Math.min(width, height);
    if (minDim < 800) {
      const scale = minDim / 800;
      this.ctx.scale(scale * 1.5, scale * 1.5);
    }

    this.ctx.translate(-comX, -comY);

    this.sim.world.bodies.forEach((b) => {
      this.drawTrail(b);
      this.drawBody(b);
    });

    this.ctx.restore();
  }

  private drawBody(b: Body) {
    const ctx = this.ctx;
    const isStar = b.mass > 100;

    ctx.save();
    ctx.beginPath();
    ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2);

    if (isStar) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#f97316';
      const g = ctx.createRadialGradient(
        b.position.x,
        b.position.y,
        0,
        b.position.x,
        b.position.y,
        b.radius,
      );
      g.addColorStop(0, '#fff');
      g.addColorStop(0.3, '#facc15');
      g.addColorStop(1, '#f97316');
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.shadowBlur = 5;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
    }

    ctx.fill();
    ctx.restore();
  }

  private drawTrail(b: Body) {
    const trail = this.trails.get(b);
    if (!trail || trail.length < 2) return;

    this.ctx.beginPath();
    this.ctx.lineWidth = 1.5;

    const color = b.mass > 100 ? '249, 115, 22' : '56, 189, 248';
    this.ctx.strokeStyle = `rgba(${color}, 0.2)`;

    this.ctx.moveTo(trail[0].x, trail[0].y);
    for (let i = 1; i < trail.length; i++) {
      this.ctx.lineTo(trail[i].x, trail[i].y);
    }
    this.ctx.stroke();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}
