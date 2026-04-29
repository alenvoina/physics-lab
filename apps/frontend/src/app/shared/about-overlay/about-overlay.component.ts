import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-overlay.component.html',
  styleUrls: ['./about-overlay.component.scss']
})
export class AboutOverlayComponent {
  @Output() closeOverlay = new EventEmitter<void>();

  close() {
    this.closeOverlay.emit();
  }

 @HostListener('document:keydown.escape')
  onKeydownHandler() {
    this.close();
  }
}