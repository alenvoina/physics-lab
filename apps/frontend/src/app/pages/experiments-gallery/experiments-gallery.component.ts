import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Experiment {
  title: string;
  image: string;
  short: string;
  full: string;
}

@Component({
  selector: 'app-experiments-gallery',
  templateUrl: './experiments-gallery.component.html',
  styleUrls: ['./experiments-gallery.component.scss'],
  imports: [CommonModule]
})
export class ExperimentsGalleryComponent {
  selected: Experiment | null = null;

  experiments: Experiment[] = [
    {
      title: 'Двойная щель',
      image: 'assets/double.jpg',
      short: 'Квантовый эксперимент, демонстрирующий волновую природу частиц.',
      full: `
Эксперимент с двойной щелью показывает, что частицы (например, электроны)
ведут себя как волны. При прохождении через две щели возникает интерференционная картина.
Это один из ключевых экспериментов квантовой механики.`
    },
    {
      title: 'Маятник Фуко',
      image: 'assets/foucault.jpg',
      short: 'Доказывает вращение Земли.',
      full: `
Маятник Фуко демонстрирует вращение Земли. Плоскость колебаний маятника
постепенно изменяется из-за вращения планеты.`
    },
    {
      title: 'Кавендишев эксперимент',
      image: 'assets/cavendish.webp',
      short: 'Измерение гравитационной постоянной.',
      full: `
Эксперимент Кавендиша позволил впервые измерить гравитационную постоянную G
и определить массу Земли.`
    },
    {
      title: 'Фотоэффект',
      image: 'assets/photoelectric.png',
      short: 'Выбивание электронов светом.',
      full: `
Фотоэффект показывает, что свет обладает квантовой природой.
При попадании фотонов на металл выбиваются электроны.`
    }
  ];

  open(exp: Experiment) {
    this.selected = exp;
  }

  close() {
    this.selected = null;
  }
}