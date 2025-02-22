import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./signup-form/signup-form.component').then(
        (m) => m.SignupFormComponent
      ),
  },
];
