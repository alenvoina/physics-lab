import { Injectable } from '@angular/core';
import { ARTICLES_DATA } from '../article/articles.data';
import { Article } from '../article/article.model';

@Injectable({ providedIn: 'root' })
export class ArticlesService {
  private articles = ARTICLES_DATA;

  getAll(): Article[] {
    return this.articles;
  }

  getBySlug(slug: string): Article | undefined {
    return this.articles.find(a => a.slug === slug);
  }

  getRandom(count: number): Article[] {
    const shuffled = [...this.articles].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}