import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('atomCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    const size = 350;
    canvas.width = size;
    canvas.height = size;

    const center = { x: size / 2, y: size / 2 };

    let angle1 = 0;
    let angle2 = 0;
    let angle3 = 0;

    const drawOrbit = (radius: number, tilt: number) => {
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(tilt);
      ctx.beginPath();
      ctx.ellipse(0, 0, radius, radius * 0.4, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(100,150,255,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    const drawElectron = (
      radius: number,
      angle: number,
      tilt: number,
      color: string
    ) => {
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(tilt);

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.4;

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;

      ctx.shadowBlur = 15;
      ctx.shadowColor = color;

      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);

      // ядро
      ctx.beginPath();
      ctx.arc(center.x, center.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#1976d2';

      ctx.shadowBlur = 25;
      ctx.shadowColor = '#1976d2';

      ctx.fill();

      // орбиты
      drawOrbit(80, 0);
      drawOrbit(80, Math.PI / 3);
      drawOrbit(80, -Math.PI / 3);

      // электроны
      drawElectron(80, angle1, 0, '#ff4081');
      drawElectron(80, angle2, Math.PI / 3, '#00e5ff');
      drawElectron(80, angle3, -Math.PI / 3, '#69f0ae');

      angle1 += 0.02;
      angle2 += 0.015;
      angle3 += 0.01;

      requestAnimationFrame(draw);
    };

    draw();
  }
}