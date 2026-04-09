import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-simulations',
    imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './simulations.component.html',
  styleUrl: './simulations.component.scss',
})
export class SimulationsComponent {
    simulationCategories = [
    {
      title: 'Механика и орбиты',
      color: '#2196F3',
      simulations: [
        { title: 'Движение планет', description: 'Исследуйте орбиты планет и гравитационные законы', points: ['Орбиты планет', 'Гравитация', 'Скорость движения'], link: '/simulation/orbital' },
        { title: 'Маятник', description: 'Изучите колебания маятника и их зависимость от длины и массы', points: ['Период колебаний', 'Амплитуда', 'Энергия'], link: '/simulation/pendulum' },
        { title: 'Гравитационные взаимодействия', description: 'Наблюдайте взаимодействие двух и более тел под действием гравитации', points: ['Силы', 'Законы движения', 'Энергия системы'], link: '/simulation/gravity' },
      ]
    },
    {
      title: 'Квантовая физика',
      color: '#9C27B0',
      simulations: [
        { title: 'Атом водорода', description: 'Изучите распределение электронов в атоме', points: ['Энергетические уровни', 'Волновая функция', 'Состояния'], link: '/simulation/quantum-system' },
        { title: 'Суперпозиция', description: 'Поймите принцип суперпозиции в квантовой физике', points: ['Состояния одновременно', 'Измерение', 'Вероятности'], link: '/simulation/quantum-superposition' },
        { title: 'Квантовые туннели', description: 'Наблюдайте эффект туннелирования', points: ['Барьер потенциала', 'Вероятность прохождения', 'Применения'], link: '/simulation/quantum-tunneling' },
      ]
    },
    {
      title: 'Ядерная физика',
      color: '#F44336',
      simulations: [
        { title: 'Радиоактивный распад', description: 'Понимайте процесс распада и полураспад', points: ['Типы распада', 'Скорость распада', 'Применения'], link: '/simulation/radioactive-decay' },
        { title: 'Ядерные реакции', description: 'Изучите реакции между ядрами', points: ['Слияние', 'Деление', 'Энергия'], link: '/simulation/nuclear-reaction' },
        { title: 'Стабильность ядер', description: 'Наблюдайте, какие ядра стабильны, а какие нет', points: ['Изотопы', 'Энергия связи', 'Применение'], link: '/simulation/nuclear-stability' },
      ]
    }
  ]

}
