import { Component } from '@angular/core';
import { ArticlesService } from '../articles/articles.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-articles-page',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class ArticlesComponent {
  articles = this.articlesService.getAll();

  constructor(private articlesService: ArticlesService) {}
}
