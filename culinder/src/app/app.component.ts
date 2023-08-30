import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div *ngFor="let restaurant of restaurants">
    <app-restaurant-card
      [restaurant]="restaurant"
      (like)="onLike(restaurant)"
      (dislike)="onDislike(restaurant)"
    ></app-restaurant-card>
  </div>
`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'culinder';
  restaurants = [
    {
      name: 'Pizza Place',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Pizza+Place',
      description: 'The best pizza in town!'
    },
    {
      name: 'Burger Joint',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Burger+Joint',
      description: 'Juicy burgers and crispy fries!'
    },
    {
      name: 'Sushi Bar',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Sushi+Bar',
      description: 'Fresh sushi and sashimi!'
    }
  ];

  onLike(restaurant: any) {
    const index = this.restaurants.indexOf(restaurant);
    if (index !== -1) {
      this.restaurants.splice(index, 1);
    }
  }

  onDislike(restaurant: any) {
    const index = this.restaurants.indexOf(restaurant);
    if (index !== -1) {
      this.restaurants.splice(index, 1);
    }
  }
}
