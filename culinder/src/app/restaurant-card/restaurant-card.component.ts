import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-restaurant-card',
  template: `
    <div class="card">
      <img [src]="restaurant.imageUrl" alt="{{ restaurant.name }}" />
      <h2>{{ restaurant.name }}</h2>
      <p>{{ restaurant.description }}</p>
      <button (click)="like.emit()">Like</button>
      <button (click)="dislike.emit()">Dislike</button>
    </div>
  `,
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