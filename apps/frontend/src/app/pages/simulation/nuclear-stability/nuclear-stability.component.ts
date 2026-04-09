import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy
} from '@angular/core';

import { NuclearStabilitySystem, Nucleus } from '@physics-lab/engine';

@Component({
  selector: 'app-nuclear-stability',
  templateUrl: './nuclear-stability.component.html',
  styleUrls: ['./nuclear-stability.component.scss']
})
export class NuclearStabilityComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  sim = NuclearStabilitySystem.createIsotopes();

  animationId = 0;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    canvas.width = 900;
    canvas.height = 600;

    this.loop();
  }

  loop = () => {
    this.sim.step();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 900, 600);

    this.sim.nuclei.forEach(n => this.drawNucleus(n));
  }

  drawNucleus(n: Nucleus) {
    const ctx = this.ctx;

    const stabilityColor = `rgba(${255 * (1 - n.stability)}, ${255 * n.stability}, 100, 1)`;

    ctx.beginPath();
    ctx.arc(n.position.x, n.position.y, n.radius, 0, Math.PI * 2);
    ctx.fillStyle = stabilityColor;
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';

    ctx.fillText(
      `p:${n.protons} n:${n.neutrons}`,
      n.position.x - 25,
      n.position.y + 4
    );

    ctx.fillText(
      `E:${n.energy.toFixed(1)}`,
      n.position.x - 25,
      n.position.y + 18
    );
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}