import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Body, Vector, World } from '@physics-lab/engine';

@Component({
    selector: 'app-classical',
    templateUrl: './classical.component.html',
    styleUrls: ['./classical.component.scss'],
    standalone: false
})
export class ClassicalComponent {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private world!: World;
  private sun!: Body;
  private planet!: Body;

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.setupSimulation();
    requestAnimationFrame(() => this.render());
  }

  setupSimulation() {
    const G = 1;
    const M = 10000;
    const r = 100; // радиус орбиты в пикселях
    const v = Math.sqrt(G * M / r);

    this.world = new World();
    this.sun = new Body({ position: new Vector(300, 300), mass: M, radius: 10 });
    this.planet = new Body({ position: new Vector(300 + r, 300), mass: 1, velocity: new Vector(0, v), radius: 5 });

    this.world.addBody(this.sun);
    this.world.addBody(this.planet);
  }

  render() {
    const ctx = this.ctx!;
    ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // шаг симуляции
    this.world.step(0.016);

    // рисуем все тела
    this.world.bodies.forEach(body => {
      ctx.beginPath();
      ctx.arc(body.position.x, body.position.y, body.radius || 5, 0, 2 * Math.PI);
      ctx.fillStyle = body === this.sun ? 'yellow' : 'cyan';
      ctx.fill();
    });

    requestAnimationFrame(() => this.render());
  }
}
