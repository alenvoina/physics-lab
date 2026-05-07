import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  OnInit,
  NgZone,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { ArticlesService } from '../articles/articles.service';
import { Article } from '../article/article.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    RouterModule,
    MatTooltipModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('atomCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  timelineEvents = [
    {
      year: 1609,
      title: 'Галилео Галилей',
      description: 'Наблюдает Луны Юпитера и строит телескоп',
      icon: 'assets/Galilei.webp',
    },
    {
      year: 1687,
      title: 'Исаак Ньютон',
      description: 'Публикует Principia, законы движения и гравитации',
      icon: 'assets/Newton.jpg',
    },
    {
      year: 1865,
      title: 'Джеймс Клерк Максвелл',
      description: 'Формулирует уравнения электромагнетизма',
      icon: 'assets/Maxwell.jpg',
    },
    {
      year: 1905,
      title: 'Альберт Эйнштейн',
      description: 'Специальная теория относительности',
      icon: 'assets/Einstein.jpg',
    },
    {
      year: 1926,
      title: 'Эрвин Шрёдингер',
      description: 'Формулирует волновое уравнение — основу квантовой механики',
      icon: 'assets/Srhedinger.jpg',
    },
    {
      year: 1932,
      title: 'Джеймс Чедвик',
      description:
        'Открывает нейтрон, что позволяет понять структуру атомного ядра',
      icon: 'assets/Chedwik.jpg',
    },
    {
      year: 1942,
      title: 'Энрико Ферми',
      description:
        'Запускает первый в мире ядерный реактор (Чикагская поленница-1) в рамках Манхэттенского проекта',
      icon: 'assets/Fermi.jpg',
    },
    {
      year: 1964,
      title: 'Мюррей Гелл-Ман',
      description:
        'Выдвигает гипотезу о существовании кварков — фундаментальных составляющих материи',
      icon: 'assets/GellMann.jpg',
    },
    {
      year: 1984,
      title: 'Стивен Чу',
      description: 'Разрабатыны методы лазерного охлаждения и удержания атомов',
      icon: 'assets/Chu.jpg',
    },
    {
      year: 2001,
      title: 'Исаак Чуанг',
      description:
        'Создан 7-кубитный прототип квантового компьютера и демонстрируют алгоритм Шора',
      icon: 'assets/Chuang.jpg',
    },
    {
      year: 2002,
      title: 'Раймонд Дэвис',
      description:
        'Успешная регистрация космических нейтрино (Нобелевская премия 2002 года)',
      icon: 'assets/Davis.jpg',
    },
    {
      year: 2012,
      title: 'Питер Хиггс',
      description:
        'Открытие бозона Хиггса на Большом адронном коллайдере в CERN',
      icon: 'assets/Higgs.jpg',
    },
    {
      year: 2015,
      title: 'Такааки Кадзита',
      description:
        'Открытие нейтринных осцилляций, доказывающее, что нейтрино имеют массу',
      icon: 'assets/Kajita.jpg',
    },
    {
      year: 2016,
      title: 'Райнер Вайc',
      description:
        'Первая прямая регистрация гравитационных волн коллаборацией LIGO',
      icon: 'assets/Weiss.jpg',
    },
    {
      year: 2020,
      title: 'Роджер Пенроуз',
      description:
        'Открытие сверхмассивной чёрной дыры в центре Галактики и изучение теории их формирования',
      icon: 'assets/Penrose.webp',
    },
    {
      year: 2025,
      title: 'Джон Кларк',
      description:
        'Открытие макроскопического квантового туннелирования и квантования энергии в электрических цепях',
      icon: 'assets/Clarke.jpg',
    },
  ];

  newsList: Article[] = [];
  private animationId!: number;

  constructor(
    private articlesService: ArticlesService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.generateRandomNews();
  }

  ngAfterViewInit() {
    this.initCanvas();
  }

  generateRandomNews() {
    this.newsList = this.articlesService.getRandom(3);
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 350;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);
    const center = { x: size / 2, y: size / 2 };

    let a1 = 0,
      a2 = 0,
      a3 = 0;

    // ВАЖНО: Запускаем анимацию ВНЕ Angular, чтобы сайт не лагал!
    this.ngZone.runOutsideAngular(() => {
      const draw = () => {
        ctx.clearRect(0, 0, size, size);

        // ... (весь твой код отрисовки атома)
        ctx.beginPath();
        ctx.arc(center.x, center.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#1976d2';
        ctx.fill();

        const orbit = (r: number, tilt: number) => {
          ctx.save();
          ctx.translate(center.x, center.y);
          ctx.rotate(tilt);
          ctx.beginPath();
          ctx.ellipse(0, 0, r, r * 0.4, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(100,150,255,0.2)';
          ctx.stroke();
          ctx.restore();
        };

        const electron = (r: number, a: number, t: number, c: string) => {
          ctx.save();
          ctx.translate(center.x, center.y);
          ctx.rotate(t);
          const x = Math.cos(a) * r;
          const y = Math.sin(a) * r * 0.4;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = c;
          ctx.fill();
          ctx.restore();
        };

        orbit(80, 0);
        orbit(80, Math.PI / 3);
        orbit(80, -Math.PI / 3);

        electron(80, a1, 0, '#ff4081');
        electron(80, a2, Math.PI / 3, '#00e5ff');
        electron(80, a3, -Math.PI / 3, '#69f0ae');

        a1 += 0.02;
        a2 += 0.015;
        a3 += 0.01;

        this.animationId = requestAnimationFrame(draw);
      };

      draw();
    });
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
