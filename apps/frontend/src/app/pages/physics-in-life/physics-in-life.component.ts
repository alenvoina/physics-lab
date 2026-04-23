import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';

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
    description: 'Навигация и теория относительности.',
    details: 'Для точности GPS учитывается замедление времени.'
  },
  {
    title: 'Лазеры',
    icon: 'flash_on',
    description: 'Квантовая физика в действии.',
    details: 'Используются в хирургии, сканерах и промышленности.'
  },
  {
    title: 'Wi-Fi и связь',
    icon: 'wifi',
    description: 'Электромагнитные волны вокруг нас.',
    details: 'Передача данных происходит через радиоволны.'
  },
  {
    title: 'Смартфоны',
    icon: 'smartphone',
    description: 'Полупроводники и квантовые эффекты.',
    details: 'Транзисторы — основа всей электроники.'
  },
  {
    title: 'Самолёты',
    icon: 'flight',
    description: 'Аэродинамика и давление.',
    details: 'Подъёмная сила возникает из-за разности давления.'
  },
  {
    title: 'Электромобили',
    icon: 'electric_car',
    description: 'Электродвигатели и энергия.',
    details: 'Преобразование электрической энергии в движение.'
  },
  {
    title: 'Микроволновка',
    icon: 'microwave',
    description: 'Нагрев за счёт волн.',
    details: 'Микроволны заставляют молекулы воды колебаться.'
  },
  {
    title: 'Солнечные панели',
    icon: 'wb_sunny',
    description: 'Фотоэффект в реальной жизни.',
    details: 'Свет превращается в электричество.'
  },
  {
    title: 'МРТ',
    icon: 'health_and_safety',
    description: 'Медицина и ядерная физика.',
    details: 'Использует магнитные поля и резонанс.'
  }
];

  open(item: LifeApplication) {
    this.selected = item;
  }

  close() {
    this.selected = null;
  }
}