import { Routes } from '@angular/router';
import { LoginComponent } from '../../business/auth/login/login.component';

export const AuthRoutes: Routes = [
  {
    path: 'login',
    // component: LoginComponent,
    loadComponent: () =>
      import('../../business/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    data: {
      title: 'Login',
    },
  },
];
