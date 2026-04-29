import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { QuantumSuperposition } from '@physics-lab/engine';

@Component({
  selector: 'app-quantum-superposition',
  templateUrl: './quantum-superposition.component.html',
  styleUrls: ['./quantum-superposition.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class QuantumSuperpositionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasWrap', { static: true })
  canvasWrapRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  system = new QuantumSuperposition();

  animationId = 0;
  lastTime = 0;

  lastMeasurement: number | null = null;
  flashTime = 0;

  private resizeObserver!: ResizeObserver;
  width = 800;
  height = 600;

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d', { alpha: false })!;

    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      this.width = width;
      this.height = height;
      this.canvasRef.nativeElement.width = width;
      this.canvasRef.nativeElement.height = height;
    });
    this.resizeObserver.observe(this.canvasWrapRef.nativeElement);

    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop = (time: number) => {
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;

    this.system.step(dt * 2);
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  measure() {
    this.lastMeasurement = this.system.measure();
    this.flashTime = 1.0;
  }

  addState() {
    this.system.addState();
    this.lastMeasurement = null;
  }

  reset() {
    this.system.reset();
    this.lastMeasurement = null;
  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.4)';
    ctx.fillRect(0, 0, this.width, this.height);

    this.drawGrid();

    this.drawWave();
    this.drawStates();
    this.drawProbabilities();

    if (this.flashTime > 0) {
      ctx.fillStyle = `rgba(56, 189, 248, ${this.flashTime * 0.8})`;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.fillStyle = `rgba(255, 255, 255, ${this.flashTime})`;
      ctx.font = 'bold 40px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.fillText('WAVEFUNCTION COLLAPSED', this.width / 2, this.height / 2);

      this.flashTime -= 0.03;
      if (this.flashTime < 0) this.flashTime = 0;
    }
  }

  drawGrid() {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < this.width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, this.height);
      ctx.stroke();
    }
    for (let i = 0; i < this.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(this.width, i);
      ctx.stroke();
    }
  }

  drawStates() {
    const ctx = this.ctx;

    const cx = Math.max(120, this.width * 0.15);
    const cy = this.height * 0.35;
    const maxRadius = Math.min(80, this.height * 0.15);

    ctx.beginPath();
    ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.lineWidth = 1;
    ctx.stroke();

    this.system.states.forEach((s, i) => {
      if (s.amplitude < 0.01) return;

      const len = s.amplitude * maxRadius;
      const x = cx + Math.cos(s.phase) * len;
      const y = cy + Math.sin(s.phase) * len;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#facc15';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#facc15';
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px monospace';
      ctx.fillText(`|ψ${i}⟩`, x + 10, y + 5);
    });

    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  }

  drawWave() {
    const ctx = this.ctx;

    const startX = Math.max(250, this.width * 0.35);
    const waveBaseY = this.height * 0.35;

    ctx.beginPath();
    ctx.moveTo(startX, waveBaseY);
    ctx.lineTo(this.width, waveBaseY);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    for (let x = startX; x < this.width; x++) {
      const waveVal = this.system.getWavePoint((x - startX) * 0.03);

      const scaleY = 70;
      const y = waveBaseY - waveVal * scaleY;

      if (x === startX) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#38bdf8';
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  drawProbabilities() {
    const ctx = this.ctx;
    const probs = this.system.getProbabilities();

    const baseY = this.height * 0.9;
    const maxBarHeight = this.height * 0.25;

    const totalBars = probs.length;
    const barWidth = Math.min(40, (this.width - 100) / totalBars - 10);
    const startX = (this.width - totalBars * (barWidth + 10)) / 2;

    probs.forEach((p, i) => {
      const x = startX + i * (barWidth + 10);
      const h = p * maxBarHeight;

      const displayH = Math.max(h, 2);

      const grad = ctx.createLinearGradient(0, baseY - displayH, 0, baseY);
      grad.addColorStop(0, p > 0.01 ? '#22c55e' : '#64748b');
      grad.addColorStop(1, 'rgba(34, 197, 94, 0.1)');

      ctx.fillStyle = grad;
      ctx.fillRect(x, baseY - displayH, barWidth, displayH);

      ctx.strokeStyle = p > 0.01 ? '#22c55e' : '#334155';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, baseY - displayH, barWidth, displayH);

      ctx.fillStyle = p > 0.01 ? '#fff' : '#64748b';
      ctx.font = '12px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.fillText(
        `${(p * 100).toFixed(0)}%`,
        x + barWidth / 2,
        baseY - displayH - 8,
      );

      ctx.fillStyle = '#94a3b8';
      ctx.fillText(`|${i}⟩`, x + barWidth / 2, baseY + 15);
    });
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
