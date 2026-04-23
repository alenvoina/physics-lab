import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RadioactiveDecaySystem } from '@physics-lab/engine';

@Component({
  selector: 'app-radioactive-decay',
  templateUrl: './radioactive-decay.component.html',
  styleUrls: ['./radioactive-decay.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class RadioactiveDecayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  sim = new RadioactiveDecaySystem(150);

  animationId = 0;
  speed = 1;

  lastTime = 0;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;

    canvas.width = 900;
    canvas.height = 400;

    this.ctx = canvas.getContext('2d')!;
    this.loop();
  }

  loop = (time = 0) => {
    const delta = time - this.lastTime;

    if (delta > 16) {
      this.update();
      this.draw();
      this.lastTime = time;
    }

    this.animationId = requestAnimationFrame(this.loop);
  };

  update() {
    this.sim.step(0.1 * this.speed);
  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 900, 400);

    this.sim.atoms.forEach(a => {
      // атом
      ctx.beginPath();
      ctx.arc(a.x, a.y, 4, 0, Math.PI * 2);

      ctx.fillStyle = a.decayed
        ? `rgba(248,113,113,${1 - a.decayProgress})`
        : '#22c55e';

      ctx.fill();

      // вспышка
      if (a.decayProgress > 0) {
        ctx.beginPath();
        ctx.arc(a.x, a.y, 10 * a.decayProgress, 0, Math.PI * 2);
        ctx.strokeStyle = '#fbbf24';
        ctx.stroke();

        a.decayProgress *= 0.85;
      }

      // эффекты типа распада
      if (a.decayed && a.decayProgress > 0.2) {
        if (this.sim.decayType === 'alpha') {
          ctx.fillStyle = '#fb923c';
          ctx.fillRect(a.x + 5, a.y, 4, 4);
        }

        if (this.sim.decayType === 'beta') {
          ctx.strokeStyle = '#60a5fa';
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(
            a.x + (Math.random() - 0.5) * 20,
            a.y + (Math.random() - 0.5) * 20
          );
          ctx.stroke();
        }

        if (this.sim.decayType === 'gamma') {
          ctx.beginPath();
          ctx.arc(a.x, a.y, 15 * a.decayProgress, 0, Math.PI * 2);
          ctx.strokeStyle = '#c084fc';
          ctx.stroke();
        }
      }
    });
  }

  reset() {
    this.sim.reset(150);
  }

  setType(type: any) {
    this.sim.setDecayType(type);
    this.reset();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}