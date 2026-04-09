import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

interface LifeApplication {
  title: string;
  icon: string;
  description: string;
  details: string;
}

@Component({
  selector: 'app-physics-in-life',
  templateUrl: './physics-in-life.component.html',
  styleUrls: ['./physics-in-life.component.scss'],
  imports: [CommonModule, MatIcon]
})
export class PhysicsInLifeComponent {
  selected: LifeApplication | null = null;

  items: LifeApplication[] = [
    {
      title: 'GPS и спутники',
      icon: 'public',
      description: 'Навигация работает благодаря гравитации и теории относительности.',
      details: `
Спутники вращаются вокруг Земли благодаря гравитации.
Для точности GPS учитывается даже эффект замедления времени из теории относительности.`
    },
    {
      title: 'Лазеры',
      icon: 'flash_on',
      description: 'Используются в медицине, сканерах и технологиях.',
      details: `
Лазеры основаны на квантовой физике. Они создают когерентный свет,
который применяется в хирургии, сканерах и промышленности.`
    },
    {
      title: 'Ядерная энергия',
      icon: 'bolt',
      description: 'Источник энергии на атомных электростанциях.',
      details: `
Энергия выделяется при делении атомных ядер.
Этот процесс используется для выработки электроэнергии на АЭС.`
    },
    {
      title: 'Смартфоны',
      icon: 'smartphone',
      description: 'Работают благодаря полупроводникам и квантовой физике.',
      details: `
Современные чипы используют квантовые эффекты в полупроводниках,
что позволяет создавать мощные и компактные устройства.`
    },
    {
      title: 'Самолёты',
      icon: 'flight',
      description: 'Подъёмная сила создаётся аэродинамикой.',
      details: `
Крылья самолёта создают разность давления воздуха,
что приводит к возникновению подъёмной силы.`
    },
    {
      title: 'МРТ (медицина)',
      icon: 'health_and_safety',
      description: 'Диагностика на основе ядерной физики.',
      details: `
Магнитно-резонансная томография использует магнитные поля и ядерный резонанс
для получения изображений внутренних органов.`
    }
  ];

  open(item: LifeApplication) {
    this.selected = item;
  }

  close() {
    this.selected = null;
  }
}