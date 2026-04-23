import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pendulum } from '@physics-lab/engine';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pendulum',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './pendulum.component.html',
  styleUrls: ['./pendulum.component.scss']
})
export class PendulumComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graphCanvas', { static: true }) graphCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('graphWrapper', { static: true }) graphWrapper!: ElementRef<HTMLDivElement>;

  private ctx!: CanvasRenderingContext2D;
  private gCtx!: CanvasRenderingContext2D;
  private pendulum!: Pendulum;
  private animationId: number = 0;
  private resizeObserver!: ResizeObserver;

  mode: 'earth' | 'moon' = 'earth';
  kineticHistory: number[] = [];
  potentialHistory: number[] = [];
  maxPoints = 150;

  amplitude = 0;
  energy = 0;
  length = 220;
  timeScale = 1;
  isDragging = false;
  private origin = { x: 0, y: 40 };

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d', { alpha: false })!;
    this.gCtx = this.graphCanvas.nativeElement.getContext('2d')!;

    this.pendulum = new Pendulum({
      angle: Math.PI / 4,
      length: this.length,
      gravity: 9.81
    });

    // Следим за изменениями размера обоих контейнеров
    this.resizeObserver = new ResizeObserver(() => this.onResize());
    this.resizeObserver.observe(this.canvas.nativeElement);
    this.resizeObserver.observe(this.graphWrapper.nativeElement);

    this.initEvents();
    this.render(0);
  }

  private onResize() {
    const dpr = window.devicePixelRatio || 1;
    
    // Ресайз основного канваса
    const mainRect = this.canvas.nativeElement.getBoundingClientRect();
    this.canvas.nativeElement.width = mainRect.width * dpr;
    this.canvas.nativeElement.height = mainRect.height * dpr;
    this.origin.x = mainRect.width / 2;

    // Ресайз графического канваса
    const graphRect = this.graphWrapper.nativeElement.getBoundingClientRect();
    this.graphCanvas.nativeElement.width = graphRect.width * dpr;
    this.graphCanvas.nativeElement.height = graphRect.height * dpr;
  }

  render(time: number) {
    const dpr = window.devicePixelRatio || 1;
    const ctx = this.ctx;
    const w = this.canvas.nativeElement.clientWidth;
    const h = this.canvas.nativeElement.clientHeight;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    // Сетка
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 50) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }

    if (!this.isDragging) {
      this.pendulum.step(0.016 * this.timeScale, time);
    }

    const x = this.origin.x + this.pendulum.length * Math.sin(this.pendulum.angle);
    const y = this.origin.y + this.pendulum.length * Math.cos(this.pendulum.angle);

    // Отрисовка нити и груза
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(this.origin.x, this.origin.y); ctx.lineTo(x, y); ctx.stroke();

    const grad = ctx.createRadialGradient(x - 4, y - 4, 2, x, y, 20);
    grad.addColorStop(0, '#60a5fa');
    grad.addColorStop(1, '#2563eb');
    ctx.fillStyle = grad;
    ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(37, 99, 235, 0.2)';
    ctx.beginPath(); ctx.arc(x, y, 18, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    this.updateData();
    this.drawEnergyGraph();

    ctx.restore();
    this.animationId = requestAnimationFrame((t) => this.render(t));
  }

  private updateData() {
    this.amplitude = Math.abs(this.pendulum.angle * 180 / Math.PI);
    this.energy = this.pendulum.energy;

    this.kineticHistory.push(this.pendulum.kineticEnergy);
    this.potentialHistory.push(this.pendulum.potentialEnergy);
    if (this.kineticHistory.length > this.maxPoints) {
      this.kineticHistory.shift();
      this.potentialHistory.shift();
    }
  }

  private drawEnergyGraph() {
    const ctx = this.gCtx;
    const canvas = this.graphCanvas.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const drawLine = (data: number[], color: string) => {
      if (data.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      const max = Math.max(...this.kineticHistory, ...this.potentialHistory, 0.5);
      data.forEach((v, i) => {
        const px = (i / (this.maxPoints - 1)) * w;
        const py = h - (v / max) * h;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      });
      ctx.stroke();
    };

    drawLine(this.kineticHistory, '#10b981');
    drawLine(this.potentialHistory, '#f43f5e');
    ctx.restore();
  }

  // Вспомогательные методы
  private initEvents() {
    const canvas = this.canvas.nativeElement;
    const getPos = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onStart = () => this.isDragging = true;
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!this.isDragging) return;
      const pos = getPos(e);
      this.pendulum.angle = Math.atan2(pos.x - this.origin.x, pos.y - this.origin.y);
      this.pendulum.angularVelocity = 0;
      e.preventDefault();
    };

    canvas.addEventListener('mousedown', onStart);
    canvas.addEventListener('touchstart', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('mouseup', () => this.isDragging = false);
    window.addEventListener('touchend', () => this.isDragging = false);
  }

  setMode(mode: 'earth' | 'moon') {
    this.mode = mode;
    this.pendulum.gravity = mode === 'earth' ? 9.81 : 1.62;
    this.reset();
  }

  updateLength() { this.pendulum.length = this.length; }

  reset() {
    this.pendulum.reset(Math.PI / 4);
    this.kineticHistory = [];
    this.potentialHistory = [];
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    this.resizeObserver.disconnect();
  }
}