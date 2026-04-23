import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule]
})
export class ExperimentsGalleryComponent {
  selected: Experiment | null = null;

  query = '';

  get filtered() {
  return this.experiments.filter(e =>
    e.title.toLowerCase().includes(this.query.toLowerCase())
  );
  }

 experiments: Experiment[] = [
  {
    title: 'Двойная щель',
    image: 'assets/double.jpg',
    short: 'Волновая природа частиц.',
    full: 'Один из самых известных экспериментов квантовой механики...'
  },
  {
    title: 'Маятник Фуко',
    image: 'assets/foucault.jpg',
    short: 'Доказательство вращения Земли.',
    full: 'Плоскость колебаний меняется из-за вращения Земли.'
  },
  {
    title: 'Кавендишев эксперимент',
    image: 'assets/cavendish.webp',
    short: 'Измерение гравитации.',
    full: 'Позволил определить гравитационную постоянную.'
  },
  {
    title: 'Фотоэффект',
    image: 'assets/photoelectric.png',
    short: 'Квантовая природа света.',
    full: 'Свет выбивает электроны из металла.'
  },
  {
    title: 'Опыт Милликена',
    image: 'assets/millikan.jpg',
    short: 'Заряд электрона.',
    full: 'Определение элементарного заряда.'
  },
  {
    title: 'Опыт Резерфорда',
    image: 'assets/rutherford.jpg',
    short: 'Ядерная модель атома.',
    full: 'Открытие ядра атома.'
  },
  {
    title: 'Эксперимент Штерна-Герлаха',
    image: 'assets/stern.jpg',
    short: 'Квантование спина.',
    full: 'Доказал существование квантовых состояний.'
  },
  {
    title: 'Эффект Комптона',
    image: 'assets/compton.jpg',
    short: 'Частичная природа света.',
    full: 'Рассеяние фотонов на электронах.'
  }
];

  open(exp: Experiment) {
    this.selected = exp;
  }

  close() {
    this.selected = null;
  }
}