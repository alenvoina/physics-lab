import { Component, OnInit } from '@angular/core';
import { NewsService, NewsItem } from '../news.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
  imports: [RouterModule, CommonModule, MatAnchor],
})
export class NewsListComponent implements OnInit {
  newsList: NewsItem[] = [];

  constructor(private newsService: NewsService) {}

  ngOnInit(): void {
    this.newsService
      .getNews()
      .subscribe((data) => (this.newsList = data.slice(0, 6)));
  }
}
