import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { Body, Vector, World } from '@physics-lab/engine';

interface PlanetVisual {
  body: Body;
  name: string;
  color: string;
  hasRing?: boolean;
  trail: Vector[];
  orbitRadius: number;
}

@Component({
  selector: 'app-orbital',
  templateUrl: './orbital.component.html',
  styleUrls: ['./orbital.component.scss'],
  standalone: false,
})
export class OrbitalComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  public world = new World();
  public fps = 0;

  private planets: PlanetVisual[] = [];
  private stars: {
    x: number;
    y: number;
    r: number;
    alpha: number;
    speed: number;
  }[] = [];
  private sun!: Body;

  private animationId!: number;
  private isRunning = false;
  private lastTime = 0;

  planetsConfig = [
    { name: 'Меркурий', distance: 70, size: 3, color: '#a3a3a3' },
    { name: 'Венера', distance: 110, size: 4.5, color: '#fbbf24' },
    { name: 'Земля', distance: 160, size: 5, color: '#3b82f6' },
    { name: 'Марс', distance: 210, size: 4.5, color: '#ef4444' },
    {
      name: 'Юпитер',
      distance: 300,
      size: 12,
      color: '#f59e0b',
      hasRing: true,
    },
    {
      name: 'Сатурн',
      distance: 400,
      size: 10,
      color: '#eab308',
      hasRing: true,
    },
    { name: 'Уран', distance: 480, size: 7, color: '#2dd4bf', hasRing: true },
    { name: 'Нептун', distance: 550, size: 7, color: '#6366f1' },
  ];

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d', { alpha: false })!;
    this.handleResize();
    this.setupSimulation();
    this.start();
  }

  @HostListener('window:resize')
  handleResize() {
    const canvas = this.canvas.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement!.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.stars = Array.from({ length: 300 }, () => ({
      x: (Math.random() - 0.5) * rect.width * 2,
      y: (Math.random() - 0.5) * rect.height * 2,
      r: Math.random() * 1.5,
      alpha: Math.random(),
      speed: 0.01 + Math.random() * 0.03,
    }));
  }

  setupSimulation() {
    this.world = new World();
    this.planets = [];

    const sunMass = 10000;
    const G = 1;

    this.sun = new Body({
      position: new Vector(0, 0),
      mass: sunMass,
      radius: 24,
    });
    this.sun.isStatic = true;
    this.world.addBody(this.sun);

    const minDimension = Math.min(window.innerWidth, window.innerHeight);

    const scale = minDimension < 1200 ? (minDimension * 0.45) / 550 : 1;

    this.planetsConfig.forEach((cfg) => {
      const r = cfg.distance * scale;
      const planetSize = minDimension < 600 ? cfg.size * 0.7 : cfg.size;
      const velocity = Math.sqrt((G * sunMass) / r);

      const planetBody = new Body({
        position: new Vector(r, 0),
        velocity: new Vector(0, velocity),
        mass: 1,
        radius: planetSize,
      });

      this.world.addBody(planetBody);
      this.planets.push({
        body: planetBody,
        name: cfg.name,
        color: cfg.color,
        hasRing: cfg.hasRing,
        trail: [],
        orbitRadius: r,
      });
    });
  }

  render(time: number) {
    if (!this.isRunning) return;

    const delta = time - this.lastTime;
    if (delta > 0) this.fps = Math.round(1000 / delta);
    this.lastTime = time;

    const canvas = this.canvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const ctx = this.ctx;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.save();
    ctx.translate(cx, cy);

    this.drawStars(ctx);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    this.planets.forEach((p) => {
      ctx.beginPath();
      ctx.arc(0, 0, p.orbitRadius, 0, Math.PI * 2);
      ctx.stroke();
    });

    this.world.step(0.016);

    this.planets.forEach((p) => {
      this.updateAndDrawTrail(ctx, p);
      this.drawPlanet(ctx, p);
    });

    this.drawSun(ctx);
    ctx.restore();

    this.animationId = requestAnimationFrame((t) => this.render(t));
  }

  private drawStars(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = 'white';
    this.stars.forEach((star) => {
      star.alpha += star.speed;
      const currentAlpha = Math.abs(Math.sin(star.alpha)) * 0.8 + 0.2;
      ctx.globalAlpha = currentAlpha;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  private updateAndDrawTrail(ctx: CanvasRenderingContext2D, p: PlanetVisual) {
    const pos = p.body.position;

    if (Math.random() > 0.4) {
      p.trail.push(new Vector(pos.x, pos.y));
      if (p.trail.length > 70) p.trail.shift();
    }

    if (p.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(p.trail[0].x, p.trail[0].y);
      for (let i = 1; i < p.trail.length; i++) {
        ctx.lineTo(p.trail[i].x, p.trail[i].y);
      }
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  private drawPlanet(ctx: CanvasRenderingContext2D, p: PlanetVisual) {
    const b = p.body;

    if (p.hasRing) {
      ctx.save();
      ctx.translate(b.position.x, b.position.y);

      ctx.rotate(Math.PI / 4);

      ctx.beginPath();
      ctx.ellipse(0, 0, b.radius * 2.6, b.radius * 0.5, 0, 0, Math.PI * 2);

      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.name === 'Сатурн' ? 4 : 2;
      ctx.globalAlpha = 0.7;
      ctx.stroke();

      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.15;
      ctx.fill();

      ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowColor = p.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  private drawSun(ctx: CanvasRenderingContext2D) {
    const r = this.sun.radius;

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#fb923c';
    ctx.shadowBlur = 60;
    ctx.fill();
    ctx.shadowBlur = 0;

    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(0.3, '#fef08a');
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.render(this.lastTime);
  }

  pause() {
    this.isRunning = false;
    cancelAnimationFrame(this.animationId);
  }

  reset() {
    this.pause();
    this.setupSimulation();
    this.start();
  }

  ngOnDestroy() {
    this.pause();
  }
}
