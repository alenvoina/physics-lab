import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { NuclearStabilitySystem, Nucleus } from '@physics-lab/engine';

@Component({
  selector: 'app-nuclear-stability',
  templateUrl: './nuclear-stability.component.html',
  styleUrls: ['./nuclear-stability.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class NuclearStabilityComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasWrap', { static: true }) canvasWrapRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;

  sim = NuclearStabilitySystem.createIsotopes(800, 600);

  animationId = 0;
  speed = 1;
  lastTime = 0;

  mouse = { x: -1000, y: -1000 };
  hovered?: Nucleus;

  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d', { alpha: false })!;

    this.resizeObserver = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;

      this.canvasRef.nativeElement.width = width;
      this.canvasRef.nativeElement.height = height;

      this.sim.setBounds(width, height);
    });

    this.resizeObserver.observe(this.canvasWrapRef.nativeElement);

    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  setSpeed(val: string) {
    this.speed = parseFloat(val);
  }

  onMouseMove(e: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();

    const scaleX = this.canvasRef.nativeElement.width / rect.width;
    const scaleY = this.canvasRef.nativeElement.height / rect.height;

    this.mouse.x = (e.clientX - rect.left) * scaleX;
    this.mouse.y = (e.clientY - rect.top) * scaleY;
  }

  onMouseLeave() {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
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

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, this.sim.width, this.sim.height);

    this.hovered = undefined;

    this.sim.nuclei.forEach(n => {
      const dx = n.position.x - this.mouse.x;
      const dy = n.position.y - this.mouse.y;

      if (Math.sqrt(dx * dx + dy * dy) < n.radius + 5) {
        this.hovered = n;
      }

      this.drawNucleus(n);
    });

    if (this.hovered) this.drawTooltip(this.hovered);
  }

  drawNucleus(n: Nucleus) {
    const ctx = this.ctx;

    const r = n.stability > 0.5 ? Math.floor(255 * (1 - n.stability) * 2) : 255;
    const g = n.stability < 0.5 ? Math.floor(255 * n.stability * 2) : 200;

    const isHovered = this.hovered === n;

    ctx.beginPath();
    ctx.arc(n.position.x, n.position.y, n.radius * (isHovered ? 4 : 2.5), 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r}, ${g}, 50, ${isHovered ? 0.4 : 0.15})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(n.position.x, n.position.y, n.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${r}, ${g}, 50)`;
    ctx.fill();

    if (n.flash > 0.01) {
      ctx.beginPath();
      ctx.arc(n.position.x, n.position.y, n.radius + (1 - n.flash) * 30, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56, 189, 248, ${n.flash})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  drawTooltip(n: Nucleus) {
    const ctx = this.ctx;

    const tx = this.mouse.x + 15;
    const ty = this.mouse.y + 15;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(tx, ty, 150, 70);

    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';

    ctx.fillText(`Z: ${n.protons}`, tx + 10, ty + 20);
    ctx.fillText(`N: ${n.neutrons}`, tx + 10, ty + 35);
    ctx.fillText(`Stability: ${(n.stability * 100).toFixed(0)}%`, tx + 10, ty + 50);
  }

  reset() {
    this.sim.reset();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    this.resizeObserver.disconnect();
  }
}