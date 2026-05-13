import { Component, Input, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false,
})
export class HeaderComponent implements OnDestroy {
  @Input() darkTheme = false;

  @ViewChild('loginModal') loginModal!: TemplateRef<any>;

  menuOpen = false;

  constructor(private dialog: MatDialog) {}

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.toggleBodyScroll();
  }

  closeMenu() {
    this.menuOpen = false;
    this.toggleBodyScroll();
  }

  openLoginModal() {
    this.dialog.open(this.loginModal, {
      width: '300px',
    });
    if (this.menuOpen) {
      this.closeMenu();
    }
  }

  private toggleBodyScroll() {
    if (this.menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }
}