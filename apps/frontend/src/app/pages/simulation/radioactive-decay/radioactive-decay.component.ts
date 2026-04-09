import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { RadioactiveDecaySystem } from '@physics-lab/engine';

@Component({
  selector: 'app-radioactive-decay',
  templateUrl: './radioactive-decay.component.html',
  styleUrls: ['./radioactive-decay.component.scss'],
})
export class RadioactiveDecayComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  ctx!: CanvasRenderingContext2D;
  sim = new RadioactiveDecaySystem(150);

  animationId = 0;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;

    canvas.width = 900;
    canvas.height = 400;

    this.ctx = canvas.getContext('2d')!;

    this.loop();
  }

  loop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  update() {
    this.sim.step(0.5);
  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 900, 400);

    this.sim.atoms.forEach(a => {
      ctx.beginPath();
      ctx.arc(a.x, a.y, 4, 0, Math.PI * 2);

      ctx.fillStyle = a.decayed ? '#f87171' : '#22c55e';
      ctx.fill();
    });

    this.drawUI();
  }

  drawUI() {
    const ctx = this.ctx;

    ctx.fillStyle = 'white';
    ctx.font = '14px monospace';

    ctx.fillText(`Time: ${this.sim.time.toFixed(1)}`, 10, 20);
    ctx.fillText(`Remaining: ${this.sim.getRemaining()}`, 10, 40);
    ctx.fillText(`Decayed: ${this.sim.getDecayed()}`, 10, 60);
    ctx.fillText(`Half-life: ${this.sim.getHalfLife().toFixed(2)}`, 10, 80);
    ctx.fillText(`Type: ${this.sim.decayType}`, 10, 100);
  }

  reset() {
    this.sim.reset();
  }

  setType(type: any) {
    this.sim.setDecayType(type);
    this.reset();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}