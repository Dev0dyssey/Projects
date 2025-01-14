import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  // Add more routes here
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Wildcard route for a 404 page
];
