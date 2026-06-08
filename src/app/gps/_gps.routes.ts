import { Routes } from '@angular/router';
import { PruebaComponent } from './prueba/prueba.component';
import { ClientsComponent } from './clients/clients.component';
import { AuthGuard } from '../services/gps/guard/auth.guard';

export const GpsRoutes: Routes = [
  // {
  //   path: 'prueba',
  //   canActivate: [AuthGuard],
  //   component: PruebaComponent,
  //   data: {
  //     title: 'Prueba',
  //   },
  //   // data: {
  //   //   title: 'Prueba',
  //   //   urls: [{ title: 'Prueba', url: '/prueba' }, { title: 'Prueba 2' }],
  //   // },
  // },
  // {
  //   path: 'clients',
  //   canActivate: [AuthGuard],
  //   component: ClientsComponent,
  //   data: {
  //     title: 'Clients',
  //   },
  // },
  {
    path: '**',
    redirectTo: 'auth-gps/login',
  },
];
