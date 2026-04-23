import { CommonModule } from '@angular/common';
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
  imports: [CommonModule]
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

  drawWaveFunction() {
  const ctx = this.ctx;

  ctx.beginPath();

  for (let x = 0; x < 900; x++) {
    const y = this.sim.getWave(x) * 60;

    if (x === 0) ctx.moveTo(x, 200 + y);
    else ctx.lineTo(x, 200 + y);
  }

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();
}

drawProbabilityCloud() {
  const ctx = this.ctx;

  for (let x = 0; x < 900; x += 2) {
    const amp = this.sim.getWave(x);
    const prob = amp * amp;

    const alpha = Math.min(prob, 1);

    ctx.fillStyle = `rgba(56,189,248,${alpha * 0.3})`;

    ctx.fillRect(x, 150, 2, 100);
  }
}

  update() {
    this.sim.step(0.02);
  }

draw() {
  const ctx = this.ctx;

  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, 900, 400);

  this.drawBarrier();
  this.drawWaveFunction();
  this.drawProbabilityCloud();
  this.drawUI();
}

drawBarrier() {
  const ctx = this.ctx;

  const h = this.sim.barrierHeight * 120;

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, '#ef4444');
  gradient.addColorStop(1, '#7f1d1d');

  ctx.fillStyle = gradient;

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

  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, 300, 90);

  ctx.fillStyle = 'white';
  ctx.font = '14px monospace';

  ctx.fillText(`Energy: ${this.sim.energy.toFixed(2)}`, 10, 20);
  ctx.fillText(`Barrier: ${this.sim.barrierHeight.toFixed(2)}`, 10, 40);

  const p = this.sim.getTunnelProbability();
  ctx.fillText(`Probability: ${p.toFixed(2)}`, 10, 60);

  ctx.fillStyle = '#94a3b8';
  ctx.fillText(`Wave behavior visible`, 10, 80);
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