import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pendulum } from '@physics-lab/engine';

@Component({
  selector: 'app-pendulum',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pendulum.component.html',
  styleUrls: ['./pendulum.component.scss']
})
export class PendulumComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private pendulum!: Pendulum;
  private animationId!: number;

  mode: 'earth' | 'moon' = 'earth';

  kineticHistory: number[] = [];
  potentialHistory: number[] = [];
  maxPoints = 200;

  amplitude = 0;
  period = 0;
  energy = 0;

  length = 220;
  timeScale = 1;
  isDragging = false;

  private origin = { x: 0, y: 120 };

  ngOnInit() {
    const canvas = this.canvas.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.origin.x = canvas.width / 2;

    this.ctx = canvas.getContext('2d')!;

    this.pendulum = new Pendulum({
      angle: Math.PI / 4,
      length: this.length,
      gravity: 9.81
    });

    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    canvas.addEventListener('mouseup', () => this.isDragging = false);
    canvas.addEventListener('mouseleave', () => this.isDragging = false);

    this.render(0);
  }

  setMode(mode: 'earth' | 'moon') {
    this.mode = mode;
    this.pendulum.gravity = mode === 'earth' ? 9.81 : 1.62;
    this.reset();
  }

  updateLength() {
    this.pendulum.length = this.length;
  }

  onMouseDown(_: MouseEvent) {
    this.isDragging = true;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.isDragging) return;

    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const mx = event.clientX - rect.left;
    const my = event.clientY - rect.top;

    const dx = mx - this.origin.x;
    const dy = my - this.origin.y;

    const angle = Math.atan2(dx, dy);
    this.pendulum.angle = angle;
    this.pendulum.angularVelocity = 0;
  }

  render(time: number) {
    const ctx = this.ctx;
    const canvas = this.canvas.nativeElement;
    this.origin.x = canvas.width / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.drawGrid(ctx, canvas);
    this.pendulum.step(0.016 * this.timeScale, time);

    const x = this.origin.x + this.pendulum.length * Math.sin(this.pendulum.angle);
    const y = this.origin.y + this.pendulum.length * Math.cos(this.pendulum.angle);

    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.origin.x, this.origin.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(this.origin.x, this.origin.y, 6, 0, Math.PI * 2);
    ctx.fill();

    const grad = ctx.createRadialGradient(x, y, 5, x, y, 30);
    grad.addColorStop(0, '#67e8f9');
    grad.addColorStop(1, '#0284c7');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, Math.PI * 2);
    ctx.fill();

    const k = this.pendulum.kineticEnergy;
    const p = this.pendulum.potentialEnergy;

    this.kineticHistory.push(k);
    this.potentialHistory.push(p);

    if (this.kineticHistory.length > this.maxPoints) {
      this.kineticHistory.shift();
      this.potentialHistory.shift();
    }

    this.amplitude = this.pendulum.amplitude * 180 / Math.PI;
    this.period = this.pendulum.period;
    this.energy = this.pendulum.energy;

    this.drawGraph(ctx);

    this.animationId = requestAnimationFrame((t) => this.render(t));
  }

  drawGrid(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    const step = 40;
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  drawGraph(ctx: CanvasRenderingContext2D) {
    const x = 20;
    const y = 360;
    const width = 360;
    const height = 160;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x, y, width, height);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(x, y, width, height);

    if (this.kineticHistory.length < 2) return;

    const all = [...this.kineticHistory, ...this.potentialHistory];
    const min = Math.min(...all);
    const max = Math.max(...all);
    const range = max - min || 1;

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const gy = y + (i / 4) * height;
      ctx.beginPath();
      ctx.moveTo(x, gy);
      ctx.lineTo(x + width, gy);
      ctx.stroke();
    }

    const drawLine = (data: number[], color: string) => {
      ctx.beginPath();
      data.forEach((v, i) => {
        const px = x + (i / (this.maxPoints - 1)) * width;
        const py = y + height - ((v - min) / range) * height;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();

      const last = data.length - 1;
      const px = x + (last / (this.maxPoints - 1)) * width;
      const py = y + height - ((data[last] - min) / range) * height;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    const kineticColor = this.mode === 'earth' ? '#16a34a' : '#22c55e';
    const potentialColor = this.mode === 'earth' ? '#dc2626' : '#f43f5e';

    drawLine(this.kineticHistory, kineticColor);
    drawLine(this.potentialHistory, potentialColor);

    ctx.fillStyle = '#0f172a';
    ctx.font = '11px Arial';
    ctx.fillText(`max: ${max.toFixed(2)}`, x + 5, y + 12);
    ctx.fillText(`min: ${min.toFixed(2)}`, x + 5, y + height - 5);

    ctx.fillStyle = kineticColor;
    ctx.fillRect(x + 120, y - 14, 10, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Kinetic', x + 135, y - 10);

    ctx.fillStyle = potentialColor;
    ctx.fillRect(x + 210, y - 14, 10, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillText('Potential', x + 225, y - 10);

    ctx.font = 'bold 12px Arial';
    ctx.fillText('Energy vs Time', x + 10, y - 25);
  }

  reset() {
    this.pendulum.reset(Math.PI / 4);
    this.kineticHistory = [];
    this.potentialHistory = [];
  }
}