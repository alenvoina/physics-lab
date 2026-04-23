import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Body, Vector, World } from '@physics-lab/engine';

@Component({
  selector: 'app-orbital',
  templateUrl: './orbital.component.html',
  styleUrls: ['./orbital.component.scss'],
  standalone: false
})
export class OrbitalComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  public world: World = new World();
  private sun!: Body;
  private stars: { x: number; y: number; r: number; opacity: number }[] = [];
  private animationId!: number;
  private resizeObserver!: ResizeObserver;

  planetsConfig = [
    { name: 'Меркурий', r: 60,  size: 3, color: '#9ca3af' },
    { name: 'Венера',   r: 90,  size: 5, color: '#fbbf24' },
    { name: 'Земля',    r: 130, size: 6, color: '#3b82f6' },
    { name: 'Марс',     r: 170, size: 5, color: '#ef4444' },
    { name: 'Юпитер',   r: 230, size: 10, color: '#f59e0b' },
    { name: 'Сатурн',   r: 290, size: 9, color: '#eab308' },
    { name: 'Уран',     r: 350, size: 7, color: '#67e8f9' },
    { name: 'Нептун',   r: 410, size: 7, color: '#6366f1' }
  ];

  private planets: { body: Body; config: any }[] = [];
  fps = 0;
  private lastTime = 0;

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d', { alpha: false })!;
    
    this.handleResize();
    
    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(this.canvas.nativeElement);

    this.setupSimulation();
    this.start();
  }

  private handleResize() {
    const canvas = this.canvas.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.generateStars(rect.width, rect.height);
    
    if (this.sun) {
      this.sun.position = new Vector(rect.width / 2, rect.height / 2);
    }
  }

  private generateStars(width: number, height: number) {
    this.stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2,
      opacity: Math.random()
    }));
  }

  setupSimulation() {
    const G = 1;
    const M = 25000;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    this.world = new World();
    this.world.friction = 1;

    this.sun = new Body({
      position: new Vector(cx, cy),
      mass: M,
      radius: 20
    });

    this.world.addBody(this.sun);
    this.planets = [];

    this.planetsConfig.forEach(cfg => {
      const responsiveR = window.innerWidth < 600 ? cfg.r * 0.7 : cfg.r;
      const v = Math.sqrt(G * M / responsiveR);

      const planet = new Body({
        position: new Vector(cx + responsiveR, cy),
        mass: 1,
        velocity: new Vector(0, v),
        radius: cfg.size
      });

      this.world.addBody(planet);
      this.planets.push({ body: planet, config: { ...cfg, r: responsiveR } });
    });
  }

  render(time: number) {
    const ctx = this.ctx;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const delta = time - this.lastTime;
    if (delta > 0) this.fps = Math.round(1000 / delta);
    this.lastTime = time;

    // 1. Очистка
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // 2. Звезды
    ctx.fillStyle = 'white';
    this.stars.forEach(star => {
      ctx.globalAlpha = star.opacity;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // 3. Физика
    this.world.step(0.015);
    const sx = this.sun.position.x;
    const sy = this.sun.position.y;

    // 4. Отрисовка ОРБИТ (теперь они не пропадут)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    this.planets.forEach(p => {
      ctx.beginPath();
      ctx.arc(sx, sy, p.config.r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // 5. Планеты и их кольца
    this.planets.forEach(p => {
      const b = p.body;
      
      // Кольца (рисуем под планетой)
      if (p.config.name === 'Сатурн' || p.config.name === 'Уран') {
        ctx.strokeStyle = p.config.name === 'Сатурн' ? 'rgba(214, 186, 120, 0.4)' : 'rgba(103, 232, 249, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(b.position.x, b.position.y, b.radius * 2.2, b.radius * 0.8, Math.PI / 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Планета
      ctx.fillStyle = p.config.color;
      ctx.beginPath();
      ctx.arc(b.position.x, b.position.y, b.radius, 0, Math.PI * 2);
      ctx.fill();

      // Свечение атмосферы
      const pGlow = ctx.createRadialGradient(b.position.x, b.position.y, 0, b.position.x, b.position.y, b.radius * 2);
      pGlow.addColorStop(0, p.config.color + '33');
      pGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = pGlow;
      ctx.beginPath();
      ctx.arc(b.position.x, b.position.y, b.radius * 2, 0, Math.PI * 2);
      ctx.fill();
    });

    // 6. Солнце (поверх орбит, но под HUD)
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 40);
    glow.addColorStop(0, '#fef9c3');
    glow.addColorStop(0.4, '#eab308');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(sx, sy, 40, 0, Math.PI * 2);
    ctx.fill();

    this.animationId = requestAnimationFrame((t) => this.render(t));
  }

  start() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.render(performance.now());
  }

  pause() {
    cancelAnimationFrame(this.animationId);
  }

  reset() {
    this.pause();
    this.setupSimulation();
    this.start();
  }

  ngOnDestroy() {
    this.pause();
    this.resizeObserver?.disconnect();
  }
}