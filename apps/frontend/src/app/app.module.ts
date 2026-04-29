import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { OrbitalComponent } from './pages/simulation/orbital/orbital.component';
import { AboutOverlayComponent } from './shared/about-overlay/about-overlay.component'

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    OrbitalComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, MaterialModule, AboutOverlayComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
