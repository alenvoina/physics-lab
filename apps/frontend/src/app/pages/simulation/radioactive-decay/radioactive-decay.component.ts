import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { RadioactiveDecaySystem, DecayType } from '@physics-lab/engine';

@Component({
  selector: 'app-radioactive-decay',
  templateUrl: './radioactive-decay.component.html',
  styleUrls: ['./radioactive-decay.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class RadioactiveDecayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvasWrap', { static: true })
  canvasWrapRef!: ElementRef<HTMLDivElement>;
  @ViewChild('canvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  decayFormula =
    'Математически: N(t) = N<sub>0</sub> · 2<sup>-t / T<sub>1/2</sub></sup>';
  ctx!: CanvasRenderingContext2D;

  sim = new RadioactiveDecaySystem(400);

  animationId = 0;
  speed = 1;
  lastTime = 0;
  private resizeObserver!: ResizeObserver;

  setSpeed(v: string) {
    this.speed = parseFloat(v);
  }

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;

    const rect = this.canvasWrapRef.nativeElement.getBoundingClientRect();
    this.updateCanvasSize(rect.width, rect.height);

    this.resizeObserver = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      this.updateCanvasSize(width, height);
    });
    this.resizeObserver.observe(this.canvasWrapRef.nativeElement);

    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  private updateCanvasSize(width: number, height: number) {
    if (width === 0 || height === 0) return;

    this.canvasRef.nativeElement.width = width;
    this.canvasRef.nativeElement.height = height;
    this.sim.width = width;
    this.sim.height = height;

    if (this.sim.time === 0 || this.sim.atoms.length === 0) {
      this.sim.reset();
    }
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
    const w = this.sim.width;
    const h = this.sim.height;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.5)';
    ctx.fillRect(0, 0, w, h);

    this.sim.atoms.forEach((a) => {
      ctx.beginPath();
      ctx.arc(a.x, a.y, 4, 0, Math.PI * 2);

      if (!a.decayed) {
        ctx.fillStyle = '#22c55e';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#22c55e';
      } else {
        ctx.shadowBlur = 0;
        if (a.decayProgress > 0) {
          ctx.fillStyle = `rgba(239, 68, 68, ${a.decayProgress})`;
        } else {
          ctx.fillStyle = '#334155';
        }
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      if (a.decayProgress > 0) {
        ctx.beginPath();
        ctx.arc(a.x, a.y, 15 * (1 - a.decayProgress), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(250, 204, 21, ${a.decayProgress})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    this.sim.emissions.forEach((e) => {
      ctx.beginPath();
      if (e.type === 'alpha') {
        ctx.arc(e.x, e.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(251, 146, 60, ${e.life})`;
        ctx.fill();
      } else if (e.type === 'beta') {
        ctx.arc(e.x, e.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${e.life})`;
        ctx.fill();
      } else if (e.type === 'gamma') {
        ctx.arc(e.x, e.y, 40 * (1 - e.life), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(192, 132, 252, ${e.life})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });
  }

  setType(type: DecayType) {
    this.sim.setDecayType(type);
  }
  reset() {
    this.sim.reset();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
    if (this.resizeObserver) this.resizeObserver.disconnect();
  }
}
