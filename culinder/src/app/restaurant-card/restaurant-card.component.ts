import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.scss'],
})
export class RestaurantCardComponent {
  @Input() restaurant: any;
  @Output() like = new EventEmitter<void>();
  @Output() dislike = new EventEmitter<void>();

  @HostBinding('class.mobile') isMobile = false;

  constructor() {
    this.isMobile = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth < 768;
      console.log('Resizing: ', this.isMobile);
    });
  }
}