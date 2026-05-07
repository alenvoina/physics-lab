import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ArticlesService } from '../articles/articles.service';
import { CommonModule } from '@angular/common';
import { Article } from './article.model';

@Component({
  standalone: true,
  selector: 'app-article-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article: Article | undefined;

  constructor(
    private route: ActivatedRoute,
    private articlesService: ArticlesService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.article = this.articlesService.getBySlug(slug);
        window.scrollTo(0, 0);
      }
    });
  }
}