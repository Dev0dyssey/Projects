import { Component, OnInit } from '@angular/core';
import { RestaurantsService } from './restaurants.service';

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
export class AppComponent implements OnInit {
  public restaurants: any[] | undefined;
  title = 'culinder';
  constructor(private restaurantService: RestaurantsService) { };

  ngOnInit() {
    this.restaurants = this.restaurantService.restaurants;
  }

  onLike(restaurant: any) {
    const index = this.restaurants?.indexOf(restaurant);
    restaurant.likes++;
  }

  onDislike(restaurant: any) {
    const index = this.restaurants?.indexOf(restaurant);
    if (index !== undefined && index !== -1) {
      this.restaurants?.splice(index, 1);
    }
  }
}
