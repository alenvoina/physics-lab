import { Component, Renderer2, Inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

interface LifeApplication {
  title: string;
  icon: string;
  description: string;
  details: string;
}

@Component({
  selector: 'app-physics-in-life',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './physics-in-life.component.html',
  styleUrls: ['./physics-in-life.component.scss'],
})
export class PhysicsInLifeComponent {
  selected: LifeApplication | null = null;
  isOpen = false;

  items: LifeApplication[] = [
    {
      title: 'GPS навигация',
      icon: 'explore',
      description: 'Эффекты теории относительности.',
      details:
        'Спутники GPS движутся быстро и находятся далеко от Земли. Без поправок на замедление времени ошибка навигации росла бы на 10 км каждый день.',
    },
    {
      title: 'МРТ сканеры',
      icon: 'biotech',
      description: 'Ядерный магнитный резонанс.',
      details:
        'МРТ использует мощные магниты, чтобы выстроить протоны в теле человека, позволяя видеть внутренние органы без рентгена.',
    },
    {
      title: 'Беспроводная зарядка',
      icon: 'battery_charging_full',
      description: 'Индукция Фарадея.',
      details:
        'Переменный ток в катушке зарядки создает магнитное поле, которое наводит ток в катушке вашего телефона.',
    },
    {
      title: 'Оптоволокно',
      icon: 'router',
      description: 'Полное внутреннее отражение.',
      details:
        'Весь интернет работает на тонких стеклянных нитях, внутри которых свет отражается от стенок, передавая гигабайты данных.',
    },
    {
      title: 'Авиация',
      icon: 'flight_takeoff',
      description: 'Уравнение Бернулли.',
      details:
        'Крыло самолета создано так, что давление сверху меньше, чем снизу. Эта разница буквально выталкивает многотонную машину в небо.',
    },
    {
      title: 'Солнечная энергия',
      icon: 'light_mode',
      description: 'Фотоэлектрический эффект.',
      details:
        'Частицы света (фотоны) выбивают электроны из кремниевых пластин, создавая чистый электрический ток.',
    },
  ];

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  open(item: LifeApplication) {
    this.selected = item;
    this.isOpen = true;
  }

  close() {
    this.selected = null;
    this.renderer.removeStyle(this.document.body, 'overflow');
  }
}
