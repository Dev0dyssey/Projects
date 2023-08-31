import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-restaurant-card',
  templateUrl: './restaurant-card.component.html',
  styles: [`
    .card {
      border: 1px solid #ccc;
      padding: 10px;
      margin: 10px;
    }
    img {
      max-width: 100%;
    }
  `]
})
export class RestaurantCardComponent {
  @Input() restaurant: any;
  @Output() like = new EventEmitter<void>();
  @Output() dislike = new EventEmitter<void>();
}