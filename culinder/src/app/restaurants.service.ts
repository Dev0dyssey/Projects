import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestaurantsService {
  public restaurants = [
    {
      name: 'Pizza Place',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Pizza+Place',
      description: 'The best pizza in town!',
      likes: 0,
    },
    {
      name: 'Burger Joint',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Burger+Joint',
      description: 'Juicy burgers and crispy fries!',
      likes: 0,
    },
    {
      name: 'Sushi Bar',
      imageUrl: 'https://via.placeholder.com/300x200.png?text=Sushi+Bar',
      description: 'Fresh sushi and sashimi!',
      likes: 0,
    }
   ];
  constructor() { }
}
