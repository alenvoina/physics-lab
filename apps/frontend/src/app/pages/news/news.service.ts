import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  link: string;
  date: string;
}

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiUrl = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.nasa.gov/rss/dyn/breaking_news.rss';

  constructor(private http: HttpClient) {}

  getNews(): Observable<NewsItem[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.items.map((item: any, index: number) => ({
        id: index.toString(),
        title: item.title,
        summary: item.contentSnippet || '',
        content: item.content,
        image: item.enclosure?.link || 'assets/default.jpg',
        link: item.link,
        date: item.pubDate
      })))
    );
  }

  getNewsById(id: string): Observable<NewsItem | undefined> {
    return this.getNews().pipe(
      map(list => list.find(item => item.id === id))
    );
  }
}