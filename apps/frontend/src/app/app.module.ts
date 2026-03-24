import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { HomeComponent } from './pages/home/home.component';
import { ClassicalComponent } from './pages/simulation/classical/classical.component';
import { QuantumComponent } from './pages/simulation/quantum/quantum.component';
import { NuclearComponent } from './pages/simulation/nuclear/nuclear.component';
import { QuantumTheoryComponent } from './pages/theory/quantum-theory/quantum-theory.component';
import { NuclearTheoryComponent } from './pages/theory/nuclear-theory/nuclear-theory.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    ClassicalComponent,
    QuantumComponent,
    NuclearComponent,
    QuantumTheoryComponent,
    NuclearTheoryComponent
  ],
  imports: [
    BrowserModule,
    HomeComponent,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
