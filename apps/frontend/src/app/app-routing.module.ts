import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { OrbitalComponent } from './pages/simulation/orbital/orbital.component';
import { QuantumComponent } from './pages/simulation/quantum/quantum.component';
import { NuclearComponent } from './pages/simulation/nuclear/nuclear.component';
import { QuantumTheoryComponent } from './pages/theory/quantum-theory/quantum-theory.component';
import { NuclearTheoryComponent } from './pages/theory/nuclear-theory/nuclear-theory.component';
import { SimulationsComponent } from './pages/simulations/simulations.component';
import { PendulumComponent } from './pages/simulation/pendulum/pendulum.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'simulations', component: SimulationsComponent },
  { path: 'simulation/orbital', component: OrbitalComponent },
  { path: 'simulation/pendulum', component: PendulumComponent },
  { path: 'simulation/quantum', component: QuantumComponent },
  { path: 'simulation/nuclear', component: NuclearComponent },
  { path: 'theory/quantum', component: QuantumTheoryComponent },
  { path: 'theory/nuclear', component: NuclearTheoryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}