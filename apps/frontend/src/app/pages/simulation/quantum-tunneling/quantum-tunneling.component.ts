import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { QuantumTunneling } from '@physics-lab/engine';

@Component({
  selector: 'app-quantum-tunneling',
  templateUrl: './quantum-tunneling.component.html',
  styleUrls: ['./quantum-tunneling.component.scss'],
})
export class QuantumTunnelingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  sim = new QuantumTunneling();

  animationId = 0;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;

    canvas.width = 900;
    canvas.height = 400;

    this.ctx = canvas.getContext('2d')!;
    this.sim.reset();

    this.loop();
  }

  loop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  update() {
    this.sim.step(0.02);
  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 900, 400);

    this.drawBarrier();
    this.drawParticle();
    this.drawUI();
  }

  drawBarrier() {
    const ctx = this.ctx;

    const h = this.sim.barrierHeight * 150;

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(
      this.sim.barrierX,
      200 - h,
      this.sim.barrierWidth,
      h * 2
    );
  }

  drawParticle() {
    const ctx = this.ctx;

    ctx.beginPath();
    ctx.arc(this.sim.x, 200, 8, 0, Math.PI * 2);

    ctx.fillStyle = '#38bdf8';
    ctx.fill();
  }

  drawUI() {
    const ctx = this.ctx;

    ctx.fillStyle = 'white';
    ctx.font = '14px monospace';

    ctx.fillText(`Energy: ${this.sim.energy.toFixed(2)}`, 10, 20);
    ctx.fillText(`Barrier: ${this.sim.barrierHeight.toFixed(2)}`, 10, 40);
    ctx.fillText(
      `Probability: ${this.sim.getTunnelProbability().toFixed(2)}`,
      10,
      60
    );

    if (this.sim.passed) {
      ctx.fillStyle = '#22c55e';
      ctx.fillText('Tunneled ✔', 10, 90);
    }

    if (this.sim.reflected) {
      ctx.fillStyle = '#f87171';
      ctx.fillText('Reflected ✖', 10, 90);
    }
  }

  reset() {
    this.sim.reset();
  }

  setEnergy(e: number) {
    this.sim.setEnergy(e);
  }

  setBarrier(h: number) {
    this.sim.setBarrier(h, this.sim.barrierWidth);
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}