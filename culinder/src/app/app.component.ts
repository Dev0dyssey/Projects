import { Component, OnInit, HostListener } from '@angular/core';
import { RestaurantsService } from './restaurants.service';

@Component({
  selector: 'app-root',
  template: `
  <div class="container">
    <div *ngFor="let restaurant of restaurants ? [restaurants[currentIndex]] : []" class="restaurant-card">
      <app-restaurant-card
        [restaurant]="restaurant"
        (like)="onLike(restaurant)"
        (dislike)="onDislike(restaurant)"
      ></app-restaurant-card>
    </div>
  </div>
`,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public restaurants: any[] | undefined;
  public currentIndex: number = 0;
  title = 'culinder';
  constructor(private restaurantService: RestaurantsService) { };

  ngOnInit() {
    this.restaurants = this.restaurantService.restaurants;
  }

  onLike(restaurant: any) {
    restaurant.likes++;
    this.loadNextCard();
  }

  onDislike(restaurant: any) {
    restaurant.dislikes++;
    this.loadNextCard();
  }

  private loadNextCard() {
    if (this.currentIndex < this.restaurants!.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }
}
