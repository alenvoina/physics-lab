import { Component } from '@angular/core';
import { ArticlesService } from '../articles/articles.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-articles-page',
  imports: [CommonModule, RouterModule],
  templateUrl: './articles.component.html',
  styleUrls:['./articles.component.scss'] 
})
export class ArticlesComponent {
  articles = this.articlesService.getAll();

  constructor(private articlesService: ArticlesService) {}
}