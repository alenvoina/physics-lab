import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NuclearStabilitySystem, Nucleus } from '@physics-lab/engine';

@Component({
  selector: 'app-nuclear-stability',
  templateUrl: './nuclear-stability.component.html',
  styleUrls: ['./nuclear-stability.component.scss'],
  imports: [FormsModule]
})
export class NuclearStabilityComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  sim = NuclearStabilitySystem.createIsotopes();

  animationId = 0;
  speed = 1;

  mouse = { x: 0, y: 0 };
  hovered?: Nucleus;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    canvas.width = 900;
    canvas.height = 600;

    this.loop();
  }

  loop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  update() {
    this.sim.step(0.5 * this.speed);
  }

  onMouseMove(e: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 900, 600);

    this.hovered = undefined;

    this.sim.nuclei.forEach(n => {
      const dx = n.position.x - this.mouse.x;
      const dy = n.position.y - this.mouse.y;

      if (Math.sqrt(dx * dx + dy * dy) < n.radius) {
        this.hovered = n;
      }

      this.drawNucleus(n);
    });

    if (this.hovered) {
      this.drawTooltip(this.hovered);
    }
  }

  drawNucleus(n: Nucleus) {
    const ctx = this.ctx;

    const r = Math.floor(255 * (1 - n.stability));
    const g = Math.floor(255 * n.stability);

    ctx.beginPath();
    ctx.arc(n.position.x, n.position.y, n.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgb(${r}, ${g}, 100)`;
    ctx.fill();

    if (n.flash > 0) {
      ctx.beginPath();
      ctx.arc(n.position.x, n.position.y, n.radius + 10 * n.flash, 0, Math.PI * 2);
      ctx.strokeStyle = '#fbbf24';
      ctx.stroke();

      n.flash *= 0.85;
    }
  }

  drawTooltip(n: Nucleus) {
    const ctx = this.ctx;

    ctx.fillStyle = '#000';
    ctx.fillRect(this.mouse.x + 10, this.mouse.y + 10, 140, 70);

    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';

    ctx.fillText(`p: ${n.protons}`, this.mouse.x + 15, this.mouse.y + 25);
    ctx.fillText(`n: ${n.neutrons}`, this.mouse.x + 15, this.mouse.y + 40);
    ctx.fillText(`E: ${n.energy.toFixed(2)}`, this.mouse.x + 15, this.mouse.y + 55);
    ctx.fillText(`S: ${n.stability.toFixed(2)}`, this.mouse.x + 15, this.mouse.y + 70);
  }

  reset() {
    this.sim = NuclearStabilitySystem.createIsotopes();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}