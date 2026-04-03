import {
  AfterViewInit,
  AfterViewChecked,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

interface News {
  title: string;
  content: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, RouterModule, MatTooltipModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})

export class HomeComponent implements AfterViewInit, AfterViewChecked, OnDestroy {

timelineEvents = [
  { year: 1609, title: 'Галилео Галилей', description: 'Наблюдает Луны Юпитера и строит телескоп', icon: 'assets/Galilei.webp' },
  { year: 1687, title: 'Исаак Ньютон', description: 'Публикует Principia, законы движения и гравитации', icon: 'assets/Newton.jpg' },
  { year: 1865, title: 'Джеймс Клерк Максвелл', description: 'Формулирует уравнения электромагнетизма', icon: 'assets/Maxwell.jpg' },
  { year: 1905, title: 'Альберт Эйнштейн', description: 'Специальная теория относительности', icon: 'assets/Einstein.jpg' },
  { year: 1926, title: 'Эрвин Шредингер', description: 'Волновая функция и квантовая механика', icon: 'assets/Srhedinger.jpg' },
  { year: 1932, title: 'Джеймс Чедвик', description: 'Открытие нейтрона', icon: 'assets/Chedwik.jpg' },
  { year: 1942, title: 'Проект Манхэттен', description: 'Разработка атомной бомбы', icon: 'assets/Einstein.jpg' },
  { year: 1964, title: 'Кварки', description: 'Появляется квантовая хромодинамика', icon: 'assets/Einstein.jpg' },
  { year: 1984, title: 'Лазерное охлаждение', description: 'Разработка лазерных охлаждений атомов', icon: 'assets/Einstein.jpg' },
  { year: 2001, title: 'Квантовые компьютеры', description: 'Первые прототипы квантовых вычислений', icon: 'assets/Einstein.jpg' },
  { year: 2002, title: 'Нейтрино', description: 'Обнаружение космических нейтрино', icon: 'assets/Einstein.jpg' },
  { year: 2012, title: 'Бозон Хиггса', description: 'Открыт бозон Хиггса в CERN', icon: 'assets/Einstein.jpg' },
  { year: 2015, title: 'Такааки Кадзита', description: 'Нейтрино меняют “тип” → значит имеют массу', icon: 'assets/Einstein.jpg' },
  { year: 2016, title: 'Райнер Вайс', description: 'Впервые зарегистрированы волны пространства-времени', icon: 'assets/Einstein.jpg' },
  { year: 2020, title: 'Роджер Пенроуз', description: 'доказательство существования сверхмассивной чёрной дыры в центре галактики', icon: 'assets/Einstein.jpg' },
  { year: 2025, title: 'Джон Кларк', description: 'Квантовые эффекты в электрических цепях', icon: 'assets/Einstein.jpg' },
  
];

newsList: News[] = [];

private allNews: News[] = [
    {
      title: 'Quantum Entanglement Breakthrough',
      content: 'Scientists have achieved record distances for entangled particles, opening new possibilities for quantum communication.',
      image: 'assets/quantum.jpg'
    },
    {
      title: 'Black Hole Imaging Updated',
      content: 'The Event Horizon Telescope released a new image of a black hole with unprecedented detail.',
      image: 'assets/blackhole.jpeg'
    },
    {
      title: 'Fusion Energy Milestone',
      content: 'Researchers generated more energy from fusion than the input energy for the first time.',
      image: 'assets/fusion.jpg'
    },
    {
      title: 'Gravitational Waves Detected',
      content: 'LIGO observatory detected new gravitational waves from a binary neutron star merger.',
      image: 'assets/gravity.jpg'
    },
    {
      title: 'Dark Matter Clues',
      content: 'Experiments hint at possible interactions of dark matter with normal matter.',
      image: 'assets/dark-matter.webp'
    }
  ];

   generateRandomNews() {
    this.newsList = this.shuffleArray(this.allNews).slice(0, 3);
  }

    private shuffleArray(arr: News[]): News[] {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  @ViewChild('atomCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private animationId!: number;
  private currentCanvas: HTMLCanvasElement | null = null;

  ngAfterViewInit() {
    this.generateRandomNews();
    this.initCanvas();
  }

  ngAfterViewChecked() {
    this.initCanvas();
  }

  private initCanvas() {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    if (this.currentCanvas === canvas) return;

    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    this.currentCanvas = canvas;
    this.startAnimation(canvas);
  }

  private startAnimation(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 350;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.scale(dpr, dpr);

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

      ctx.beginPath();
      ctx.arc(center.x, center.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#1976d2';
      ctx.shadowBlur = 25;
      ctx.shadowColor = '#1976d2';
      ctx.fill();

      drawOrbit(80, 0);
      drawOrbit(80, Math.PI / 3);
      drawOrbit(80, -Math.PI / 3);

      drawElectron(80, angle1, 0, '#ff4081');
      drawElectron(80, angle2, Math.PI / 3, '#00e5ff');
      drawElectron(80, angle3, -Math.PI / 3, '#69f0ae');

      angle1 += 0.02;
      angle2 += 0.015;
      angle3 += 0.01;

      this.animationId = requestAnimationFrame(draw);
    };

    draw();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }


}