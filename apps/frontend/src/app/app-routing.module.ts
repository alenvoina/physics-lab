import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { OrbitalComponent } from './pages/simulation/orbital/orbital.component';
import { QuantumComponent } from './pages/simulation/quantum-system/quantum-system.component';
import { SimulationsComponent } from './pages/simulations/simulations.component';
import { PendulumComponent } from './pages/simulation/pendulum/pendulum.component';
import { NewsListComponent } from './pages/news/news-list/news-list.component';
import { NewsDetailComponent } from './pages/news/news-detail/news-detail.component';
import { GravitySimComponent } from './pages/simulation/gravity-system/gravity-system.component';
import { QuantumSuperpositionComponent } from './pages/simulation/quantum-superposition/quantum-superposition.component';
import { QuantumTunnelingComponent } from './pages/simulation/quantum-tunneling/quantum-tunneling.component';
import { RadioactiveDecayComponent } from './pages/simulation/radioactive-decay/radioactive-decay.component';
import { NuclearReactorComponent } from './pages/simulation/nuclear-reaction/nuclear-reaction.component';
import { NuclearStabilityComponent } from './pages/simulation/nuclear-stability/nuclear-stability.component';
import { PhysicsInLifeComponent } from './pages/physics-in-life/physics-in-life.component';
import { ExperimentsGalleryComponent } from './pages/experiments-gallery/experiments-gallery.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'simulations', component: SimulationsComponent },
  { path: 'simulation/orbital', component: OrbitalComponent },
  { path: 'simulation/pendulum', component: PendulumComponent },
  { path: 'simulation/quantum-system', component: QuantumComponent },
  { path: 'news', component: NewsListComponent },
  { path: 'news/:id', component: NewsDetailComponent },
  { path: 'simulation/gravity', component: GravitySimComponent },
  { path: 'simulation/quantum-superposition', component: QuantumSuperpositionComponent },
  { path: 'simulation/quantum-tunneling', component: QuantumTunnelingComponent },
  { path: 'simulation/radioactive-decay', component: RadioactiveDecayComponent },
  { path: 'simulation/nuclear-reaction', component: NuclearReactorComponent },
  { path: 'simulation/nuclear-stability', component: NuclearStabilityComponent },
  { path: 'physics-life', component: PhysicsInLifeComponent },
  { path: 'experiments', component: ExperimentsGalleryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
    })],
  exports: [RouterModule]
})
export class AppRoutingModule {}