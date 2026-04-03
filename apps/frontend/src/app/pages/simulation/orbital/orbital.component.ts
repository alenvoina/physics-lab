import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Body, Vector, World } from '@physics-lab/engine';

@Component({
  selector: 'app-orbital',
  templateUrl: './orbital.component.html',
  styleUrls: ['./orbital.component.scss'],
  standalone: false
})
export class OrbitalComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  public world!: World;
  private sun!: Body;
  private planet!: Body;
  private stars: { x: number; y: number; r: number }[] = [];

  private animationId!: number;

  planetsConfig = [
  { name: 'Mercury', r: 60, size: 3, color: '#9ca3af' },
  { name: 'Venus',   r: 90, size: 5, color: '#fbbf24' },
  { name: 'Earth',   r: 120, size: 6, color: '#3b82f6' },
  { name: 'Mars',    r: 150, size: 5, color: '#ef4444' },
  { name: 'Jupiter', r: 210, size: 10, color: '#f59e0b' },
  { name: 'Saturn',  r: 270, size: 9, color: '#eab308' },
  { name: 'Uranus',  r: 320, size: 7, color: '#67e8f9' },
  { name: 'Neptune', r: 360, size: 7, color: '#6366f1' }
];

private planets: { body: Body; config: any }[] = [];

  fps = 0;
  private lastTime = 0;

  ngOnInit() {
    const canvasEl = this.canvas.nativeElement;

    canvasEl.width = canvasEl.offsetWidth;
    canvasEl.height = canvasEl.offsetHeight;
    for (let i = 0; i < 150; i++) {
  this.stars.push({
    x: Math.random() * this.canvas.nativeElement.width,
    y: Math.random() * this.canvas.nativeElement.height,
    r: Math.random() * 1.5
  });
}

    this.ctx = canvasEl.getContext('2d')!;

    this.setupSimulation();
    this.render(0);
  }

setupSimulation() {
  const G = 1;
  const M = 20000;

  const canvas = this.canvas.nativeElement;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  this.world = new World();
  this.world.friction = 1;

  this.sun = new Body({
    position: new Vector(cx, cy),
    mass: M,
    radius: 18
  });

  this.world.addBody(this.sun);

  this.planets = [];

  this.planetsConfig.forEach(cfg => {
    const v = Math.sqrt(G * M / cfg.r);

    const planet = new Body({
      position: new Vector(cx + cfg.r, cy),
      mass: 1,
      velocity: new Vector(0, v),
      radius: cfg.size
    });

    this.world.addBody(planet);
    this.planets.push({ body: planet, config: cfg });
  });
}

render(time: number) {
  const ctx = this.ctx;
  const canvas = this.canvas.nativeElement;

  if (this.lastTime) {
    const delta = time - this.lastTime;
    this.fps = Math.round(1000 / delta);
  }
  this.lastTime = time;

  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'white';
  this.stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });

  this.world.step(0.01);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;

  this.planets.forEach(p => {
    ctx.beginPath();
    ctx.arc(
      this.sun.position.x,
      this.sun.position.y,
      p.config.r,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  });

  const sx = this.sun.position.x;
  const sy = this.sun.position.y;

  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, this.sun.radius * 6);
  glow.addColorStop(0, '#fff7ed');
  glow.addColorStop(0.3, '#facc15');
  glow.addColorStop(1, 'rgba(250,204,21,0)');

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(sx, sy, this.sun.radius * 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(sx, sy, this.sun.radius, 0, Math.PI * 2);
  ctx.fill();

  this.planets.forEach(p => {
    const b = p.body;
    const color = p.config.color;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2);
    ctx.fill();

    const atm = ctx.createRadialGradient(
      b.position.x,
      b.position.y,
      0,
      b.position.x,
      b.position.y,
      b.radius * 2
    );

    atm.addColorStop(0, color + '88');
    atm.addColorStop(1, 'transparent');

    ctx.fillStyle = atm;
    ctx.beginPath();
    ctx.arc(b.position.x, b.position.y, b.radius * 2, 0, Math.PI * 2);
    ctx.fill();

    if (p.config.name === 'Saturn') {
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.ellipse(
        b.position.x,
        b.position.y,
        b.radius * 2.2,
        b.radius * 0.9,
        0,
        0,
        Math.PI * 2
      );
      ctx.stroke();
    }
  });

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '14px monospace';
  ctx.fillText(`FPS: ${this.fps}`, 10, 20);

  this.animationId = requestAnimationFrame((t) => this.render(t));
}

  start() {
    this.render(0);
  }

  pause() {
    cancelAnimationFrame(this.animationId);
  }

  reset() {
    cancelAnimationFrame(this.animationId);
    this.setupSimulation();
    this.render(0);
  }
}