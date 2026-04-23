import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent {
  @Input() darkTheme = false;

  @ViewChild('loginModal') loginModal!: TemplateRef<any>;

  menuOpen = false;

  constructor(private dialog: MatDialog) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  openLoginModal() {
    this.dialog.open(this.loginModal, {
      width: '300px'
    });
  }
}