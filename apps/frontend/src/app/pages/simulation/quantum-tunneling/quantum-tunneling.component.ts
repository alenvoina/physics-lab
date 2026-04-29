import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { QuantumTunneling } from '@physics-lab/engine';


@Component({
  selector: 'app-quantum-tunneling',
  templateUrl: './quantum-tunneling.component.html',
  styleUrls: ['./quantum-tunneling.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class QuantumTunnelingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasWrap', { static: true })
  canvasWrapRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  sim = new QuantumTunneling();

  animationId = 0;
  lastTime = 0;

  width = 800;
  height = 400;
  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d', { alpha: false })!;

    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      this.width = width;
      this.height = height;
      this.canvasRef.nativeElement.width = width;
      this.canvasRef.nativeElement.height = height;

      this.sim.barrierX = (width - this.sim.barrierWidth) / 2;
    });
    this.resizeObserver.observe(this.canvasWrapRef.nativeElement);

    this.sim.reset();
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop = (time: number) => {
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    this.sim.step(dt);
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  setEnergy(e: string) {
    this.sim.setEnergy(parseFloat(e));
  }
  setBarrier(h: string) {
    this.sim.setBarrier(parseFloat(h));
  }
  reset() {
    this.sim.reset();
  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.5)';
    ctx.fillRect(0, 0, this.width, this.height);

    this.drawGrid();
    this.drawBarrier();
    this.drawProbabilityCloud();
    this.drawWaveFunction();
  }

  drawGrid() {
    const ctx = this.ctx;
    const centerY = this.height / 2;

    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(this.width, centerY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  drawBarrier() {
    const ctx = this.ctx;
    const centerY = this.height / 2;
    const h = (this.sim.barrierHeight / 2) * (this.height * 0.4);

    const isOvercome = this.sim.energy >= this.sim.barrierHeight;

    const color1 = isOvercome
      ? 'rgba(34, 197, 94, 0.4)'
      : 'rgba(239, 68, 68, 0.5)';
    const color2 = isOvercome
      ? 'rgba(34, 197, 94, 0.1)'
      : 'rgba(239, 68, 68, 0.1)';
    const borderColor = isOvercome ? '#22c55e' : '#ef4444';

    const gradient = ctx.createLinearGradient(0, centerY - h, 0, centerY + h);
    gradient.addColorStop(0, color2);
    gradient.addColorStop(0.5, color1);
    gradient.addColorStop(1, color2);

    ctx.fillStyle = gradient;
    ctx.fillRect(this.sim.barrierX, centerY - h, this.sim.barrierWidth, h * 2);

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(
      this.sim.barrierX,
      centerY - h,
      this.sim.barrierWidth,
      h * 2,
    );

    ctx.shadowBlur = 15;
    ctx.shadowColor = borderColor;
    ctx.strokeRect(
      this.sim.barrierX,
      centerY - h,
      this.sim.barrierWidth,
      h * 2,
    );
    ctx.shadowBlur = 0;
  }

  drawWaveFunction() {
    const ctx = this.ctx;
    const centerY = this.height / 2;
    const maxAmp = this.height * 0.25;

    ctx.beginPath();
    for (let x = 0; x < this.width; x += 2) {
      const y = this.sim.getWave(x) * maxAmp;

      if (x === 0) ctx.moveTo(x, centerY - y);
      else ctx.lineTo(x, centerY - y);
    }

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#38bdf8';
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  drawProbabilityCloud() {
    const ctx = this.ctx;
    const centerY = this.height / 2;
    const maxAmp = this.height * 0.25;

    for (let x = 0; x < this.width; x += 3) {
      const amp = this.sim.getWave(x);
      const prob = amp * amp;

      const alpha = Math.min(prob, 1);
      const cloudHeight = maxAmp * 1.5;

      ctx.fillStyle = `rgba(56, 189, 248, ${alpha * 0.15})`;
      ctx.fillRect(x, centerY - cloudHeight / 2, 3, cloudHeight);
    }
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
