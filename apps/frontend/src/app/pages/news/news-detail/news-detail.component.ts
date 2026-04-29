import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService, NewsItem } from '../news.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss'],
  imports: [CommonModule],
})
export class NewsDetailComponent implements OnInit {
  news?: NewsItem;

  constructor(
    private route: ActivatedRoute,
    private newsService: NewsService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.newsService.getNewsById(id).subscribe((data) => (this.news = data));
    this.newsService.getNewsById(id).subscribe((data) => {
      this.news = data;
      this.fixImages();
    });
  }

  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/news/default.jpg';
  }

  onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    img.removeAttribute('width');
    img.removeAttribute('height');
    img.classList.add('loaded');
  }

  fixImages() {
    setTimeout(() => {
      const images = document.querySelectorAll('.news-detail img');
      images.forEach((img: any) => {
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
      });
    }, 0);
  }
}
