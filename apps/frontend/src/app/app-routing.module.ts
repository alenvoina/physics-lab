import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { ClassicalComponent } from './pages/simulation/classical/classical.component';
import { QuantumComponent } from './pages/simulation/quantum/quantum.component';
import { NuclearComponent } from './pages/simulation/nuclear/nuclear.component';
import { QuantumTheoryComponent } from './pages/theory/quantum-theory/quantum-theory.component';
import { NuclearTheoryComponent } from './pages/theory/nuclear-theory/nuclear-theory.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'simulation/classical', component: ClassicalComponent },
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