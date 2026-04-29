import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Experiment {
  title: string;
  category: string;
  image: string;
  short: string;
  full: string;
}

@Component({
  selector: 'app-experiments-gallery',
  templateUrl: './experiments-gallery.component.html',
  styleUrls: ['./experiments-gallery.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class ExperimentsGalleryComponent {
  selected: Experiment | null = null;
  query = '';

  get filtered() {
    return this.experiments.filter(
      (e) =>
        e.title.toLowerCase().includes(this.query.toLowerCase()) ||
        e.category.toLowerCase().includes(this.query.toLowerCase()),
    );
  }

  onSearch(event: Event) {
    this.query = (event.target as HTMLInputElement).value;
  }

  open(exp: Experiment) {
    this.selected = exp;
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.selected = null;
    document.body.style.overflow = '';
  }

  experiments: Experiment[] = [
    {
      title: 'Двойная щель (Опыт Юнга)',
      category: 'Квантовая механика',
      image:
        'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=800&auto=format&fit=crop',
      short: 'Демонстрация корпускулярно-волнового дуализма.',
      full: 'Один из самых фундаментальных экспериментов квантовой механики. Он показывает, что свет и материя могут проявлять характеристики как классических волн, так и частиц; более того, он демонстрирует фундаментально вероятностную природу квантовомеханических явлений.',
    },
    {
      title: 'Маятник Фуко',
      category: 'Классическая механика',
      image:
        'https://images.unsplash.com/photo-1544006658-89bde88e87c6?q=80&w=800&auto=format&fit=crop',
      short: 'Наглядное доказательство вращения Земли.',
      full: 'Массивный маятник, плоскость колебаний которого медленно поворачивается со временем из-за силы Кориолиса, вызванной суточным вращением Земли вокруг своей оси.',
    },
    {
      title: 'Эксперимент Кавендиша',
      category: 'Гравитация',
      image:
        'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=800&auto=format&fit=crop',
      short: 'Первое точное измерение гравитационной постоянной.',
      full: 'Используя крутильные весы, Генри Кавендиш смог измерить крошечную силу гравитационного притяжения между свинцовыми сферами, что позволило вычислить массу Земли.',
    },
    {
      title: 'Фотоэффект',
      category: 'Квантовая физика',
      image:
        'https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?q=80&w=800&auto=format&fit=crop',
      short: 'Выбивание электронов светом.',
      full: 'Явление испускания электронов веществом под действием света. Альберт Эйнштейн объяснил его, предположив, что свет состоит из квантов энергии (фотонов), за что и получил Нобелевскую премию.',
    },
    {
      title: 'Опыт Милликена',
      category: 'Электромагнетизм',
      image:
        'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=800&auto=format&fit=crop',
      short: 'Измерение элементарного заряда электрона.',
      full: 'Роберт Милликен подвешивал мельчайшие заряженные капли масла в электрическом поле между двумя металлическими пластинами. Балансируя силу тяжести и электрическую силу, он точно измерил заряд электрона.',
    },
    {
      title: 'Опыт Резерфорда',
      category: 'Ядерная физика',
      image:
        'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=800&auto=format&fit=crop',
      short: 'Открытие крошечного, плотного ядра атома.',
      full: 'Обстреливая тончайшую золотую фольгу альфа-частицами, Резерфорд обнаружил, что некоторые частицы отскакивают назад. Это разрушило модель "пудинга с изюмом" и доказало существование атомного ядра.',
    },
    {
      title: 'Эксперимент Штерна-Герлаха',
      category: 'Квантовый спин',
      image:
        'https://images.unsplash.com/photo-1614729939124-032d0b56c9ce?q=80&w=800&auto=format&fit=crop',
      short: 'Доказательство квантования момента импульса.',
      full: 'Пропуская пучок атомов серебра через неоднородное магнитное поле, физики увидели, что пучок разделяется на две четкие полосы. Это доказало, что пространственная ориентация углового момента (спина) квантуется.',
    },
    {
      title: 'Дисперсия Ньютона',
      category: 'Оптика',
      image:
        'https://images.unsplash.com/photo-1506764506544-0b1a43a0e633?q=80&w=800&auto=format&fit=crop',
      short: 'Разложение белого света в спектр.',
      full: 'Исаак Ньютон с помощью стеклянной призмы доказал, что белый свет не является чистым, а состоит из всех цветов видимого спектра, которые преломляются под разными углами.',
    },
    {
      title: 'Кот Шрёдингера',
      category: 'Мысленный эксперимент',
      image:
        'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop',
      short: 'Парадокс квантовой суперпозиции макрообъектов.',
      full: 'Мысленный эксперимент, в котором кот в закрытой коробке находится в суперпозиции живого и мертвого состояния до тех пор, пока наблюдатель не откроет коробку. Демонстрирует проблему интерпретации коллапса волновой функции.',
    },
    {
      title: 'Опыт Майкельсона-Морли',
      category: 'Теория относительности',
      image:
        'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=800&auto=format&fit=crop',
      short: 'Опровержение светоносного эфира.',
      full: 'С помощью интерферометра исследователи пытались измерить "эфирный ветер" при движении Земли. Нулевой результат эксперимента заложил основу для Специальной теории относительности Эйнштейна.',
    },
    {
      title: 'Демон Максвелла',
      category: 'Термодинамика',
      image:
        'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=800&auto=format&fit=crop',
      short: 'Парадокс второго начала термодинамики.',
      full: 'Мысленный эксперимент, в котором "демон" открывает и закрывает дверцу между двумя сосудами с газом, пропуская только быстрые молекулы в одну сторону. Это привело бы к уменьшению энтропии, что нарушает законы физики.',
    },
    {
      title: 'Опыт Эрстеда',
      category: 'Электромагнетизм',
      image:
        'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=800&auto=format&fit=crop',
      short: 'Связь электричества и магнетизма.',
      full: 'Ганс Кристиан Эрстед случайно обнаружил, что стрелка компаса отклоняется рядом с проводом, по которому течет ток. Это стало первым прямым доказательством того, что электричество создает магнетизм.',
    },
  ];
}
