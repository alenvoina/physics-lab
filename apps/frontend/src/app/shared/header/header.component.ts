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

        constructor(public dialog: MatDialog) {}

  openLoginModal() {
    this.dialog.open(this.loginModal, {
      width: '300px',
      panelClass: 'custom-dialog-container'
    });
  }
}
