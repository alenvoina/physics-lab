import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

const simulationUrls = [
  'simulation/orbital',
  'simulation/gravity',
  'simulation/quantum-system',
  'simulation/nuclear-reaction'
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  isSimulationPage = false;
  

  constructor(private router: Router) {}

  ngOnInit() {
   this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe((event: NavigationEnd) => {
    this.isSimulationPage = simulationUrls.some(url => event.urlAfterRedirects.includes(url));
  });
  }
}