import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Fact {
  title: string;
  description: string;
  category: string;
}

@Component({
  selector: 'app-physics-facts',
  templateUrl: './physics-facts.component.html',
  styleUrls: ['./physics-facts.component.scss'],
  imports: [CommonModule]
})
export class PhysicsFactsComponent {

  categories = ['Все', 'Классика', 'Квантовая', 'Космос'];

  selectedCategory = 'Все';

  facts: Fact[] = [
    {
      title: 'Свет — это и волна, и частица',
      description: 'Фотон обладает двойственной природой: ведёт себя как волна и как частица.',
      category: 'Квантовая'
    },
    {
      title: 'Ничто не быстрее света',
      description: 'Скорость света в вакууме — максимальная скорость во Вселенной.',
      category: 'Космос'
    },
    {
      title: 'Гравитация искривляет пространство',
      description: 'Массивные объекты искривляют пространство-время.',
      category: 'Космос'
    },
    {
      title: 'Импульс сохраняется',
      description: 'В замкнутой системе суммарный импульс остаётся постоянным.',
      category: 'Классика'
    },
    {
      title: 'Квантовая запутанность',
      description: 'Две частицы могут мгновенно влиять друг на друга на расстоянии.',
      category: 'Квантовая'
    },
    {
      title: 'Чёрные дыры испаряются',
      description: 'Из-за эффекта Хокинга чёрные дыры теряют массу.',
      category: 'Космос'
    }
  ];

  get filteredFacts() {
    if (this.selectedCategory === 'Все') return this.facts;
    return this.facts.filter(f => f.category === this.selectedCategory);
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  }
}