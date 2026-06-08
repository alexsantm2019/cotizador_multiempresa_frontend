import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

export const GpsAuthRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login',
    },
  },
];
