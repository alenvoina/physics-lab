import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { QuantumSystem } from '@physics-lab/engine';

@Component({
  selector: 'app-quantum',
  templateUrl: './quantum-system.component.html',
  styleUrls: ['./quantum-system.component.scss'],
})
export class QuantumComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  system = new QuantumSystem();
  animationId = 0;
  stepCounter = 0;

  mode: 'levels' | 'wave' | 'states' = 'levels';

  ngAfterViewInit() {
   const canvas = this.canvasRef.nativeElement;
const ctx = canvas.getContext('2d')!;
const dpr = window.devicePixelRatio || 1;
const width = 900;
const height = 600;

canvas.width = width * dpr;
canvas.height = height * dpr;
canvas.style.width = width + 'px';
canvas.style.height = height + 'px';

    this.ctx = canvas.getContext('2d')!;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.resetTransform?.();
    ctx.scale(dpr, dpr);

    this.ctx = ctx;

    this.loop();
  }

  loop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  };

  update() {
    this.system.step(0.02);
    this.stepCounter++;
  }

  setMode(mode: 'levels' | 'wave' | 'states') {
    this.mode = mode;
  }

  draw() {
    const ctx = this.ctx;

    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, 900, 600);

    switch (this.mode) {
      case 'levels':
        this.drawLevels();
        break;
      case 'wave':
        this.drawWave();
        break;
      case 'states':
        this.drawStates();
        break;
    }

    this.drawUI();
  }

  drawLevels() {
    const ctx = this.ctx;

    this.system.electrons.forEach((e, i) => {
      ctx.beginPath();
      ctx.arc(450, 300, e.radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.stroke();

      const pos = this.system.getElectronPosition(e, i);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
    });
  }

  drawWave() {
    const ctx = this.ctx;

    for (let r = 0; r < 300; r += 2) {
      const amp = this.system.getWaveAmplitude(r, 1);

      ctx.beginPath();
      ctx.arc(450, 300, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(56,189,248,${Math.min(Math.abs(amp), 1)})`;
      ctx.stroke();
    }
  }

drawUI() {
  const ctx = this.ctx;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
  ctx.fillRect(0, 0, 900, 80);

  ctx.fillStyle = 'white';
  ctx.font = `14px monospace`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  const lines = [
    `Mode: ${this.mode}`,
    `Electrons: ${this.system.electrons.length}`,
    `Step: ${this.system.stepCount?.toFixed(0) || 0}`
  ];

  lines.forEach((line, i) => {
    ctx.fillText(line, 10, 10 + i * 20);
  });
}

drawStates() {
  const ctx = this.ctx;

  ctx.fillStyle = 'white';
  ctx.font = `14px monospace`;
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  const startY = 100;

  this.system.electrons.forEach((e, i) => {
    ctx.fillText(
      `n=${e.n}  E=${e.energy.toFixed(2)} eV`,
      10,
      startY + i * 20
    );
  });
}

  ngOnDestroy() {
    cancelAnimationFrame(this.animationId);
  }
}